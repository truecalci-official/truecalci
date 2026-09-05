import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const deployDir = path.resolve(rootDir, 'public_deploy');

console.log('Syncing updated production files to public_deploy/...');

const filesToSync = [
  'robots.txt',
  'sitemap.xml',
  '_headers',
  'openapi.json',
  'server.json',
  'glama.json',
  'package.json',
  'llms.txt',
  'llms-full.txt',
  'index.html',
  'workstation.html',
  'pricing.html',
  'docs.html',
  'engineering-formulas.html',
  'terms.html',
  'privacy.html',
  'admin.html',
  '_worker.js'
];

for (const file of filesToSync) {
  const src = path.join(rootDir, file);
  const dest = path.join(deployDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✔ Synced ${file}`);
  }
}

// Sync js/
function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(path.join(rootDir, 'js'), path.join(deployDir, 'js'));
console.log('  ✔ Synced js/ directory recursively');

copyRecursive(path.join(rootDir, 'css'), path.join(deployDir, 'css'));
console.log('  ✔ Synced css/ directory recursively');

if (fs.existsSync(path.join(rootDir, '.well-known'))) {
  copyRecursive(path.join(rootDir, '.well-known'), path.join(deployDir, '.well-known'));
  console.log('  ✔ Synced .well-known/ directory recursively');
}

// Automated Integrity & Drift Verification Loop
console.log('\nVerifying byte-level synchronization...');
let driftCount = 0;
for (const file of filesToSync) {
  const src = path.join(rootDir, file);
  const dest = path.join(deployDir, file);
  if (!fs.existsSync(dest)) {
    console.error(`  ❌ Missing in public_deploy: ${file}`);
    driftCount++;
  } else {
    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.readFileSync(dest);
    if (!srcBuf.equals(destBuf)) {
      console.error(`  ❌ Content mismatch in: ${file}`);
      driftCount++;
    }
  }
}

if (driftCount > 0) {
  console.error(`\n❌ Synchronization verification failed with ${driftCount} drifted files!`);
  process.exit(1);
}

console.log('  ✔ Zero drift detected across all synced files');
console.log('\n🎉 public_deploy/ is completely synchronized with production files!');

