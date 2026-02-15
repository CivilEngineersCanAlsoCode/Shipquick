/**
 * Shipquick Installer Core
 * Handles the actual file copying from bundled content to target directory
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const CONTENT_DIR = path.join(__dirname, '..', '..', 'content');

/**
 * Module definitions - what's available in the content/ directory
 */
const MODULES = {
  core: {
    id: 'core',
    name: 'Shipquick Core',
    description: 'Core agents, workflows, tasks, and configuration (always installed)',
    required: true,
    contentPaths: [
      '_bmad/core',
      '_bmad/_config',
      '.beads',
      '_tools',
      'bd',
      'bd.cmd',
    ],
  },
  bmm: {
    id: 'bmm',
    name: 'BMAD Method (Agile AI-Driven Development)',
    description: '50+ workflows for the full development lifecycle',
    required: false,
    contentPaths: ['_bmad/bmm'],
  },
  sq: {
    id: 'sq',
    name: 'SAFe 6.0.1 Module',
    description: 'SAFe hierarchy management - Portfolio, Solution, ART, Team',
    required: false,
    contentPaths: ['_bmad/sq'],
  },
  tea: {
    id: 'tea',
    name: 'Test Architect (TEA)',
    description: 'Production-ready test framework architecture with Playwright/Cypress',
    required: false,
    contentPaths: ['_bmad/tea'],
  },
};

/**
 * IDE integration definitions
 */
const IDE_INTEGRATIONS = {
  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code ⭐',
    contentPaths: ['.claude'],
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor ⭐',
    contentPaths: ['.cursor'],
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf ⭐',
    contentPaths: ['.windsurf'],
  },
  codex: {
    id: 'codex',
    name: 'Codex',
    contentPaths: ['.codex'],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini (Google)',
    contentPaths: ['.gemini'],
  },
  'kilo-code': {
    id: 'kilo-code',
    name: 'Kilo Code',
    contentPaths: ['.kilocodemodes'],
  },
  'github-copilot': {
    id: 'github-copilot',
    name: 'GitHub Copilot ⭐',
    contentPaths: ['.github'],
  },
  'google-antigravity': {
    id: 'google-antigravity',
    name: 'Google Antigravity ⭐',
    contentPaths: ['.gemini'],
  },
  augment: {
    id: 'augment',
    name: 'Augment',
    contentPaths: ['.augment'],
  },
  kiro: {
    id: 'kiro',
    name: 'Kiro',
    contentPaths: ['.kiro'],
  },
};

class Installer {
  constructor() {
    this.contentDir = CONTENT_DIR;
  }

  /**
   * Get available modules
   */
  getModules() {
    return MODULES;
  }

  /**
   * Get available IDE integrations
   */
  getIDEIntegrations() {
    return IDE_INTEGRATIONS;
  }

  /**
   * Install modules and IDE integrations to target directory
   */
  async install(config) {
    const {
      targetDir,
      selectedModules,
      selectedIDEs,
      userName,
      communicationLanguage,
      documentLanguage,
      outputFolder,
    } = config;

    const results = {
      moduleCount: 0,
      ideCount: 0,
      modules: [],
      ides: [],
      configsGenerated: false,
      success: false,
    };

    // 1. Copy shared files (always installed)
    await this._copySharedFiles(targetDir);

    // 2. Copy selected modules
    for (const moduleId of selectedModules) {
      const mod = MODULES[moduleId];
      if (!mod) continue;

      for (const contentPath of mod.contentPaths) {
        const src = path.join(this.contentDir, contentPath);
        const dest = path.join(targetDir, contentPath);

        if (await fs.pathExists(src)) {
          await fs.copy(src, dest, { overwrite: true });
        }
      }

      results.modules.push(mod.name);
      results.moduleCount++;
    }

    // 3. Copy selected IDE integrations
    for (const ideId of selectedIDEs) {
      const ide = IDE_INTEGRATIONS[ideId];
      if (!ide) continue;

      for (const contentPath of ide.contentPaths) {
        const src = path.join(this.contentDir, contentPath);
        const dest = path.join(targetDir, contentPath);

        if (await fs.pathExists(src)) {
          await fs.copy(src, dest, { overwrite: true });
        }
      }

      results.ides.push(ide.name);
      results.ideCount++;
    }

    // 4. Copy workflow files (.agent/workflows)
    const workflowsSrc = path.join(this.contentDir, '.agent');
    const workflowsDest = path.join(targetDir, '.agent');
    if (await fs.pathExists(workflowsSrc)) {
      await fs.copy(workflowsSrc, workflowsDest, { overwrite: true });
    }

    // 5. Generate configuration files
    await this._generateConfigs(targetDir, {
      userName,
      communicationLanguage,
      documentLanguage,
      outputFolder,
    });
    results.configsGenerated = true;

    // 6. Create output directory structure
    await this._createOutputDirs(targetDir, outputFolder);

    // 7. Create Gemini.md template
    await this._createGeminiMd(targetDir);

    // 8. Create AGENTS.md
    await this._copyRootFiles(targetDir);

    results.success = true;
    return results;
  }

  /**
   * Copy shared root-level files
   */
  async _copySharedFiles(targetDir) {
    const sharedFiles = [
      '.gitattributes',
      'agents.md',
      'index.md',
    ];

    for (const file of sharedFiles) {
      const src = path.join(this.contentDir, file);
      const dest = path.join(targetDir, file);
      if (await fs.pathExists(src)) {
        await fs.copy(src, dest, { overwrite: false });
      }
    }
  }

  /**
   * Copy root files like AGENTS.md, index.md
   */
  async _copyRootFiles(targetDir) {
    const rootFiles = ['agents.md', 'index.md'];
    for (const file of rootFiles) {
      const src = path.join(this.contentDir, file);
      const dest = path.join(targetDir, file);
      if (await fs.pathExists(src)) {
        await fs.copy(src, dest, { overwrite: true });
      }
    }
  }

  /**
   * Generate config.yaml files with user preferences
   */
  async _generateConfigs(targetDir, config) {
    const coreConfig = {
      user_name: config.userName,
      communication_language: config.communicationLanguage,
      document_output_language: config.documentLanguage,
      output_folder: config.outputFolder,
    };

    // Write core config
    const coreConfigPath = path.join(targetDir, '_bmad', 'core', 'config.yaml');
    await fs.ensureDir(path.dirname(coreConfigPath));

    const configYaml = [
      '# Shipquick Core Configuration',
      '# Generated by Shipquick installer',
      '',
      yaml.dump(coreConfig, { lineWidth: -1 }),
    ].join('\n');

    await fs.writeFile(coreConfigPath, configYaml);

    // Write memory config
    const memoryConfigPath = path.join(targetDir, '_bmad', '_memory', 'config.yaml');
    await fs.ensureDir(path.dirname(memoryConfigPath));

    const memoryConfig = {
      user_name: config.userName,
      communication_language: config.communicationLanguage,
      document_output_language: config.documentLanguage,
      output_folder: config.outputFolder,
      auto_save: true,
    };

    const memoryYaml = [
      '# Shipquick Memory Configuration',
      '# Generated by Shipquick installer',
      '',
      yaml.dump(memoryConfig, { lineWidth: -1 }),
    ].join('\n');

    await fs.writeFile(memoryConfigPath, memoryYaml);
  }

  /**
   * Create the output directory structure
   */
  async _createOutputDirs(targetDir, outputFolder) {
    const dirs = [
      'implementation-artifacts',
      'planning-artifacts',
      'test-artifacts',
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(targetDir, outputFolder, dir));
    }
  }

  /**
   * Create Gemini.md template
   */
  async _createGeminiMd(targetDir) {
    const geminiPath = path.join(targetDir, 'gemini.md');
    if (await fs.pathExists(geminiPath)) return; // Don't overwrite existing

    const src = path.join(this.contentDir, 'gemini.md');
    if (await fs.pathExists(src)) {
      await fs.copy(src, geminiPath);
    } else {
      const template = [
        '# Gemini Learning & Mistake Protocol',
        '',
        '## Template',
        '',
        '### Mistake: [TITLE]',
        '- **Date**: [DATE]',
        '- **Root Cause**: [DESCRIPTION]',
        '- **Correction**: [FIX]',
        '- **Prevention**: [RULE]',
        '',
        '---',
        '',
        '## Mistakes Log',
        '',
        '_No mistakes recorded yet._',
        '',
      ].join('\n');
      await fs.writeFile(geminiPath, template);
    }
  }

  /**
   * Count what would be installed (for summary)
   */
  async countManifests(targetDir) {
    let workflows = 0;
    let agents = 0;
    let tasks = 0;

    const agentDir = path.join(targetDir, '.agent', 'workflows');
    if (await fs.pathExists(agentDir)) {
      const files = await fs.readdir(agentDir);
      workflows = files.filter((f) => f.endsWith('.md')).length;
    }

    const bmadAgentsDir = path.join(targetDir, '_bmad', 'core', 'agents');
    if (await fs.pathExists(bmadAgentsDir)) {
      const files = await fs.readdir(bmadAgentsDir);
      agents = files.filter((f) => f.endsWith('.md')).length;
    }

    const tasksDir = path.join(targetDir, '_bmad', 'core', 'tasks');
    if (await fs.pathExists(tasksDir)) {
      const files = await fs.readdir(tasksDir);
      tasks = files.filter((f) => f.endsWith('.md')).length;
    }

    return { workflows, agents, tasks };
  }
}

module.exports = { Installer, MODULES, IDE_INTEGRATIONS };
