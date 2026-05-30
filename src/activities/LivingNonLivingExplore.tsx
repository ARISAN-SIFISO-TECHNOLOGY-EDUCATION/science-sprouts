// Activity: Living vs Non-Living — EXPLORE (Band B)
// 5E Stage: explore | Kind: game | Generator: sortLivingNonLiving
//
// Learner taps objects to sort them into LIVING / NOT LIVING zones.
// No judgement — the answer is revealed immediately. Experience first.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Object data ───────────────────────────────────────────────────────────────

interface SciObject {
  id: string;
  emoji: string;
  label: string;
  isLiving: boolean;
  fact: string;
}

const OBJECTS: SciObject[] = [
  { id: 'tree',      emoji: '🌳', label: 'Tree',      isLiving: true,  fact: 'Trees grow, drink water, and make seeds. Very alive!' },
  { id: 'rock',      emoji: '🪨', label: 'Rock',      isLiving: false, fact: 'Rocks never grow, eat, or reproduce. Not alive.' },
  { id: 'dog',       emoji: '🐕', label: 'Dog',       isLiving: true,  fact: 'Dogs breathe, eat, grow, and have puppies. Alive!' },
  { id: 'car',       emoji: '🚗', label: 'Car',       isLiving: false, fact: 'Cars need humans to make them move. Not alive.' },
  { id: 'flower',    emoji: '🌸', label: 'Flower',    isLiving: true,  fact: 'Flowers grow, use sunlight, and make seeds. Alive!' },
  { id: 'chair',     emoji: '🪑', label: 'Chair',     isLiving: false, fact: 'A chair was made from wood, but it cannot grow anymore. Not alive.' },
  { id: 'butterfly', emoji: '🦋', label: 'Butterfly', isLiving: true,  fact: 'Butterflies grow from caterpillars and lay eggs. Alive!' },
  { id: 'book',      emoji: '📚', label: 'Book',      isLiving: false, fact: 'Books are made from paper but cannot grow or feed. Not alive.' },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export default function LivingNonLivingExplore({ onComplete, onExit }: Props) {
  const [sorted, setSorted] = useState<Record<string, boolean>>({});  // id → isLiving
  const [feedback, setFeedback] = useState<{ id: string; isLiving: boolean; fact: string } | null>(null);
  const [done, setDone] = useState(false);

  const remaining = OBJECTS.filter(o => !(o.id in sorted));

  function sort(obj: SciObject) {
    setSorted(prev => ({ ...prev, [obj.id]: obj.isLiving }));
    setFeedback({ id: obj.id, isLiving: obj.isLiving, fact: obj.fact });
    setTimeout(() => setFeedback(null), 2400);

    if (Object.keys(sorted).length + 1 >= OBJECTS.length) {
      setTimeout(() => setDone(true), 2800);
    }
  }

  const livingItems    = OBJECTS.filter(o => sorted[o.id] === true);
  const notLivingItems = OBJECTS.filter(o => sorted[o.id] === false);

  return (
    <ActivityWrapper
      title="Living or Not?"
      voicePrompt="Tap each thing to find out — is it alive or not?"
      onExit={onExit}
      onSuccess={onComplete}
      currentRound={Object.keys(sorted).length}
      totalRounds={OBJECTS.length}
      accentColor="bg-emerald-500"
    >
      <div className="w-full max-w-sm mx-auto">

        {/* ── Objects to sort ───────────────────────────────────────────── */}
        {remaining.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-5">
            {remaining.map(obj => (
              <motion.button
                key={obj.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => sort(obj)}
                className="flex flex-col items-center gap-1 p-3 bg-white rounded-2xl
                           shadow-md border-2 border-gray-100 hover:border-emerald-300
                           transition-all active:scale-95"
              >
                <span className="text-4xl">{obj.emoji}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  {obj.label}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* ── Two sorting zones ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 min-h-[6rem]">
          {/* LIVING zone */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider mb-2">
              🌱 LIVING
            </p>
            <div className="flex flex-wrap gap-1.5">
              {livingItems.map(o => (
                <motion.span
                  key={o.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="text-2xl"
                >
                  {o.emoji}
                </motion.span>
              ))}
            </div>
          </div>

          {/* NOT LIVING zone */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-3">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-2">
              ⚙️ NOT LIVING
            </p>
            <div className="flex flex-wrap gap-1.5">
              {notLivingItems.map(o => (
                <motion.span
                  key={o.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="text-2xl"
                >
                  {o.emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Empty prompt */}
        {Object.keys(sorted).length === 0 && (
          <p className="text-center text-gray-400 text-sm font-bold mt-3">
            Tap an object above to sort it!
          </p>
        )}

        {/* ── Inline feedback toast ─────────────────────────────────────── */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'mt-4 p-3 rounded-2xl text-center text-sm font-bold',
                feedback.isLiving
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              {feedback.isLiving ? '🌱 LIVING! ' : '⚙️ NOT LIVING — '}
              {feedback.fact}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Completion CTA ────────────────────────────────────────────── */}
        <AnimatePresence>
          {done && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onComplete}
              className="mt-6 w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669]
                         text-white font-display font-black text-xl rounded-3xl btn-press"
            >
              Now find out WHAT makes something alive! →
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </ActivityWrapper>
  );
}
