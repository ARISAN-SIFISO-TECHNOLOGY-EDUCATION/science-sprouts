// ──────────────────────────────────────────────────────────────────────────────
// Science Sprouts — core type definitions
// Implements the §10 data model from the blueprint.
// ──────────────────────────────────────────────────────────────────────────────

/** The four CAPS science strands that form the curriculum spine. */
export type Strand =
  | 'life_and_living'
  | 'matter_and_materials'
  | 'energy_and_change'
  | 'earth_and_beyond';

/** Developmental band — maps to age range and SA curriculum phase. */
export type Band =
  | 'A3'   // Age 3    — ECD sensory play, caregiver-led only
  | 'A4'   // Age 4    — ECD simple exploration, caregiver-led
  | 'A5'   // Age 5    — Pre-Grade R structured discovery
  | 'B6'   // Age 6    — Foundation Phase Gr 1: predict, test, record, badges
  | 'B7'   // Age 7    — Foundation Phase Gr 2: fair tests, bar charts
  | 'B8'   // Age 8    — Intermediate Phase Gr 3: plan, measure, conclude
  | 'B'    // Age 9    — Intermediate Phase
  | 'C'    // Age 10    — Intermediate Phase Gr 5: investigate, measure, conclude
  | 'C11'; // Age 11    — Intermediate Phase Gr 6: separate, transfer, model

/** The 5E instructional model stages. */
export type FiveE = 'engage' | 'explore' | 'explain' | 'elaborate' | 'evaluate';

/** Activity interaction archetypes. */
export type ActivityKind =
  | 'sensory_play'   // Band A: big-button, caregiver-led
  | 'story'          // narrated diagram or animation
  | 'game'           // interactive drag / tap game
  | 'simulation'     // virtual experiment
  | 'experiment'     // "go try at home" prompt
  | 'quiz';          // predict / drag-match / MCQ

/** Mastery states for the learner graph. */
export type Mastery = 'not_started' | 'exploring' | 'proficient' | 'mastered';

// ── Curriculum graph ──────────────────────────────────────────────────────────

/** One node in the curriculum prerequisite graph. */
export interface LearningObjective {
  id: string;                        // e.g. "mm.float_sink"
  strand: Strand;
  topic: string;                     // "Floating & Sinking"
  title: string;                     // "Why do some things float?"
  capsRef?: string;                  // SA curriculum reference
  ncfElda?: string;                  // NCF reference (Band A only)
  band: Band;
  prerequisites: string[];           // ids of prerequisite objectives
  anchoringPhenomenon: string;       // hook question shown to learner
  languages: string[];               // supported audio languages
}

/** One renderable learning activity (the "CASE" per band). */
export interface LearningActivity {
  id: string;
  objectiveId: string;
  band: Band;
  fiveEStage: FiveE;
  kind: ActivityKind;
  generatorKey: string;              // maps to scienceEngine generator
  config: Record<string, unknown>;   // generator parameters
  assets: {
    audioByLang?: Record<string, string[]>;
    art?: string[];
    video?: string[];
  };
  estimatedSeconds: number;          // Band A capped ~30s
  caregiverPrompt?: string;          // required for Band A
  hints?: string[];                  // pre-written (v1, no AI)
}

// ── Learner state (IndexedDB) ─────────────────────────────────────────────────

/** Progress per objective, stored in IndexedDB. */
export interface LearnerMasteryState {
  objectiveId: string;
  state: Mastery;
  stars: number;                     // not percentages — celebration, not judgement
  badges: string[];
  completedActivityIds: string[];
  updatedAt: string;                 // ISO timestamp
}

/** Top-level learner profile in IndexedDB. */
export interface LearnerProfile {
  /** Friendly display name (optional; privacy-first: never a real name by default). */
  displayName: string;
  selectedBand: Band;
  masteryByObjective: Record<string, LearnerMasteryState>;
  totalStars: number;
  gardenFlowers: number;             // mirrors Numeracy Sprouts reward metaphor
  settings: {
    audioEnabled: boolean;
    selectedLanguage: 'en' | 'zu';
    overrideSequence: boolean;       // parent/teacher unlock
  };
  createdAt: string;
}
