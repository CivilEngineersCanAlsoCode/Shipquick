const fs = require('fs');
const path = require('path');

// --- Configuration ---
const MANIFEST_PATH = '_bmad/_config/workflow-manifest.csv';
const WEB_BUNDLES_DIR = 'web-bundles';

// 9-Agent Mapping
const AGENT_MAP = {
  // 00 - Orchestrator
  'brainstorming': '00-bmad-orchestrator',
  'party-mode': '00-bmad-orchestrator',

  // 01 - Portfolio & Solution
  'sq-init': '01-portfolio-solution',
  'sq-analyze': '01-portfolio-solution',
  'domain-research': '01-portfolio-solution',
  'market-research': '01-portfolio-solution',
  'sq-solve': '01-portfolio-solution',
  'sq-audit': '01-portfolio-solution', // Governance
  'sq-export': '01-portfolio-solution', // Governance

  // 02 - Product Manager
  'create-product-brief': '02-product-manager',
  'create-prd': '02-product-manager',
  'edit-prd': '02-product-manager',
  'validate-prd': '02-product-manager',
  'sq-plan': '02-product-manager',

  // 03 - System Architect
  'create-architecture': '03-system-architect',
  'check-implementation-readiness': '03-system-architect',
  'technical-research': '03-system-architect',
  'document-project': '03-system-architect',
  'generate-project-context': '03-system-architect',

  // 04a - Product Owner
  'create-epics-and-stories': '04a-product-owner',
  'create-story': '04a-product-owner',
  'sprint-planning': '04a-product-owner',
  'sprint-status': '04a-product-owner',

  // 04b - Scrum Master
  'retrospective': '04b-scrum-master',
  'correct-course': '04b-scrum-master',

  // 04c - Dev Squad
  'sq-exec': '04c-dev-squad',
  'dev-story': '04c-dev-squad',
  'quick-dev': '04c-dev-squad',
  'quick-spec': '04c-dev-squad',
  'code-review': '04c-dev-squad',

  // 04d - UX Designer
  'create-ux-design': '04d-ux-designer',

  // 05 - Test Architect
  'qa-automate': '05-test-architect',
  'teach-me-testing': '05-test-architect',
  'testarch-atdd': '05-test-architect',
  'testarch-automate': '05-test-architect',
  'testarch-ci': '05-test-architect',
  'testarch-framework': '05-test-architect',
  'testarch-nfr': '05-test-architect',
  'testarch-test-design': '05-test-architect',
  'testarch-test-review': '05-test-architect',
  'testarch-trace': '05-test-architect'
};

// --- Helper Functions ---

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function parseManifest(csvContent) {
  const lines = csvContent.split('\n').filter(l => l.trim() && !l.startsWith('name,'));
  const workflows = [];
  
  lines.forEach(line => {
    // Basic CSV parser (handles quotes)
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches) return;
    
    const name = matches[0].replace(/"/g, '');
    const relativePath = matches[3].replace(/"/g, '');
    
    workflows.push({ name, relativePath });
  });
  return workflows;
}

function harvestFiles(dirPath) {
  let harvested = {
    steps: [],     // .md
    data: [],      // .csv
    templates: [], // various
    config: [],    // .yaml, .json
    logic: []      // .xml
  };

  if (!fs.existsSync(dirPath)) return harvested;

  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively search specifically named folders
      if (['steps-c', 'steps-e', 'steps-v', 'data', 'templates', 'config'].includes(file)) {
          const subHarvest = harvestFiles(fullPath);
          // Merge results
          harvested.steps = harvested.steps.concat(subHarvest.steps);
          harvested.data = harvested.data.concat(subHarvest.data);
          harvested.templates = harvested.templates.concat(subHarvest.templates);
          harvested.config = harvested.config.concat(subHarvest.config);
          harvested.logic = harvested.logic.concat(subHarvest.logic);
      }
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      const ext = path.extname(file).toLowerCase();
      
      if (ext === '.md') {
          // Identify if it's a step or just a regular md
          // For simplicty, treat all MDs in subfolders or main as steps/content
          harvested.steps.push({ name: file, content });
      } else if (ext === '.csv') {
          harvested.data.push({ name: file, content });
      } else if (ext === '.yaml' || ext === '.json') {
          harvested.config.push({ name: file, content });
      } else if (ext === '.xml') {
          harvested.logic.push({ name: file, content });
      } else {
           // Treat others as templates if in template folder, or general assets
           // For now, if we are inside a 'templates' folder (checked by parent recursion), 
           // but here we are flat. 
           // Let's rely on file placement.
           if (fullPath.includes('/templates/')) {
               harvested.templates.push({ name: file, content });
           }
      }
    }
  });
  
  return harvested;
}

function compileHtml(workflowName, mainContent, harvested) {
    const timestamp = new Date().toISOString();
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${workflowName} - Shipquick Web Bundle</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; color: #333; }
        h1, h2, h3 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        section { margin-bottom: 40px; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #fafafa; }
        pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; overflow-x: auto; border-radius: 4px; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .toc { background: #eef; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .toc ul { list-style-type: none; padding: 0; }
        .toc li { margin: 5px 0; }
        .toc a { text-decoration: none; color: #0366d6; }
        .toc a:hover { text-decoration: underline; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold; margin-right: 5px; }
        .badge.md { background: #e1f5fe; color: #0277bd; }
        .badge.csv { background: #fbe9e7; color: #d84315; }
        .badge.yaml { background: #fff3e0; color: #ef6c00; }
    </style>
</head>
<body>

<h1>Workflow: ${workflowName.toUpperCase()}</h1>
<p>Generated: ${timestamp}</p>

<div class="toc">
    <h2>Table of Contents</h2>
    <ul>
        <li><a href="#main">Main Workflow</a></li>
`;

    // Add ToC entries
    harvested.steps.sort((a,b) => a.name.localeCompare(b.name)).forEach(f => {
        html += `<li><a href="#step-${f.name}"><span class="badge md">MD</span> ${f.name}</a></li>\n`;
    });
    harvested.data.forEach(f => {
        html += `<li><a href="#data-${f.name}"><span class="badge csv">CSV</span> ${f.name}</a></li>\n`;
    });
    harvested.config.forEach(f => {
        html += `<li><a href="#config-${f.name}"><span class="badge yaml">CFG</span> ${f.name}</a></li>\n`;
    });
    harvested.templates.sort((a,b) => a.name.localeCompare(b.name)).forEach(f => {
         html += `<li><a href="#template-${f.name}"><span class="badge">TMP</span> ${f.name}</a></li>\n`;
    });

    html += `    </ul>
</div>

<article id="main">
    <h2>Main Workflow Document</h2>
    <pre>${escapeHtml(mainContent)}</pre>
</article>
`;

    // Add Content
    if (harvested.steps.length > 0) {
        html += `<h2>Steps & Instructions</h2>\n`;
        harvested.steps.forEach(f => {
            html += `<section id="step-${f.name}">
                <h3>${f.name}</h3>
                <pre>${escapeHtml(f.content)}</pre>
            </section>\n`;
        });
    }

    if (harvested.data.length > 0) {
        html += `<h2>Reference Data (CSV)</h2>\n`;
        harvested.data.forEach(f => {
            html += `<section id="data-${f.name}">
                <h3>${f.name}</h3>
                ${csvToHtmlTable(f.content)}
            </section>\n`;
        });
    }

    if (harvested.config.length > 0) {
        html += `<h2>Configuration & Logic</h2>\n`;
        harvested.config.forEach(f => {
            html += `<section id="config-${f.name}">
                <h3>${f.name}</h3>
                <pre><code class="language-yaml">${escapeHtml(f.content)}</code></pre>
            </section>\n`;
        });
    }
    
    if (harvested.templates.length > 0) {
        html += `<h2>Templates</h2>\n`;
        harvested.templates.forEach(f => {
            html += `<section id="template-${f.name}">
                <h3>${f.name}</h3>
                <pre><code>${escapeHtml(f.content)}</code></pre>
            </section>\n`;
        });
    }

    html += `
</body>
</html>`;

    return html;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function csvToHtmlTable(csvText) {
    if (!csvText) return '';
    const rows = csvText.trim().split('\n');
    let table = '<table>\n';
    
    rows.forEach((row, index) => {
        const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, '')); // Basic CSV split
        table += '  <tr>\n';
        cols.forEach(col => {
            if (index === 0) {
                table += `    <th>${escapeHtml(col)}</th>\n`;
            } else {
                table += `    <td>${escapeHtml(col)}</td>\n`;
            }
        });
        table += '  </tr>\n';
    });
    table += '</table>';
    return table;
}


// --- Main Execution ---

console.log('🚀 Starting Web Bundle Compilation...');

if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`❌ Manifest not found at: ${MANIFEST_PATH}`);
    process.exit(1);
}

const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
const workflows = parseManifest(manifestContent);

console.log(`📋 Found ${workflows.length} workflows in manifest.`);

let successCount = 0;
let failCount = 0;

workflows.forEach(wf => {
    const targetAgentFolder = AGENT_MAP[wf.name];
    
    if (!targetAgentFolder) {
        console.warn(`⚠️  Skipping unmapped workflow: ${wf.name}`);
        return;
    }

    const sourceFilePath = wf.relativePath; // e.g., _bmad/bmm/workflows/2-plan-workflows/create-prd/workflow-create-prd.md
    const sourceDir = path.dirname(sourceFilePath); // e.g., _bmad/bmm/workflows/2-plan-workflows/create-prd/

    if (!fs.existsSync(sourceFilePath)) {
         console.warn(`⚠️  Source file not found: ${sourceFilePath}`);
         return;
    }

    try {
        console.log(`📦 Compiling ${wf.name}...`);
        
        // 1. Read Main File
        const mainContent = fs.readFileSync(sourceFilePath, 'utf8');
        
        // 2. Harvest Related Files
        // Only if start from a directory structure. 
        // Logic: Checks if there are siblings or if it's just a file.
        // The harvester checks specific subfolders.
        const harvested = harvestFiles(sourceDir);
        
        // 3. Compile HTML
        const htmlContent = compileHtml(wf.name, mainContent, harvested);
        
        // 4. Write Output
        const destFileName = `workflow_${wf.name.toLowerCase()}.html`;
        const destPath = path.join(WEB_BUNDLES_DIR, targetAgentFolder, destFileName);
        
        ensureDirectoryExistence(destPath);
        fs.writeFileSync(destPath, htmlContent);
        
        console.log(`   ✅ Saved to ${targetAgentFolder}/${destFileName}`);
        successCount++;
        
    } catch (err) {
        console.error(`   ❌ Error compiling ${wf.name}: ${err.message}`);
        failCount++;
    }
});

console.log(`\n🎉 Compilation Complete!`);
console.log(`   Success: ${successCount}`);
console.log(`   Failed:  ${failCount}`);
