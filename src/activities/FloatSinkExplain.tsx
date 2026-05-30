// Activity: Floating & Sinking — EXPLAIN (Band B)
// 5E Stage: explain | Kind: story | Generator: narratedDiagram
//
// Short concept explanation with a visual diagram — only introduced AFTER
// the learner has had the explore experience. Follows 5E model.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import ActivityWrapper from '../components/ActivityWrapper';

// ── Concept slides ────────────────────────────────────────────────────────────

interface Slide {
  id: number;
  heading: string;
  body: string;
  visual: React.ReactNode;
  voicePrompt: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    heading: 'Why do things float?',
    body: 'Water pushes UP on every object. We call this the UPTHRUST. If the upthrust is strong enough, the object floats!',
    voicePrompt: 'Water pushes up on every object. This push is called upthrust. If the upthrust is strong enough, the object floats!',
    visual: (
      <div className="relative w-48 h-36 mx-auto">
        {/* Water */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-blue-200 rounded-2xl" />
        {/* Boat */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-5xl">⛵</div>
        {/* Upthrust arrow */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-blue-500 font-black text-2xl"
        >
          ↑
        </motion.div>
        <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-600 whitespace-nowrap">
          UPTHRUST
        </p>
      </div>
    ),
  },
  {
    id: 2,
    heading: 'When does it sink?',
    body: 'If an object is very heavy for its size (we call this DENSE), gravity pulls it down harder than the water can push up.',
    voicePrompt: 'If an object is very heavy for its size — very dense — gravity pulls it down harder than the water can push up. It sinks!',
    visual: (
      <div className="relative w-48 h-36 mx-auto">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-blue-200 rounded-2xl" />
        {/* Stone sinking */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl"
        >
          🪨
        </motion.div>
        {/* Gravity arrow */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-2 left-1/2 -translate-x-1/2 text-gray-500 font-black text-2xl"
        >
          ↓
        </motion.div>
        <p className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-500 whitespace-nowrap">
          GRAVITY
        </p>
      </div>
    ),
  },
  {
    id: 3,
    heading: 'The orange trick 🍊',
    body: 'A whole orange floats — its peel has tiny air pockets. Peel it and it sinks! The peel was adding air and making it less dense.',
    voicePrompt: 'A whole orange floats because the peel has tiny air pockets inside. Peel it away, and the orange sinks! The peel was trapping air and making it less dense.',
    visual: (
      <div className="flex gap-8 justify-center items-end mt-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl">🍊</span>
          <div className="w-24 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
            <span className="text-xl">🍊</span>
          </div>
          <p className="text-[10px] font-black text-green-600">FLOATS ✓</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl opacity-50">🍊</span>
          <div className="w-24 h-10 bg-blue-200 rounded-xl overflow-hidden relative">
            <motion.span
              animate={{ y: [0, 28, 28] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="absolute left-1/2 -translate-x-1/2 text-xl"
            >
              🟠
            </motion.span>
          </div>
          <p className="text-[10px] font-black text-blue-600">SINKS ↓</p>
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

export default function FloatSinkExplain({ onComplete, onExit }: Props) {
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
      title="Why Things Float"
      voicePrompt={slide.voicePrompt}
      currentRound={idx + 1}
      totalRounds={SLIDES.length}
      onExit={onExit}
      onSuccess={onComplete}
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
            <h3 className="font-display font-black text-xl text-gray-800 mb-3 text-center">
              {slide.heading}
            </h3>

            {/* Diagram */}
            <div className="mb-5">{slide.visual}</div>

            {/* Explanation text */}
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={next}
          className="mt-6 w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A]
                     text-white font-display font-black text-xl rounded-3xl
                     flex items-center justify-center gap-2 btn-press"
        >
          {isLast ? 'Got it — let me try!' : 'Next'}
          <ChevronRight size={22} />
        </motion.button>
      </div>
    </ActivityWrapper>
  );
}
