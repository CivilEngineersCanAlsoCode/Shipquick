/**
 * Bundle Content Script
 * Copies Shipquick framework files from the parent repo into content/
 * Run this before npm publish: node scripts/bundle-content.js
 */

const path = require('node:path');
const fs = require('fs-extra');

const FRAMEWORK_DIR = path.join(__dirname, '..', '..');
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const VENDOR_DIR = path.join(__dirname, '..', 'vendor');

// Files and folders to bundle from the framework
const BUNDLE_ITEMS = [
  // Core framework
  '_bmad',
  '.agent',
  '.beads',

  // IDE configs
  '.claude',
  '.cursor',
  '.windsurf',
  '.codex',
  '.gemini',
  '.kiro',
  '.augment',

  // Root files
  '.gitattributes',
  '.kilocodemodes',
  'agents.md',
  'gemini.md',
  'index.md',
];

// Items to EXCLUDE from bundle
const EXCLUDE_ITEMS = [
  '_npm-package',    // Don't bundle ourselves
  'Old Bmad',        // Test install
  '.git',
  'node_modules',
  '.DS_Store',
  '_bmad-output',    // User-generated output
];

async function bundle() {
  console.log('🔧 Bundling Shipquick framework content...\n');

  // Clean existing content
  await fs.remove(CONTENT_DIR);
  await fs.ensureDir(CONTENT_DIR);

  let copied = 0;
  let skipped = 0;

  for (const item of BUNDLE_ITEMS) {
    const src = path.join(FRAMEWORK_DIR, item);
    const dest = path.join(CONTENT_DIR, item);

    if (await fs.pathExists(src)) {
      await fs.copy(src, dest, {
        overwrite: true,
        filter: (srcPath) => {
          const relative = path.relative(src, srcPath);
          // Skip excluded items
          for (const exclude of EXCLUDE_ITEMS) {
            if (srcPath.includes(exclude)) return false;
          }
          // Skip .DS_Store
          if (path.basename(srcPath) === '.DS_Store') return false;
          return true;
        },
      });
      const stat = await fs.stat(src);
      const type = stat.isDirectory() ? 'DIR ' : 'FILE';
      console.log(`  ✓ ${type}  ${item}`);
      copied++;
    } else {
      skipped++;
    }
  }

  // Copy vendored tools (beads, etc.)
  if (await fs.pathExists(VENDOR_DIR)) {
    await fs.copy(VENDOR_DIR, CONTENT_DIR, { overwrite: true });
    console.log(`  ✓ VENDOR  Merged vendor/ into content/`);
  }

  // Remove any _memory session data
  const memoryDir = path.join(CONTENT_DIR, '_bmad', '_memory');
  if (await fs.pathExists(memoryDir)) {
    // Keep structure but clear session-specific content
    const storytellerDir = path.join(memoryDir, 'storyteller-sidecar');
    if (await fs.pathExists(storytellerDir)) {
      // Keep template files but ensure they're clean
    }
  }

  console.log(`\n📦 Bundle complete: ${copied} items copied, ${skipped} skipped`);
  console.log(`   Location: ${CONTENT_DIR}`);

  // Show size
  const size = await getDirSize(CONTENT_DIR);
  console.log(`   Size: ${(size / 1024 / 1024).toFixed(1)} MB`);
}

async function getDirSize(dir) {
  let size = 0;
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      size += await getDirSize(filePath);
    } else {
      const stat = await fs.stat(filePath);
      size += stat.size;
    }
  }
  return size;
}

bundle().catch((err) => {
  console.error('Bundle failed:', err);
  process.exit(1);
});
