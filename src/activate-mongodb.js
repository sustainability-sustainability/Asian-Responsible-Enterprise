#!/usr/bin/env node

/**
 * MongoDB Activation Script
 * Automatically uncomments all // MONGODB: markers in the codebase
 */

const fs = require('fs');
const path = require('path');

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

function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (file !== 'node_modules' && !file.startsWith('.')) {
        scanDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function activateMongoDB(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changesCount = 0;
  
  const lines = content.split('\n');
  let skipNextMongoMarker = false;
  let inMongoBlock = false;
  
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check if this is a MONGODB marker line (e.g., "// MONGODB: Uncomment when ready...")
    if (trimmedLine.startsWith('// MONGODB:') || trimmedLine.startsWith('//MONGODB:')) {
      // This is just a marker comment, skip it
      modified = true;
      inMongoBlock = true;
      continue; // Don't add this line to output
    }
    
    // Check if this is a GOOGLE OAUTH marker (end of MongoDB block)
    if (trimmedLine.startsWith('// GOOGLE OAUTH:') || trimmedLine.startsWith('//GOOGLE OAUTH:')) {
      inMongoBlock = false;
      // This is just a marker comment, skip it
      modified = true;
      continue;
    }
    
    // Check for other marker comments that end a MongoDB block
    if (inMongoBlock && trimmedLine.startsWith('//') && 
        (trimmedLine.includes('Import') || trimmedLine.includes('SECURITY:') || 
         trimmedLine.includes('=========') || trimmedLine === '//')) {
      // Check if next line is not commented - if so, end the block
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (!nextLine.startsWith('//') || nextLine.startsWith('// =========')) {
          inMongoBlock = false;
        }
      }
    }
    
    // If we're in a MongoDB block and the line is commented code, uncomment it
    if (inMongoBlock && trimmedLine.startsWith('// ') && 
        !trimmedLine.startsWith('// =========') &&
        !trimmedLine.startsWith('// MONGODB') &&
        !trimmedLine.startsWith('// Not required') &&
        (trimmedLine.includes('const ') || trimmedLine.includes('import ') || 
         trimmedLine.includes('require(') || trimmedLine.includes('mongoose') ||
         trimmedLine.includes('type:') || trimmedLine.includes('Schema') ||
         trimmedLine.includes('{') || trimmedLine.includes('}') ||
         trimmedLine.includes('[') || trimmedLine.includes(']') ||
         trimmedLine.includes('required') || trimmedLine.includes('unique') ||
         trimmedLine.includes('trim') || trimmedLine.includes('lowercase') ||
         trimmedLine.includes('default') || trimmedLine.includes('index') ||
         trimmedLine.includes('model(') || trimmedLine.includes('module.exports') ||
         trimmedLine.includes('return ') || trimmedLine.includes('this.') ||
         trimmedLine.includes('timestamps') || trimmedLine.includes('//   '))) {
      // Uncomment the line by removing "// "
      const uncommentedLine = line.replace(/^(\s*)\/\/\s?/, '$1');
      processedLines.push(uncommentedLine);
      changesCount++;
      continue;
    }
    
    // If line starts with "//   " (code indented), it's part of a schema
    if (inMongoBlock && trimmedLine.startsWith('//   ')) {
      const uncommentedLine = line.replace(/^(\s*)\/\/\s?/, '$1');
      processedLines.push(uncommentedLine);
      changesCount++;
      continue;
    }
    
    // Check if line is just "//" in a mongo block
    if (inMongoBlock && trimmedLine === '//') {
      processedLines.push(line.replace('//', ''));
      continue;
    }
    
    // Otherwise, keep the line as-is
    processedLines.push(line);
  }
  
  if (modified) {
    content = processedLines.join('\n');
  }
  
  return { modified, content, changesCount };
}

function deactivateLocalStorage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changesCount = 0;
  
  // Comment out localStorage usage (optional - only if you want to disable it)
  // This is commented out by default. Uncomment if you want to auto-disable localStorage
  
  /*
  const localStoragePatterns = [
    /localStorage\.getItem/g,
    /localStorage\.setItem/g,
    /localStorage\.removeItem/g,
    /localStorage\.clear/g
  ];
  
  localStoragePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      // This would need more sophisticated logic to properly comment out
      // For now, we'll skip this functionality
    }
  });
  */
  
  return { modified, content, changesCount };
}

async function main() {
  console.clear();
  print('═══════════════════════════════════════════════════════════', 'blue');
  print('          🗄️  MongoDB Activation Script 🗄️', 'bright');
  print('═══════════════════════════════════════════════════════════', 'blue');
  console.log();
  
  print('📁 Scanning codebase for MongoDB markers...', 'cyan');
  console.log();
  
  const rootDir = __dirname;
  const files = scanDirectory(rootDir);
  
  let totalFilesModified = 0;
  let totalChanges = 0;
  const modifiedFiles = [];
  
  files.forEach(filePath => {
    const relativePath = path.relative(rootDir, filePath);
    
    // Skip this script itself and test files
    if (relativePath.includes('activate-mongodb.js') || 
        relativePath.includes('setup-wizard.js') ||
        relativePath.includes('test-config.js')) {
      return;
    }
    
    const result = activateMongoDB(filePath);
    
    if (result.modified) {
      // Create backup
      const backupPath = filePath + '.backup';
      fs.copyFileSync(filePath, backupPath);
      
      // Write modified content
      fs.writeFileSync(filePath, result.content, 'utf8');
      
      totalFilesModified++;
      totalChanges += result.changesCount;
      modifiedFiles.push({
        path: relativePath,
        changes: result.changesCount
      });
      
      print(`✓ ${relativePath}`, 'green');
      print(`  └─ Activated ${result.changesCount} MongoDB code block(s)`, 'cyan');
    }
  });
  
  console.log();
  print('─────────────────────────────────────────────────────────', 'blue');
  console.log();
  
  if (totalFilesModified > 0) {
    print(`✅ Successfully activated MongoDB in ${totalFilesModified} file(s)`, 'green');
    print(`   Total changes: ${totalChanges}`, 'cyan');
    console.log();
    
    print('📋 Modified Files:', 'yellow');
    modifiedFiles.forEach(file => {
      print(`   • ${file.path} (${file.changes} changes)`, 'white');
    });
    console.log();
    
    print('💾 Backups created:', 'yellow');
    print('   Original files saved with .backup extension', 'white');
    print('   You can restore them if needed', 'white');
    console.log();
    
    print('📝 Next Steps:', 'cyan');
    print('   1. Review the changes in your files', 'white');
    print('   2. Make sure your .env file is configured', 'white');
    print('   3. Run: node test-config.js', 'white');
    print('   4. Run: npm run dev', 'white');
    console.log();
    
  } else {
    print('ℹ️  No MongoDB markers found in codebase', 'yellow');
    print('   Either MongoDB is already activated, or no markers exist', 'white');
    console.log();
    print('💡 Tip: MongoDB markers should look like:', 'cyan');
    print('   // MONGODB: your code here', 'white');
    print('   or', 'white');
    print('   /* MONGODB:', 'white');
    print('      your code here', 'white');
    print('   */', 'white');
    console.log();
  }
  
  print('═══════════════════════════════════════════════════════════', 'blue');
  print('                  ✨ Process Complete! ✨', 'bright');
  print('═══════════════════════════════════════════════════════════', 'blue');
  console.log();
}

main().catch(err => {
  print('\n❌ Error: ' + err.message, 'red');
  console.error(err);
  process.exit(1);
});