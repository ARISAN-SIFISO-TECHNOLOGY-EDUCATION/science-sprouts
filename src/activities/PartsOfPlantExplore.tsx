// Activity: Parts of a Plant — EXPLORE (Band B)
// 5E: explore    Kind: game    Generator: tapToReveal
// Tap each part of the plant to discover its name and what it does.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ActivityWrapper from '../components/ActivityWrapper';

interface PlantPart {
  id: string;
  emoji: string;
  name: string;
  fact: string;
  color: string;
  bg: string;
}

const PARTS: PlantPart[] = [
  { id: 'flower', emoji: '🌸', name: 'Flower',  fact: 'Flowers make SEEDS. Each seed can grow into a brand new plant!',                       color: 'text-pink-700',    bg: 'bg-pink-50 border-pink-200'    },
  { id: 'leaf',   emoji: '🍃', name: 'Leaf',    fact: 'Leaves are food factories! They catch sunlight and turn it into food for the plant.',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { id: 'stem',   emoji: '🌿', name: 'Stem',    fact: 'The stem is a water highway! It carries water and food between roots and leaves.',     color: 'text-green-700',   bg: 'bg-green-50 border-green-200'  },
  { id: 'root',   emoji: '🌱', name: 'Root',    fact: 'Roots are underground anchors and water drinkers. They hold the plant firmly in soil.', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200'  },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function PartsOfPlantExplore({ onComplete, onExit }: Props) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [lastTapped, setLastTapped] = useState<string | null>(null);
  const allRevealed = revealed.size === PARTS.length;

  function tap(id: string) {
    setRevealed(prev => new Set([...prev, id]));
    setLastTapped(id);
  }

  const lastPart = PARTS.find(p => p.id === lastTapped);

  return (
    <ActivityWrapper
      title="Parts of a Plant"
      voicePrompt="Tap each part of the plant to find out what it does!"
      onExit={onExit}
      onSuccess={onComplete}
      currentRound={revealed.size}
      totalRounds={PARTS.length}
      accentColor="bg-emerald-500"
    >
      <div className="w-full max-w-sm mx-auto">

        {/* ── Plant diagram ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-4">
          {PARTS.map((part, i) => {
            const isDone = revealed.has(part.id);
            return (
              <React.Fragment key={part.id}>
                {/* Soil line before roots */}
                {i === 3 && (
                  <div className="w-full flex items-center gap-2 my-1">
                    <div className="flex-1 border-t-2 border-dashed border-amber-300" />
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">soil</span>
                    <div className="flex-1 border-t-2 border-dashed border-amber-300" />
                  </div>
                )}
                {/* Stem line between parts */}
                {i > 0 && i < 3 && (
                  <div className="w-2 h-4 bg-green-400 rounded-full" />
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => tap(part.id)}
                  className={`w-full p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                    isDone ? part.bg : 'bg-white border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-4xl">{part.emoji}</span>
                  <div className="flex-1">
                    {isDone ? (
                      <>
                        <p className={`font-display font-black text-lg ${part.color}`}>{part.name}</p>
                        <p className="text-xs text-gray-600 leading-snug">{part.fact}</p>
                      </>
                    ) : (
                      <p className="font-black text-gray-400 text-lg">Tap to discover ✨</p>
                    )}
                  </div>
                  {isDone && <span className="text-emerald-500 font-black text-lg flex-shrink-0">✓</span>}
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Fact highlight ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {lastPart && revealed.has(lastPart.id) && !allRevealed && (
            <motion.div
              key={lastPart.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-2xl border-2 text-center text-sm font-bold ${lastPart.bg} ${lastPart.color}`}
            >
              {lastPart.emoji} {lastPart.fact}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Completion ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {allRevealed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onComplete}
              className="mt-4 w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-xl rounded-3xl btn-press"
            >
              I know all the parts! →
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </ActivityWrapper>
  );
}
