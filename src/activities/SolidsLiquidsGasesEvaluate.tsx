// Activity: Solids, Liquids & Gases — EVALUATE (Band B)
// 5E Stage: evaluate | Kind: quiz | Generator: predictThenTest
//
// Four tricky substances that challenge assumptions about states of matter.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Quiz objects ──────────────────────────────────────────────────────────────

type State = 'solid' | 'liquid' | 'gas';

interface TrickyObject {
  id: string;
  emoji: string;
  label: string;
  state: State;
  whyTricky: string;
  explanation: string;
  hint: string;
}

const QUIZ_OBJECTS: TrickyObject[] = [
  {
    id: 'steam',
    emoji: '♨️',
    label: 'Steam',
    state: 'gas',
    whyTricky: 'You can see it — so maybe it\'s a liquid?',
    explanation: 'Steam is a GAS. When water is heated past 100°C, it becomes water vapour — a gas. The white cloud you see is tiny water droplets, but the real steam is invisible.',
    hint: 'Can steam fill a whole room? Does it have a fixed shape?',
  },
  {
    id: 'honey',
    emoji: '🍯',
    label: 'Honey',
    state: 'liquid',
    whyTricky: 'It moves so slowly — is it a very thick solid?',
    explanation: 'Honey is a LIQUID. It flows and takes the shape of its container, just very slowly. Liquids don\'t have to flow fast!',
    hint: 'If you pour honey into a differently shaped jar, what shape does it become?',
  },
  {
    id: 'sand',
    emoji: '🏖️',
    label: 'Sand',
    state: 'solid',
    whyTricky: 'It pours like water — surely it\'s a liquid?',
    explanation: 'Sand is a SOLID. Each grain of sand is a tiny solid particle. When grains are small enough, solids can pour — but each grain keeps its own shape.',
    hint: 'Pick up one grain of sand. Does it keep its shape, or does it flow?',
  },
  {
    id: 'air',
    emoji: '🌬️',
    label: 'Air',
    state: 'gas',
    whyTricky: 'You can\'t see it or hold it — is it even real?',
    explanation: 'Air is a GAS — a mixture of gases including oxygen and nitrogen. Even though you can\'t see it, you can feel it move as wind, and you breathe it every second.',
    hint: 'Can air fill a balloon? Does it spread out to fill any space?',
  },
];

type Phase = 'predict' | 'result';

interface Answer {
  id: string;
  predicted: State;
  correct: boolean;
}

const STATE_LABELS: Record<State, { label: string; emoji: string; bg: string; shadow: string }> = {
  solid:  { label: 'SOLID',  emoji: '🧊', bg: 'bg-sky-500',    shadow: 'shadow-[0_6px_0_#0284C7]' },
  liquid: { label: 'LIQUID', emoji: '💧', bg: 'bg-blue-500',   shadow: 'shadow-[0_6px_0_#1D4ED8]' },
  gas:    { label: 'GAS',    emoji: '💨', bg: 'bg-violet-500', shadow: 'shadow-[0_6px_0_#6D28D9]' },
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export default function SolidsLiquidsGasesEvaluate({ onComplete, onExit }: Props) {
  const [round, setRound]     = useState(0);
  const [phase, setPhase]     = useState<Phase>('predict');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone]       = useState(false);

  const current = QUIZ_OBJECTS[round];

  function predict(state: State) {
    const correct = state === current.state;
    setAnswers(prev => [...prev, { id: current.id, predicted: state, correct }]);
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

  // ── Results ─────────────────────────────────────────────────────────────────

  if (done) {
    return (
      <ActivityWrapper title="Tricky States!" onExit={onExit} onSuccess={onComplete} accentColor="bg-sky-500">
        <div className="w-full max-w-sm mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-7xl mb-5"
          >
            {score === 4 ? '🏆' : score === 3 ? '🌟' : score >= 2 ? '💪' : '🌱'}
          </motion.div>
          <h3 className="font-display font-black text-3xl text-gray-800 mb-2">
            {score} / {QUIZ_OBJECTS.length} correct!
          </h3>
          <p className="text-gray-500 mb-8">
            {score === 4
              ? 'Perfect! You understand states of matter.'
              : score === 3
              ? 'Excellent — those tricky ones catch everyone!'
              : score >= 2
              ? 'Good thinking! Matter science takes practice.'
              : 'Keep exploring — scientists learn by getting it wrong!'}
          </p>
          <div className="space-y-2 mb-8 text-left">
            {QUIZ_OBJECTS.map((obj, i) => {
              const ans = answers[i];
              const sl  = STATE_LABELS[obj.state];
              return (
                <div
                  key={obj.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-2xl text-sm',
                    ans?.correct ? 'bg-sky-50 text-sky-800' : 'bg-orange-50 text-orange-800'
                  )}
                >
                  <span className="text-2xl flex-shrink-0">{obj.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-black">{obj.label} — {sl.emoji} {sl.label}</p>
                    <p className="text-xs opacity-80 leading-snug">{obj.explanation}</p>
                  </div>
                  <span className="flex-shrink-0 font-black">{ans?.correct ? '✓' : '✗'}</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={onComplete}
            className="w-full py-4 bg-sky-500 shadow-[0_6px_0_#0284C7]
                       text-white font-display font-black text-xl rounded-3xl btn-press"
          >
            Finish 🌱
          </button>
        </div>
      </ActivityWrapper>
    );
  }

  // ── Per-round ────────────────────────────────────────────────────────────────

  return (
    <ActivityWrapper
      title="Tricky States!"
      voicePrompt={
        phase === 'predict'
          ? `Is ${current.label} a solid, liquid, or gas? Make your prediction!`
          : answers.at(-1)?.correct
          ? `Correct! ${current.label} is a ${current.state}. ${current.explanation}`
          : `Not quite. ${current.label} is actually a ${current.state}. ${current.explanation}`
      }
      currentRound={round + 1}
      totalRounds={QUIZ_OBJECTS.length}
      onExit={onExit}
      onSuccess={onComplete}
      accentColor="bg-sky-500"
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
            <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-center font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">
                Your prediction:
              </p>
              {(['solid', 'liquid', 'gas'] as State[]).map(s => {
                const sl = STATE_LABELS[s];
                return (
                  <button
                    key={s}
                    onClick={() => predict(s)}
                    className={cn(
                      'w-full py-3.5 text-white font-display font-black text-lg rounded-3xl btn-press',
                      'flex items-center justify-center gap-3',
                      sl.bg, sl.shadow
                    )}
                  >
                    {sl.emoji} {sl.label}
                  </button>
                );
              })}

              <button
                onClick={() => setShowHint(s => !s)}
                className="flex items-center gap-2 mx-auto text-amber-500 text-sm font-bold mt-2"
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
                    className="text-center text-amber-700 text-sm bg-amber-50 rounded-2xl p-3 border border-amber-200"
                  >
                    💡 {current.hint}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className={cn(
                'p-4 rounded-2xl font-bold text-sm leading-snug',
                answers.at(-1)?.correct ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'
              )}>
                <p className="text-base font-black mb-1">
                  {answers.at(-1)?.correct ? '✅ Correct! ' : '💡 Not quite — '}
                  {current.label} is a <strong>{STATE_LABELS[current.state].emoji} {current.state.toUpperCase()}</strong>
                </p>
                <p className="opacity-90">{current.explanation}</p>
              </div>
              <button
                onClick={nextRound}
                className="w-full py-4 bg-sky-500 shadow-[0_6px_0_#0284C7]
                           text-white font-display font-black text-xl rounded-3xl btn-press"
              >
                {round + 1 < QUIZ_OBJECTS.length ? 'Next →' : 'See my score!'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ActivityWrapper>
  );
}
