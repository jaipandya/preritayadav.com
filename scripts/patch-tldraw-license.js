#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// Temporary patch: make @tldraw/editor treat every environment as development
// so the production license check is skipped while the hobby license is obtained.
// Remove this file (and the postinstall entry in package.json) once the licenseKey
// is added to <Tldraw licenseKey={...} />.

const fs = require('fs');
const path = require('path');

const FILES = [
  'node_modules/@tldraw/editor/dist-esm/lib/license/LicenseManager.mjs',
  'node_modules/@tldraw/editor/dist-cjs/lib/license/LicenseManager.js',
];

const ORIGINAL = `  getIsDevelopment() {\n    return ![\"https:\", \"vscode-webview:\"].includes(window.location.protocol) || window.location.hostname === \"localhost\" || process.env.NODE_ENV !== \"production\";\n  }`;
const PATCHED = `  getIsDevelopment() {\n    // TEMP PATCH: always return true while hobby license is pending\n    return true;\n  }`;

for (const file of FILES) {
  const abs = path.join(__dirname, '..', file);
  if (!fs.existsSync(abs)) {
    console.warn(`[patch-tldraw] ${file} not found, skipping.`);
    continue;
  }
  const content = fs.readFileSync(abs, 'utf8');
  if (content.includes('TEMP PATCH')) {
    console.log(`[patch-tldraw] ${file} already patched.`);
    continue;
  }
  const replaced = content.replace(ORIGINAL, PATCHED);
  if (replaced === content) {
    console.warn(`[patch-tldraw] Could not find target in ${file} – tldraw may have been updated.`);
    continue;
  }
  fs.writeFileSync(abs, replaced, 'utf8');
  console.log(`[patch-tldraw] Patched ${file}`);
}
