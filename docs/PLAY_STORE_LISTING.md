# Google Play Store Listing — Science Sprouts

Copy-paste source for the Play Console listing. Character limits noted in brackets.

---

## App name [30 chars]

```
Science Sprouts
```

## Short description [80 chars]

```
Offline CAPS science for ages 3–12. 100+ hands-on lessons. No ads, no sign-up.
```

## Full description [4000 chars]

```
Science Sprouts turns curiosity into discovery. It is a gentle, hands-on science
adventure for children aged 3 to 12 — built around the South African CAPS Natural
Sciences curriculum, but loved by curious kids anywhere.

Your child predicts, investigates, and writes their own conclusions — just like a
real scientist — then earns a badge and gets a simple real-world mission to try
with a grown-up. No reading walls, no timers racing the clock, no pressure. Just
"what do you think will happen?" and the joy of finding out.

🌱 GROWS WITH YOUR CHILD — 10 AGE LEVELS
Pick the level that fits your child, from Tiny Explorers (age 3) all the way to
Senior Scientists (age 12). Each age has its own dedicated set of lessons that
gets gently more challenging — never too easy, never overwhelming.

🔬 OVER 100 HANDS-ON SCIENCE TOPICS
Every topic is an interactive mini-investigation across the four science strands:
• Life & Living — the body, plants, animals, food chains, classification
• Matter & Materials — solids/liquids/gases, mixtures, acids & bases, atoms
• Energy & Change — light, sound, forces, circuits, heat, renewable energy
• Earth & Beyond — weather, seasons, rocks, the Sun, Moon, tides and galaxies

✏️ THINK LIKE A SCIENTIST
Children don't just tap the right answer. They make a prediction, run a hands-on
test or sort, then complete their own written conclusion — "I found that… because…"
This builds real scientific thinking, not memorisation.

👨‍👩‍👧 MADE FOR FAMILIES
Every activity ends with a caregiver card: a quick, screen-free mission to try
together at home with everyday objects. Science Sprouts is a starting point for
real-world exploration, not a replacement for it.

🔒 SAFE BY DESIGN
• 100% offline — works anywhere, no internet needed
• No ads, ever
• No accounts, no sign-up, no personal data collected
• No in-app purchases
Your child's progress is saved privately on your device and never leaves it.

📚 ALIGNED TO THE CAPS CURRICULUM
Topics follow the South African CAPS Natural Sciences progression from the
Foundation Phase through the Senior Phase, so school and play reinforce each other.

Start the adventure today — and watch your little scientist grow. 🌿
```

---

## Categorisation

| Field | Value |
|-------|-------|
| App or game | **App** |
| Category | **Education** |
| Tags | science, kids, education, learning, CAPS |
| Email | sifiso.cyprianshezi28@gmail.com |
| Website (optional) | (GitHub Pages or leave blank) |
| Privacy Policy URL | **(host PRIVACY_POLICY.md — see launch checklist)** |

---

## Target audience & content

- **Target age groups:** 3–5, 6–8, 9–12 (this makes it a *child-directed* app →
  the **Designed for Families** programme + Families policy apply).
- **Appeals to children:** Yes.
- Because it targets children, you must complete the **Content rating**
  questionnaire and the **Target audience and content** declaration honestly.

## Content rating (IARC questionnaire answers)

Answer everything **No / None** — there is no violence, no scary content, no
language, no user interaction, no data sharing, no ads, no purchases, no location.
Expected result: **Everyone / PEGI 3 / rated for all ages.**

## Data safety form

| Question | Answer |
|----------|--------|
| Does your app collect or share any required user data? | **No** |
| Does your app collect any data at all? | **No** |
| Is all user data encrypted in transit? | N/A (no data leaves the device) |
| Do you provide a way to request data deletion? | N/A (uninstalling deletes the on-device data) |
| Privacy policy URL | (required — paste the hosted URL) |

> Verified in code: the app makes **zero network requests** and contains no
> analytics/ads SDKs. The only on-device storage is progress data in IndexedDB,
> which never leaves the device — declare "No data collected."

---

## Graphic assets required by Play Console

| Asset | Spec | Status |
|-------|------|--------|
| App icon | 512×512 PNG, 32-bit | Derive from `ic_launcher` (confirm 512px master) |
| Feature graphic | 1024×500 PNG/JPG | **TODO** — `scripts/shot-banner.mjs` may help |
| Phone screenshots | 2–8, min 320px, 16:9 or 9:16 | **Ready** in `screenshots/marketing/` (786×1396, 9:16) |
| Tablet screenshots | optional | optional |

**Upload-ready phone screenshots** — `screenshots/marketing/` (regenerate any time
with `npm run dev` then `node scripts/marketing-screenshots.mjs`):

1. `1-choose-age.png` — "Who is learning today?" age picker
2. `2-home-age6.png` — Home (Age 6) with the new bottom navigation
3. `3-home-age12.png` — Home (Age 12, Senior Scientists) showing breadth
4. `4-activity-predict.png` — a "Predict" investigation screen
5. `5-progress-badges.png` — Progress page: badges, garden, counts
6. `6-about-safe.png` — About: "100% offline · no ads · no data collected"

> These are current (Age 12 + the new Home/Ages/Progress/About navigation).
> The older loose files in `screenshots/` are superseded.
