// Activity: Living vs Non-Living — EXPLAIN (Band B)
// 5E Stage: explain | Kind: story | Generator: narratedDiagram
//
// Three concept slides: GROW → FEED → REPRODUCE.
// Ends with the "fire challenge" to prime the evaluate activity.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Slides ────────────────────────────────────────────────────────────────────

interface Slide {
  id: number;
  heading: string;
  body: string;
  voicePrompt: string;
  visual: React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    heading: 'Living things GROW 🌱',
    body: 'All living things start small and grow bigger over time. A tiny seed becomes a giant tree. A baby becomes an adult.',
    voicePrompt: 'All living things grow. A tiny seed becomes a huge tree. A baby becomes an adult. Growth is one sign of life.',
    visual: (
      <div className="flex items-end justify-center gap-4 py-4">
        {[
          { emoji: '🌱', label: 'Seed',    size: 'text-3xl' },
          { emoji: '🌿', label: 'Seedling', size: 'text-4xl' },
          { emoji: '🌳', label: 'Tree',     size: 'text-6xl' },
        ].map((stage, i) => (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <span className={stage.size}>{stage.emoji}</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">
              {stage.label}
            </span>
          </motion.div>
        ))}
        <div className="flex flex-col items-center justify-end mb-3">
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-2xl text-gray-400"
          >
            →
          </motion.span>
        </div>
      </div>
    ),
  },

  {
    id: 2,
    heading: 'Living things FEED 💧',
    body: 'Animals eat food. Plants make their own food using sunlight and water. All living things need energy to survive.',
    voicePrompt: 'Living things need energy. Animals eat food. Plants use sunlight and water to make their own food. All living things must feed to survive.',
    visual: (
      <div className="grid grid-cols-2 gap-4 py-3">
        {/* Plant feeding */}
        <div className="bg-emerald-50 rounded-2xl p-3 text-center">
          <div className="flex justify-center items-center gap-1 mb-2">
            <span className="text-3xl">☀️</span>
            <span className="text-xl font-black text-gray-400">+</span>
            <span className="text-3xl">💧</span>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-1"
          >
            🌿
          </motion.div>
          <p className="text-[9px] font-black text-emerald-600 uppercase">Plants make food</p>
        </div>
        {/* Animal feeding */}
        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <div className="flex justify-center items-center gap-1 mb-2">
            <span className="text-3xl">🍖</span>
            <span className="text-xl font-black text-gray-400">→</span>
            <span className="text-3xl">⚡</span>
          </div>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
            className="text-4xl mb-1"
          >
            🐕
          </motion.div>
          <p className="text-[9px] font-black text-amber-600 uppercase">Animals eat food</p>
        </div>
      </div>
    ),
  },

  {
    id: 3,
    heading: 'Living things MAKE BABIES 🐣',
    body: 'Every living thing can reproduce — make more of its own kind. Dogs have puppies. Flowers make seeds. Fish lay eggs.',
    voicePrompt: 'Every living thing can reproduce — make more of its kind. Dogs have puppies. Flowers make seeds. Now here is the tricky question: a fire grows and eats fuel. But can a fire make baby fires on its own? No! Fire is NOT alive.',
    visual: (
      <div className="space-y-3 py-2">
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">🐕</span>
          <span className="text-2xl">→</span>
          <div className="flex gap-1">
            <span className="text-3xl">🐕</span>
            <span className="text-3xl">🐕</span>
          </div>
          <span className="text-[9px] font-bold text-gray-400">puppies</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">🌸</span>
          <span className="text-2xl">→</span>
          <div className="flex gap-1">
            <span className="text-3xl">🌸</span>
            <span className="text-3xl">🌸</span>
          </div>
          <span className="text-[9px] font-bold text-gray-400">seeds</span>
        </div>
        {/* The fire challenge */}
        <div className="mt-3 p-3 bg-orange-50 rounded-2xl border-2 border-orange-200 text-center">
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">
            🔥 Think about this!
          </p>
          <p className="text-sm font-bold text-gray-700">
            Fire grows and eats fuel... but can it make baby fires? <span className="text-orange-600">No!</span>
          </p>
        </div>
      </div>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
  onExit: () => void;
}

export default function LivingNonLivingExplain({ onComplete, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  function next() {
    if (isLast) {
      onComplete();
    } else {
      setIdx(i => i + 1);
    }
  }

  return (
    <ActivityWrapper
      title="What Makes Something Alive?"
      voicePrompt={slide.voicePrompt}
      currentRound={idx + 1}
      totalRounds={SLIDES.length}
      onExit={onExit}
      onSuccess={onComplete}
      accentColor="bg-emerald-500"
    >
      <div className="w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100"
          >
            <h3 className="font-display font-black text-xl text-gray-800 mb-4 text-center">
              {slide.heading}
            </h3>
            <div className="mb-5">{slide.visual}</div>
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={next}
          className="mt-6 w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669]
                     text-white font-display font-black text-xl rounded-3xl
                     flex items-center justify-center gap-2 btn-press"
        >
          {isLast ? 'Test me on the tricky ones!' : 'Next'}
          <ChevronRight size={22} />
        </motion.button>
      </div>
    </ActivityWrapper>
  );
}
