#!/usr/bin/env node

/**
 * Production Setup Script
 * 
 * Interactive script to help set up production environment with:
 * - MongoDB Atlas
 * - Cloudinary
 * - Environment variables
 * - Google OAuth (optional)
 * 
 * Run: node setup-production.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

async function main() {
  console.clear();
  
  log('🚀 SDG Website - Production Setup', 'bright');
  log('This script will help you configure your production environment\n', 'cyan');
  
  const config = {
    backend: {},
    frontend: {}
  };
  
  // MongoDB Setup
  header('📦 MongoDB Atlas Configuration');
  log('Get your connection string from: https://www.mongodb.com/cloud/atlas', 'blue');
  log('Example: mongodb+srv://user:password@cluster.mongodb.net/sdg-website\n', 'yellow');
  
  const mongoUri = await question('MongoDB Connection String: ');
  
  if (!mongoUri || !mongoUri.startsWith('mongodb')) {
    log('❌ Invalid MongoDB URI. Please use a valid connection string.', 'red');
    process.exit(1);
  }
  
  config.backend.MONGODB_URI = mongoUri;
  log('✅ MongoDB configured\n', 'green');
  
  // JWT Secret
  header('🔐 Security Configuration');
  log('Generating secure JWT secret...\n', 'blue');
  
  const jwtSecret = require('crypto').randomBytes(32).toString('hex');
  config.backend.JWT_SECRET = jwtSecret;
  log('✅ JWT secret generated\n', 'green');
  
  // Cloudinary
  header('🖼️  Cloudinary Configuration (Media Storage)');
  log('Get credentials from: https://cloudinary.com/console', 'blue');
  log('This is optional but recommended for production\n', 'yellow');
  
  const useCloudinary = await question('Configure Cloudinary? (y/n): ');
  
  if (useCloudinary.toLowerCase() === 'y') {
    const cloudName = await question('Cloudinary Cloud Name: ');
    const apiKey = await question('Cloudinary API Key: ');
    const apiSecret = await question('Cloudinary API Secret: ');
    
    if (cloudName && apiKey && apiSecret) {
      config.backend.CLOUDINARY_CLOUD_NAME = cloudName;
      config.backend.CLOUDINARY_API_KEY = apiKey;
      config.backend.CLOUDINARY_API_SECRET = apiSecret;
      log('✅ Cloudinary configured\n', 'green');
    }
  } else {
    log('⏭️  Skipping Cloudinary (will use base64 encoding)\n', 'yellow');
  }
  
  // Google OAuth
  header('🔑 Google OAuth Configuration (Admin Login)');
  log('Get credentials from: https://console.cloud.google.com', 'blue');
  log('This is optional - you can use bypass mode for testing\n', 'yellow');
  
  const useOAuth = await question('Configure Google OAuth? (y/n): ');
  
  if (useOAuth.toLowerCase() === 'y') {
    const clientId = await question('Google Client ID: ');
    const clientSecret = await question('Google Client Secret: ');
    const callbackUrl = await question('Callback URL (e.g., https://api.yourdomain.com/api/auth/google/callback): ');
    
    if (clientId && clientSecret && callbackUrl) {
      config.backend.GOOGLE_CLIENT_ID = clientId;
      config.backend.GOOGLE_CLIENT_SECRET = clientSecret;
      config.backend.GOOGLE_CALLBACK_URL = callbackUrl;
      config.frontend.VITE_GOOGLE_CLIENT_ID = clientId;
      log('✅ Google OAuth configured\n', 'green');
    }
  } else {
    log('⏭️  Skipping Google OAuth (will use bypass mode)\n', 'yellow');
  }
  
  // CORS
  header('🌐 CORS Configuration');
  const frontendUrl = await question('Frontend URL (e.g., https://yourdomain.com): ');
  
  if (frontendUrl) {
    config.backend.ALLOWED_ORIGINS = `${frontendUrl},https://www.${frontendUrl.replace('https://', '')}`;
    config.frontend.VITE_API_URL = await question('Backend API URL (e.g., https://api.yourdomain.com/api): ');
    log('✅ CORS configured\n', 'green');
  }
  
  // Environment
  config.backend.NODE_ENV = 'production';
  config.backend.PORT = '5000';
  
  // Write backend .env
  header('💾 Writing Configuration Files');
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  let backendEnvContent = '';
  
  for (const [key, value] of Object.entries(config.backend)) {
    backendEnvContent += `${key}=${value}\n`;
  }
  
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  log(`✅ Backend .env written to: ${backendEnvPath}`, 'green');
  
  // Write frontend .env.production
  if (Object.keys(config.frontend).length > 0) {
    const frontendEnvPath = path.join(__dirname, '.env.production');
    let frontendEnvContent = '';
    
    for (const [key, value] of Object.entries(config.frontend)) {
      frontendEnvContent += `${key}=${value}\n`;
    }
    
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    log(`✅ Frontend .env.production written to: ${frontendEnvPath}`, 'green');
  }
  
  // Summary
  header('📋 Setup Summary');
  
  log('✅ MongoDB Atlas: Configured', 'green');
  log(`✅ JWT Secret: Generated (${jwtSecret.substring(0, 10)}...)`, 'green');
  log(`${useCloudinary.toLowerCase() === 'y' ? '✅' : '⏭️'} Cloudinary: ${useCloudinary.toLowerCase() === 'y' ? 'Configured' : 'Skipped'}`, useCloudinary.toLowerCase() === 'y' ? 'green' : 'yellow');
  log(`${useOAuth.toLowerCase() === 'y' ? '✅' : '⏭️'} Google OAuth: ${useOAuth.toLowerCase() === 'y' ? 'Configured' : 'Skipped'}`, useOAuth.toLowerCase() === 'y' ? 'green' : 'yellow');
  log(`${frontendUrl ? '✅' : '⏭️'} CORS: ${frontendUrl ? 'Configured' : 'Skipped'}`, frontendUrl ? 'green' : 'yellow');
  
  // Next Steps
  header('🎯 Next Steps');
  
  log('1. Test MongoDB connection:', 'bright');
  log('   cd backend && node -e "require(\'dotenv\').config(); const mongoose = require(\'mongoose\'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log(\'✅ Connected!\')).catch(e => console.error(\'❌\', e));"', 'cyan');
  
  log('\n2. Start backend:', 'bright');
  log('   cd backend && npm install && npm start', 'cyan');
  
  log('\n3. Start frontend:', 'bright');
  log('   npm install && npm run build && npm run preview', 'cyan');
  
  log('\n4. Deploy:', 'bright');
  log('   - Backend: Deploy to Railway, Render, or Heroku', 'cyan');
  log('   - Frontend: Deploy to Vercel or Netlify', 'cyan');
  log('   - See DEPLOYMENT_GUIDE.md for detailed instructions', 'cyan');
  
  log('\n5. Update CORS after deployment:', 'bright');
  log('   Add your production URLs to ALLOWED_ORIGINS in backend/.env', 'cyan');
  
  log('\n6. Update Google OAuth redirect URIs:', 'bright');
  log('   Add production callback URL in Google Cloud Console', 'cyan');
  
  header('✨ Setup Complete!');
  log('Your production environment is ready to deploy!\n', 'green');
  log('Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions.', 'blue');
  
  rl.close();
}

// Run
main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
