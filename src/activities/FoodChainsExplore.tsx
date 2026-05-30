// Activity: Food Chains — EXPLORE (Band B)
// 5E: explore    Kind: sequence game
// Tap cards in the order you think the food chain goes — then see the correct chain.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ActivityWrapper from '../components/ActivityWrapper';

interface ChainCard { id: string; emoji: string; label: string; role: string; }

const CHAIN_CARDS: ChainCard[] = [
  { id: 'sun',     emoji: '☀️', label: 'Sun',      role: 'Energy source' },
  { id: 'grass',   emoji: '🌿', label: 'Grass',    role: 'Producer'      },
  { id: 'rabbit',  emoji: '🐇', label: 'Rabbit',   role: 'Herbivore'     },
  { id: 'fox',     emoji: '🦊', label: 'Fox',      role: 'Carnivore'     },
];

// Shuffle once (not truly random — just reorder from canonical)
const SHUFFLED: ChainCard[] = [CHAIN_CARDS[2], CHAIN_CARDS[0], CHAIN_CARDS[3], CHAIN_CARDS[1]];

interface Props { onComplete: () => void; onExit: () => void; }

export default function FoodChainsExplore({ onComplete, onExit }: Props) {
  const [sequence, setSequence] = useState<ChainCard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const remaining = SHUFFLED.filter(c => !sequence.find(s => s.id === c.id));
  const allPlaced = sequence.length === CHAIN_CARDS.length;

  function place(card: ChainCard) {
    setSequence(prev => [...prev, card]);
  }

  function reset() {
    setSequence([]);
    setShowAnswer(false);
  }

  return (
    <ActivityWrapper
      title="Build a Food Chain"
      voicePrompt={allPlaced ? 'Great! Now see how the real food chain works and how energy flows from the sun all the way to the fox.' : 'Tap the cards in the order you think the food chain goes — who eats who?'}
      onExit={onExit}
      onSuccess={onComplete}
      currentRound={sequence.length}
      totalRounds={CHAIN_CARDS.length}
      accentColor="bg-green-500"
    >
      <div className="w-full max-w-sm mx-auto">

        {/* ── Cards to place ─────────────────────────────────────────────── */}
        {!allPlaced && (
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {remaining.map(card => (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.88 }}
                onClick={() => place(card)}
                className="flex flex-col items-center gap-1 p-3 bg-white rounded-2xl shadow-md border-2 border-gray-100 hover:border-green-300 active:scale-95 transition-all"
              >
                <span className="text-4xl">{card.emoji}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{card.label}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* ── Your sequence ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-3 mb-4 min-h-[4rem]">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Your chain:</p>
          <div className="flex items-center flex-wrap gap-1">
            {sequence.map((card, i) => (
              <React.Fragment key={card.id}>
                {i > 0 && <span className="text-green-400 font-black text-xl">→</span>}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                  className="flex flex-col items-center">
                  <span className="text-3xl">{card.emoji}</span>
                  <span className="text-[8px] font-black text-gray-500">{card.label}</span>
                </motion.div>
              </React.Fragment>
            ))}
            {sequence.length === 0 && <p className="text-gray-300 text-sm font-bold">Tap a card to start!</p>}
          </div>
        </div>

        {/* ── After all placed: reveal correct chain ─────────────────────── */}
        <AnimatePresence>
          {allPlaced && !showAnswer && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowAnswer(true)}
              className="w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-xl rounded-3xl btn-press mb-3"
            >
              Show me the real chain! →
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Correct chain reveal ──────────────────────────────────────── */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-3">✅ The real food chain:</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {CHAIN_CARDS.map((card, i) => (
                    <React.Fragment key={card.id}>
                      {i > 0 && <span className="text-green-500 font-black text-xl">→</span>}
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">{card.emoji}</span>
                        <span className="text-[8px] font-black text-green-700">{card.label}</span>
                        <span className="text-[7px] text-green-500">{card.role}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs text-green-700 font-bold mt-3 text-center">
                  Energy flows from the sun → through each living thing ☀️
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={reset} className="flex-1 py-3 bg-white border-2 border-green-300 text-green-600 font-display font-black text-base rounded-2xl btn-press">
                  Try again 🔄
                </button>
                <button onClick={onComplete} className="flex-1 py-3 bg-green-500 shadow-[0_4px_0_#16A34A] text-white font-display font-black text-base rounded-2xl btn-press">
                  I get it! →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ActivityWrapper>
  );
}
