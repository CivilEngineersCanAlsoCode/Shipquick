const fs = require('fs');
const path = require('path');
const csv = require('fs').readFileSync('_bmad/_config/workflow-manifest.csv', 'utf8');

// Mapping of Component/Role to Agent Directory
const AGENT_MAP = {
  '00': '00-bmad-orchestrator',
  '01': '01-lpm-strategy',
  '02': '02-solution-train',
  '03': '03-product-management',
  '04': '04-system-architecture',
  '05': '05-agile-team',
  '06': '06-quality-release'
};

// Workflow to Agent ID mapping
const WORKFLOW_TO_AGENT = {
  // 00 - Orchestrator
  'brainstorming': '00',
  'party-mode': '00',

  // 01 - LPM
  'sq-init': '01',
  'sq-analyze': '01',
  'domain-research': '01',
  'market-research': '01',

  // 02 - Solution
  'sq-solve': '02',

  // 03 - Product
  'sq-plan': '03',
  'create-product-brief': '03',
  'create-prd': '03',
  'edit-prd': '03',
  'validate-prd': '03',
  'create-ux-design': '03',

  // 04 - Architecture
  'create-architecture': '04',
  'check-implementation-readiness': '04',
  'technical-research': '04',
  'document-project': '04',
  'generate-project-context': '04',

  // 05 - Agile Team
  'sq-exec': '05',
  'create-epics-and-stories': '05',
  'create-story': '05',
  'dev-story': '05',
  'quick-dev': '05',
  'quick-spec': '05',
  'code-review': '05',
  'sprint-planning': '05',
  'sprint-status': '05',
  'correct-course': '05',
  'retrospective': '05',
  'sq-export': '05',

  // 06 - Quality
  'sq-audit': '06',
  'qa-automate': '06',
  'teach-me-testing': '06',
  
  // TEA Workflows (All to 06)
  'testarch-atdd': '06',
  'testarch-automate': '06',
  'testarch-ci': '06',
  'testarch-framework': '06',
  'testarch-nfr': '06',
  'testarch-test-design': '06',
  'testarch-test-review': '06',
  'testarch-trace': '06'
};

// Parse CSV
const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('name,'));
console.log(`Found ${lines.length} workflows in manifest.`);

lines.forEach(line => {
  // Regex to handle quoted CSV fields
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  if (!matches) return;
  
  const name = matches[0].replace(/"/g, '');
  // Skip description (index 1) and module (index 2)
  const relativePath = matches[3].replace(/"/g, ''); // Path is index 3

  const agentId = WORKFLOW_TO_AGENT[name];
  if (!agentId) {
    console.warn(`Skipping unmapped workflow: ${name}`);
    return;
  }

  const agentDirName = AGENT_MAP[agentId];
  const sourcePath = path.resolve(relativePath);
  
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    return;
  }

  const destFileName = `workflow_${name.toLowerCase()}.md`;
  const destPath = path.join('web-bundles', agentDirName, destFileName);

  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${name} -> ${agentDirName}/${destFileName}`);
  } catch (err) {
    console.error(`Error copying ${name}: ${err.message}`);
  }
});

console.log('Workflow population complete.');
