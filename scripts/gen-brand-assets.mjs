// Generates all brand assets from public/logo.png:
//   assets/icon-only.png        1024×1024  full-bleed logo (legacy launcher)
//   assets/icon-foreground.png  1024×1024  padded logo, transparent (adaptive fg)
//   assets/icon-background.png  1024×1024  solid brand dark (adaptive bg)
//   assets/splash.png           2732×2732  logo centred on dark
//   assets/splash-dark.png      2732×2732  same
//   play-assets/icon-512.png    512×512    Play Store listing icon (full-bleed)
//   play-assets/feature-graphic-1024x500.png  Play Store feature graphic
//
// Run: node scripts/gen-brand-assets.mjs   (Playwright must be installed)

import { chromium } from 'playwright';
import path from 'path';
import { mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const PLAY = path.join(ROOT, 'play-assets');
mkdirSync(ASSETS, { recursive: true });
mkdirSync(PLAY, { recursive: true });

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DARK = '#1f2a37';           // brand dark slate (matches logo background)
const logoDataUrl =
  'data:image/png;base64,' + readFileSync(path.join(ROOT, 'public', 'logo.png')).toString('base64');

/** Render `html` at exactly w×h and save to file. omitBg = transparent capture. */
async function render(browser, w, h, html, file, omitBg = false) {
  const page = await (await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 1,
  })).newPage();
  await page.setContent(
    `<!doctype html><html><head><style>
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:${w}px;height:${h}px;overflow:hidden}
    </style></head><body>${html}</body></html>`,
    { waitUntil: 'networkidle' });
  await page.waitForTimeout(120);
  await page.screenshot({ path: file, omitBackground: omitBg });
  await page.close();
  console.log('  ✓', path.relative(ROOT, file));
}

const coverLogo = `<img src="${logoDataUrl}" style="width:100%;height:100%;object-fit:cover">`;
const containLogo = (pct) =>
  `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">
     <img src="${logoDataUrl}" style="width:${pct}%;height:${pct}%;object-fit:contain"></div>`;

async function run() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });

  // ---- Launcher icon sources (@capacitor/assets reads these) ----
  await render(browser, 1024, 1024, `<div style="width:100%;height:100%;background:${DARK}">${coverLogo}</div>`, path.join(ASSETS, 'icon-only.png'));
  await render(browser, 1024, 1024, containLogo(74), path.join(ASSETS, 'icon-foreground.png'), true);
  await render(browser, 1024, 1024, `<div style="width:100%;height:100%;background:${DARK}"></div>`, path.join(ASSETS, 'icon-background.png'));

  // ---- Splash sources ----
  const splash = `<div style="width:100%;height:100%;background:${DARK};display:flex;align-items:center;justify-content:center">
      <img src="${logoDataUrl}" style="width:42%;object-fit:contain"></div>`;
  await render(browser, 2732, 2732, splash, path.join(ASSETS, 'splash.png'));
  await render(browser, 2732, 2732, splash, path.join(ASSETS, 'splash-dark.png'));

  // ---- Play Store listing icon (512×512, full-bleed) ----
  await render(browser, 512, 512, `<div style="width:100%;height:100%;background:${DARK}">${coverLogo}</div>`, path.join(PLAY, 'icon-512.png'));

  // ---- Feature graphic (1024×500) ----
  const feature = `
    <div style="width:1024px;height:500px;position:relative;overflow:hidden;
        background:radial-gradient(120% 140% at 80% 20%, #1f3a5f 0%, #18283f 55%, #0f1b2e 100%);
        font-family:'Segoe UI',system-ui,sans-serif;color:#fff;display:flex;align-items:center">
      <div style="position:absolute;inset:0;background:
          radial-gradient(2px 2px at 18% 30%, rgba(255,255,255,.7), transparent),
          radial-gradient(2px 2px at 30% 70%, rgba(255,255,255,.5), transparent),
          radial-gradient(1.5px 1.5px at 60% 22%, rgba(255,255,255,.6), transparent),
          radial-gradient(2px 2px at 88% 65%, rgba(255,255,255,.5), transparent)"></div>
      <div style="flex:1;padding:0 56px;z-index:2">
        <div style="font-size:62px;font-weight:800;line-height:1.05;
            text-shadow:0 2px 10px rgba(0,0,0,.4)">Science<br>Sprouts</div>
        <div style="font-size:26px;font-weight:600;color:#9be29b;margin-top:14px">
          Offline CAPS science · Ages 3–12</div>
        <div style="font-size:18px;color:#c9d6e5;margin-top:10px">
          100+ hands-on lessons · No ads · No sign-up</div>
      </div>
      <div style="width:430px;height:500px;display:flex;align-items:center;justify-content:center;z-index:2">
        <img src="${logoDataUrl}" style="width:380px;height:380px;object-fit:contain;
            filter:drop-shadow(0 12px 30px rgba(0,0,0,.5))">
      </div>
    </div>`;
  await render(browser, 1024, 500, feature, path.join(PLAY, 'feature-graphic-1024x500.png'));

  await browser.close();
  console.log('\nDone. Sources in assets/, Play assets in play-assets/');
}
run().catch(e => { console.error(e); process.exit(1); });
