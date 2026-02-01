// Shipquick Installer - Main Installation Logic // Ref: 1.0
// This module handles copying files, installing Beads, and initialization // Ref: 1.1

const fs = require('fs-extra'); // Ref: 1.2 - File system operations
const path = require('path'); // Ref: 1.3 - Path utilities
const { execSync, exec } = require('child_process'); // Ref: 1.4 - Command execution

// Ref: 2.0 - Chalk import with fallback for ESM/CJS compatibility
let chalk;
try {
  chalk = require('chalk'); // Ref: 2.1 - Try require first
} catch {
  chalk = { // Ref: 2.2 - Fallback to plain console
    green: (s) => s,
    yellow: (s) => s,
    red: (s) => s,
    cyan: (s) => s,
    bold: (s) => s
  };
}

// Ref: 3.0 - Main install function
async function install() {
  const targetDir = process.cwd(); // Ref: 3.1 - Get current working directory
  const packageDir = path.join(__dirname, '..'); // Ref: 3.2 - Package root directory
  const sourceDir = path.join(packageDir, '_bmad-safe'); // Ref: 3.3 - Source _bmad-safe folder

  console.log('\n🚀 Shipquick Installation Starting...\n'); // Ref: 3.4

  try {
    // Ref: 4.0 - Step 1: Copy _bmad-safe to target directory
    console.log(chalk.cyan('📁 Step 1/3: Copying _bmad-safe folder...')); // Ref: 4.1
    
    const targetBmadDir = path.join(targetDir, '_bmad-safe'); // Ref: 4.2
    
    if (fs.existsSync(targetBmadDir)) { // Ref: 4.3 - Check if already exists
      console.log(chalk.yellow('   ⚠️  _bmad-safe folder already exists, skipping copy')); // Ref: 4.4
    } else {
      fs.copySync(sourceDir, targetBmadDir); // Ref: 4.5 - Copy folder
      console.log(chalk.green('   ✅ _bmad-safe folder created successfully')); // Ref: 4.6
    }

    // Ref: 5.0 - Step 2: Install Beads CLI
    console.log(chalk.cyan('\n📦 Step 2/3: Installing Beads CLI...')); // Ref: 5.1
    
    try {
      execSync('bd --version', { stdio: 'pipe' }); // Ref: 5.2 - Check if Beads already installed
      console.log(chalk.green('   ✅ Beads CLI already installed')); // Ref: 5.3
    } catch {
      console.log(chalk.yellow('   ⏳ Installing Beads from GitHub...')); // Ref: 5.4
      try {
        execSync('npm install -g github:steveyegge/beads', { stdio: 'inherit' }); // Ref: 5.5 - Install Beads
        console.log(chalk.green('   ✅ Beads CLI installed successfully')); // Ref: 5.6
      } catch (beadsError) {
        console.log(chalk.yellow('   ⚠️  Could not install Beads globally. You may need to run:')); // Ref: 5.7
        console.log(chalk.yellow('      npm install -g github:steveyegge/beads')); // Ref: 5.8
      }
    }

    // Ref: 6.0 - Step 3: Initialize Beads
    console.log(chalk.cyan('\n🔧 Step 3/3: Initializing Beads...')); // Ref: 6.1
    
    const beadsDir = path.join(targetDir, '.beads'); // Ref: 6.2
    
    if (fs.existsSync(beadsDir)) { // Ref: 6.3 - Check if already initialized
      console.log(chalk.yellow('   ⚠️  Beads already initialized (.beads folder exists)')); // Ref: 6.4
    } else {
      try {
        execSync('bd init', { cwd: targetDir, stdio: 'pipe' }); // Ref: 6.5 - Initialize Beads
        console.log(chalk.green('   ✅ Beads initialized successfully')); // Ref: 6.6
      } catch {
        console.log(chalk.yellow('   ⚠️  Could not initialize Beads automatically')); // Ref: 6.7
        console.log(chalk.yellow('      Run manually: bd init')); // Ref: 6.8
      }
    }

    // Ref: 7.0 - Success message
    console.log('\n' + chalk.green.bold('🎉 Setup Complete!') + '\n'); // Ref: 7.1
    console.log('Next steps:'); // Ref: 7.2
    console.log('  1. Review config: ' + chalk.cyan('_bmad-safe/bmm-safe/config.yaml')); // Ref: 7.3
    console.log('  2. View tasks:    ' + chalk.cyan('bd list')); // Ref: 7.4
    console.log('  3. Start working: ' + chalk.cyan('bd ready')); // Ref: 7.5
    console.log('\n'); // Ref: 7.6

  } catch (error) {
    // Ref: 8.0 - Error handling
    console.error(chalk.red('\n❌ Installation failed:')); // Ref: 8.1
    console.error(chalk.red('   ' + error.message)); // Ref: 8.2
    process.exit(1); // Ref: 8.3
  }
}

module.exports = { install }; // Ref: 9.0 - Export install function
