const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'PROMPT.md'), 'utf8').replace(/\r\n/g, '\n');
const output = '// Generated from PROMPT.md; run node scripts/build-prompt.cjs\nconst ANALYSIS_PROMPT = ' + JSON.stringify(source) + ';\n';
const target = path.join(root, 'prompt-data.js');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) {
    console.error('prompt-data.js is stale. Run node scripts/build-prompt.cjs');
    process.exitCode = 1;
  }
} else fs.writeFileSync(target, output);
