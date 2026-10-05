/**
 * Basic axe-core accessibility audit setup.
 * Can be expanded with puppeteer/playwright for full page scans.
 */
import axe from 'axe-core';

console.log('axe-core version:', axe.version);
console.log('Axe core rules loaded:', Object.keys(axe.getRules ? axe.getRules() : {}).length || 'N/A');

// Example: run on HTML string (to be integrated with Playwright)
async function auditPage(htmlString = '<html><body><button>Test</button></body></html>') {
  const results = await axe.run(htmlString, {
    runOnly: {
      type: 'tag',
      values: ['wcag2aa', 'wcag2a', 'best-practice'],
    },
  });
  console.log('Violations:', results.violations.length);
  results.violations.forEach((v) => {
    console.log(' -', v.id, ':', v.description, '(', v.nodes.length, 'nodes)');
  });
}

auditPage().catch((err) => console.error('Audit error:', err));
