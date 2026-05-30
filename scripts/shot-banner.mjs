import { chromium } from 'playwright';

const CHROME   = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const VIEWPORT = { width: 390, height: 844 };

async function loadBand(page, band) {
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.evaluate(async (b) => {
    localStorage.setItem('bandExplicitlyChosen', '1');
    const profile = {
      displayName: 'Explorer', selectedBand: b,
      masteryByObjective: {}, totalStars: 2, gardenFlowers: 2,
      settings: { audioEnabled: true, selectedLanguage: 'en', overrideSequence: false },
      createdAt: new Date().toISOString(),
    };
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open('science-sprouts-db', 1);
      r.onsuccess = () => res(r.result); r.onerror = rej;
      r.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains('learner-profile')) d.createObjectStore('learner-profile');
        if (!d.objectStoreNames.contains('settings')) d.createObjectStore('settings');
      };
    });
    await new Promise((res, rej) => {
      const tx = db.transaction('learner-profile', 'readwrite');
      const r  = tx.objectStore('learner-profile').put(profile, 'current');
      r.onsuccess = res; r.onerror = rej;
    });
  }, band);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('text=Your learning journey', { timeout: 8000 });
  await page.waitForTimeout(700);
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx     = await browser.newContext({ viewport: VIEWPORT });
const page    = await ctx.newPage();
page.on('console', () => {});

for (const band of ['A', 'B', 'C']) {
  await loadBand(page, band);
  await page.screenshot({ path: `screenshots/home-band-${band.toLowerCase()}-new.png` });
  console.log(`📸 home-band-${band.toLowerCase()}-new.png`);
}

await browser.close();
