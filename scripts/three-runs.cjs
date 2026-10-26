const { spawnSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const playwrightCli = require.resolve('@playwright/test/cli');
const outputDirectory = resolve('stability-results');
mkdirSync(outputDirectory, { recursive: true });

for (let run = 1; run <= 3; run++) {
 const result = spawnSync(
  process.execPath,
  [playwrightCli, 'test', 'tests/junior', '--reporter=line'],
  {
    encoding: 'utf8',
    env: { ...process.env, CI: '1' },
    maxBuffer: 8 * 1024 * 1024
  }
);

  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  const file = join(outputDirectory, `run-${run}.txt`);
  writeFileSync(file, output, 'utf8');
  const passed = result.status === 0 && !result.error;
  process.stdout.write(`Run ${run}/3: ${passed ? 'PASSED' : 'FAILED'}; log: ${file}\n`);
  if (!passed) {
    if (result.error) process.stderr.write(`${result.error.message}\n`);
    process.exit(result.status || 1);
  }
}

process.stdout.write('Three independent runs passed for the Junior API suite.\n');
