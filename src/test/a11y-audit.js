import axe from 'axe-core';
import { JSDOM } from 'jsdom';

console.log('axe-core version:', axe.version);
console.log('Axe core rules loaded:', Object.keys(axe.getRules ? axe.getRules() : {}).length || 'N/A');

async function auditPage(htmlString = '<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body><main><button aria-label="Test action">Test</button></main></body></html>') {
  const dom = new JSDOM(htmlString, { runScripts: 'dangerously' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.Node = dom.window.Node;
  globalThis.Element = dom.window.Element;

  const results = await axe.run(dom.window.document.documentElement, {
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
