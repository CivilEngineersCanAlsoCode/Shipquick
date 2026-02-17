/**
 * Shipquick Prompts - Wrapper around @clack/prompts
 * Mirrors BMAD's prompts.js pattern
 */

const clack = require('@clack/prompts');
const pc = require('picocolors');

const SHIPQUICK_COLOR = pc.cyan;
const ACCENT_COLOR = pc.magenta;
const SUCCESS_COLOR = pc.green;
const WARNING_COLOR = pc.yellow;
const ERROR_COLOR = pc.red;
const DIM_COLOR = pc.dim;

/**
 * Display the Shipquick ASCII banner
 */
function banner(version) {
  const c = require('picocolors');
  
  console.log('');
  console.log(c.bgCyan(c.black(c.bold('   SHIPQUICK   '))));
  console.log(c.cyan('   Ship Smarter. Scale Faster. SAFe Ready.'));
  console.log('');
}

/**
 * Display a boxed message (like BMAD's completion box)
 */
function box(lines, title) {
  const maxLen = Math.max(
    ...lines.map((l) => l.length),
    (title || '').length + 4,
    50
  );
  const pad = (s, len) => s + ' '.repeat(Math.max(0, len - s.length));

  console.log(
    SHIPQUICK_COLOR(`  ◇  ${title || 'Shipquick'} ${'─'.repeat(Math.max(0, maxLen - (title || 'Shipquick').length + 2))}╮`)
  );
  for (const line of lines) {
    console.log(SHIPQUICK_COLOR('  │') + `  ${pad(line, maxLen)}  ` + SHIPQUICK_COLOR('│'));
  }
  console.log(
    SHIPQUICK_COLOR(`  ├${'─'.repeat(maxLen + 4)}╯`)
  );
}

/**
 * Display a styled message block
 */
function messageBlock(text) {
  const lines = text.split('\n');
  for (const line of lines) {
    console.log(SHIPQUICK_COLOR('  │') + `  ${line}`);
  }
}

module.exports = {
  // Re-export @clack/prompts
  intro: clack.intro,
  outro: clack.outro,
  text: clack.text,
  confirm: clack.confirm,
  select: clack.select,
  multiselect: clack.multiselect,
  spinner: clack.spinner,
  isCancel: clack.isCancel,
  cancel: clack.cancel,
  note: clack.note,
  log: clack.log,

  // Custom helpers
  banner,
  box,
  messageBlock,

  // Colors
  colors: {
    primary: SHIPQUICK_COLOR,
    accent: ACCENT_COLOR,
    success: SUCCESS_COLOR,
    warning: WARNING_COLOR,
    error: ERROR_COLOR,
    dim: DIM_COLOR,
  },
};
