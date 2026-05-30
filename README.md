# 🌿 Science Sprouts

**A South African science education app for ages 3 – 17+, extending to NQF Level 5 (18+).**

Built on the CAPS curriculum (NCF Birth-to-Four · Natural Sciences & Technology · Physical Sciences) with an Ubuntu-rooted, indigenous-knowledge lens. Multilingual: English + isiZulu audio.

---

## Age Bands

| Band | Ages | SA Phase | Mode |
|------|------|----------|------|
| **A — Little Explorers** | 3–5 | Pre-school / NCF Birth-to-Four | Caregiver-led, ~30 s activities, no reading required |
| **B — Science Adventurers** | 6–9 | Foundation Phase (Gr R–3) | Guided/semi-independent, story + play + experiment |
| **C — Junior Scientists** | 10–12 | Intermediate Phase (Gr 4–6) | Independent inquiry, predict → test → record |
| **D — Senior Scientists** | 13–17 | Senior Phase + FET (Gr 7–12) | *(Coming soon)* Hypothesis, data analysis, CAPS alignment |
| **E — NQF Level 5** | 18+ | Higher Certificate / TVET | *(Coming soon)* Extended inquiry, workplace science contexts |

---

## Curriculum Alignment

- **Bands A–B:** NCF Birth-to-Four (DBE, 2015) · CAPS Life Skills → Beginning Knowledge (Gr R–3)
- **Bands B–C:** CAPS Natural Sciences & Technology — Intermediate Phase (Gr 4–6)
- **Band D:** CAPS Natural Sciences (Gr 7–9) · Physical Sciences (Gr 10–12)
- **Band E:** NQF Level 5 Natural Sciences contexts

### The four CAPS strands (content spine)

1. 🌿 **Life & Living** — living things, ecosystems, the body, life cycles
2. 🧪 **Matter & Materials** — properties, states, mixtures, materials
3. ⚡ **Energy & Change** — light, sound, heat, electricity, forces
4. 🌍 **Earth & Beyond** — soil, water, weather, the solar system

---

## Pedagogy

Activities follow the **5E instructional model** — phenomenon first, explanation after:

> **Engage → Explore → Explain → Elaborate → Evaluate**

The same phenomenon is rendered differently per band (e.g. *Floating & Sinking*):
- **Band A:** sensory tray with a caregiver prompt card + 3-min timer
- **Band B:** drag-and-drop water tank game + animated diagram (upthrust, density)
- **Band C:** variable-change investigation — predict clay shape outcomes, record results, conclude using density/displacement

---

## Key Features (Phase 0 — current)

- ✅ **Three live bands** (A, B, C) — all rendering *Floating & Sinking*
- ✅ **Offline-first** — IndexedDB, no account required
- ✅ **Voice narration** — Web Speech API (English); pre-recorded isiZulu audio slots ready
- ✅ **Garden reward** — flowers grow as activities are completed (stars, not scores)
- ✅ **Parent/teacher dashboard** — band selector, sequence override, progress reset
- ✅ **CAPS references** — shown on every topic card
- ✅ **PWA-ready** — installable on Android/iOS via browser

---

## Tech Stack

| Layer | Tech |
|-------|------|
| UI | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer Motion) |
| Offline storage | IndexedDB via `idb` |
| Icons | Lucide React |
| Future backend | Python + FastAPI + PostgreSQL |
| Future deploy | Cloudflare Pages + Capacitor (APK) |

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3001
npm run build     # production build
npm run lint      # TypeScript type-check
```

---

## Project Structure

```
src/
├── types.ts              # Band, Strand, 5E, LearnerProfile types (§10 data model)
├── curriculum.ts         # Curriculum graph: objectives + activity CASEs
├── lib/
│   ├── db.ts             # IndexedDB — offline-first progress persistence
│   └── utils.ts          # cn(), shuffle(), speak(), playNarration() (audio fallback chain)
├── components/
│   ├── BandSelector.tsx  # First-launch age selector (shows full 3–17+ scope)
│   ├── ActivityWrapper.tsx # Shared activity chrome: header, voice bubble, success overlay
│   ├── Garden.tsx        # Flower garden reward
│   └── Dashboard.tsx     # Parent/teacher settings panel
├── activities/
│   ├── FloatSinkBandA.tsx   # Band A: caregiver hook + "go try it" physical card
│   ├── FloatSinkExplore.tsx # Band B: drag-drop float/sink game
│   ├── FloatSinkExplain.tsx # Band B: 3-slide narrated diagram
│   ├── FloatSinkEvaluate.tsx# Band B: predict-then-test quiz
│   └── FloatSinkBandC.tsx   # Band C: variable-change inquiry investigation
└── App.tsx               # Main shell — band routing, home screen, garden
```

---

## Audio Strategy

isiZulu audio is **never** routed through the Web Speech API (which lacks `zu-ZA` voices on target low-end Androids and would mispronounce the text). The fallback chain:

1. Pre-recorded file — requested language (`zu`)
2. Pre-recorded file — English (`en`)
3. Web Speech API — English text only
4. Silent — captions always visible on screen

---

## Roadmap

- [ ] **Phase 1** — Band A + C renderers for remaining Matter & Materials topics
- [ ] **Phase 2** — Curriculum graph + offline downloadable content packs
- [ ] **Phase 3** — Band D (Gr 7–12) + CAPS Senior/FET alignment
- [ ] **Phase 4** — NQF Level 5 content + workplace science contexts
- [ ] **Phase 5** — isiZulu pre-recorded audio production
- [ ] **Phase 6** — Backend (FastAPI + PostgreSQL) + POPIA-compliant accounts
- [ ] **Phase 7** — Capacitor APK → Google Play Store

---

## Indigenous Knowledge & Local Context

CAPS explicitly requires engagement with African and indigenous knowledge systems. Science Sprouts makes this a first-class feature — local phenomena, local species, South African contexts — not a footnote.

*"An orange floats. Peel it and it sinks."* — not a generic lab demo, but a kitchen table in a South African home.

---

## References

- [NCF Birth-to-Four (DBE, 2015)](https://www.unicef.org/southafrica/reports/south-african-national-curriculum-framework-children-birth-four)
- [CAPS NS&T Intermediate Phase](https://wcedeportal.co.za/eresource/112756)
- [CAPS Natural Sciences Gr 7–9](https://wcedeportal.co.za/eresource/112876)

---

*Built with ❤️ by ARISAN SIFISO TECHNOLOGY EDUCATION*
