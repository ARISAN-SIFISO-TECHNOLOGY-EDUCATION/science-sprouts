// Replaces the default Capacitor launcher icons with the Science Sprouts logo.
// Generates, per density:
//   ic_launcher.png            (legacy square, full-bleed on brand dark)
//   ic_launcher_round.png      (legacy round, circular)
//   ic_launcher_foreground.png (adaptive foreground, logo in central safe zone, transparent)
// Background colour is set via values/ic_launcher_background.xml (edited separately).
//
// Run: node scripts/gen-launcher-icons.mjs

import { chromium } from 'playwright';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const RES = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DARK = '#1f2a37';
const logo =
  'data:image/png;base64,' + readFileSync(path.join(ROOT, 'public', 'logo.png')).toString('base64');

// density -> [legacy square/round px, adaptive foreground px]
const DENS = {
  mdpi:    [48, 108],
  hdpi:    [72, 162],
  xhdpi:   [96, 216],
  xxhdpi:  [144, 324],
  xxxhdpi: [192, 432],
};

async function render(browser, w, h, html, file, omitBg = false) {
  const page = await (await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 1,
  })).newPage();
  await page.setContent(
    `<!doctype html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}
     html,body{width:${w}px;height:${h}px;overflow:hidden}</style></head><body>${html}</body></html>`,
    { waitUntil: 'networkidle' });
  await page.waitForTimeout(80);
  await page.screenshot({ path: file, omitBackground: omitBg });
  await page.close();
}

async function run() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  for (const [dens, [sq, fg]] of Object.entries(DENS)) {
    const dir = path.join(RES, `mipmap-${dens}`);
    // legacy square — full-bleed logo on dark
    await render(browser, sq, sq,
      `<div style="width:100%;height:100%;background:${DARK}">
         <img src="${logo}" style="width:100%;height:100%;object-fit:cover"></div>`,
      path.join(dir, 'ic_launcher.png'));
    // legacy round — circular crop, transparent corners
    await render(browser, sq, sq,
      `<div style="width:100%;height:100%;border-radius:50%;overflow:hidden;background:${DARK}">
         <img src="${logo}" style="width:100%;height:100%;object-fit:cover"></div>`,
      path.join(dir, 'ic_launcher_round.png'), true);
    // adaptive foreground — logo in central safe zone, transparent
    await render(browser, fg, fg,
      `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">
         <img src="${logo}" style="width:62%;height:62%;object-fit:contain"></div>`,
      path.join(dir, 'ic_launcher_foreground.png'), true);
    console.log('  ✓', `mipmap-${dens}`);
  }
  await browser.close();
  console.log('\nLauncher icons regenerated.');
}
run().catch(e => { console.error(e); process.exit(1); });
