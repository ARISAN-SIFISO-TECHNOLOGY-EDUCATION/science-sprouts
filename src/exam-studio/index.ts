// @sprouts/exam-studio — reusable exam-prep framework (in-repo package).
//
// The content-FREE core the Science Academy (ages 13–17) tier builds on:
//   • types     — the Problem contract + level-generator/topic-map shapes
//   • helpers   — option builders (makeOptions), conceptual generators (fromCases)
//   • progress  — the mastery engine: ≥80% pass gating, sequential level/topic
//                 unlock, mistake log, day-streak + daily goal, mock scores
//
// Boundary rules (keep this package extractable):
//   1. NOTHING here imports app CONTENT (science generators, curriculum) or UI.
//          exam-studio  ←  senior-science (content)  ←  App
//   2. The ONE host seam is `../lib/safeStorage` (a generic localStorage util).
//
// Consumers import from THIS barrel, e.g.
//   import { recordAttempt, makeOptions, type Problem } from '../exam-studio';
//
// NOTE for the Node smoke test: scienceEngine.ts imports `./types` and
// `./helpers` DIRECTLY (with .ts extensions), not via this barrel, so the
// strip-types smoke run never loads the progress/localStorage code path.
export * from './types';
export * from './helpers';
export * from './progress';
