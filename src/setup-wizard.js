#!/usr/bin/env node

/**
 * SDG Website Backend Setup Wizard
 * This interactive script helps you configure your .env file step by step
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

function print(text, color = 'reset') {
  console.log(colors[color] + text + colors.reset);
}

function question(query) {
  return new Promise(resolve => rl.question(colors.cyan + query + colors.reset, resolve));
}

async function setupWizard() {
  console.clear();
  print('═══════════════════════════════════════════════════════════', 'blue');
  print('     🌍 SDG Website Backend Configuration Wizard 🌍', 'bright');
  print('═══════════════════════════════════════════════════════════', 'blue');
  console.log();

  const config = {};

  // Step 1: MongoDB
  print('\n📊 STEP 1: MongoDB Configuration', 'green');
  print('─────────────────────────────────────────────────────────', 'blue');
  const mongoChoice = await question('Choose MongoDB setup:\n  1) Local MongoDB (mongodb://localhost:27017)\n  2) MongoDB Atlas (Cloud)\n  Enter choice (1 or 2): ');
  
  if (mongoChoice === '1') {
    config.MONGODB_URI = 'mongodb://localhost:27017/sdg-website';
    print('✓ Using local MongoDB', 'green');
  } else {
    print('\n📝 Get your connection string from:', 'yellow');
    print('   https://cloud.mongodb.com → Database → Connect → Connect your application', 'yellow');
    const mongoUri = await question('\nPaste your MongoDB Atlas connection string: ');
    config.MONGODB_URI = mongoUri.trim();
  }

  // Step 2: JWT Secret
  print('\n🔐 STEP 2: JWT Secret Generation', 'green');
  print('─────────────────────────────────────────────────────────', 'blue');
  const generateJWT = await question('Generate random JWT secret automatically? (y/n): ');
  
  if (generateJWT.toLowerCase() === 'y' || generateJWT === '') {
    config.JWT_SECRET = crypto.randomBytes(32).toString('hex');
    print('✓ JWT Secret generated: ' + config.JWT_SECRET.substring(0, 20) + '...', 'green');
  } else {
    const jwtSecret = await question('Enter your JWT secret: ');
    config.JWT_SECRET = jwtSecret.trim();
  }

  // Step 3: Google OAuth
  print('\n🔑 STEP 3: Google OAuth Configuration', 'green');
  print('─────────────────────────────────────────────────────────', 'blue');
  print('📝 Get credentials from:', 'yellow');
  print('   https://console.cloud.google.com → APIs & Services → Credentials', 'yellow');
  console.log();
  
  const skipGoogle = await question('Skip Google OAuth for now? (y/n): ');
  
  if (skipGoogle.toLowerCase() === 'y') {
    config.GOOGLE_CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com';
    config.GOOGLE_CLIENT_SECRET = 'your-google-client-secret';
    print('⚠ Using placeholder values - update later!', 'yellow');
  } else {
    const googleClientId = await question('Google Client ID: ');
    const googleClientSecret = await question('Google Client Secret: ');
    config.GOOGLE_CLIENT_ID = googleClientId.trim();
    config.GOOGLE_CLIENT_SECRET = googleClientSecret.trim();
    print('✓ Google OAuth configured', 'green');
  }

  // Step 4: Cloudinary
  print('\n☁️  STEP 4: Cloudinary Configuration', 'green');
  print('─────────────────────────────────────────────────────────', 'blue');
  print('📝 Get credentials from:', 'yellow');
  print('   https://cloudinary.com/console → Dashboard', 'yellow');
  console.log();
  
  const skipCloudinary = await question('Skip Cloudinary for now? (y/n): ');
  
  if (skipCloudinary.toLowerCase() === 'y') {
    config.CLOUDINARY_CLOUD_NAME = 'your-cloud-name';
    config.CLOUDINARY_API_KEY = 'your-api-key';
    config.CLOUDINARY_API_SECRET = 'your-api-secret';
    print('⚠ Using placeholder values - update later!', 'yellow');
  } else {
    const cloudName = await question('Cloudinary Cloud Name: ');
    const apiKey = await question('Cloudinary API Key: ');
    const apiSecret = await question('Cloudinary API Secret: ');
    config.CLOUDINARY_CLOUD_NAME = cloudName.trim();
    config.CLOUDINARY_API_KEY = apiKey.trim();
    config.CLOUDINARY_API_SECRET = apiSecret.trim();
    print('✓ Cloudinary configured', 'green');
  }

  // Step 5: Server Configuration
  print('\n⚙️  STEP 5: Server Configuration', 'green');
  print('─────────────────────────────────────────────────────────', 'blue');
  const port = await question('Server port (press Enter for 5000): ');
  config.PORT = port.trim() || '5000';
  
  const nodeEnv = await question('Environment (development/production, press Enter for development): ');
  config.NODE_ENV = nodeEnv.trim() || 'development';

  // Generate .env file
  print('\n📝 Generating .env file...', 'blue');
  
  const envContent = `# MongoDB Connection
MONGODB_URI=${config.MONGODB_URI}

# JWT Secret
JWT_SECRET=${config.JWT_SECRET}

# Google OAuth (Gmail Login)
GOOGLE_CLIENT_ID=${config.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${config.GOOGLE_CLIENT_SECRET}

# Cloudinary (Video/Image Uploads)
CLOUDINARY_CLOUD_NAME=${config.CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${config.CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${config.CLOUDINARY_API_SECRET}

# Server Configuration
PORT=${config.PORT}
NODE_ENV=${config.NODE_ENV}
`;

  // Check if .env exists
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    print('\n⚠️  Warning: .env file already exists!', 'yellow');
    const overwrite = await question('Overwrite existing .env file? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      print('\n✓ Saving as .env.new instead', 'green');
      fs.writeFileSync(path.join(__dirname, '.env.new'), envContent);
      print('\n✅ Configuration saved to .env.new', 'green');
      print('   Rename it to .env when ready to use it.', 'yellow');
    } else {
      // Backup existing
      fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
      print('✓ Backed up existing .env to .env.backup', 'yellow');
      fs.writeFileSync(envPath, envContent);
      print('\n✅ Configuration saved to .env', 'green');
    }
  } else {
    fs.writeFileSync(envPath, envContent);
    print('\n✅ Configuration saved to .env', 'green');
  }

  // Summary
  print('\n═══════════════════════════════════════════════════════════', 'blue');
  print('                    ✨ Setup Complete! ✨', 'bright');
  print('═══════════════════════════════════════════════════════════', 'blue');
  console.log();
  print('📋 Configuration Summary:', 'cyan');
  print(`   • MongoDB: ${config.MONGODB_URI.includes('localhost') ? 'Local' : 'Atlas (Cloud)'}`, 'white');
  print(`   • Google OAuth: ${config.GOOGLE_CLIENT_ID.includes('your-') ? 'Not configured' : 'Configured ✓'}`, 'white');
  print(`   • Cloudinary: ${config.CLOUDINARY_CLOUD_NAME.includes('your-') ? 'Not configured' : 'Configured ✓'}`, 'white');
  print(`   • Server Port: ${config.PORT}`, 'white');
  print(`   • Environment: ${config.NODE_ENV}`, 'white');
  console.log();
  print('📚 Next Steps:', 'cyan');
  print('   1. Run: npm install', 'white');
  print('   2. Run: node activate-mongodb.js (to enable MongoDB in code)', 'white');
  print('   3. Run: node test-config.js (to verify setup)', 'white');
  print('   4. Run: npm run dev (to start server)', 'white');
  console.log();
  print('💡 Tip: Keep your .env file secure and never commit it to Git!', 'yellow');
  console.log();

  rl.close();
}

// Run the wizard
setupWizard().catch(err => {
  print('\n❌ Error: ' + err.message, 'red');
  rl.close();
  process.exit(1);
});
