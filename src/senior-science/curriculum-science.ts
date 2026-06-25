// ──────────────────────────────────────────────────────────────────────────────
// Science Academy (ages 13–17) — curriculum spine.
// The teen tier of Science Sprouts. Presented by AGE, never by grade; the
// 5-school arc mirrors the ecosystem's other teen apps (Math Academy, Truth
// Seekers). SA CAPS alignment (Senior Phase NS → FET Physical + Life Sciences)
// is INTERNAL only — the `capsRef` note is never rendered.
// ──────────────────────────────────────────────────────────────────────────────

export interface ScienceTopic {
  id: string;        // `age{N}-{slug}`, the key into TOPIC_LEVELS
  title: string;     // science only — never a grade label
  subtitle: string;
  icon: string;      // emoji
  levels: number;    // sequential, ≥80% to pass each
  capsRef?: string;  // internal alignment note — NEVER rendered
}

export interface ScienceAgeGroup {
  age: number;       // 13–17
  school: string;    // Explorers · Pioneers · Builders · Systems · Thinkers
  emoji: string;
  tagline: string;
  topics: ScienceTopic[];
}

// Uniform shape: every topic carries the same number of levels for v1.
const LEVELS = 3;

export const SCIENCE_AGES: ScienceAgeGroup[] = [
  {
    age: 13,
    school: 'Explorers',
    emoji: '🧭',
    tagline: 'The building blocks of everything',
    topics: [
      { id: 'age13-atoms',  title: 'Atoms & Elements', subtitle: 'What everything is made of',     icon: '⚛️', levels: LEVELS, capsRef: 'CAPS NS Senior Phase: Matter & Materials' },
      { id: 'age13-cells',  title: 'Cells & Life',     subtitle: 'The smallest living units',        icon: '🦠', levels: LEVELS, capsRef: 'CAPS NS Senior Phase: Life & Living' },
      { id: 'age13-energy', title: 'Energy & Circuits', subtitle: 'How energy moves and powers things', icon: '⚡', levels: LEVELS, capsRef: 'CAPS NS Senior Phase: Energy & Change' },
    ],
  },
  {
    age: 14,
    school: 'Pioneers',
    emoji: '🚩',
    tagline: 'How matter, bodies and current behave',
    topics: [
      { id: 'age14-reactions',   title: 'Chemical Reactions',     subtitle: 'When substances change for good', icon: '🧪', levels: LEVELS, capsRef: 'CAPS NS Senior Phase: Matter & Materials' },
      { id: 'age14-body',        title: 'Body Systems',           subtitle: 'How your body keeps you alive',    icon: '🫀', levels: LEVELS, capsRef: 'CAPS NS Senior Phase: Life & Living' },
      { id: 'age14-electricity', title: 'Electricity & Magnetism', subtitle: 'Current, circuits and magnets',    icon: '🧲', levels: LEVELS, capsRef: 'CAPS NS Senior Phase: Energy & Change' },
    ],
  },
  {
    age: 15,
    school: 'Builders',
    emoji: '🏗️',
    tagline: 'Classifying matter and life',
    topics: [
      { id: 'age15-matter',  title: 'Matter & Classification', subtitle: 'Pure substances, mixtures and states', icon: '🔬', levels: LEVELS, capsRef: 'CAPS Physical Sciences FET: Matter & Materials' },
      { id: 'age15-lifesci', title: 'Cells & Biodiversity',    subtitle: 'Organelles and the variety of life',   icon: '🌿', levels: LEVELS, capsRef: 'CAPS Life Sciences FET: Diversity, Change & Continuity' },
    ],
  },
  {
    age: 16,
    school: 'Systems',
    emoji: '🛰️',
    tagline: 'Bonds, reactions and life processes',
    topics: [
      { id: 'age16-bonding',  title: 'Chemical Change & Bonding', subtitle: 'Bonds, equations, acids and bases',  icon: '⚗️', levels: LEVELS, capsRef: 'CAPS Physical Sciences FET: Chemical Change' },
      { id: 'age16-lifeproc', title: 'Life Processes',            subtitle: 'Photosynthesis, respiration, balance', icon: '🌱', levels: LEVELS, capsRef: 'CAPS Life Sciences FET: Life Processes' },
    ],
  },
  {
    age: 17,
    school: 'Thinkers',
    emoji: '🧩',
    tagline: 'Reasoning across reactions and inheritance',
    topics: [
      { id: 'age17-rates',    title: 'Reactions, Rates & Energy', subtitle: 'What speeds reactions and stores energy', icon: '🔥', levels: LEVELS, capsRef: 'CAPS Physical Sciences FET: Chemical Change & Energy' },
      { id: 'age17-genetics', title: 'Genetics & Evolution',      subtitle: 'Inheritance and how life changes',        icon: '🧬', levels: LEVELS, capsRef: 'CAPS Life Sciences FET: Genetics & Evolution' },
    ],
  },
];

// Convenience lookups.
export const SCIENCE_AGE_BY_NUMBER: Record<number, ScienceAgeGroup> = Object.fromEntries(
  SCIENCE_AGES.map((a) => [a.age, a]),
);

export function scienceTopicById(topicId: string): ScienceTopic | undefined {
  for (const a of SCIENCE_AGES) {
    const t = a.topics.find((x) => x.id === topicId);
    if (t) return t;
  }
  return undefined;
}

export function scienceTopicIdsForAge(age: number): string[] {
  return (SCIENCE_AGE_BY_NUMBER[age]?.topics ?? []).map((t) => t.id);
}
