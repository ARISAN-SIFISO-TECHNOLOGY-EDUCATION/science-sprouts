// ──────────────────────────────────────────────────────────────────────────────
// Science Sprouts — curriculum data
// Base Camp: 2 topics across 2 CAPS strands (Band B)
// This file is the single source of truth for all learning objectives and
// activities. It is the science analogue of constants.ts in Numeracy Sprouts.
// ──────────────────────────────────────────────────────────────────────────────

import { LearningObjective, LearningActivity } from './types';

// ── Objectives (curriculum graph nodes) ──────────────────────────────────────

export const OBJECTIVES: LearningObjective[] = [
  // Prerequisites (stubs — not yet playable, just graph nodes)
  {
    id: 'mm.solids_liquids',
    strand: 'matter_and_materials',
    topic: 'Solids & Liquids',
    title: 'Solids and liquids are different',
    capsRef: 'CAPS NS&T Gr 4: Matter & Materials',
    band: 'B',
    prerequisites: [],
    anchoringPhenomenon: 'What happens when you pour water into a container?',
    languages: ['en', 'zu'],
  },

  // Phase 0 target objective
  {
    id: 'mm.float_sink',
    strand: 'matter_and_materials',
    topic: 'Floating & Sinking',
    title: 'Why do some things float?',
    capsRef: 'CAPS NS&T Gr 5: Matter & Materials',
    band: 'B',
    prerequisites: ['mm.solids_liquids'],
    anchoringPhenomenon:
      'An orange floats — but peel it, and it sinks. Why?',
    languages: ['en', 'zu'],
  },

  {
    id: 'mm.solids_liquids_gases',
    strand: 'matter_and_materials',
    topic: 'Solids, Liquids & Gases',
    title: 'Why does water change state?',
    capsRef: 'CAPS NS&T Gr 2-3: Matter & Materials',
    band: 'B',
    prerequisites: ['mm.float_sink'],
    anchoringPhenomenon:
      'Water can be ice, a river, or steam — all depending on temperature. Why?',
    languages: ['en', 'zu'],
  },

  // ── Age 5 (A5) — MVP topics ──────────────────────────────────────────────

  {
    id: 'll.five_senses',
    strand: 'life_and_living',
    topic: '5 Senses',
    title: 'I use my senses to learn about the world',
    capsRef: 'CAPS Gr R: Life & Living',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'Close your eyes — can you still hear, smell, and touch?',
    languages: ['en', 'zu'],
  },

  {
    id: 'mm.wet_dry',
    strand: 'matter_and_materials',
    topic: 'Wet vs Dry',
    title: 'Water changes how things feel',
    capsRef: 'CAPS Gr R: Matter & Materials',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'What happens to dry paper when it touches water?',
    languages: ['en', 'zu'],
  },

  {
    id: 'eb.day_night',
    strand: 'earth_and_beyond',
    topic: 'Day & Night',
    title: 'The sky changes from day to night',
    capsRef: 'CAPS Gr R: Earth & Beyond',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'Where does the sun go when it gets dark?',
    languages: ['en', 'zu'],
  },

  // ── Age 5 (A5) — Pack v1 (remaining 7 topics) ────────────────────────────

  {
    id: 'll.plant_needs',
    strand: 'life_and_living',
    topic: 'Plant Needs',
    title: 'Plants need sun and water to grow',
    capsRef: 'CAPS Gr R: Life & Living',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'Why does one plant grow big and another stay small?',
    languages: ['en', 'zu'],
  },
  {
    id: 'll.animal_groups',
    strand: 'life_and_living',
    topic: 'Animal Groups',
    title: 'Animals move in different ways',
    capsRef: 'CAPS Gr R: Life & Living',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'Why do birds fly but fish swim?',
    languages: ['en', 'zu'],
  },
  {
    id: 'mm.hot_cold',
    strand: 'matter_and_materials',
    topic: 'Hot vs Cold',
    title: 'We can feel hot and cold',
    capsRef: 'CAPS Gr R: Matter & Materials',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'Why does ice feel cold but tea feels hot?',
    languages: ['en', 'zu'],
  },
  {
    id: 'mm.building_things',
    strand: 'matter_and_materials',
    topic: 'Building Things',
    title: 'Different materials do different jobs',
    capsRef: 'CAPS Gr R: Matter & Materials',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'Why does a paper roof leak but a plastic one keeps you dry?',
    languages: ['en', 'zu'],
  },
  {
    id: 'ec.light_sources',
    strand: 'energy_and_change',
    topic: 'Light Sources',
    title: 'The sun, lamps and candles give light',
    capsRef: 'CAPS Gr R: Energy & Change',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'What gives us light when the sun goes down?',
    languages: ['en', 'zu'],
  },
  {
    id: 'ec.push_pull',
    strand: 'energy_and_change',
    topic: 'Push & Pull',
    title: 'We move things by pushing and pulling',
    capsRef: 'CAPS Gr R: Energy & Change',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'How do we bring a wagon closer or send a box away?',
    languages: ['en', 'zu'],
  },
  {
    id: 'eb.water_everywhere',
    strand: 'earth_and_beyond',
    topic: 'Water Everywhere',
    title: 'Water comes from rain, rivers and taps',
    capsRef: 'CAPS Gr R: Earth & Beyond',
    band: 'A5',
    prerequisites: [],
    anchoringPhenomenon: 'Where does the water from your tap come from?',
    languages: ['en', 'zu'],
  },

  // ── Age 6 (B6) — Foundation Phase Gr 1 MVP ───────────────────────────────

  {
    id: 'mm.float_sink_record',
    strand: 'matter_and_materials',
    topic: 'Floating & Sinking',
    title: 'Predict, test and record what floats',
    capsRef: 'CAPS Gr 1: Matter & Materials',
    band: 'B6',
    prerequisites: [],
    anchoringPhenomenon: 'Will a big heavy rock float — or sink?',
    languages: ['en', 'zu'],
  },
  {
    id: 'll.plant_parts_record',
    strand: 'life_and_living',
    topic: 'Plant Parts',
    title: 'Each plant part has a job',
    capsRef: 'CAPS Gr 1: Life & Living',
    band: 'B6',
    prerequisites: [],
    anchoringPhenomenon: 'What job does each part of a plant do?',
    languages: ['en', 'zu'],
  },
  {
    id: 'ec.shadows_record',
    strand: 'energy_and_change',
    topic: 'Shadows',
    title: 'Light makes shadows change size',
    capsRef: 'CAPS Gr 1: Energy & Change',
    band: 'B6',
    prerequisites: [],
    anchoringPhenomenon: 'What makes a shadow bigger or smaller?',
    languages: ['en', 'zu'],
  },

  // ── Age 6 (B6) — Pack v1 (remaining 9 topics) ────────────────────────────

  { id: 'll.body_parts',       strand: 'life_and_living',      topic: 'Body Parts',       title: 'Each body part has a job',                capsRef: 'CAPS Gr 1: Life & Living',      band: 'B6', prerequisites: [], anchoringPhenomenon: 'What do your eyes, ears and legs help you do?', languages: ['en', 'zu'] },
  { id: 'll.animal_needs_b6',  strand: 'life_and_living',      topic: 'Animal Needs',     title: 'Animals need food, water and shelter',    capsRef: 'CAPS Gr 1: Life & Living',      band: 'B6', prerequisites: [], anchoringPhenomenon: 'What does a pet need to stay alive and happy?', languages: ['en', 'zu'] },
  { id: 'll.life_cycle',       strand: 'life_and_living',      topic: 'Life Cycle',       title: 'Living things grow and change',           capsRef: 'CAPS Gr 1: Life & Living',      band: 'B6', prerequisites: [], anchoringPhenomenon: 'How does an egg become a chicken?',             languages: ['en', 'zu'] },
  { id: 'mm.materials',        strand: 'matter_and_materials', topic: 'Materials Around Us', title: 'Things are made of wood, metal or plastic', capsRef: 'CAPS Gr 1: Matter & Materials', band: 'B6', prerequisites: [], anchoringPhenomenon: 'What is a chair, a spoon and a bottle made of?', languages: ['en', 'zu'] },
  { id: 'mm.strong_materials', strand: 'matter_and_materials', topic: 'Strong Materials', title: 'Strong materials hold weight',            capsRef: 'CAPS Gr 1: Matter & Materials', band: 'B6', prerequisites: [], anchoringPhenomenon: 'Which bridge will hold the heavy car?',          languages: ['en', 'zu'] },
  { id: 'ec.sources_of_light', strand: 'energy_and_change',    topic: 'Sources of Light', title: 'Some things make light, some do not',     capsRef: 'CAPS Gr 1: Energy & Change',    band: 'B6', prerequisites: [], anchoringPhenomenon: 'Does a rock give light? Does a lamp?',            languages: ['en', 'zu'] },
  { id: 'ec.movement',         strand: 'energy_and_change',    topic: 'Movement',         title: 'Heavy things need a bigger push',         capsRef: 'CAPS Gr 1: Energy & Change',    band: 'B6', prerequisites: [], anchoringPhenomenon: 'Is it easier to push a ball or a heavy box?',    languages: ['en', 'zu'] },
  { id: 'eb.weather_seasons',  strand: 'earth_and_beyond',     topic: 'Weather & Seasons',title: 'We can watch and record the weather',     capsRef: 'CAPS Gr 1: Earth & Beyond',     band: 'B6', prerequisites: [], anchoringPhenomenon: 'What is the weather each day this week?',         languages: ['en', 'zu'] },
  { id: 'eb.day_night_spin',   strand: 'earth_and_beyond',     topic: 'Day & Night',      title: 'The Earth spins to give day and night',   capsRef: 'CAPS Gr 1: Earth & Beyond',     band: 'B6', prerequisites: [], anchoringPhenomenon: 'Why does it get dark at night?',                  languages: ['en', 'zu'] },

  // ── Age 7 (B7) — Foundation Phase Gr 2 MVP ───────────────────────────────

  {
    id: 'mm.absorbent',
    strand: 'matter_and_materials',
    topic: 'Absorbent Materials',
    title: 'A fair test: which cloth holds the most water?',
    capsRef: 'CAPS Gr 2: Matter & Materials',
    band: 'B7',
    prerequisites: [],
    anchoringPhenomenon: 'Same size cloths, same water — which soaks up the most?',
    languages: ['en', 'zu'],
  },
  {
    id: 'ec.magnets',
    strand: 'energy_and_change',
    topic: 'Magnets Attract',
    title: 'Test what a magnet sticks to',
    capsRef: 'CAPS Gr 2: Energy & Change',
    band: 'B7',
    prerequisites: [],
    anchoringPhenomenon: 'Does a magnet stick to metal, wood, or plastic?',
    languages: ['en', 'zu'],
  },
  {
    id: 'll.growth',
    strand: 'life_and_living',
    topic: 'Growth',
    title: 'Measure how living things grow over time',
    capsRef: 'CAPS Gr 2: Life & Living',
    band: 'B7',
    prerequisites: [],
    anchoringPhenomenon: 'How much taller is the plant after one week?',
    languages: ['en', 'zu'],
  },

  // ── Age 7 (B7) — Pack v1 (remaining 9 topics) ────────────────────────────

  { id: 'll.animal_homes',  strand: 'life_and_living',      topic: 'Animal Homes',            title: 'Each animal lives in a special home',  capsRef: 'CAPS Gr 2: Life & Living',      band: 'B7', prerequisites: [], anchoringPhenomenon: 'Why does a fish live in water and a bird in a tree?', languages: ['en', 'zu'] },
  { id: 'll.food_sources',  strand: 'life_and_living',      topic: 'Food from Plants & Animals', title: 'Our food comes from plants and animals', capsRef: 'CAPS Gr 2: Life & Living',   band: 'B7', prerequisites: [], anchoringPhenomenon: 'Does your food come from a plant or an animal?', languages: ['en', 'zu'] },
  { id: 'll.senses_safety', strand: 'life_and_living',      topic: 'Senses & Safety',         title: 'Keep your senses safe',                capsRef: 'CAPS Gr 2: Life & Living',      band: 'B7', prerequisites: [], anchoringPhenomenon: 'How do we protect our eyes, ears and skin?',      languages: ['en', 'zu'] },
  { id: 'mm.states_change', strand: 'matter_and_materials', topic: 'Solids, Liquids & Gases', title: 'Heat changes water between states',    capsRef: 'CAPS Gr 2: Matter & Materials', band: 'B7', prerequisites: [], anchoringPhenomenon: 'What happens to ice when it gets hot?',           languages: ['en', 'zu'] },
  { id: 'mm.mixtures',      strand: 'matter_and_materials', topic: 'Mixtures',                title: 'Some mixtures can be separated again', capsRef: 'CAPS Gr 2: Matter & Materials', band: 'B7', prerequisites: [], anchoringPhenomenon: 'Can we get clean water back from sandy water?',   languages: ['en', 'zu'] },
  { id: 'ec.energy_sources',strand: 'energy_and_change',    topic: 'Energy from Food & Sun',  title: 'Living things get energy to grow & move', capsRef: 'CAPS Gr 2: Energy & Change', band: 'B7', prerequisites: [], anchoringPhenomenon: 'Where do plants and people get their energy?',     languages: ['en', 'zu'] },
  { id: 'ec.wind',          strand: 'energy_and_change',    topic: 'Wind Moves Things',       title: 'Wind is a force that moves things',    capsRef: 'CAPS Gr 2: Energy & Change',    band: 'B7', prerequisites: [], anchoringPhenomenon: 'Why does wind move paper but not a brick?',       languages: ['en', 'zu'] },
  { id: 'eb.water_sources', strand: 'earth_and_beyond',     topic: 'Water Sources',           title: 'Tap water travels from rain to our homes', capsRef: 'CAPS Gr 2: Earth & Beyond', band: 'B7', prerequisites: [], anchoringPhenomenon: 'Where does the water in your tap come from?',     languages: ['en', 'zu'] },
  { id: 'eb.soil',          strand: 'earth_and_beyond',     topic: 'Soil Types',              title: 'Different soils hold different amounts of water', capsRef: 'CAPS Gr 2: Earth & Beyond', band: 'B7', prerequisites: [], anchoringPhenomenon: 'Which soil holds the most water — sand, loam or clay?', languages: ['en', 'zu'] },

  // ── Age 8 (B8) — Intermediate Phase Gr 3: plan, measure, conclude ────────

  { id: 'mm.insulation',     strand: 'matter_and_materials', topic: 'Insulation — Keep Warm', title: 'Some materials trap heat better than others', capsRef: 'CAPS Gr 3: Matter & Materials', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Which cup keeps hot water warmest — paper, plastic or foil?', languages: ['en', 'zu'] },
  { id: 'll.food_chains_b8', strand: 'life_and_living',      topic: 'Food Chains & Energy',   title: 'Energy flows from the sun through every food chain', capsRef: 'CAPS Gr 3: Life & Living', band: 'B8', prerequisites: [], anchoringPhenomenon: 'What happens to a food chain if we remove the sun?', languages: ['en', 'zu'] },
  { id: 'ec.shadow_size',    strand: 'energy_and_change',    topic: 'Shadow Size',            title: 'Distance from the light changes shadow size', capsRef: 'CAPS Gr 3: Energy & Change', band: 'B8', prerequisites: [], anchoringPhenomenon: 'What happens to a shadow when the object moves closer to the light?', languages: ['en', 'zu'] },

  // Age 8 (B8) — remaining 9 topics (Intermediate Phase Gr 3 Pack v1)
  { id: 'll.life_cycle_b8',  strand: 'life_and_living',      topic: 'Life Cycles — Complete', title: 'A butterfly grows through four stages over many days', capsRef: 'CAPS Gr 3: Life & Living', band: 'B8', prerequisites: [], anchoringPhenomenon: 'How many days does it take an egg to become a butterfly?', languages: ['en', 'zu'] },
  { id: 'll.healthy_body',   strand: 'life_and_living',      topic: 'Healthy Bodies',         title: 'We can collect data about keeping our body healthy', capsRef: 'CAPS Gr 3: Life & Living', band: 'B8', prerequisites: [], anchoringPhenomenon: 'How much water should you drink to stay healthy?', languages: ['en', 'zu'] },
  { id: 'mm.evaporation',    strand: 'matter_and_materials', topic: 'States in Life — Evaporation', title: 'Water evaporates into the air as a gas', capsRef: 'CAPS Gr 3: Matter & Materials', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Why do wet clothes dry in the sun?', languages: ['en', 'zu'] },
  { id: 'mm.reversible',     strand: 'matter_and_materials', topic: 'Reversible & Irreversible', title: 'Some changes can be undone, and some cannot', capsRef: 'CAPS Gr 3: Matter & Materials', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Can every change be undone?', languages: ['en', 'zu'] },
  { id: 'ec.forces_b8',      strand: 'energy_and_change',    topic: 'Forces — Push & Pull',   title: 'Heavier objects need more force to move', capsRef: 'CAPS Gr 3: Energy & Change', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Does a heavier object need more force to lift?', languages: ['en', 'zu'] },
  { id: 'ec.sound',          strand: 'energy_and_change',    topic: 'Sound — Pitch',          title: 'Faster vibrations make a higher sound', capsRef: 'CAPS Gr 3: Energy & Change', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Does a tight rubber band make a high or low sound?', languages: ['en', 'zu'] },
  { id: 'eb.rocks',          strand: 'earth_and_beyond',     topic: 'Rocks & Soils',          title: 'Different rocks have different hardness', capsRef: 'CAPS Gr 3: Earth & Beyond', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Are all rocks equally hard?', languages: ['en', 'zu'] },
  { id: 'eb.weather_b8',     strand: 'earth_and_beyond',     topic: 'Weather Patterns',       title: 'Recorded weather data shows patterns we can predict', capsRef: 'CAPS Gr 3: Earth & Beyond', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Can we spot a pattern in the weather to predict tomorrow?', languages: ['en', 'zu'] },
  { id: 'eb.space_b8',       strand: 'earth_and_beyond',     topic: 'Planets, Sun & Moon',    title: 'The Earth spins, giving us day and night', capsRef: 'CAPS Gr 3: Earth & Beyond', band: 'B8', prerequisites: [], anchoringPhenomenon: 'Why do we have day and night?', languages: ['en', 'zu'] },

  // ── Age 9 (Band B) — CAPS Gr 4 "Science Adventurers": flagship sims ──────
  { id: 'll.photosynthesis', strand: 'life_and_living',      topic: 'Photosynthesis',         title: 'Plants make their own food using light', capsRef: 'CAPS Gr 4: Life & Living', band: 'B', prerequisites: [], anchoringPhenomenon: 'How do plants make their own food from sunlight?', languages: ['en', 'zu'] },
  { id: 'ec.circuits',       strand: 'energy_and_change',    topic: 'Electrical Circuits',    title: 'A bulb lights only in a complete circuit', capsRef: 'CAPS Gr 4: Energy & Change', band: 'B', prerequisites: [], anchoringPhenomenon: 'What do we need to make a bulb light up?', languages: ['en', 'zu'] },
  { id: 'mm.water_cycle',    strand: 'matter_and_materials', topic: 'The Water Cycle',        title: 'Water evaporates, condenses and falls as rain', capsRef: 'CAPS Gr 4: Matter & Materials', band: 'B', prerequisites: [], anchoringPhenomenon: 'Where does rain come from?', languages: ['en', 'zu'] },

  // ── Ages 3–4 (A3/A4) — Life & Living ────────────────────────────────────

  {
    id: 'll.my_body',
    strand: 'life_and_living',
    topic: 'My Body',
    title: 'I have body parts — and so does everyone else!',
    capsRef: 'NCF Knowledge & Understanding of the World / CAPS Foundation Phase',
    band: 'A3',
    prerequisites: [],
    anchoringPhenomenon: 'Can you touch your nose? Can you touch mummy\'s nose?',
    languages: ['en', 'zu'],
  },

  // ── Ages 3–4 (A3/A4) — Matter & Materials ────────────────────────────────

  {
    id: 'mm.hard_soft',
    strand: 'matter_and_materials',
    topic: 'Hard vs Soft',
    title: 'Some things are hard and some things are soft!',
    capsRef: 'NCF Knowledge & Understanding of the World / CAPS Foundation Phase',
    band: 'A3',
    prerequisites: [],
    anchoringPhenomenon: 'Is a spoon hard or soft? What about a pillow?',
    languages: ['en', 'zu'],
  },

  // ── Ages 3–4 (A3/A4) — Earth & Beyond ───────────────────────────────────

  {
    id: 'eb.weather',
    strand: 'earth_and_beyond',
    topic: 'Weather',
    title: 'The sky changes — sunny, cloudy, rainy!',
    capsRef: 'NCF Knowledge & Understanding of the World / CAPS Foundation Phase',
    band: 'A3',
    prerequisites: [],
    anchoringPhenomenon: 'Look outside — is it sunny or rainy today?',
    languages: ['en', 'zu'],
  },

  // ── Life & Living ─────────────────────────────────────────────────────────

  {
    id: 'll.parts_of_plant',
    strand: 'life_and_living',
    topic: 'Parts of a Plant',
    title: 'What does each part of a plant do?',
    capsRef: 'CAPS NS&T Gr 1-2: Life & Living',
    band: 'B',
    prerequisites: [],
    anchoringPhenomenon: 'A plant cut at the stem wilts — but why does the whole plant suffer?',
    languages: ['en', 'zu'],
  },

  {
    id: 'll.food_chains',
    strand: 'life_and_living',
    topic: 'Food Chains',
    title: 'Who eats who — and why does it matter?',
    capsRef: 'CAPS NS&T Gr 4-5: Life & Living',
    band: 'B',
    prerequisites: ['ll.parts_of_plant'],
    anchoringPhenomenon: 'If all the grass disappeared, would the foxes survive?',
    languages: ['en', 'zu'],
  },

  // ── Energy & Change ───────────────────────────────────────────────────────

  {
    id: 'ec.light_shadows',
    strand: 'energy_and_change',
    topic: 'Light & Shadows',
    title: 'Why do shadows change size and direction?',
    capsRef: 'CAPS NS&T Gr 3: Energy & Change',
    band: 'B',
    prerequisites: [],
    anchoringPhenomenon: 'Your shadow is long in the morning but almost gone at midday. Why?',
    languages: ['en', 'zu'],
  },

  {
    id: 'll.non_living',
    strand: 'life_and_living',
    topic: 'Living vs Non-Living',
    title: 'What makes something alive?',
    capsRef: 'CAPS NS&T Gr 4: Life & Living',
    band: 'B',
    prerequisites: [],
    anchoringPhenomenon: 'A fire grows and eats fuel — is it alive?',
    languages: ['en', 'zu'],
  },
];

// ── Activities (CASEs per band for each objective) ────────────────────────────

export const ACTIVITIES: LearningActivity[] = [
  // ── mm.float_sink  ·  Band B ────────────────────────────────────────────────

  {
    id: 'fs.b.explore',
    objectiveId: 'mm.float_sink',
    band: 'B',
    fiveEStage: 'explore',
    kind: 'game',
    generatorKey: 'floatSinkDrag',
    config: {
      objects: ['cork', 'stone', 'leaf', 'coin', 'plastic_bottle', 'apple'],
    },
    assets: {
      audioByLang: {
        en: [],  // audio files to be added in Phase 1 content production
        zu: [],
      },
    },
    estimatedSeconds: 120,
    hints: [
      'Drop it in the water — what happens?',
      'Does it stay on top or go to the bottom?',
    ],
  },

  {
    id: 'fs.b.explain',
    objectiveId: 'mm.float_sink',
    band: 'B',
    fiveEStage: 'explain',
    kind: 'story',
    generatorKey: 'narratedDiagram',
    config: {
      concept: 'air_and_density',
      diagram: 'boat_vs_ball',
    },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 90,
  },

  {
    id: 'fs.b.evaluate',
    objectiveId: 'mm.float_sink',
    band: 'B',
    fiveEStage: 'evaluate',
    kind: 'quiz',
    generatorKey: 'predictThenTest',
    config: {
      objects: ['sponge', 'marble', 'feather', 'metal_spoon'],
    },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 120,
    hints: [
      'Think about whether it has air trapped inside.',
      'Heavy-for-its-size things tend to sink.',
    ],
  },

  // ── Age 5 (A5) MVP activities — single 4-phase activity per topic ───────

  { id: 'll.5s.a5.engage',  objectiveId: 'll.five_senses', band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'fiveSenses', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Close your eyes. Can you hear 3 sounds?' },
  { id: 'mm.wd.a5.engage',  objectiveId: 'mm.wet_dry',     band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'wetDry',     config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Wash a face cloth. Where does it dry?' },
  { id: 'eb.dn.a5.engage',  objectiveId: 'eb.day_night',   band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'dayNight',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Tonight, find 3 stars in the sky!' },

  // ── Age 5 Pack v1 — remaining 7 topics (single 4-phase activity each) ───

  { id: 'll.pn.a5.engage',  objectiveId: 'll.plant_needs',      band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'plantNeeds',     config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Water one plant at home. Watch it for 3 days!' },
  { id: 'll.ag.a5.engage',  objectiveId: 'll.animal_groups',    band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'animalGroups',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Move like an animal — hop like a frog!' },
  { id: 'mm.hc.a5.engage',  objectiveId: 'mm.hot_cold',         band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'hotCold',        config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'With a grown-up, feel cool water vs a warm cup.' },
  { id: 'mm.bt.a5.engage',  objectiveId: 'mm.building_things',  band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'buildingThings', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Build a small roof. Test it with water drops!' },
  { id: 'ec.lts.a5.engage', objectiveId: 'ec.light_sources',    band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'lightSources',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'At night, which things give light?' },
  { id: 'ec.pp.a5.engage',  objectiveId: 'ec.push_pull',        band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'pushPull',       config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Push your toy car. Now pull it back!' },
  { id: 'eb.we.a5.engage',  objectiveId: 'eb.water_everywhere', band: 'A5', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'waterEverywhere',config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 240, caregiverPrompt: 'Find 3 places water comes from at home!' },

  // ── Age 6 (B6) MVP activities — single multi-phase activity per topic ───

  { id: 'mm.fsr.b6.do', objectiveId: 'mm.float_sink_record', band: 'B6', fiveEStage: 'explore', kind: 'game',  generatorKey: 'floatSinkRecord', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 360, caregiverPrompt: 'Bath science! Test 3 things — float or sink?' },
  { id: 'll.ppr.b6.do', objectiveId: 'll.plant_parts_record', band: 'B6', fiveEStage: 'explore', kind: 'game', generatorKey: 'plantPartsRecord', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Draw your plant. Label 2 parts!' },
  { id: 'ec.shr.b6.do', objectiveId: 'ec.shadows_record', band: 'B6', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'shadowsRecord', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Make a big shadow and a small shadow with a torch!' },

  // ── Age 6 Pack v1 — remaining 9 activities ──────────────────────────────

  { id: 'll.bp.b6.do',  objectiveId: 'll.body_parts',       band: 'B6', fiveEStage: 'explore', kind: 'game',       generatorKey: 'bodyParts',       config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Point to body parts. What does each do?' },
  { id: 'll.an.b6.do',  objectiveId: 'll.animal_needs_b6',  band: 'B6', fiveEStage: 'explore', kind: 'game',       generatorKey: 'animalNeeds',     config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Name a pet. What 3 things does it need?' },
  { id: 'll.lc.b6.do',  objectiveId: 'll.life_cycle',       band: 'B6', fiveEStage: 'explore', kind: 'game',       generatorKey: 'lifeCycle',       config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Find baby, child and grown-up pictures.' },
  { id: 'mm.mat.b6.do', objectiveId: 'mm.materials',        band: 'B6', fiveEStage: 'explore', kind: 'game',       generatorKey: 'materials',       config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Find 3 plastic things at home.' },
  { id: 'mm.sm.b6.do',  objectiveId: 'mm.strong_materials', band: 'B6', fiveEStage: 'explore', kind: 'game',       generatorKey: 'strongMaterials', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Build a bridge. Test it with a coin.' },
  { id: 'ec.sol.b6.do', objectiveId: 'ec.sources_of_light', band: 'B6', fiveEStage: 'explore', kind: 'game',       generatorKey: 'lightSort',       config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Find 2 light sources at night.' },
  { id: 'ec.mv.b6.do',  objectiveId: 'ec.movement',         band: 'B6', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'movement',        config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Push a light toy, then a heavy one.' },
  { id: 'eb.ws.b6.do',  objectiveId: 'eb.weather_seasons',  band: 'B6', fiveEStage: 'explore', kind: 'game',       generatorKey: 'weatherChart',    config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Watch the sky for 3 mornings. Draw it.' },
  { id: 'eb.dns.b6.do', objectiveId: 'eb.day_night_spin',   band: 'B6', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'earthSpin',       config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 300, caregiverPrompt: 'Spin near a lamp — day and night!' },

  // ── Age 7 (B7) MVP activities — predict → fair test → chart → explain ───

  { id: 'mm.abs.b7.do', objectiveId: 'mm.absorbent', band: 'B7', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'absorbent', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Fair test at home: which cloth dries faster?' },
  { id: 'ec.mag.b7.do', objectiveId: 'ec.magnets',   band: 'B7', fiveEStage: 'explore', kind: 'game',       generatorKey: 'magnets',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 480, caregiverPrompt: 'Test a fridge magnet on 5 things at home.' },
  { id: 'll.gro.b7.do', objectiveId: 'll.growth',    band: 'B7', fiveEStage: 'explore', kind: 'game',       generatorKey: 'growth',    config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 480, caregiverPrompt: 'Measure how tall you are. Check again next month!' },

  // ── Age 7 Pack v1 — remaining 9 activities ──────────────────────────────

  { id: 'll.ah.b7.do',  objectiveId: 'll.animal_homes',  band: 'B7', fiveEStage: 'explore', kind: 'game',       generatorKey: 'animalHomes',  config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'Find where ants or birds live near you.' },
  { id: 'll.fs.b7.do',  objectiveId: 'll.food_sources',  band: 'B7', fiveEStage: 'explore', kind: 'game',       generatorKey: 'foodSources',  config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'What did you eat? Plant or animal?' },
  { id: 'll.ss.b7.do',  objectiveId: 'll.senses_safety', band: 'B7', fiveEStage: 'explore', kind: 'quiz',       generatorKey: 'sensesSafety', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'When do you wear a hat or sunglasses?' },
  { id: 'mm.sc.b7.do',  objectiveId: 'mm.states_change', band: 'B7', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'statesChange', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'Watch an ice cube melt in a cup. Time it!' },
  { id: 'mm.mix.b7.do', objectiveId: 'mm.mixtures',      band: 'B7', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'mixtures',     config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'Mix soil + water. Let it settle. Pour the water off.' },
  { id: 'ec.en.b7.do',  objectiveId: 'ec.energy_sources',band: 'B7', fiveEStage: 'explore', kind: 'game',       generatorKey: 'energySources',config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'What food gave you energy to play today?' },
  { id: 'ec.wind.b7.do',objectiveId: 'ec.wind',          band: 'B7', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'wind',         config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'Make a paper windmill. Test it outside.' },
  { id: 'eb.wat.b7.do', objectiveId: 'eb.water_sources', band: 'B7', fiveEStage: 'explore', kind: 'game',       generatorKey: 'waterSources', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'Trace water from the tap back to its source.' },
  { id: 'eb.soil.b7.do',objectiveId: 'eb.soil',          band: 'B7', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'soilTypes',    config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 420, caregiverPrompt: 'Collect 3 soils. Drop water on each.' },

  // ── Age 8 activities (B8 — plan → measure → record → conclude) ──────────
  { id: 'mm.ins.b8.do', objectiveId: 'mm.insulation',     band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'insulation',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 720, caregiverPrompt: 'Which 2 materials keep an ice cream coldest? Test it.' },
  { id: 'll.fc.b8.do',  objectiveId: 'll.food_chains_b8', band: 'B8', fiveEStage: 'explore', kind: 'game',       generatorKey: 'foodChainsB8', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Make a food chain from 4 living things you saw outside.' },
  { id: 'ec.shd.b8.do', objectiveId: 'ec.shadow_size',    band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'shadowSize',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Measure your shadow at 9am and 3pm. Which is longer?' },
  { id: 'll.lc.b8.do',  objectiveId: 'll.life_cycle_b8',  band: 'B8', fiveEStage: 'explore', kind: 'game',       generatorKey: 'lifeCycleB8',  config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Plant a seed; time how many days it takes to sprout.' },
  { id: 'll.hb.b8.do',  objectiveId: 'll.healthy_body',   band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'healthyBody',  config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Keep a health diary for a week.' },
  { id: 'mm.evap.b8.do',objectiveId: 'mm.evaporation',    band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'evaporation',  config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Hang a wet cloth in the sun; time how long it takes to dry.' },
  { id: 'mm.rev.b8.do', objectiveId: 'mm.reversible',     band: 'B8', fiveEStage: 'explore', kind: 'quiz',       generatorKey: 'reversible',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Toast bread — can you un-toast it?' },
  { id: 'ec.frc.b8.do', objectiveId: 'ec.forces_b8',      band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'forcesB8',     config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Push a book vs pull a book. Which is easier?' },
  { id: 'ec.snd.b8.do', objectiveId: 'ec.sound',          band: 'B8', fiveEStage: 'explore', kind: 'game',       generatorKey: 'soundB8',      config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Pluck tight and loose rubber bands. Which is high pitch?' },
  { id: 'eb.rck.b8.do', objectiveId: 'eb.rocks',          band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'rocks',        config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Collect 3 rocks. Which scratches which?' },
  { id: 'eb.wx.b8.do',  objectiveId: 'eb.weather_b8',     band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'weatherB8',    config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Make a weather chart for a week.' },
  { id: 'eb.spc.b8.do', objectiveId: 'eb.space_b8',       band: 'B8', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'spaceB8',      config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 600, caregiverPrompt: 'Watch the moon for 4 nights. Draw its shape.' },

  // ── Age 9 activities (Band B — CAPS Gr 4 flagship sims) ─────────────────
  { id: 'll.photo.b.do', objectiveId: 'll.photosynthesis', band: 'B', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'photosynthesis', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 900, caregiverPrompt: 'Grow two beans — one in sun, one in the dark. Measure after a week.' },
  { id: 'ec.circ.b.do',  objectiveId: 'ec.circuits',       band: 'B', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'circuitBuilder', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 900, caregiverPrompt: 'Find 3 things that use electricity. Trace the path from plug to device.' },
  { id: 'mm.wc.b.do',    objectiveId: 'mm.water_cycle',    band: 'B', fiveEStage: 'explore', kind: 'simulation', generatorKey: 'waterCycle',     config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 900, caregiverPrompt: 'Put one glass of water in sun, one in shade. Which loses more?' },

  // ── Ages 3–4 activities (A3 + A4 share same components) ─────────────────

  { id: 'll.mb.a.engage',  objectiveId: 'll.my_body',   band: 'A3', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'tapBodyParts', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90, caregiverPrompt: 'Touch your nose! Touch mummy\'s nose!' },
  { id: 'mm.hs.a.engage',  objectiveId: 'mm.hard_soft', band: 'A3', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'sortTwoBoxes', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90, caregiverPrompt: 'Find 1 hard thing and 1 soft thing in your room!' },
  { id: 'eb.wx.a.engage',  objectiveId: 'eb.weather',   band: 'A3', fiveEStage: 'engage', kind: 'sensory_play', generatorKey: 'weatherExplore', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90, caregiverPrompt: 'Look outside — is it sunny, cloudy, or rainy?' },

  // ── mm.solids_liquids_gases  ·  Band A ───────────────────────────────────

  {
    id: 'mm.slg.a.engage',
    objectiveId: 'mm.solids_liquids_gases',
    band: 'A5',
    fiveEStage: 'engage',
    kind: 'sensory_play',
    generatorKey: 'caregiverPrompt',
    config: { phenomenon: 'hard_vs_pours', caregiverLed: true },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 30,
    caregiverPrompt: 'Pick up a stone — it is hard and keeps its shape (SOLID). Now pour water — it flows (LIQUID).',
  },

  // ── mm.solids_liquids_gases  ·  Band B ───────────────────────────────────

  {
    id: 'mm.slg.b.explore',
    objectiveId: 'mm.solids_liquids_gases',
    band: 'B',
    fiveEStage: 'explore',
    kind: 'game',
    generatorKey: 'sortThreeStates',
    config: { objects: ['ice', 'juice', 'steam', 'rock', 'milk', 'oxygen', 'wood', 'water'] },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 90,
    hints: ['Does it keep its own shape?', 'Can it flow or pour?'],
  },

  {
    id: 'mm.slg.b.explain',
    objectiveId: 'mm.solids_liquids_gases',
    band: 'B',
    fiveEStage: 'explain',
    kind: 'story',
    generatorKey: 'narratedDiagram',
    config: { concept: 'particle_theory', diagram: 'three_states' },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 90,
  },

  {
    id: 'mm.slg.b.evaluate',
    objectiveId: 'mm.solids_liquids_gases',
    band: 'B',
    fiveEStage: 'evaluate',
    kind: 'quiz',
    generatorKey: 'predictThenTest',
    config: { objects: ['steam', 'honey', 'sand', 'air'] },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 120,
    hints: ['Does it keep its shape?', 'Does it fill its container completely?'],
  },

  // ── ll.parts_of_plant  ·  Band A + B ─────────────────────────────────────

  { id: 'll.pop.a.engage',  objectiveId: 'll.parts_of_plant', band: 'A5', fiveEStage: 'engage',   kind: 'sensory_play', generatorKey: 'caregiverPrompt', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 30,  caregiverPrompt: 'Point to the roots, stem, leaves, and flower on a real plant!' },
  { id: 'll.pop.b.explore', objectiveId: 'll.parts_of_plant', band: 'B', fiveEStage: 'explore',  kind: 'game',         generatorKey: 'tapToReveal',     config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90  },
  { id: 'll.pop.b.explain', objectiveId: 'll.parts_of_plant', band: 'B', fiveEStage: 'explain',  kind: 'story',        generatorKey: 'narratedDiagram', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90  },
  { id: 'll.pop.b.evaluate',objectiveId: 'll.parts_of_plant', band: 'B', fiveEStage: 'evaluate', kind: 'quiz',         generatorKey: 'predictThenTest', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 120 },

  // ── ll.food_chains  ·  Band A + B ────────────────────────────────────────

  { id: 'll.fc.a.engage',   objectiveId: 'll.food_chains', band: 'A5', fiveEStage: 'engage',   kind: 'sensory_play', generatorKey: 'caregiverPrompt', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 30  },
  { id: 'll.fc.b.explore',  objectiveId: 'll.food_chains', band: 'B', fiveEStage: 'explore',  kind: 'game',         generatorKey: 'chainSequence',   config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90  },
  { id: 'll.fc.b.explain',  objectiveId: 'll.food_chains', band: 'B', fiveEStage: 'explain',  kind: 'story',        generatorKey: 'narratedDiagram', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90  },
  { id: 'll.fc.b.evaluate', objectiveId: 'll.food_chains', band: 'B', fiveEStage: 'evaluate', kind: 'quiz',         generatorKey: 'predictThenTest', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 120 },

  // ── ec.light_shadows  ·  Band A + B ──────────────────────────────────────

  { id: 'ec.ls.a.engage',   objectiveId: 'ec.light_shadows', band: 'A5', fiveEStage: 'engage',   kind: 'sensory_play', generatorKey: 'caregiverPrompt', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 30  },
  { id: 'ec.ls.b.explore',  objectiveId: 'ec.light_shadows', band: 'B', fiveEStage: 'explore',  kind: 'simulation',   generatorKey: 'shadowSim',       config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90  },
  { id: 'ec.ls.b.explain',  objectiveId: 'ec.light_shadows', band: 'B', fiveEStage: 'explain',  kind: 'story',        generatorKey: 'narratedDiagram', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 90  },
  { id: 'ec.ls.b.evaluate', objectiveId: 'ec.light_shadows', band: 'B', fiveEStage: 'evaluate', kind: 'quiz',         generatorKey: 'predictThenTest', config: {}, assets: { audioByLang: { en: [], zu: [] } }, estimatedSeconds: 120 },

  // ── ll.non_living  ·  Band A ──────────────────────────────────────────────

  {
    id: 'll.non_living.a.engage',
    objectiveId: 'll.non_living',
    band: 'A5',
    fiveEStage: 'engage',
    kind: 'sensory_play',
    generatorKey: 'caregiverPrompt',
    config: { phenomenon: 'alive_or_not', caregiverLed: true },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 30,
    caregiverPrompt: 'The dog moves, eats, and breathes — it is ALIVE! The rock just sits there — it is NOT alive.',
  },

  // ── ll.non_living  ·  Band B ──────────────────────────────────────────────

  {
    id: 'll.b.explore',
    objectiveId: 'll.non_living',
    band: 'B',
    fiveEStage: 'explore',
    kind: 'game',
    generatorKey: 'sortLivingNonLiving',
    config: {
      objects: ['tree', 'rock', 'dog', 'car', 'flower', 'chair', 'butterfly', 'book'],
    },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 90,
    hints: [
      'Think: does it grow by itself?',
      'Does it need food or water to survive?',
    ],
  },

  {
    id: 'll.b.explain',
    objectiveId: 'll.non_living',
    band: 'B',
    fiveEStage: 'explain',
    kind: 'story',
    generatorKey: 'narratedDiagram',
    config: { concept: 'living_characteristics', diagram: 'grow_eat_reproduce' },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 90,
  },

  {
    id: 'll.b.evaluate',
    objectiveId: 'll.non_living',
    band: 'B',
    fiveEStage: 'evaluate',
    kind: 'quiz',
    generatorKey: 'predictThenTest',
    config: {
      objects: ['fire', 'mushroom', 'river', 'robot'],
    },
    assets: { audioByLang: { en: [], zu: [] } },
    estimatedSeconds: 120,
    hints: [
      'Can it grow and feed on its own?',
      'Can it make more of its kind without human help?',
    ],
  },
];

// ── Helper lookups ────────────────────────────────────────────────────────────

export const OBJECTIVE_MAP = Object.fromEntries(
  OBJECTIVES.map(o => [o.id, o])
);

export const ACTIVITIES_BY_OBJECTIVE: Record<string, LearningActivity[]> =
  ACTIVITIES.reduce<Record<string, LearningActivity[]>>((acc, a) => {
    (acc[a.objectiveId] ??= []).push(a);
    return acc;
  }, {});

/** Return activities for an objective in 5E order. */
export const FIVE_E_ORDER: LearningActivity['fiveEStage'][] = [
  'engage', 'explore', 'explain', 'elaborate', 'evaluate',
];

export function getActivitiesInOrder(objectiveId: string): LearningActivity[] {
  const acts = ACTIVITIES_BY_OBJECTIVE[objectiveId] ?? [];
  return [...acts].sort(
    (a, b) =>
      FIVE_E_ORDER.indexOf(a.fiveEStage) - FIVE_E_ORDER.indexOf(b.fiveEStage)
  );
}

// ── Band metadata ─────────────────────────────────────────────────────────────

export const BAND_META = {
  A3: {
    label: 'Tiny Explorers',
    ageRange: 'Age 3',
    description: 'Sensory play with a grown-up',
    color: 'bg-rose-400',
    shadow: 'shadow-[0_6px_0_#FB7185]',
    textColor: 'text-rose-600',
    bgLight: 'bg-rose-50',
  },
  A4: {
    label: 'Young Discoverers',
    ageRange: 'Age 4',
    description: 'Simple hands-on exploration',
    color: 'bg-orange-400',
    shadow: 'shadow-[0_6px_0_#FB923C]',
    textColor: 'text-orange-600',
    bgLight: 'bg-orange-50',
  },
  A5: {
    label: 'Little Explorers',
    ageRange: 'Age 5',
    description: 'Structured discovery activities',
    color: 'bg-sky-400',
    shadow: 'shadow-[0_6px_0_#0EA5E9]',
    textColor: 'text-sky-600',
    bgLight: 'bg-sky-50',
  },
  B6: {
    label: 'Foundation Scientists',
    ageRange: 'Age 6',
    description: 'Predict, test & record like a scientist',
    color: 'bg-lime-500',
    shadow: 'shadow-[0_6px_0_#65A30D]',
    textColor: 'text-lime-700',
    bgLight: 'bg-lime-50',
  },
  B7: {
    label: 'Junior Investigators',
    ageRange: 'Age 7',
    description: 'Fair tests & bar charts',
    color: 'bg-emerald-500',
    shadow: 'shadow-[0_6px_0_#059669]',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
  },
  B8: {
    label: 'Junior Investigators II',
    ageRange: 'Age 8',
    description: 'Plan, measure & write conclusions',
    color: 'bg-teal-500',
    shadow: 'shadow-[0_6px_0_#0D9488]',
    textColor: 'text-teal-700',
    bgLight: 'bg-teal-50',
  },
  B: {
    label: 'Science Adventurers',
    ageRange: 'Age 9',
    description: 'Explore, experiment, discover!',
    color: 'bg-green-500',
    shadow: 'shadow-[0_6px_0_#16A34A]',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
  },
  C: {
    label: 'Junior Scientists',
    ageRange: 'Ages 10–12',
    description: 'Investigate, predict, reason',
    color: 'bg-indigo-500',
    shadow: 'shadow-[0_6px_0_#4338CA]',
    textColor: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
  },
} as const;

/** Strand display info */
export const STRAND_META = {
  life_and_living: {
    label: 'Life & Living',
    icon: '🌿',
    color: 'bg-emerald-100 text-emerald-700',
  },
  matter_and_materials: {
    label: 'Matter & Materials',
    icon: '🧪',
    color: 'bg-blue-100 text-blue-700',
  },
  energy_and_change: {
    label: 'Energy & Change',
    icon: '⚡',
    color: 'bg-amber-100 text-amber-700',
  },
  earth_and_beyond: {
    label: 'Earth & Beyond',
    icon: '🌍',
    color: 'bg-violet-100 text-violet-700',
  },
} as const;
