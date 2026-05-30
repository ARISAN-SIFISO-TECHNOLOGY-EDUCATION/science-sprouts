// Activity: Floating & Sinking — EVALUATE (Band B)
// 5E Stage: evaluate | Kind: quiz | Generator: predictThenTest
//
// Learner first PREDICTS whether each object floats or sinks, then "tests"
// it. Score shown at end; hints available if wrong.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Quiz objects ──────────────────────────────────────────────────────────────

interface QuizObject {
  id: string;
  emoji: string;
  label: string;
  floats: boolean;
  hint: string;
}

const QUIZ_OBJECTS: QuizObject[] = [
  { id: 'sponge',      emoji: '🧽', label: 'Sponge',      floats: true,  hint: 'Think about whether it has air trapped inside.' },
  { id: 'marble',      emoji: '🔮', label: 'Marble',      floats: false, hint: 'Glass marbles are dense — heavy for their size.' },
  { id: 'feather',     emoji: '🪶', label: 'Feather',     floats: true,  hint: 'Feathers are very light and trap air.' },
  { id: 'metal_spoon', emoji: '🥄', label: 'Metal spoon', floats: false, hint: 'Metal is very dense — heavier than water for its size.' },
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

export default function FloatSinkEvaluate({ onComplete, onExit }: Props) {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('predict');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  const current = QUIZ_OBJECTS[round];

  function predict(floats: boolean) {
    const correct = floats === current.floats;
    setAnswers(prev => [...prev, { id: current.id, predicted: floats, correct }]);
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

  if (done) {
    return (
      <ActivityWrapper
        title="Predict & Test"
        onExit={onExit}
        onSuccess={onComplete}
      >
        <div className="w-full max-w-sm mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-7xl mb-6"
          >
            {score === QUIZ_OBJECTS.length ? '🏆' : score >= 2 ? '🌟' : '💪'}
          </motion.div>
          <h3 className="font-display font-black text-3xl text-gray-800 mb-2">
            {score} / {QUIZ_OBJECTS.length} correct!
          </h3>
          <p className="text-gray-500 mb-8">
            {score === QUIZ_OBJECTS.length
              ? "Perfect prediction! You're thinking like a scientist."
              : score >= 2
              ? "Good thinking! Density takes practice."
              : "Keep exploring — scientists learn by testing!"}
          </p>
          {/* Per-question review */}
          <div className="space-y-2 mb-8 text-left">
            {QUIZ_OBJECTS.map((obj, i) => {
              const ans = answers[i];
              return (
                <div
                  key={obj.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-2xl text-sm font-bold',
                    ans?.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  )}
                >
                  <span className="text-xl">{obj.emoji}</span>
                  <span className="flex-1">{obj.label}</span>
                  <span>{obj.floats ? 'Floats 🌊' : 'Sinks ↓'}</span>
                  <span>{ans?.correct ? '✓' : '✗'}</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={onComplete}
            className="w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A]
                       text-white font-display font-black text-xl rounded-3xl btn-press"
          >
            Finish 🌱
          </button>
        </div>
      </ActivityWrapper>
    );
  }

  return (
    <ActivityWrapper
      title="Predict & Test"
      voicePrompt={
        phase === 'predict'
          ? `Will the ${current.label} float or sink? Make your prediction!`
          : answers.at(-1)?.correct
          ? `Correct! The ${current.label} ${current.floats ? 'floats' : 'sinks'}.`
          : `Not quite. The ${current.label} actually ${current.floats ? 'floats' : 'sinks'}.`
      }
      currentRound={round + 1}
      totalRounds={QUIZ_OBJECTS.length}
      onExit={onExit}
      onSuccess={onComplete}
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Object card */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-md border-2 border-gray-100
                     flex flex-col items-center gap-3 mb-6"
        >
          <span className="text-7xl">{current.emoji}</span>
          <p className="font-display font-black text-2xl text-gray-700">
            {current.label}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'predict' ? (
            <motion.div
              key="predict"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-center font-bold text-gray-500 mb-4 text-sm uppercase tracking-widest">
                Your prediction:
              </p>
              <button
                onClick={() => predict(true)}
                className="w-full py-4 bg-sky-400 shadow-[0_6px_0_#0EA5E9]
                           text-white font-display font-black text-xl rounded-3xl btn-press
                           flex items-center justify-center gap-3"
              >
                🌊 It FLOATS
              </button>
              <button
                onClick={() => predict(false)}
                className="w-full py-4 bg-blue-600 shadow-[0_6px_0_#1D4ED8]
                           text-white font-display font-black text-xl rounded-3xl btn-press
                           flex items-center justify-center gap-3"
              >
                ↓ It SINKS
              </button>

              {/* Hint toggle */}
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
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Result banner */}
              <div
                className={cn(
                  'p-4 rounded-2xl text-center font-bold text-lg',
                  answers.at(-1)?.correct
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                )}
              >
                {answers.at(-1)?.correct ? '✅ Correct! ' : '💡 Not quite — '}
                The {current.label}{' '}
                <strong>{current.floats ? 'floats' : 'sinks'}</strong>!
              </div>

              {/* Mini diagram */}
              <div className="w-full h-24 bg-blue-100 rounded-2xl flex items-center
                              justify-center overflow-hidden relative">
                {current.floats ? (
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl absolute top-3"
                  >
                    {current.emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    animate={{ y: [0, 8, 8] }}
                    transition={{ duration: 1, repeat: 0 }}
                    className="text-4xl absolute bottom-3"
                  >
                    {current.emoji}
                  </motion.span>
                )}
              </div>

              <button
                onClick={nextRound}
                className="w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A]
                           text-white font-display font-black text-xl rounded-3xl btn-press"
              >
                {round + 1 < QUIZ_OBJECTS.length ? 'Next object →' : 'See my score!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ActivityWrapper>
  );
}
