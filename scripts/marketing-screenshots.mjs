// Marketing screenshots for the Play Store listing — shows the new persistent
// navigation, Progress (badges) and About pages, across several age bands.
// Output: screenshots/marketing/*.png   (run the dev server first: npm run dev)

import { chromium } from 'playwright';
import path from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'screenshots', 'marketing');
mkdirSync(OUT, { recursive: true });

const APP_URL = 'http://localhost:3001';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const VIEWPORT = { width: 393, height: 698 }; // ~9:16 phone; ×2 DSR → 786×1396 PNG

const errors = [];

function badge(objectiveId, badgeName, actId) {
  return [objectiveId, {
    objectiveId, state: 'mastered', stars: 1, badges: [badgeName],
    completedActivityIds: [actId], updatedAt: new Date().toISOString(),
  }];
}

async function seed(page, band, mastery = {}, stars = 0, flowers = 0) {
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.evaluate(async ({ band, mastery, stars, flowers }) => {
    localStorage.setItem('bandExplicitlyChosen', '1');
    const profile = {
      displayName: 'Explorer', selectedBand: band,
      masteryByObjective: mastery, totalStars: stars, gardenFlowers: flowers,
      settings: { audioEnabled: true, selectedLanguage: 'en', overrideSequence: true },
      createdAt: new Date().toISOString(),
    };
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open('science-sprouts-db', 1);
      r.onsuccess = () => res(r.result); r.onerror = rej;
      r.onupgradeneeded = ev => {
        const d = ev.target.result;
        if (!d.objectStoreNames.contains('learner-profile')) d.createObjectStore('learner-profile');
        if (!d.objectStoreNames.contains('settings')) d.createObjectStore('settings');
      };
    });
    await new Promise((res, rej) => {
      const tx = db.transaction('learner-profile', 'readwrite');
      const rq = tx.objectStore('learner-profile').put(profile, 'current');
      rq.onsuccess = res; rq.onerror = rej;
    });
  }, { band, mastery, stars, flowers });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
}

async function shot(page, name) {
  await page.waitForTimeout(550);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`  📸 ${name}.png`);
}

async function run() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await (await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })).newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  // 1. Band selector (fresh)
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => { localStorage.clear(); const r = indexedDB.deleteDatabase('science-sprouts-db'); return new Promise(res => { r.onsuccess = r.onerror = r.onblocked = res; }); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('text=Who is learning today', { timeout: 8000 });
  await shot(page, '1-choose-age');

  // 2. Home — Foundation Scientists (Age 6), rich topic list + new bottom nav
  await seed(page, 'B6', {}, 4, 4);
  await page.waitForSelector('nav[aria-label="Main navigation"]');
  await shot(page, '2-home-age6');

  // 3. Home — Senior Scientists (Age 12), shows breadth + nav
  await seed(page, 'C12', {}, 8, 6);
  await page.waitForSelector('nav[aria-label="Main navigation"]');
  await shot(page, '3-home-age12');

  // 4. Activity — a "Predict" investigation screen (Biosphere, C12)
  await page.locator('button').filter({ hasText: 'The Biosphere' }).first().click();
  await page.waitForSelector('text=Your learning journey', { timeout: 5000 });
  await page.locator('button:has-text("GO")').first().click();
  await page.waitForTimeout(1400); // lazy chunk + predict screen
  await shot(page, '4-activity-predict');

  // 5. Progress — badges earned, garden, counts
  await seed(page, 'C12', Object.fromEntries([
    badge('ll.biosphere', 'Biosphere Explorer Badge 🌍', 'll.bio.c12.do'),
    badge('ec.heat_transfer', 'Heat Mover Badge 🔥', 'ec.heat.c12.do'),
    badge('mm.acids_bases', 'Acid–Base Tester Badge 🧪', 'mm.acid.c12.do'),
    badge('eb.galaxies', 'Cosmic Explorer Badge 🌌', 'eb.gal.c12.do'),
    badge('ec.energy_types', 'Energy Detective Badge ⚡', 'ec.etypes.c12.do'),
    badge('ll.classification', 'Classifier Badge 🔬', 'll.class.c12.do'),
  ]), 12, 8);
  await page.locator('nav button', { hasText: 'Progress' }).click();
  await page.waitForSelector('text=Badges earned', { timeout: 5000 });
  await shot(page, '5-progress-badges');

  // 6. About — "safe & private" trust panel
  await page.locator('nav button', { hasText: 'About' }).click();
  await page.waitForSelector('text=Safe & private', { timeout: 5000 });
  await shot(page, '6-about-safe');

  await browser.close();
  console.log(`\n${errors.length ? '❌ ' + errors.join('\n') : '✅ no console errors'}`);
  console.log(`📁 ${OUT}`);
}
run().catch(e => { console.error(e); process.exit(1); });
