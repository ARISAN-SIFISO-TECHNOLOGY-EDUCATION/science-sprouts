// Content-integrity smoke for the Science Academy (ages 13–17).
// For every topic/level: generate problems and assert correctAnswer ∈ options,
// 4 distinct options, non-empty workingSteps + examTip, and ZERO grade strings
// in user-facing copy (question/options — capsRef is internal and excluded).
// Also checks the curriculum and engine agree on topics + level counts.
// Pure import (no network, no localStorage). Run with --experimental-strip-types.
import { TOPIC_LEVELS, generateProblems, generateTopicTestProblems, topicLevelCount } from './src/senior-science/scienceEngine.ts';
import { SCIENCE_AGES, scienceTopicIdsForAge } from './src/senior-science/curriculum-science.ts';

let fail = 0;
const err = (m) => { console.error('✗ ' + m); fail++; };

const GRADE = /\bGrade\b|\bGR\s?\d|\bGr\.?\s?\d/;

function checkProblem(where, p) {
  if (!p) { err(`${where}: no problem generated`); return; }
  const opts = p.options;
  if (!Array.isArray(opts) || opts.length !== 4) err(`${where}: expected 4 options, got ${opts?.length}`);
  if (new Set(opts).size !== opts.length) err(`${where}: duplicate options → ${JSON.stringify(opts)}`);
  if (!opts.includes(p.correctAnswer)) err(`${where}: correctAnswer '${p.correctAnswer}' ∉ options`);
  if (!p.workingSteps?.length) err(`${where}: empty workingSteps`);
  if (!p.examTip) err(`${where}: missing examTip`);
  if (!p.commonMistake) err(`${where}: missing commonMistake`);
  // Grade-string guardrail on user-facing fields.
  const facing = [p.question, ...opts, ...(p.workingSteps ?? []), ...(p.hints ?? []), p.examTip, p.commonMistake].join(' ');
  if (GRADE.test(facing)) err(`${where}: grade string in user-facing copy → "${facing.match(GRADE)[0]}"`);
}

// 1) Curriculum ↔ engine agreement.
let topicCount = 0;
for (const ageGroup of SCIENCE_AGES) {
  const ids = scienceTopicIdsForAge(ageGroup.age);
  if (ids.length !== ageGroup.topics.length) err(`age${ageGroup.age}: topic id count mismatch`);
  for (const t of ageGroup.topics) {
    topicCount++;
    if (GRADE.test(`${t.title} ${t.subtitle}`)) err(`${t.id}: grade string in title/subtitle`);
    if (!TOPIC_LEVELS[t.id]) { err(`${t.id}: declared in curriculum but missing from TOPIC_LEVELS`); continue; }
    if (topicLevelCount(t.id) !== t.levels) err(`${t.id}: curriculum says ${t.levels} levels, engine has ${topicLevelCount(t.id)}`);
  }
}

// 2) Every level generates valid problems (sample several times for randomness).
let levelCount = 0;
for (const [topicId, levels] of Object.entries(TOPIC_LEVELS)) {
  for (const lv of Object.keys(levels).map(Number)) {
    levelCount++;
    const problems = generateProblems(topicId, 4, lv);
    if (!problems.length) err(`${topicId} L${lv}: generateProblems returned nothing`);
    for (let i = 0; i < 25; i++) checkProblem(`${topicId} L${lv}`, levels[lv]());
    problems.forEach((p, i) => checkProblem(`${topicId} L${lv} #${i}`, p));
  }
  // Topic test draws one per level.
  const test = generateTopicTestProblems(topicId);
  if (test.length !== Object.keys(levels).length) err(`${topicId}: topic test should have ${Object.keys(levels).length} problems, got ${test.length}`);
  test.forEach((p, i) => checkProblem(`${topicId} test #${i}`, p));
}

console.log(`Checked ${topicCount} topics, ${levelCount} levels across ${SCIENCE_AGES.length} ages.`);
if (fail) { console.error(`\n${fail} problem(s) found.`); process.exit(1); }
console.log('All Science Academy content checks passed. ✅');
