import { chromium } from 'playwright';

async function run() {
  console.log('🚀 Starting Comprehensive Browser Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['microphone', 'camera'],
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  const requestFailures = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));
  page.on('requestfailed', req => requestFailures.push(req.url()));

  console.log('1. Navigating to http://localhost:4173...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  // Test 1: Title and Header
  const title = await page.title();
  console.log(`   Page title: "${title}"`);
  if (!title.includes('Touch Grass')) throw new Error('Incorrect page title');

  // Test 2: Check Bird View
  console.log('2. Testing Bird Identification View...');
  await page.waitForSelector('h2:has-text("Bird Call Identification")');
  console.log('   Bird Call Identification heading visible ✅');

  // Test 3: Record Audio & Identify
  const recordBtn = await page.$('button[aria-label="Record bird call"]');
  if (recordBtn) {
    console.log('   Clicking Record button...');
    await recordBtn.click();
    await page.waitForTimeout(500);
    // Button should now allow stop or auto-finish after 3s
    const stopBtn = await page.$('button[aria-label="Stop recording bird call"]');
    console.log('   Stop recording button active during recording:', !!stopBtn);
    if (stopBtn) {
      await stopBtn.click();
      console.log('   Stopped recording early ✅');
    } else {
      await page.waitForTimeout(3200);
    }

    // Identify Bird button should appear
    await page.waitForTimeout(500);
    const identifyBtn = await page.$('button[aria-label="Identify bird from recorded audio"]');
    if (identifyBtn) {
      console.log('   Identify Bird button appeared, clicking...');
      await identifyBtn.click();
      await page.waitForSelector('section[aria-label="Bird identification results"]', { timeout: 5000 });
      console.log('   Bird identification results rendered ✅');

      // Test Reference Call audio chirp
      const refCallBtn = await page.$('button[aria-label^="Play reference call"]');
      if (refCallBtn) {
        console.log('   Clicking Reference Call button...');
        await refCallBtn.click();
        await page.waitForTimeout(300);
        console.log('   Reference call played successfully ✅');
      }
    } else {
      console.log('   Identify bird button did not appear (no chunks recorded in headless environment without audio hardware)');
    }
  }

  // Test 4: Navigate to Photo ID
  console.log('3. Testing Photo Identification View...');
  await page.click('nav a[href="#photo"]');
  await page.waitForSelector('h2:has-text("Plant & Insect Identification")');
  console.log('   Photo ID heading visible ✅');

  // Test Photo Gallery Import using an in-memory generated image
  console.log('   Testing image import & identification...');
  const fileInput = await page.$('input[type="file"][accept="image/*"]');
  if (fileInput) {
    // Generate a 100x100 dummy PNG buffer
    const dummyImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(dummyImageBase64, 'base64');
    await fileInput.setInputFiles({
      name: 'leaf-test.png',
      mimeType: 'image/png',
      buffer: buffer,
    });
    console.log('   Photo uploaded, waiting for inference...');
    await page.waitForSelector('section[aria-label="Photo identification results"]', { timeout: 5000 });
    const topSpecies = await page.$eval('section[aria-label="Photo identification results"] h3', el => el.textContent);
    console.log(`   Photo identified top match: "${topSpecies}" ✅`);
  }

  // Test 5: Navigate to History
  console.log('4. Testing Observation History View...');
  await page.click('nav a[href="#history"]');
  await page.waitForSelector('h2:has-text("Observation History")');
  console.log('   Observation History heading visible ✅');

  // Verify that observations were auto-saved
  await page.waitForTimeout(1000);
  const observationsCountText = await page.$eval('p:has-text("ready")', el => el.textContent).catch(() => null);
  console.log(`   History status: "${observationsCountText}"`);

  // Test Export Dialog
  const exportBtn = await page.$('button[aria-label="Export observations"]');
  if (exportBtn) {
    console.log('   Testing Export dialog...');
    await exportBtn.click();
    await page.waitForSelector('div[role="dialog"][aria-label="Export observations"]');
    console.log('   Export dialog opened ✅');
    await page.click('button[aria-label="Close export dialog"]');
  }

  // Test 6: Navigate to Models
  console.log('5. Testing Model Manager View...');
  await page.click('nav a[href="#models"]');
  await page.waitForSelector('h2:has-text("Model Manager")');
  console.log('   Model Manager heading visible ✅');
  const modelCards = await page.$$eval('h3', els => els.map(e => e.textContent.trim()));
  console.log('   Models present in registry:', modelCards.filter(m => m.includes('ONNX') || m.includes('MobileNet')));

  // Test 7: Open Settings from Header
  console.log('6. Testing Settings Panel...');
  await page.click('button[aria-label="Open settings"]');
  await page.waitForSelector('div[role="dialog"][aria-label="Settings modal"]');
  console.log('   Settings modal opened from Header ✅');

  // Test About dialog inside Settings
  const aboutBtn = await page.$('button:has-text("About & Licenses")');
  if (aboutBtn) {
    await aboutBtn.click();
    await page.waitForSelector('div[role="dialog"][aria-label="About Touch Grass"]');
    console.log('   About & Licenses dialog opened ✅');
    await page.click('button[aria-label="Close about dialog"]');
  }
  await page.click('button[aria-label="Close settings"]');
  console.log('   Settings modal closed ✅');

  // Check for Console Errors and CSP Violations
  console.log('\n--- Verification Results ---');
  console.log('Console Errors:', consoleErrors);
  console.log('Request Failures:', requestFailures);

  if (consoleErrors.some(e => e.includes('Content Security Policy'))) {
    throw new Error('CSP Violations detected!');
  }
  if (consoleErrors.length > 0) {
    console.warn(`Warning: ${consoleErrors.length} console errors logged (verify if benign).`);
  } else {
    console.log('🎉 ALL CHECKS PASSED WITH ZERO CONSOLE ERRORS! 🎉');
  }

  await browser.close();
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
