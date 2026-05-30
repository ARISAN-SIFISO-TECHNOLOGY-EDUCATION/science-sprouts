// Activity: Solids, Liquids & Gases — EXPLORE (Band B)
// 5E Stage: explore | Kind: game | Generator: sortThreeStates
//
// Learner taps objects to sort them into SOLID / LIQUID / GAS zones.
// Answer revealed immediately — experience before understanding.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Object data ───────────────────────────────────────────────────────────────

type State = 'solid' | 'liquid' | 'gas';

interface MatterObject {
  id: string;
  emoji: string;
  label: string;
  state: State;
  fact: string;
}

const OBJECTS: MatterObject[] = [
  { id: 'ice',    emoji: '🧊', label: 'Ice',       state: 'solid',  fact: 'Ice is solid water — its particles are locked tightly together.' },
  { id: 'juice',  emoji: '🧃', label: 'Juice',     state: 'liquid', fact: 'Juice is a liquid — it flows and takes the shape of its container.' },
  { id: 'steam',  emoji: '♨️', label: 'Steam',     state: 'gas',    fact: 'Steam is water as a gas — particles spread out and fill the air.' },
  { id: 'rock',   emoji: '🪨', label: 'Rock',      state: 'solid',  fact: 'Rocks are solid — their particles are packed tight and barely move.' },
  { id: 'milk',   emoji: '🥛', label: 'Milk',      state: 'liquid', fact: 'Milk is a liquid — it pours and spreads to fill its container.' },
  { id: 'oxygen', emoji: '💨', label: 'Oxygen',    state: 'gas',    fact: 'The air we breathe is a gas — particles zoom around freely.' },
  { id: 'wood',   emoji: '🪵', label: 'Wood',      state: 'solid',  fact: 'Wood is solid — it keeps its shape and doesn\'t flow.' },
  { id: 'water',  emoji: '💧', label: 'Water',     state: 'liquid', fact: 'Water is the most common liquid on Earth — it flows downhill and fills any shape.' },
];

const ZONE_LABELS: Record<State, { label: string; emoji: string; bg: string; border: string; text: string }> = {
  solid:  { label: 'SOLID',  emoji: '🧊', bg: 'bg-sky-50',    border: 'border-sky-200',   text: 'text-sky-700'   },
  liquid: { label: 'LIQUID', emoji: '💧', bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-700'  },
  gas:    { label: 'GAS',    emoji: '💨', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700'},
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export default function SolidsLiquidsGasesExplore({ onComplete, onExit }: Props) {
  const [sorted, setSorted]   = useState<Record<string, State>>({});
  const [feedback, setFeedback] = useState<{ id: string; state: State; fact: string } | null>(null);
  const [done, setDone]       = useState(false);

  const remaining = OBJECTS.filter(o => !(o.id in sorted));

  function sort(obj: MatterObject) {
    setSorted(prev => ({ ...prev, [obj.id]: obj.state }));
    setFeedback({ id: obj.id, state: obj.state, fact: obj.fact });
    setTimeout(() => setFeedback(null), 2400);
    if (Object.keys(sorted).length + 1 >= OBJECTS.length) {
      setTimeout(() => setDone(true), 2800);
    }
  }

  const byState = (s: State) => OBJECTS.filter(o => sorted[o.id] === s);

  return (
    <ActivityWrapper
      title="Solid, Liquid or Gas?"
      voicePrompt="Tap each object — is it a solid, liquid, or gas?"
      onExit={onExit}
      onSuccess={onComplete}
      currentRound={Object.keys(sorted).length}
      totalRounds={OBJECTS.length}
      accentColor="bg-sky-500"
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
                           shadow-md border-2 border-gray-100 hover:border-sky-300
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

        {/* ── Three sorting zones ───────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 min-h-[5rem]">
          {(['solid', 'liquid', 'gas'] as State[]).map(s => {
            const z = ZONE_LABELS[s];
            const items = byState(s);
            return (
              <div key={s} className={cn('rounded-2xl p-2 border-2', z.bg, z.border)}>
                <p className={cn('text-[8px] font-black uppercase tracking-wider mb-1.5', z.text)}>
                  {z.emoji} {z.label}
                </p>
                <div className="flex flex-wrap gap-1">
                  {items.map(o => (
                    <motion.span
                      key={o.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="text-xl"
                    >
                      {o.emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(sorted).length === 0 && (
          <p className="text-center text-gray-400 text-sm font-bold mt-3">
            Tap an object above to sort it!
          </p>
        )}

        {/* ── Feedback toast ────────────────────────────────────────────── */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'mt-4 p-3 rounded-2xl text-center text-sm font-bold',
                feedback.state === 'solid'  ? 'bg-sky-100 text-sky-700'
                : feedback.state === 'liquid' ? 'bg-blue-100 text-blue-700'
                :                               'bg-violet-100 text-violet-700'
              )}
            >
              {ZONE_LABELS[feedback.state].emoji} {feedback.state.toUpperCase()}! {feedback.fact}
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
              className="mt-6 w-full py-4 bg-sky-500 shadow-[0_6px_0_#0284C7]
                         text-white font-display font-black text-xl rounded-3xl btn-press"
            >
              Now find out WHY they're different! →
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </ActivityWrapper>
  );
}
