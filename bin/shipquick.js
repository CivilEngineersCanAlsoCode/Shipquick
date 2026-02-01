#!/usr/bin/env node
// Shipquick CLI - Entry Point // Ref: 1.0
// This file handles command-line arguments and routes to appropriate functions // Ref: 1.1

const { install } = require("../lib/installer.js"); // Ref: 1.2 - Import installer module

const command = process.argv[2]; // Ref: 1.3 - Get command from CLI args

// Ref: 2.0 - Command router
if (command === "install") {
  // Ref: 2.1 - Run installation
  install();
} else if (command === "help" || command === "--help" || command === "-h") {
  // Ref: 2.2 - Show help
  console.log(`
  Shipquick - BMAD Method + SAFe 6.0.1 + Beads State Management

  Usage:
    npx shipquick install    Install bmad-safe and Beads in current directory
    npx shipquick help       Show this help message

  After installation:
    bd list                  View task hierarchy
    bd ready                 See next task
    bd done <id>             Mark task complete

  Learn more: https://github.com/CivilEngineersCanAlsoCode/Shipquick
  `);
} else {
  // Ref: 2.3 - Default message for unknown commands
  console.log("Usage: npx shipquick install");
  console.log("       npx shipquick help");
}
