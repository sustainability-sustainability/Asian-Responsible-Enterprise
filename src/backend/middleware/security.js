// ========================================
// SECURITY MIDDLEWARE
// ========================================
// Middleware functions to protect API endpoints

const jwt = require('jsonwebtoken');

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================
// Verify JWT token and authenticate user
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No authentication token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      );
      
      // Attach user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'Token has expired' 
        });
      }
      
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid authentication token' 
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'Failed to authenticate user' 
    });
  }
};

// ========================================
// AUTHORIZATION MIDDLEWARE
// ========================================
// Check if user has required role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Authentication required' 
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You do not have permission to access this resource' 
      });
    }
    
    next();
  };
};

// ========================================
// ADMIN-ONLY MIDDLEWARE
// ========================================
// Shorthand for admin authorization
const requireAdmin = authorize('admin');

// ========================================
// EMAIL WHITELIST MIDDLEWARE
// ========================================
// Check if email is in allowed domains or whitelist
const checkEmailWhitelist = (email) => {
  // Get allowed domains and emails from environment
  const allowedDomains = process.env.ADMIN_EMAIL_DOMAINS 
    ? process.env.ADMIN_EMAIL_DOMAINS.split(',').map(d => d.trim())
    : [];
  
  const allowedEmails = process.env.ADMIN_EMAILS 
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
    : [];
  
  // Check if email is in whitelist
  if (allowedEmails.includes(email.toLowerCase())) {
    return true;
  }
  
  // Check if email domain is allowed
  const emailDomain = email.split('@')[1];
  if (allowedDomains.includes(emailDomain)) {
    return true;
  }
  
  return false;
};

// ========================================
// REQUEST SANITIZATION
// ========================================
// Sanitize request body to prevent XSS and injection attacks
const sanitizeRequest = (req, res, next) => {
  // Function to recursively sanitize strings
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove potential XSS patterns
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };
  
  // Sanitize request body
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  next();
};

// ========================================
// RATE LIMITING HELPER
// ========================================
// Simple in-memory rate limiting (use Redis in production)
const rateLimitStore = new Map();

const rateLimit = (maxRequests = 100, windowMinutes = 15) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    
    // Get or create rate limit data for IP
    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, {
        count: 0,
        resetTime: now + windowMs
      });
    }
    
    const limitData = rateLimitStore.get(ip);
    
    // Reset if window has passed
    if (now > limitData.resetTime) {
      limitData.count = 0;
      limitData.resetTime = now + windowMs;
    }
    
    // Increment request count
    limitData.count++;
    
    // Check if limit exceeded
    if (limitData.count > maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil((limitData.resetTime - now) / 60000)} minutes.`,
        retryAfter: Math.ceil((limitData.resetTime - now) / 1000)
      });
    }
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - limitData.count);
    res.setHeader('X-RateLimit-Reset', new Date(limitData.resetTime).toISOString());
    
    next();
  };
};

// Clean up old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime + 3600000) { // 1 hour after reset
      rateLimitStore.delete(ip);
    }
  }
}, 3600000);

// ========================================
// VALIDATE FILE UPLOAD
// ========================================
// Validate file type and size for uploads
const validateFileUpload = (allowedTypes = [], maxSizeMB = 50) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }
    
    const file = req.file;
    const fileType = file.mimetype;
    const fileSizeMB = file.size / (1024 * 1024);
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(fileType)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: `Only ${allowedTypes.join(', ')} files are allowed`,
        receivedType: fileType
      });
    }
    
    // Check file size
    if (fileSizeMB > maxSizeMB) {
      return res.status(400).json({
        error: 'File too large',
        message: `File size must be less than ${maxSizeMB}MB`,
        fileSize: `${fileSizeMB.toFixed(2)}MB`
      });
    }
    
    next();
  };
};

// ========================================
// REQUEST LOGGING
// ========================================
// Log incoming requests for security monitoring
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.originalUrl || req.url;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  
  // Log response status when response finishes
  res.on('finish', () => {
    const status = res.statusCode;
    const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    console.log(`[${timestamp}] ${method} ${url} - Status: ${statusColor}${status}${resetColor}`);
  });
  
  next();
};

// ========================================
// SECURITY HEADERS
// ========================================
// Add security headers to responses
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  
  next();
};

// ========================================
// EXPORTS
// ========================================
module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  checkEmailWhitelist,
  sanitizeRequest,
  rateLimit,
  validateFileUpload,
  requestLogger,
  securityHeaders
};
