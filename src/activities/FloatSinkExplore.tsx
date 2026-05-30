// Activity: Floating & Sinking — EXPLORE (Band B)
// 5E Stage: explore | Kind: game | Generator: floatSinkDrag
//
// Learner drags objects into a water tank and observes whether they float or
// sink. No explanation is given yet — experience before understanding.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Object data ───────────────────────────────────────────────────────────────

interface SciObject {
  id: string;
  emoji: string;
  label: string;
  floats: boolean;
  fact: string; // brief explanation shown AFTER the drop (not before)
}

const OBJECTS: SciObject[] = [
  { id: 'cork',           emoji: '🪵', label: 'Cork',           floats: true,  fact: 'Cork is very light for its size — it floats!' },
  { id: 'stone',          emoji: '🪨', label: 'Stone',          floats: false, fact: 'Stone is heavy and dense — it sinks.' },
  { id: 'leaf',           emoji: '🍃', label: 'Leaf',           floats: true,  fact: 'A leaf traps air underneath — it floats.' },
  { id: 'coin',           emoji: '🪙', label: 'Coin',           floats: false, fact: 'Metal coins are very dense — they sink.' },
  { id: 'plastic_bottle', emoji: '🧴', label: 'Plastic bottle', floats: true,  fact: 'An empty bottle has air inside — it floats.' },
  { id: 'apple',          emoji: '🍎', label: 'Apple',          floats: true,  fact: 'Apples have air pockets inside — they float!' },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export default function FloatSinkExplore({ onComplete, onExit }: Props) {
  const [dropped, setDropped] = useState<Record<string, boolean>>({}); // id → floats
  const [feedback, setFeedback] = useState<{ id: string; floats: boolean; fact: string } | null>(null);
  const [done, setDone] = useState(false);

  const remaining = OBJECTS.filter(o => !(o.id in dropped));

  function drop(obj: SciObject) {
    setDropped(prev => ({ ...prev, [obj.id]: obj.floats }));
    setFeedback({ id: obj.id, floats: obj.floats, fact: obj.fact });
    setTimeout(() => setFeedback(null), 2200);

    if (Object.keys(dropped).length + 1 >= OBJECTS.length) {
      setTimeout(() => setDone(true), 2600);
    }
  }

  const floaters = OBJECTS.filter(o => dropped[o.id] === true);
  const sinkers  = OBJECTS.filter(o => dropped[o.id] === false);

  return (
    <ActivityWrapper
      title="Float or Sink?"
      voicePrompt="Drop each object into the water. Does it float or sink?"
      onExit={onExit}
      onSuccess={onComplete}
      currentRound={Object.keys(dropped).length}
      totalRounds={OBJECTS.length}
    >
      {/* ── Objects to drop ───────────────────────────────────────────── */}
      <div className="w-full max-w-sm mx-auto">
        {remaining.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {remaining.map(obj => (
              <motion.button
                key={obj.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => drop(obj)}
                className="flex flex-col items-center gap-1 p-3 bg-white rounded-2xl
                           shadow-md border-2 border-gray-100 hover:border-green-300
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

        {/* ── Water tank ────────────────────────────────────────────── */}
        <div className="relative w-full h-48 bg-blue-100 rounded-3xl border-4 border-blue-200 overflow-hidden shadow-inner">
          {/* Water surface line */}
          <div className="absolute top-10 left-0 right-0 h-0.5 bg-blue-300/60" />

          {/* Floating zone label */}
          <p className="absolute top-2 left-3 text-[10px] font-black text-blue-400 uppercase tracking-widest">
            Floating
          </p>
          {/* Sinking zone label */}
          <p className="absolute bottom-2 left-3 text-[10px] font-black text-blue-300 uppercase tracking-widest">
            Sinking
          </p>

          {/* Floaters — near surface */}
          <div className="absolute top-12 w-full flex flex-wrap justify-center gap-2 px-3">
            {floaters.map(o => (
              <motion.span
                key={o.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl"
              >
                {o.emoji}
              </motion.span>
            ))}
          </div>

          {/* Sinkers — near bottom */}
          <div className="absolute bottom-8 w-full flex flex-wrap justify-center gap-2 px-3">
            {sinkers.map(o => (
              <motion.span
                key={o.id}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 10 }}
                className="text-2xl"
              >
                {o.emoji}
              </motion.span>
            ))}
          </div>

          {/* Empty prompt */}
          {Object.keys(dropped).length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center
                          text-blue-300 font-bold text-sm">
              Tap an object above to drop it in!
            </p>
          )}
        </div>

        {/* ── Inline feedback toast ─────────────────────────────────── */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'mt-4 p-3 rounded-2xl text-center text-sm font-bold',
                feedback.floats
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              )}
            >
              {feedback.floats ? '🎉 It floats! ' : '💦 It sinks! '}
              {feedback.fact}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Completion CTA ────────────────────────────────────────── */}
        <AnimatePresence>
          {done && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onComplete}
              className="mt-6 w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A]
                         text-white font-display font-black text-xl rounded-3xl
                         btn-press"
            >
              I'm ready to find out WHY! →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ActivityWrapper>
  );
}
