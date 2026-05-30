// Activity: Living vs Non-Living — EVALUATE (Band B)
// 5E Stage: evaluate | Kind: quiz | Generator: predictThenTest
//
// Four "tricky" objects that challenge the simple "can it move?" definition.
// Learner predicts ALIVE / NOT ALIVE, then reveals the correct answer.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Quiz objects ──────────────────────────────────────────────────────────────

interface TrickyObject {
  id: string;
  emoji: string;
  label: string;
  isLiving: boolean;
  whyTricky: string;    // why learners often guess wrong
  explanation: string;  // the correct reasoning
  hint: string;
}

const QUIZ_OBJECTS: TrickyObject[] = [
  {
    id: 'fire',
    emoji: '🔥',
    label: 'Fire',
    isLiving: false,
    whyTricky: 'It grows and eats fuel — just like a living thing!',
    explanation: 'Fire is NOT alive. It grows and uses fuel, but it has no cells and cannot reproduce by itself.',
    hint: 'Can fire make baby fires on its own, without a human to light them?',
  },
  {
    id: 'mushroom',
    emoji: '🍄',
    label: 'Mushroom',
    isLiving: true,
    whyTricky: 'It looks like it\'s just sitting there doing nothing!',
    explanation: 'Mushrooms ARE alive! They are fungi — they grow, feed on dead matter, and release spores to reproduce.',
    hint: 'Think: does it grow? Can it make more mushrooms from spores?',
  },
  {
    id: 'river',
    emoji: '🌊',
    label: 'River (water)',
    isLiving: false,
    whyTricky: 'Water flows and moves — it looks active!',
    explanation: 'Water is NOT alive. It moves because of gravity, but it has no cells, does not grow, and cannot reproduce.',
    hint: 'Does water need food to keep flowing? Does it grow?',
  },
  {
    id: 'robot',
    emoji: '🤖',
    label: 'Robot',
    isLiving: false,
    whyTricky: 'Robots can move, sense, and respond — just like animals!',
    explanation: 'A robot is NOT alive. It can move and respond, but it cannot grow or make baby robots on its own.',
    hint: 'Can a robot build a copy of itself without any human help?',
  },
];

type Phase = 'predict' | 'result';

interface Answer {
  id: string;
  predicted: boolean;
  correct: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export default function LivingNonLivingEvaluate({ onComplete, onExit }: Props) {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('predict');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  const current = QUIZ_OBJECTS[round];

  function predict(isLiving: boolean) {
    const correct = isLiving === current.isLiving;
    setAnswers(prev => [...prev, { id: current.id, predicted: isLiving, correct }]);
    setPhase('result');
    setShowHint(false);
  }

  function nextRound() {
    if (round + 1 >= QUIZ_OBJECTS.length) {
      setDone(true);
    } else {
      setRound(r => r + 1);
      setPhase('predict');
    }
  }

  const score = answers.filter(a => a.correct).length;

  // ── Results screen ──────────────────────────────────────────────────────────

  if (done) {
    return (
      <ActivityWrapper
        title="Tricky Things!"
        onExit={onExit}
        onSuccess={onComplete}
        accentColor="bg-emerald-500"
      >
        <div className="w-full max-w-sm mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-7xl mb-5"
          >
            {score === QUIZ_OBJECTS.length ? '🏆' : score >= 3 ? '🌟' : score >= 2 ? '💪' : '🌱'}
          </motion.div>
          <h3 className="font-display font-black text-3xl text-gray-800 mb-2">
            {score} / {QUIZ_OBJECTS.length} correct!
          </h3>
          <p className="text-gray-500 mb-8">
            {score === QUIZ_OBJECTS.length
              ? 'Perfect! You think like a real scientist.'
              : score >= 3
              ? 'Excellent — those tricky ones are hard!'
              : score >= 2
              ? 'Good effort! Life science takes practice.'
              : 'Keep exploring — every scientist starts here!'}
          </p>

          {/* Per-object review */}
          <div className="space-y-2 mb-8 text-left">
            {QUIZ_OBJECTS.map((obj, i) => {
              const ans = answers[i];
              return (
                <div
                  key={obj.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-2xl text-sm',
                    ans?.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'
                  )}
                >
                  <span className="text-2xl flex-shrink-0">{obj.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black">{obj.label}</p>
                    <p className="text-xs font-medium leading-snug opacity-80">
                      {obj.explanation}
                    </p>
                  </div>
                  <span className="flex-shrink-0 font-black">{ans?.correct ? '✓' : '✗'}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669]
                       text-white font-display font-black text-xl rounded-3xl btn-press"
          >
            Finish 🌱
          </button>
        </div>
      </ActivityWrapper>
    );
  }

  // ── Per-round screen ────────────────────────────────────────────────────────

  return (
    <ActivityWrapper
      title="Tricky Things!"
      voicePrompt={
        phase === 'predict'
          ? `Is a ${current.label} alive or not alive? Make your prediction!`
          : answers.at(-1)?.correct
          ? `Correct! A ${current.label} is ${current.isLiving ? 'alive' : 'not alive'}. ${current.explanation}`
          : `Not quite. A ${current.label} is actually ${current.isLiving ? 'alive' : 'not alive'}. ${current.explanation}`
      }
      currentRound={round + 1}
      totalRounds={QUIZ_OBJECTS.length}
      onExit={onExit}
      onSuccess={onComplete}
      accentColor="bg-emerald-500"
    >
      <div className="w-full max-w-sm mx-auto">

        {/* Object card */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-md border-2 border-gray-100
                     flex flex-col items-center gap-3 mb-5"
        >
          <span className="text-7xl">{current.emoji}</span>
          <p className="font-display font-black text-2xl text-gray-700">{current.label}</p>
          {phase === 'predict' && (
            <p className="text-xs text-amber-600 font-bold italic text-center">
              💡 {current.whyTricky}
            </p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'predict' ? (

            /* ── Prediction buttons ─────────────────────────────────────── */
            <motion.div
              key="predict"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-center font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">
                Your prediction:
              </p>
              <button
                onClick={() => predict(true)}
                className="w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669]
                           text-white font-display font-black text-xl rounded-3xl btn-press
                           flex items-center justify-center gap-3"
              >
                🌱 It's ALIVE
              </button>
              <button
                onClick={() => predict(false)}
                className="w-full py-4 bg-gray-500 shadow-[0_6px_0_#374151]
                           text-white font-display font-black text-xl rounded-3xl btn-press
                           flex items-center justify-center gap-3"
              >
                ⚙️ NOT alive
              </button>

              {/* Hint */}
              <button
                onClick={() => setShowHint(s => !s)}
                className="flex items-center gap-2 mx-auto text-amber-500 text-sm font-bold
                           mt-2 hover:text-amber-700 transition-colors"
              >
                <Lightbulb size={16} />
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-amber-700 text-sm bg-amber-50
                               rounded-2xl p-3 border border-amber-200"
                  >
                    💡 {current.hint}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

          ) : (

            /* ── Result panel ───────────────────────────────────────────── */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className={cn(
                'p-4 rounded-2xl font-bold text-sm leading-snug',
                answers.at(-1)?.correct
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-orange-100 text-orange-700'
              )}>
                <p className="text-base font-black mb-1">
                  {answers.at(-1)?.correct ? '✅ Correct! ' : '💡 Not quite — '}
                  A {current.label} is{' '}
                  <strong>{current.isLiving ? 'ALIVE 🌱' : 'NOT alive ⚙️'}</strong>
                </p>
                <p className="opacity-90">{current.explanation}</p>
              </div>

              <button
                onClick={nextRound}
                className="w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669]
                           text-white font-display font-black text-xl rounded-3xl btn-press"
              >
                {round + 1 < QUIZ_OBJECTS.length ? 'Next tricky thing →' : 'See my score!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ActivityWrapper>
  );
}
