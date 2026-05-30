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

  // ── Life & Living ─────────────────────────────────────────────────────────

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

  // ── mm.solids_liquids_gases  ·  Band A ───────────────────────────────────

  {
    id: 'mm.slg.a.engage',
    objectiveId: 'mm.solids_liquids_gases',
    band: 'A',
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

  // ── ll.non_living  ·  Band A ──────────────────────────────────────────────

  {
    id: 'll.non_living.a.engage',
    objectiveId: 'll.non_living',
    band: 'A',
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
  A: {
    label: 'Little Explorers',
    ageRange: 'Ages 3–5',
    description: 'Short activities done with a grown-up',
    color: 'bg-sky-400',
    shadow: 'shadow-[0_6px_0_#0EA5E9]',
    textColor: 'text-sky-600',
    bgLight: 'bg-sky-50',
  },
  B: {
    label: 'Science Adventurers',
    ageRange: 'Ages 6–9',
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
