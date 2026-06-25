// ──────────────────────────────────────────────────────────────────────────────
// Science Academy (ages 13–17) — engine.
// Registers every age's authored levels into one TOPIC_LEVELS map and exposes
// the problem generators the UI calls. Imports the exam-studio types/helpers
// DIRECTLY (with .ts extensions) so the Node strip-types smoke run never loads
// the progress/localStorage path — mirrors math-adventure's mathEngine.ts.
// ──────────────────────────────────────────────────────────────────────────────
import type { Problem, TopicLevels } from '../exam-studio/types.ts';
import { shuffle } from '../exam-studio/helpers.ts';
import { AGE13_LEVELS } from './cases/age13.ts';
import { AGE14_LEVELS } from './cases/age14.ts';
import { AGE15_LEVELS } from './cases/age15.ts';
import { AGE16_LEVELS } from './cases/age16.ts';
import { AGE17_LEVELS } from './cases/age17.ts';

// `age{N}-{topic}` → { levelNumber: generator }
export const TOPIC_LEVELS: Record<string, TopicLevels> = {
  ...AGE13_LEVELS,
  ...AGE14_LEVELS,
  ...AGE15_LEVELS,
  ...AGE16_LEVELS,
  ...AGE17_LEVELS,
};

export function topicLevelCount(topicId: string): number {
  const t = TOPIC_LEVELS[topicId];
  return t ? Object.keys(t).length : 0;
}

/**
 * Generate `count` problems for a single level, preferring DISTINCT questions.
 * Draws first from the requested level; if that level has fewer distinct items
 * than `count`, it pads from the topic's other levels (review) rather than
 * repeating a question. Only if the whole topic is exhausted does it repeat.
 * Falls back to the highest available level if `level` is beyond what is
 * authored (lower-band fallback).
 */
export function generateProblems(topicId: string, count: number, level: number): Problem[] {
  const topic = TOPIC_LEVELS[topicId];
  if (!topic) return [];
  const levels = Object.keys(topic).map(Number).sort((a, b) => a - b);
  const useLevel = topic[level] ? level : levels[levels.length - 1];
  // Try the requested level first, then siblings (closest levels first) for padding.
  const order = [useLevel, ...levels.filter((l) => l !== useLevel)
    .sort((a, b) => Math.abs(a - useLevel) - Math.abs(b - useLevel))];

  const out: Problem[] = [];
  const seen = new Set<string>();
  for (const lv of order) {
    const gen = topic[lv];
    let guard = 0;
    while (out.length < count && guard < count * 12) {
      const p = gen();
      guard++;
      if (seen.has(p.question)) continue;
      seen.add(p.question);
      out.push(p);
    }
    if (out.length >= count) break;
  }
  // Truly exhausted (tiny topic) — top up by repeating the requested level.
  while (out.length < count) out.push(topic[useLevel]());
  return out;
}

/**
 * A topic test draws one problem from each level of the topic, shuffled.
 * Pass = ≥80% (handled by the progress engine).
 */
export function generateTopicTestProblems(topicId: string): Problem[] {
  const topic = TOPIC_LEVELS[topicId];
  if (!topic) return [];
  const problems = Object.keys(topic)
    .map(Number)
    .sort((a, b) => a - b)
    .map((lv) => topic[lv]());
  return shuffle(problems);
}
