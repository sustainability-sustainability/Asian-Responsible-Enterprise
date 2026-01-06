#!/usr/bin/env node

/**
 * SDG Website Backend Configuration Tester
 * Tests all environment variables and external service connections
 */

require('dotenv').config();
const mongoose = require('mongoose');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function print(text, color = 'reset') {
  console.log(colors[color] + text + colors.reset);
}

function printStatus(name, status, message = '') {
  const icon = status ? '✅' : '❌';
  const color = status ? 'green' : 'red';
  print(`${icon} ${name}`, color);
  if (message) {
    print(`   └─ ${message}`, 'cyan');
  }
}

async function testConfiguration() {
  console.clear();
  print('═══════════════════════════════════════════════════════════', 'blue');
  print('        🧪 Configuration Test Suite 🧪', 'bright');
  print('═══════════════════════════════════════════════════════════', 'blue');
  console.log();

  let allTestsPassed = true;

  // Test 1: Check if .env file exists
  print('📋 Testing Environment Variables...', 'cyan');
  print('─────────────────────────────────────────────────────────', 'blue');

  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'PORT',
    'NODE_ENV'
  ];

  let envVarsOk = true;
  for (const varName of requiredVars) {
    const value = process.env[varName];
    const exists = !!value;
    const isPlaceholder = value && (
      value.includes('your-') || 
      value.includes('change-this') ||
      value.includes('YOUR_')
    );
    
    if (!exists) {
      printStatus(varName, false, 'Missing from .env file');
      envVarsOk = false;
      allTestsPassed = false;
    } else if (isPlaceholder) {
      printStatus(varName, false, 'Using placeholder value - needs to be updated');
      envVarsOk = false;
      allTestsPassed = false;
    } else {
      const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD') 
        ? value.substring(0, 10) + '...' 
        : value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value;
      printStatus(varName, true, displayValue);
    }
  }

  console.log();

  // Test 2: JWT Secret strength
  print('🔐 Testing JWT Secret...', 'cyan');
  print('─────────────────────────────────────────────────────────', 'blue');
  
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    const length = jwtSecret.length;
    const isStrong = length >= 32;
    printStatus('JWT Secret Length', isStrong, `${length} characters (minimum 32 recommended)`);
    if (!isStrong) allTestsPassed = false;
  } else {
    printStatus('JWT Secret', false, 'Not configured');
    allTestsPassed = false;
  }

  console.log();

  // Test 3: MongoDB Connection
  print('🗄️  Testing MongoDB Connection...', 'cyan');
  print('─────────────────────────────────────────────────────────', 'blue');
  
  if (process.env.MONGODB_URI) {
    try {
      print('   Connecting to MongoDB...', 'yellow');
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      printStatus('MongoDB Connection', true, 'Successfully connected');
      
      // Test write operation
      const testCollection = mongoose.connection.db.collection('test');
      await testCollection.insertOne({ test: true, timestamp: new Date() });
      await testCollection.deleteOne({ test: true });
      printStatus('MongoDB Write/Delete', true, 'Database operations working');
      
      await mongoose.connection.close();
    } catch (err) {
      printStatus('MongoDB Connection', false, err.message);
      allTestsPassed = false;
    }
  } else {
    printStatus('MongoDB Connection', false, 'MONGODB_URI not configured');
    allTestsPassed = false;
  }

  console.log();

  // Test 4: Google OAuth Configuration
  print('🔑 Testing Google OAuth Configuration...', 'cyan');
  print('─────────────────────────────────────────────────────────', 'blue');
  
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (googleClientId && !googleClientId.includes('your-')) {
    const isValidFormat = googleClientId.includes('.apps.googleusercontent.com');
    printStatus('Google Client ID Format', isValidFormat, isValidFormat ? 'Valid format' : 'Invalid format - should end with .apps.googleusercontent.com');
    if (!isValidFormat) allTestsPassed = false;
  } else {
    printStatus('Google Client ID', false, 'Not configured');
    print('   ℹ️  Get it from: https://console.cloud.google.com', 'yellow');
    allTestsPassed = false;
  }

  if (googleClientSecret && !googleClientSecret.includes('your-')) {
    const isValidFormat = googleClientSecret.startsWith('GOCSPX-') || googleClientSecret.length > 20;
    printStatus('Google Client Secret', isValidFormat, isValidFormat ? 'Configured' : 'May be invalid');
    if (!isValidFormat) allTestsPassed = false;
  } else {
    printStatus('Google Client Secret', false, 'Not configured');
    allTestsPassed = false;
  }

  console.log();

  // Test 5: Cloudinary Configuration
  print('☁️  Testing Cloudinary Configuration...', 'cyan');
  print('─────────────────────────────────────────────────────────', 'blue');
  
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudKey = process.env.CLOUDINARY_API_KEY;
  const cloudSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (cloudName && !cloudName.includes('your-')) {
    printStatus('Cloudinary Cloud Name', true, cloudName);
  } else {
    printStatus('Cloudinary Cloud Name', false, 'Not configured');
    print('   ℹ️  Get it from: https://cloudinary.com/console', 'yellow');
    allTestsPassed = false;
  }

  if (cloudKey && !cloudKey.includes('your-')) {
    printStatus('Cloudinary API Key', true, cloudKey);
  } else {
    printStatus('Cloudinary API Key', false, 'Not configured');
    allTestsPassed = false;
  }

  if (cloudSecret && !cloudSecret.includes('your-')) {
    const length = cloudSecret.length;
    printStatus('Cloudinary API Secret', true, `Configured (${length} characters)`);
  } else {
    printStatus('Cloudinary API Secret', false, 'Not configured');
    allTestsPassed = false;
  }

  // Test Cloudinary connection
  if (cloudName && cloudKey && cloudSecret && 
      !cloudName.includes('your-') && !cloudKey.includes('your-') && !cloudSecret.includes('your-')) {
    try {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: cloudName,
        api_key: cloudKey,
        api_secret: cloudSecret
      });
      
      // Test API connection
      const result = await cloudinary.api.ping();
      printStatus('Cloudinary API Connection', true, 'Successfully connected');
    } catch (err) {
      printStatus('Cloudinary API Connection', false, err.message);
      allTestsPassed = false;
    }
  }

  console.log();

  // Test 6: Server Configuration
  print('⚙️  Testing Server Configuration...', 'cyan');
  print('─────────────────────────────────────────────────────────', 'blue');
  
  const port = process.env.PORT;
  const nodeEnv = process.env.NODE_ENV;
  
  printStatus('Server Port', !!port, port || 'Not set (will use default 5000)');
  printStatus('Node Environment', !!nodeEnv, nodeEnv || 'Not set (will use default development)');

  console.log();

  // Final Summary
  print('═══════════════════════════════════════════════════════════', 'blue');
  if (allTestsPassed) {
    print('              ✅ ALL TESTS PASSED! ✅', 'green');
    print('═══════════════════════════════════════════════════════════', 'blue');
    console.log();
    print('🚀 Your backend is ready to run!', 'green');
    print('   Run: npm run dev', 'cyan');
  } else {
    print('              ⚠️  SOME TESTS FAILED ⚠️', 'yellow');
    print('═══════════════════════════════════════════════════════════', 'blue');
    console.log();
    print('📝 Next Steps:', 'yellow');
    print('   1. Fix the failed configuration items above', 'white');
    print('   2. Update your .env file with correct values', 'white');
    print('   3. Run this test again: node test-config.js', 'white');
    console.log();
    print('💡 Tips:', 'cyan');
    print('   • Run: node setup-wizard.js to reconfigure', 'white');
    print('   • Check the step-by-step guide in SETUP.md', 'white');
  }
  console.log();

  process.exit(allTestsPassed ? 0 : 1);
}

// Run tests
testConfiguration().catch(err => {
  print('\n❌ Fatal Error: ' + err.message, 'red');
  console.error(err);
  process.exit(1);
});
