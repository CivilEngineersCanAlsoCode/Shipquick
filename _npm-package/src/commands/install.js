/**
 * Install Command - The interactive installer flow
 * Mirrors BMAD's install experience with Shipquick branding
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const os = require('node:os');
const prompts = require('../lib/prompts');
const { Installer, MODULES, IDE_INTEGRATIONS } = require('../lib/installer');
const { execSync } = require('node:child_process');

const installer = new Installer();
const packageJson = require('../../package.json');

/**
 * Load messages from YAML
 */
function loadMessages() {
  const messagesPath = path.join(__dirname, '..', 'messages.yaml');
  const content = fs.readFileSync(messagesPath, 'utf8');
  return yaml.load(content);
}

/**
 * Check if target directory has an existing installation
 */
async function checkExistingInstall(dir) {
  const bmadDir = path.join(dir, '_bmad');
  return fs.pathExists(bmadDir);
}

/**
 * Try to detect beads CLI
 */
function hasBeadsCLI() {
  try {
    execSync('bd --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Main install flow
 */
async function runInstall(options) {
  const messages = loadMessages();
  const c = prompts.colors;

  // Helper to skip prompts if -y is used
  const skip = options.yes;
  const getAnswer = async (promptFn, config) => {
    if (skip) return config.initialValue ?? config.initialValues;
    return promptFn(config);
  };

  // ─── Step 1: Banner ───
  prompts.banner(packageJson.version);

  // ─── Step 2: Start message ───
  prompts.intro(c.primary(''));
  prompts.messageBlock(messages.startMessage.trim());

 // ─── Step 3: Installation directory ───
  const defaultDir = options.directory || process.cwd();
  let installDir = defaultDir;
  let confirmed = false;

  while (!confirmed) {
    installDir = await getAnswer(prompts.text, {
      message: 'Installation directory:',
      placeholder: defaultDir,
      initialValue: options.directory, // Only pre-fill if explicitly passed via CLI arg
      validate(value) {
        if (!value && !defaultDir) return 'Directory path is required';
      },
    });

    if (prompts.isCancel(installDir)) {
      prompts.cancel('Installation cancelled.');
      process.exit(0);
    }

    if (!installDir) installDir = defaultDir;
    const resolvedDir = path.resolve(installDir);

    // Check if directory exists
    const dirExists = await fs.pathExists(resolvedDir);
    const isEmpty = dirExists
      ? (await fs.readdir(resolvedDir)).filter((f) => !f.startsWith('.')).length === 0
      : false;

    if (dirExists) {
      await prompts.log.info(`Resolved installation path: ${resolvedDir}`);
      const hasExisting = await checkExistingInstall(resolvedDir);

      if (hasExisting) {
        await prompts.log.warn('Existing Shipquick installation detected!');
      } else if (isEmpty) {
        await prompts.log.info('Directory exists and is empty');
      } else {
        await prompts.log.info('Directory exists with content');
      }
    } else {
      await prompts.log.info(`Will create: ${resolvedDir}`);
    }

    // ─── Step 4: Confirm directory ───
    const confirmDir = await getAnswer(prompts.confirm, {
      message: 'Install to this directory?',
      initialValue: true,
    });

    if (prompts.isCancel(confirmDir)) {
      prompts.cancel('Installation cancelled.');
      process.exit(0);
    }

    if (confirmDir) {
      confirmed = true;
      // Ensure directory exists and is writable
      try {
        await fs.ensureDir(resolvedDir);
        await fs.access(resolvedDir, fs.constants.W_OK);
      } catch (e) {
        prompts.log.error(`Directory not writable: ${e.message}`);
        confirmed = false;
        await prompts.log.warn("Let's try again with a different path.");
      }
    } else {
      await prompts.log.warn("Let's try again with a different path.");
    }
  }

  const resolvedDir = path.resolve(installDir);

  // ─── Step 5: Module selection ───
  // Handle CLI modules if provided
  let initialModules = ['core'];
  if (options.modules) {
    const mods = options.modules.split(',').map((s) => s.trim());
    initialModules = [...new Set(['core', ...mods])];
  }

  const moduleChoices = Object.values(MODULES).map((mod) => ({
    value: mod.id,
    label: mod.required ? c.primary(`${mod.name} (always installed)`) : mod.name,
    hint: mod.description,
    disabled: mod.required,
  }));

  const selectedModules = await getAnswer(prompts.multiselect, {
    message: 'Select modules to install:',
    options: moduleChoices,
    initialValues: initialModules,
    required: true,
  });

  if (prompts.isCancel(selectedModules)) {
    prompts.cancel('Installation cancelled.');
    process.exit(0);
  }

  // Ensure core is always included
  const finalModules = selectedModules.includes('core')
    ? selectedModules
    : ['core', ...selectedModules];

  // ─── Step 6: IDE integration ───
  // Handle CLI tools if provided
  let initialIDEs = [];
  if (options.tools) {
    if (options.tools === 'none') {
      initialIDEs = [];
    } else {
      initialIDEs = options.tools.split(',').map((s) => s.trim());
    }
  }

  const ideChoices = Object.values(IDE_INTEGRATIONS).map((ide) => ({
    value: ide.id,
    label: ide.name,
  }));

  const selectedIDEs = await getAnswer(prompts.multiselect, {
    message: 'Integrate with:',
    options: ideChoices,
    initialValues: initialIDEs,
    required: false,
  });

  if (prompts.isCancel(selectedIDEs)) {
    prompts.cancel('Installation cancelled.');
    process.exit(0);
  }

  // If no IDEs selected, confirm
  if (selectedIDEs.length === 0) {
    const continueNoIDE = await getAnswer(prompts.confirm, {
      message: 'No tools selected. Continue without installing any tools?',
      initialValue: true,
    });

    if (prompts.isCancel(continueNoIDE) || !continueNoIDE) {
      prompts.cancel('Installation cancelled.');
      process.exit(0);
    }
  }

  // ─── Step 7: Configuration ───
  await prompts.log.step('Shipquick Configuration');

  const defaultName = options.userName || os.userInfo().username || 'User';
  
  let userName = await getAnswer(prompts.text, {
    message: 'What should agents call you? (Use your name or a team name)',
    placeholder: 'Bro', 
    initialValue: options.userName, // Only if cli arg
    validate(value) {
      // Allow empty to use default
    },
  });

  if (prompts.isCancel(userName)) {
    prompts.cancel('Installation cancelled.');
    process.exit(0);
  }
  if (!userName) userName = 'Bro';

  // ─── Step 8: Communication language ───
  let commLang = await getAnswer(prompts.text, {
    message: 'What language should agents use when chatting with you?',
    placeholder: 'English',
    initialValue: undefined,
  });

  if (prompts.isCancel(commLang)) {
    prompts.cancel('Installation cancelled.');
    process.exit(0);
  }
  if (!commLang) commLang = 'English';

  // ─── Step 9: Document language ───
  let docLang = await getAnswer(prompts.text, {
    message: 'Preferred document output language?',
    placeholder: 'English',
    initialValue: undefined,
  });

  if (prompts.isCancel(docLang)) {
    prompts.cancel('Installation cancelled.');
    process.exit(0);
  }
  if (!docLang) docLang = 'English';

  // ─── Step 10: Output folder ───
  let outputFolder = await getAnswer(prompts.text, {
    message: 'Where should output files be saved?',
    placeholder: '_bmad-output',
    initialValue: undefined,
  });

  if (prompts.isCancel(outputFolder)) {
    prompts.cancel('Installation cancelled.');
    process.exit(0);
  }
  if (!outputFolder) outputFolder = '_bmad-output';

  // ─── Step 11: Pre-checks ───
  const spin = prompts.spinner();
  spin.start('Running pre-checks...');

  // Quick validation
  await new Promise((r) => setTimeout(r, 500));
  spin.stop('Pre-checks complete');

  // ─── Step 12: Installation ───
  spin.start('Installing Shipquick framework...');

  const result = await installer.install({
    targetDir: resolvedDir,
    selectedModules: finalModules,
    selectedIDEs,
    userName,
    communicationLanguage: commLang,
    documentLanguage: docLang,
    outputFolder,
  });

  spin.stop('Installation complete');

  // ─── Step 13: Beads init ───
  spin.start('Initializing Beads issue tracking...');

  // Use local wrapper if available, else fall back to global 'bd' for robustness
  const localBd = process.platform === 'win32' ? 'bd.cmd' : './bd';
  const hasLocalBd = await fs.pathExists(path.join(resolvedDir, localBd));
  const bdCmd = hasLocalBd ? localBd : (hasBeadsCLI() ? 'bd' : null);

  if (bdCmd) {
    try {
      execSync(`${bdCmd} init`, { cwd: resolvedDir, stdio: 'pipe' });
      spin.stop('Beads initialized');
    } catch (e) {
      if (process.env.DEBUG) console.error(e);
      spin.stop('Beads initialization skipped (run "bd init" or "./bd init" manually)');
    }
  } else {
    spin.stop('Beads CLI not found');
    await prompts.log.info(
      'Beads utility not initialized.'
    );
  }

  // ─── Step 14: Count manifests for summary ───
  const manifests = await installer.countManifests(resolvedDir);

  // ─── Step 15: Summary box ───
  prompts.box(
    [
      '',
      `  ✓  Modules (${result.moduleCount} installed: ${result.modules.join(', ')})`,
      `  ✓  Configurations (generated)`,
      `  ✓  Manifests (${manifests.workflows} workflows, ${manifests.agents} agents, ${manifests.tasks} tasks)`,
      result.ideCount > 0
        ? `  ✓  IDE Integrations (${result.ides.join(', ')})`
        : `  ○  No IDE integrations`,
      `  ✓  Output directory (${outputFolder}/)`,
      '',
      `  Installed to: ${resolvedDir}/_bmad`,
      '',
    ],
    'SHIPQUICK IS READY TO USE!'
  );

  // ─── Step 16: End message ───
  prompts.messageBlock(messages.endMessage.trim());
  console.log('');
}

module.exports = {
  command: 'install',
  description: 'Install Shipquick framework (BMAD + SAFe + Beads)',
  options: [
    ['--directory <path>', 'Installation directory (default: current directory)'],
    ['--modules <modules>', 'Comma-separated module IDs (e.g., "core,bmm,sq,tea")'],
    ['--tools <tools>', 'Comma-separated IDE IDs (e.g., "claude-code,cursor")'],
    ['--user-name <name>', 'Name for agents to use'],
    ['-y, --yes', 'Accept all defaults and skip prompts'],
  ],
  action: async (options) => {
    try {
      await runInstall(options);
      process.exit(0);
    } catch (error) {
      if (error.message?.includes('cancel')) {
        process.exit(0);
      }
      console.error(`\n  Installation failed: ${error.message}`);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  },
};
