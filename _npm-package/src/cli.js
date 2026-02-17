const { program } = require('commander');
const path = require('node:path');
const fs = require('node:fs');

// Raise stdin listener limit for @clack/prompts
if (process.stdin?.setMaxListeners) {
  process.stdin.setMaxListeners(50);
}

const packageJson = require('../package.json');

// Fix stdin for interactive prompts
if (process.stdin.isTTY) {
  try {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    if (process.platform === 'win32') {
      process.stdin.on('error', () => {});
    }
  } catch {
    // Silently ignore
  }
}

// Register install command
const installCommand = require('./commands/install');

program
  .version(packageJson.version)
  .description('Shipquick - BMAD + SAFe + Beads Framework Installer');

const cmd = program
  .command(installCommand.command)
  .description(installCommand.description);

for (const option of installCommand.options || []) {
  cmd.option(...option);
}
cmd.action(installCommand.action);

program.parse(process.argv);

if (process.argv.slice(2).length === 0) {
  program.outputHelp();
}
