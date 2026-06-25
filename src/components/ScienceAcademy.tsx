// ──────────────────────────────────────────────────────────────────────────────
// Science Academy — the teen tier (ages 13–17) of Science Sprouts.
// A dark, exam-prep experience driven by the data-only scienceEngine + the
// ported exam-studio progress engine (≥80% pass, sequential level/topic unlock,
// mistake log). Self-contained: manages its own view state and paints its own
// dark surface. Presented by AGE, never by grade.
// ──────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock, Check, X, ChevronLeft, ChevronRight, Flame, AlertTriangle,
  Lightbulb, Trash2, GraduationCap, RotateCcw, Sparkles,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Problem } from '../exam-studio';
import {
  recordAttempt, addMistake, getMistakes, removeMistake,
  isLevelUnlocked, isLevelPassed, getLevelProgress,
  isTopicUnlocked, isTopicTestPassed, getStreak,
  isDevUnlockAll, setDevUnlockAll, isDevButtonRevealed, revealDevButton,
  type MistakeEntry,
} from '../exam-studio';
import { generateProblems, generateTopicTestProblems } from '../senior-science/scienceEngine';
import {
  SCIENCE_AGE_BY_NUMBER, scienceTopicById, scienceTopicIdsForAge,
  type ScienceTopic,
} from '../senior-science/curriculum-science';

const QUIZ_LEN = 5;          // questions per level (pass = 4/5 = 80%)
const PASS = 80;

interface Props {
  age: number;
  onChangeAge: () => void;
}

type View =
  | { v: 'topics' }
  | { v: 'quiz'; topicId: string; level: number; isTest: boolean }
  | { v: 'result'; topicId: string; level: number; isTest: boolean; score: number }
  | { v: 'mistakes' };

export default function ScienceAcademy({ age, onChangeAge }: Props) {
  const group = SCIENCE_AGE_BY_NUMBER[age];
  const [view, setView] = useState<View>({ v: 'topics' });
  // A version counter forces topic-list re-reads of localStorage after a pass.
  const [rev, setRev] = useState(0);
  const bump = () => setRev((r) => r + 1);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Coming soon for this age.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-lg mx-auto px-4 pb-28 pt-4">
        <AnimatePresence mode="wait">
          {view.v === 'topics' && (
            <TopicsView
              key={`topics-${rev}`}
              age={age}
              onOpenLevel={(topicId, level, isTest) => setView({ v: 'quiz', topicId, level, isTest })}
              onChangeAge={onChangeAge}
              onOpenMistakes={() => setView({ v: 'mistakes' })}
            />
          )}
          {view.v === 'quiz' && (
            <QuizView
              key={`quiz-${view.topicId}-${view.level}-${view.isTest}`}
              topicId={view.topicId}
              level={view.level}
              isTest={view.isTest}
              onDone={(score) => {
                recordAttempt(view.topicId, view.level, score, view.isTest);
                setView({ v: 'result', topicId: view.topicId, level: view.level, isTest: view.isTest, score });
              }}
              onQuit={() => setView({ v: 'topics' })}
            />
          )}
          {view.v === 'result' && (
            <ResultView
              key="result"
              topicId={view.topicId}
              level={view.level}
              isTest={view.isTest}
              score={view.score}
              onRetry={() => setView({ v: 'quiz', topicId: view.topicId, level: view.level, isTest: view.isTest })}
              onNext={(nextLevel) => setView({ v: 'quiz', topicId: view.topicId, level: nextLevel, isTest: false })}
              onHome={() => { bump(); setView({ v: 'topics' }); }}
            />
          )}
          {view.v === 'mistakes' && (
            <MistakesView key="mistakes" onBack={() => setView({ v: 'topics' })} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Topics view ───────────────────────────────────────────────────────────────

function TopicsView({
  age, onOpenLevel, onChangeAge, onOpenMistakes,
}: {
  age: number;
  onOpenLevel: (topicId: string, level: number, isTest: boolean) => void;
  onChangeAge: () => void;
  onOpenMistakes: () => void;
}) {
  const group = SCIENCE_AGE_BY_NUMBER[age];
  const ids = scienceTopicIdsForAge(age);
  const streak = getStreak();
  const devOn = isDevUnlockAll();
  const showDev = isDevButtonRevealed() || import.meta.env.DEV;
  const [taps, setTaps] = useState(0);
  const [, force] = useState(0);

  const tapTitle = () => {
    const n = taps + 1;
    setTaps(n);
    if (n >= 7) { revealDevButton(); force((x) => x + 1); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <button onClick={onChangeAge} className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm font-semibold">
          <ChevronLeft className="w-4 h-4" /> Change age
        </button>
        <div className="flex items-center gap-3">
          {streak.count > 0 && (
            <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
              <Flame className="w-4 h-4" /> {streak.count}
            </span>
          )}
          <button onClick={onOpenMistakes} className="text-slate-400 hover:text-slate-200 text-sm font-semibold flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Mistakes
          </button>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Science Academy · Age {age}</p>
        <h1 onClick={tapTitle} className="text-3xl font-black mt-1 select-none">
          {group.emoji} {group.school}
        </h1>
        <p className="text-slate-400 text-sm mt-1">{group.tagline}</p>
      </div>

      {showDev && (
        <button
          onClick={() => { setDevUnlockAll(!devOn); force((x) => x + 1); }}
          className={cn(
            'mb-4 w-full rounded-xl border px-3 py-2 text-xs font-bold transition',
            devOn ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 bg-slate-900 text-slate-400',
          )}
        >
          Dev Mode: unlock everything — {devOn ? 'ON' : 'OFF'}
        </button>
      )}

      {/* Topic cards */}
      <div className="space-y-3">
        {group.topics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            unlocked={isTopicUnlocked(i, ids)}
            onOpenLevel={onOpenLevel}
          />
        ))}
      </div>
    </motion.div>
  );
}

function TopicCard({
  topic, unlocked, onOpenLevel,
}: {
  topic: ScienceTopic;
  unlocked: boolean;
  onOpenLevel: (topicId: string, level: number, isTest: boolean) => void;
}) {
  const levels = Array.from({ length: topic.levels }, (_, k) => k + 1);
  const allPassed = levels.every((l) => isLevelPassed(topic.id, l));
  const testPassed = isTopicTestPassed(topic.id);

  return (
    <div className={cn(
      'rounded-2xl border p-4 transition',
      unlocked ? 'border-slate-700 bg-slate-900' : 'border-slate-800 bg-slate-900/40 opacity-60',
    )}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{topic.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-100 leading-tight">{topic.title}</h3>
          <p className="text-xs text-slate-400">{topic.subtitle}</p>
        </div>
        {!unlocked && <Lock className="w-4 h-4 text-slate-500" />}
        {testPassed && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Mastered</span>}
      </div>

      {unlocked && (
        <div className="mt-3 flex flex-wrap gap-2">
          {levels.map((l) => {
            const open = isLevelUnlocked(topic.id, l);
            const passed = isLevelPassed(topic.id, l);
            const best = getLevelProgress(topic.id, l).bestScore;
            return (
              <button
                key={l}
                disabled={!open}
                onClick={() => onOpenLevel(topic.id, l, false)}
                className={cn(
                  'h-11 min-w-11 px-3 rounded-xl text-sm font-black flex items-center justify-center gap-1 border transition',
                  passed ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                    : open ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 hover:bg-indigo-500/25'
                      : 'border-slate-800 bg-slate-900 text-slate-600',
                )}
                title={best ? `Best ${best}%` : undefined}
              >
                {passed ? <Check className="w-4 h-4" /> : open ? l : <Lock className="w-3.5 h-3.5" />}
              </button>
            );
          })}
          {/* Topic test, unlocked once every level is passed */}
          <button
            disabled={!allPassed}
            onClick={() => onOpenLevel(topic.id, 0, true)}
            className={cn(
              'h-11 px-3 rounded-xl text-xs font-black flex items-center gap-1 border transition',
              testPassed ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                : allPassed ? 'border-amber-500 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25'
                  : 'border-slate-800 bg-slate-900 text-slate-600',
            )}
          >
            <GraduationCap className="w-4 h-4" /> Test
          </button>
        </div>
      )}
    </div>
  );
}

// ── Quiz view ─────────────────────────────────────────────────────────────────

function QuizView({
  topicId, level, isTest, onDone, onQuit,
}: {
  topicId: string;
  level: number;
  isTest: boolean;
  onDone: (score: number) => void;
  onQuit: () => void;
}) {
  const problems = useMemo<Problem[]>(
    () => (isTest ? generateTopicTestProblems(topicId) : generateProblems(topicId, QUIZ_LEN, level)),
    [topicId, level, isTest],
  );
  const topic = scienceTopicById(topicId);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const p = problems[idx];
  if (!p) { onQuit(); return null; }
  const answered = chosen !== null;
  const isRight = chosen === p.correctAnswer;
  const total = problems.length;

  const choose = (opt: string) => {
    if (answered) return;
    setChosen(opt);
    if (opt === p.correctAnswer) {
      setCorrectCount((c) => c + 1);
    } else {
      addMistake({
        questionId: p.id, topicId, level, question: p.question,
        correctAnswer: p.correctAnswer, userAnswer: opt, timestamp: Date.now(),
      });
    }
  };

  const next = () => {
    if (idx + 1 >= total) {
      const score = Math.round((correctCount / total) * 100);
      onDone(score);
      return;
    }
    setIdx((i) => i + 1);
    setChosen(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onQuit} className="text-slate-400 hover:text-slate-200 text-sm font-semibold flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Quit
        </button>
        <p className="text-xs font-bold text-slate-400">
          {topic?.title} · {isTest ? 'Topic Test' : `Level ${level}`}
        </p>
        <span className="text-xs font-black text-slate-300">{idx + 1}/{total}</span>
      </div>

      {/* progress bar */}
      <div className="h-1.5 rounded-full bg-slate-800 mb-5 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(idx / total) * 100}%` }} />
      </div>

      <h2 className="text-lg font-bold leading-snug mb-4">{p.question}</h2>

      <div className="space-y-2.5">
        {p.options.map((opt) => {
          const right = opt === p.correctAnswer;
          const picked = opt === chosen;
          return (
            <button
              key={opt}
              disabled={answered}
              onClick={() => choose(opt)}
              className={cn(
                'w-full text-left rounded-xl border px-4 py-3 font-semibold transition',
                !answered && 'border-slate-700 bg-slate-900 hover:border-indigo-500 hover:bg-slate-800',
                answered && right && 'border-emerald-500 bg-emerald-500/15 text-emerald-200',
                answered && picked && !right && 'border-rose-500 bg-rose-500/15 text-rose-200',
                answered && !right && !picked && 'border-slate-800 bg-slate-900 text-slate-500',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                {opt}
                {answered && right && <Check className="w-4 h-4 shrink-0" />}
                {answered && picked && !right && <X className="w-4 h-4 shrink-0" />}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 rounded-xl border border-slate-700 bg-slate-900 p-4 overflow-hidden"
          >
            <p className={cn('font-black mb-2', isRight ? 'text-emerald-300' : 'text-rose-300')}>
              {isRight ? 'Correct! 🎉' : `Not quite — it's "${p.correctAnswer}"`}
            </p>
            {p.workingSteps.length > 0 && (
              <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1 mb-3">
                {p.workingSteps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            )}
            <div className="flex items-start gap-2 text-xs text-amber-300/90 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span><span className="font-bold">Watch out:</span> {p.commonMistake}</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-indigo-300">
              <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span><span className="font-bold">Tip:</span> {p.examTip}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {answered && (
        <button
          onClick={next}
          className="mt-4 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 font-black flex items-center justify-center gap-1"
        >
          {idx + 1 >= total ? 'See result' : 'Next'} <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// ── Result view ───────────────────────────────────────────────────────────────

function ResultView({
  topicId, level, isTest, score, onRetry, onNext, onHome,
}: {
  topicId: string;
  level: number;
  isTest: boolean;
  score: number;
  onRetry: () => void;
  onNext: (nextLevel: number) => void;
  onHome: () => void;
}) {
  const passed = score >= PASS;
  const topic = scienceTopicById(topicId);
  const hasNext = !isTest && topic ? level < topic.levels : false;
  const nextUnlocked = hasNext && isLevelUnlocked(topicId, level + 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center"
    >
      <div className={cn('w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4',
        passed ? 'bg-emerald-500/20' : 'bg-slate-800')}>
        {passed ? <Sparkles className="w-10 h-10 text-emerald-400" /> : <RotateCcw className="w-10 h-10 text-slate-400" />}
      </div>
      <p className="text-5xl font-black mb-1">{score}%</p>
      <p className={cn('font-bold mb-1', passed ? 'text-emerald-300' : 'text-slate-400')}>
        {passed ? (isTest ? 'Topic mastered!' : 'Level passed!') : 'Keep going — 80% to pass'}
      </p>
      <p className="text-sm text-slate-500 mb-8">
        {topic?.title} · {isTest ? 'Topic Test' : `Level ${level}`}
      </p>

      <div className="w-full max-w-xs space-y-2.5">
        {passed && nextUnlocked && (
          <button onClick={() => onNext(level + 1)} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 font-black">
            Next level →
          </button>
        )}
        {!passed && (
          <button onClick={onRetry} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 font-black">
            Try again
          </button>
        )}
        <button onClick={onHome} className="w-full rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 py-3 font-bold text-slate-300">
          Back to topics
        </button>
      </div>
    </motion.div>
  );
}

// ── Mistakes view ─────────────────────────────────────────────────────────────

function MistakesView({ onBack }: { onBack: () => void }) {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => getMistakes());
  const drop = (id: string) => { removeMistake(id); setMistakes(getMistakes()); };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm font-semibold mb-4">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-black mb-1">Your mistakes</h1>
      <p className="text-slate-400 text-sm mb-5">Review these — fixing them is how mastery sticks.</p>

      {mistakes.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
          No mistakes logged. 🎉
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.map((m) => {
            const topic = scienceTopicById(m.topicId);
            return (
              <div key={m.questionId} className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-slate-500 mb-1">{topic?.title ?? m.topicId}</p>
                  <button onClick={() => drop(m.questionId)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-semibold text-slate-200 mb-2">{m.question}</p>
                <p className="text-xs text-rose-300">You chose: {m.userAnswer}</p>
                <p className="text-xs text-emerald-300">Answer: {m.correctAnswer}</p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
