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
  'index.html',
  'workstation.html',
  'pricing.html',
  'docs.html',
  'engineering-formulas.html',
  'terms.html',
  'privacy.html',
  'admin.html'
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

console.log('\n🎉 public_deploy/ is completely synchronized with production files!');
