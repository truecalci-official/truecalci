import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PAGES = [
  '/',
  '/workstation.html',
  '/engineering-formulas.html',
  '/pricing.html',
  '/privacy.html',
  '/terms.html',
  '/docs.html'
];

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

function extractHrefs(html) {
  const hrefs = [];
  const regex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

async function runAudit() {
  console.log('='.repeat(80));
  console.log('TRUECALCI COMPREHENSIVE MULTI-PAGE AUDIT & LINK INTEGRITY CRAWLER');
  console.log('='.repeat(80));

  let totalChecks = 0;
  let passedChecks = 0;
  let failedChecks = 0;

  function assert(condition, message) {
    totalChecks++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedChecks++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failedChecks++;
    }
  }

  for (const pageUrl of PAGES) {
    console.log(`\n[Auditing Page] http://localhost:3000${pageUrl}`);
    try {
      const page = await fetchPage(pageUrl);
      assert(page.status === 200, `Page ${pageUrl} responded with HTTP 200 OK`);

      // 1. Verify Universal Header Presence
      assert(page.body.includes('class="app-header') || page.body.includes("class='app-header"), `Page ${pageUrl} contains universal app-header`);
      assert(page.body.includes('class="brand-title') || page.body.includes("TrueCalci"), `Page ${pageUrl} contains TrueCalci brand element`);
      assert(page.body.includes('header-search-input'), `Page ${pageUrl} contains omnibar search input`);
      assert(page.body.includes('Product</span>'), `Page ${pageUrl} contains Product dropdown in header`);
      assert(page.body.includes('Solutions</span>'), `Page ${pageUrl} contains Solutions dropdown in header`);
      assert(page.body.includes('Resources</span>'), `Page ${pageUrl} contains Resources dropdown in header`);
      assert(page.body.includes('/pricing.html') || page.body.includes('/pricing'), `Page ${pageUrl} contains direct link to Pricing`);
      assert(page.body.includes('/workstation.html') || page.body.includes('workstation.html'), `Page ${pageUrl} contains navigation to Workstation Studio`);

      // 2. Extract and Validate all Internal Links
      const hrefs = extractHrefs(page.body);
      const internalLinks = hrefs.filter(h => 
        h.startsWith('/') || h.startsWith('#') || (!h.startsWith('http') && !h.startsWith('mailto:') && !h.startsWith('javascript:'))
      );

      console.log(`    Found ${internalLinks.length} internal links on ${pageUrl}. Verifying destinations...`);

      for (const link of internalLinks) {
        if (link.startsWith('#')) {
          // In-page anchor — fine
          continue;
        }

        const cleanPath = link.split('#')[0].split('?')[0];
        if (!cleanPath) continue;

        const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
        
        try {
          const res = await fetchPage(normalizedPath);
          assert(res.status === 200, `Internal link target "${link}" on ${pageUrl} returns HTTP 200`);
        } catch (e) {
          assert(false, `Internal link target "${link}" on ${pageUrl} failed with error: ${e.message}`);
        }
      }
    } catch (err) {
      assert(false, `Failed to fetch page ${pageUrl}: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`AUDIT RESULTS: ${passedChecks} PASSED, ${failedChecks} FAILED (TOTAL: ${totalChecks})`);
  console.log('='.repeat(80));

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runAudit();
