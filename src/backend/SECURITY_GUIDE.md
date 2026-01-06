# Backend Security Guide

## 🔐 Security Overview

This backend implementation includes multiple layers of security to protect your application and data.

## Security Features Implemented

### 1. Environment Variables (.env)
- **Purpose**: Hide sensitive credentials and configuration
- **Location**: `/backend/.env` (create from `.env.example`)
- **What to secure**:
  - Database connection strings
  - API keys (Google OAuth, Cloudinary)
  - JWT secret keys
  - Email credentials
  
**⚠️ CRITICAL**: Never commit the `.env` file to version control!

**Setup**:
```bash
cd backend
cp .env.example .env
# Edit .env with your actual credentials
```

### 2. JWT Authentication
- **What it does**: Securely authenticates users with tokens
- **Token expiration**: 7 days (configurable in .env)
- **Implementation**: All protected routes require valid JWT

**Best Practices**:
- Use a strong, random JWT_SECRET (minimum 64 characters)
- Generate secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Tokens expire automatically after 7 days
- Frontend must include token in Authorization header: `Bearer <token>`

### 3. Email Whitelisting
- **Purpose**: Restrict admin access to specific emails/domains
- **Configuration**: Set in `.env` file

```env
# Allow specific emails
ADMIN_EMAILS=admin@gmail.com,manager@company.com

# Or allow entire domains
ADMIN_EMAIL_DOMAINS=yourcompany.com,yourdomain.org
```

**How it works**:
- When users log in via Google OAuth, their email is checked
- Only whitelisted emails/domains can access admin dashboard
- Provides an extra layer beyond just authentication

### 4. Rate Limiting
- **Purpose**: Prevent brute force attacks and API abuse
- **Default**: 100 requests per 15 minutes per IP
- **Configuration**: Adjust in `.env`

```env
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MINUTES=15
```

**How it works**:
- Tracks requests per IP address
- Returns 429 (Too Many Requests) when limit exceeded
- Automatically resets after time window
- Includes retry-after headers

**To disable** (not recommended):
```env
ENABLE_RATE_LIMITING=false
```

### 5. Request Sanitization
- **Purpose**: Prevent XSS (Cross-Site Scripting) attacks
- **Automatically applied**: All incoming requests
- **What it removes**:
  - `<script>` tags
  - `javascript:` protocols
  - Event handlers (onclick, onerror, etc.)
  - Suspicious HTML patterns

**Example**:
```javascript
// Before sanitization:
{ title: "<script>alert('xss')</script>Hello" }

// After sanitization:
{ title: "Hello" }
```

### 6. Security Headers
All API responses include security headers:

```
X-Frame-Options: DENY                    # Prevent clickjacking
X-Content-Type-Options: nosniff         # Prevent MIME sniffing
X-XSS-Protection: 1; mode=block         # Enable XSS filter
Strict-Transport-Security: ...          # Force HTTPS (production)
Content-Security-Policy: ...            # Restrict content sources
```

### 7. CORS (Cross-Origin Resource Sharing)
- **Purpose**: Control which domains can access your API
- **Configuration**: Set allowed origins in `.env`

```env
# Development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Production
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

**Security notes**:
- Never use `*` (allow all) in production
- List only your trusted frontend URLs
- Credentials (cookies) are enabled for trusted origins

### 8. Password Hashing (When MongoDB enabled)
- **Algorithm**: bcrypt with salt rounds
- **Security**: Passwords are never stored in plain text
- **One-way**: Cannot be reversed, only compared

```javascript
// Password hashing (in code)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### 9. File Upload Validation
- **Purpose**: Prevent malicious file uploads
- **Checks**:
  - File type validation (mimetype)
  - File size limits
  - Maximum sizes configurable in .env

```env
MAX_FILE_SIZE_MB=50
MAX_VIDEO_SIZE_MB=500
```

### 10. Request Logging
- **Purpose**: Monitor and audit all API requests
- **Logs include**:
  - Timestamp
  - IP address
  - HTTP method and URL
  - Response status code
  - User agent

**To disable** (not recommended):
```env
ENABLE_REQUEST_LOGGING=false
```

## Production Security Checklist

Before deploying to production, ensure:

### ✅ Environment Variables
- [ ] `.env` file created with actual credentials
- [ ] Strong JWT_SECRET (64+ random characters)
- [ ] MongoDB connection string uses authentication
- [ ] Google OAuth credentials are production keys
- [ ] Cloudinary credentials are set
- [ ] `.env` file is in `.gitignore`

### ✅ Authentication
- [ ] Bypass login DISABLED: `ENABLE_BYPASS_LOGIN=false`
- [ ] Email whitelist configured with real admin emails
- [ ] Google OAuth client ID matches your domain
- [ ] JWT expiration time is appropriate (default 7d)

### ✅ CORS Configuration
- [ ] Production domain(s) listed in CORS_ORIGIN
- [ ] Development origins removed from production
- [ ] No wildcard (*) origins

### ✅ Rate Limiting
- [ ] Rate limiting ENABLED
- [ ] Limits appropriate for your traffic
- [ ] Consider using Redis for multi-instance deployments

### ✅ HTTPS
- [ ] API server running behind HTTPS
- [ ] SSL certificates valid and up-to-date
- [ ] Redirect HTTP to HTTPS
- [ ] HSTS header enabled (automatic in production)

### ✅ MongoDB Security
- [ ] MongoDB connection uses authentication
- [ ] Database user has minimal required permissions
- [ ] Connection string uses SSL: `?ssl=true`
- [ ] IP whitelist configured on MongoDB Atlas
- [ ] Regular backups configured

### ✅ API Keys
- [ ] All API keys are environment variables
- [ ] Cloudinary signing enabled for uploads
- [ ] API keys have appropriate scopes/permissions
- [ ] Rotate keys regularly

### ✅ Monitoring
- [ ] Request logging enabled
- [ ] Error tracking setup (e.g., Sentry)
- [ ] Performance monitoring
- [ ] Regular security audits

## Security Best Practices

### 1. Keep Dependencies Updated
```bash
npm audit
npm audit fix
npm update
```

### 2. Use HTTPS Everywhere
- Never send credentials over HTTP
- Use Let's Encrypt for free SSL certificates
- Force HTTPS redirects

### 3. Implement Backup Strategy
- Regular MongoDB backups
- Test restore procedures
- Keep backups encrypted and secure

### 4. Monitor for Suspicious Activity
- Review request logs regularly
- Set up alerts for:
  - Excessive failed login attempts
  - Rate limit violations
  - 401/403 error spikes
  - Unusual traffic patterns

### 5. Principle of Least Privilege
- Database users have minimal permissions
- API keys have minimal scopes
- Admin accounts only for administrators
- Separate development and production credentials

### 6. Input Validation
- Validate all user inputs on backend
- Never trust client-side validation alone
- Use express-validator for route validation

### 7. Secure Session Management
- JWT tokens expire after reasonable time
- Implement token refresh mechanism
- Logout invalidates tokens (token blacklisting)

## Common Security Vulnerabilities Prevented

### ✅ SQL/NoSQL Injection
- **How**: Input sanitization, mongoose query validation
- **Protection**: All inputs sanitized, parameterized queries

### ✅ Cross-Site Scripting (XSS)
- **How**: Request sanitization, CSP headers
- **Protection**: HTML/JS code stripped from inputs

### ✅ Cross-Site Request Forgery (CSRF)
- **How**: JWT tokens, CORS restrictions
- **Protection**: Token required, origin validation

### ✅ Brute Force Attacks
- **How**: Rate limiting
- **Protection**: Max requests per time window

### ✅ Man-in-the-Middle (MITM)
- **How**: HTTPS, HSTS headers
- **Protection**: Encrypted connections

### ✅ Session Hijacking
- **How**: JWT signatures, token expiration
- **Protection**: Tokens cannot be tampered

### ✅ Clickjacking
- **How**: X-Frame-Options header
- **Protection**: Site cannot be embedded in iframe

## Incident Response

If security breach suspected:

1. **Immediate Actions**:
   - Rotate all API keys and secrets
   - Invalidate all JWT tokens (change JWT_SECRET)
   - Review recent access logs
   - Lock affected accounts

2. **Investigation**:
   - Check request logs for suspicious patterns
   - Review database for unauthorized changes
   - Identify breach source and method
   - Document findings

3. **Recovery**:
   - Patch security vulnerability
   - Restore from backup if needed
   - Notify affected users if data compromised
   - Update security measures

4. **Prevention**:
   - Implement additional security measures
   - Update security procedures
   - Train team on new protocols
   - Schedule security audit

## Security Testing

### Manual Testing
```bash
# Test rate limiting
for i in {1..101}; do curl http://localhost:5000/api/health; done

# Test authentication
curl -X GET http://localhost:5000/api/news \
  -H "Authorization: Bearer invalid-token"

# Test CORS
curl -X GET http://localhost:5000/api/health \
  -H "Origin: https://malicious-site.com"
```

### Automated Testing
- Use OWASP ZAP for penetration testing
- Run `npm audit` regularly
- Implement automated security scans in CI/CD

## Support & Updates

- Keep this backend updated with security patches
- Subscribe to security advisories for dependencies
- Review OWASP Top 10 regularly
- Consult security professionals for sensitive applications

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Remember**: Security is an ongoing process, not a one-time setup. Regular reviews and updates are essential!
