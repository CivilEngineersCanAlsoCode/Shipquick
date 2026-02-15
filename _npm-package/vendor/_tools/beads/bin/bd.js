#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Determine the platform-specific binary name
function getBinaryPath() {
  const platform = os.platform();
  let arch = os.arch();

  // Map Node arch to Go arch
  if (arch === 'x64') arch = 'amd64';

  let filename = '';

  if (platform === 'darwin') {
    filename = `bd-darwin-${arch}`;
  } else if (platform === 'linux') {
    filename = `bd-linux-${arch}`;
  } else if (platform === 'win32') {
    filename = `bd-windows-${arch}.exe`;
  } else {
    console.error(`Error: Unsupported platform: ${platform}`);
    process.exit(1);
  }

  // Binary is stored in the dist directory
  const binaryPath = path.join(__dirname, 'dist', filename);

  if (!fs.existsSync(binaryPath)) {
    console.error(`Error: beads binary not found at ${binaryPath}`);
    console.error(`Platform: ${platform}, Architecture: ${arch} (Node: ${os.arch()})`);
    console.error('This may indicate that the platform binary was not bundled correctly.');
    process.exit(1);
  }

  return binaryPath;
}

// Execute the native binary with all arguments passed through
function main() {
  const binaryPath = getBinaryPath();
  
  // Ensure binary is executable (on unix)
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(binaryPath, 0o755);
    } catch (e) {
      // Ignore if we can't chmod (e.g. read-only fs), might still work
    }
  }

  // Spawn the native bd binary with all command-line arguments
  const child = spawn(binaryPath, process.argv.slice(2), {
    stdio: 'inherit',
    env: process.env
  });

  child.on('error', (err) => {
    console.error(`Error executing bd binary: ${err.message}`);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exit(1);
    }
    process.exit(code || 0);
  });
}

main();
