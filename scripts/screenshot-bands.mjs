// Screenshot all three age bands in Science Sprouts
// Writes band directly to IndexedDB so each run starts clean on the right band.

import { chromium } from 'playwright';
import path from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'screenshots');
mkdirSync(OUT, { recursive: true });

const APP_URL  = 'http://localhost:3001';
const CHROME   = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro

async function shot(page, name, label) {
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`  📸 ${name}.png  ← ${label}`);
}

/**
 * Navigate to APP_URL and pre-seed the IndexedDB profile for the given band.
 * This skips the band selector entirely — we're testing home + activity screens,
 * not the selector (which is already captured separately).
 */
async function loadBand(page, band) {
  // First visit to let the app register the IDB schema
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Write profile + localStorage flag directly so app skips onboarding
  await page.evaluate(async (b) => {
    localStorage.setItem('bandExplicitlyChosen', '1');

    const profile = {
      displayName: 'Explorer',
      selectedBand: b,
      masteryByObjective: {},
      totalStars: 3,
      gardenFlowers: 3, // show a few flowers for a nicer garden
      settings: { audioEnabled: true, selectedLanguage: 'en', overrideSequence: true },
      createdAt: new Date().toISOString(),
    };

    // Open (or reuse) the IDB database
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open('science-sprouts-db', 1);
      req.onsuccess = () => resolve(req.result);
      req.onerror   = reject;
      req.onupgradeneeded = ev => {
        const d = ev.target.result;
        if (!d.objectStoreNames.contains('learner-profile'))
          d.createObjectStore('learner-profile');
        if (!d.objectStoreNames.contains('settings'))
          d.createObjectStore('settings');
      };
    });

    await new Promise((resolve, reject) => {
      const tx  = db.transaction('learner-profile', 'readwrite');
      const req = tx.objectStore('learner-profile').put(profile, 'current');
      req.onsuccess = resolve;
      req.onerror   = reject;
    });
  }, band);

  // Reload so React picks up the IDB values
  await page.reload({ waitUntil: 'networkidle' });
  // Wait for the home screen landmark
  await page.waitForSelector('text=Your learning journey', { timeout: 10000 });
  await page.waitForTimeout(600);
}

async function run() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const ctx     = await browser.newContext({ viewport: VIEWPORT });
  const page    = await ctx.newPage();
  page.on('console', () => {});

  // ── 0. Band selector — first-launch ─────────────────────────────────────────
  console.log('\n── Band Selector ─────────────────────────────────────────');
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.clear();
    const r = indexedDB.deleteDatabase('science-sprouts-db');
    return new Promise(res => { r.onsuccess = r.onerror = r.onblocked = res; });
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('text=Who is learning today', { timeout: 8000 });
  await shot(page, '0-band-selector', 'first-launch: all three bands visible');

  // ══════════════════════════════════════════════════════════════════════════════
  // BAND A — Little Explorers (Ages 3–5)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n── Band A · Little Explorers (Ages 3–5) ─────────────────');
  await loadBand(page, 'A');
  await shot(page, '1-band-a-home', 'home: single "Try with water!" card, sky-blue accent');

  await page.locator('button').filter({ hasText: /Try with water/i }).first().click();
  await page.waitForTimeout(600);
  await shot(page, '2-band-a-hook', 'activity: caregiver reads the hook aloud');

  await page.locator('button').filter({ hasText: /Now go try it/i }).click();
  await page.waitForTimeout(500);
  await shot(page, '3-band-a-go-card', 'activity: 3-min timer + "go try with water" card');

  // ══════════════════════════════════════════════════════════════════════════════
  // BAND B — Science Adventurers (Ages 6–9)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n── Band B · Science Adventurers (Ages 6–9) ──────────────');
  await loadBand(page, 'B');
  await shot(page, '4-band-b-home', 'home: three-step 5E journey, green accent');

  // Open Explore — match by unique sub-description, not the word "Explore" alone
  // (the band banner also contains "Explore, experiment & discover")
  await page.locator('button').filter({ hasText: 'Drop objects into water' }).click();
  await page.waitForTimeout(800);
  await shot(page, '5-band-b-explore', 'Explore: objects to drop, water tank, voice prompt');

  // Return to home — reload Band B fresh (cleanest, avoids back-button timing issues)
  await loadBand(page, 'B');

  // Open Explain — match by unique sub-description
  await page.locator('button').filter({ hasText: 'Find out WHY things float' }).click();
  await page.waitForTimeout(800);
  await shot(page, '6-band-b-explain', 'Explain: slide 1 — upthrust/why things float');

  // Advance to slide 2
  await page.locator('button').filter({ hasText: /Next/i }).first().click();
  await page.waitForTimeout(600);
  await shot(page, '7-band-b-explain-slide2', 'Explain: slide 2 — density/sinking');

  // Advance to slide 3 (orange trick)
  await page.locator('button').filter({ hasText: /Next/i }).first().click();
  await page.waitForTimeout(600);
  await shot(page, '8-band-b-explain-slide3', 'Explain: slide 3 — the orange trick');

  // ══════════════════════════════════════════════════════════════════════════════
  // BAND C — Junior Scientists (Ages 10–12)
  // ══════════════════════════════════════════════════════════════════════════════
  console.log('\n── Band C · Junior Scientists (Ages 10–12) ──────────────');
  await loadBand(page, 'C');
  await shot(page, '9-band-c-home', 'home: single investigation card, indigo accent');

  // Match by unique sub-description to avoid matching the band banner text
  await page.locator('button').filter({ hasText: 'Predict & test' }).click();
  await page.waitForTimeout(600);
  await shot(page, '10-band-c-anchor', 'Investigate: anchor question (orange trick)');

  // Scroll the button into view and click with force (it may be near bottom of flex layout)
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent?.includes('predictions'));
    btn?.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(300);
  await page.locator('button').filter({ hasText: /predictions/i }).click({ force: true });
  await page.waitForTimeout(600);
  await shot(page, '11-band-c-predict', 'Predict: record prediction before testing');

  await browser.close();
  console.log(`\n✅ ${OUT} — 13 screenshots captured\n`);
}

run().catch(e => { console.error(e); process.exit(1); });
