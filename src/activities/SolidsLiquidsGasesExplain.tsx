// Activity: Solids, Liquids & Gases — EXPLAIN (Band B)
// 5E Stage: explain | Kind: story | Generator: narratedDiagram
//
// Three slides — one per state of matter.
// Particle diagrams show WHY each state behaves differently.

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

/** Animated particle grid */
function ParticleGrid({
  count,
  spacing,
  wobble,
  color,
}: {
  count: number;
  spacing: number;
  wobble: number;
  color: string;
}) {
  const cols = Math.ceil(Math.sqrt(count));
  const dots = Array.from({ length: count });
  return (
    <div
      className="flex flex-wrap justify-center items-center gap-0"
      style={{ width: cols * spacing, margin: '0 auto' }}
    >
      {dots.map((_, i) => (
        <motion.div
          key={i}
          animate={wobble > 0
            ? { x: [0, wobble * (Math.random() > 0.5 ? 1 : -1), 0],
                y: [0, wobble * (Math.random() > 0.5 ? 1 : -1), 0] }
            : {}
          }
          transition={{ duration: 0.8 + Math.random() * 0.6, repeat: Infinity, delay: i * 0.05 }}
          className={`rounded-full ${color}`}
          style={{ width: 14, height: 14, margin: (spacing - 14) / 2 }}
        />
      ))}
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    id: 1,
    heading: 'SOLID — Particles locked tight 🧊',
    body: 'In a solid, tiny particles are packed closely together and barely move. That\'s why solids keep their shape — the particles are held in place.',
    voicePrompt: 'In a solid, tiny particles are packed tightly together and can only vibrate a little. That is why solids keep their shape. Ice, rock, and wood are solids.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 w-48">
          <ParticleGrid count={16} spacing={28} wobble={1} color="bg-sky-400" />
        </div>
        <div className="flex gap-4 text-xs font-bold text-center">
          <div className="text-sky-600">
            <div className="text-2xl mb-1">🧊</div>
            <div>Ice</div>
          </div>
          <div className="text-sky-600">
            <div className="text-2xl mb-1">🪨</div>
            <div>Rock</div>
          </div>
          <div className="text-sky-600">
            <div className="text-2xl mb-1">🪵</div>
            <div>Wood</div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 2,
    heading: 'LIQUID — Particles flowing freely 💧',
    body: 'In a liquid, particles are still close together but can slide past each other. That\'s why liquids flow and take the shape of any container you pour them into.',
    voicePrompt: 'In a liquid, particles are close together but can slide past each other. That is why liquids flow and change shape. Water, juice, and milk are liquids.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 w-48">
          <ParticleGrid count={16} spacing={28} wobble={4} color="bg-blue-400" />
        </div>
        <div className="flex gap-4 text-xs font-bold text-center">
          <div className="text-blue-600">
            <div className="text-2xl mb-1">💧</div>
            <div>Water</div>
          </div>
          <div className="text-blue-600">
            <div className="text-2xl mb-1">🥛</div>
            <div>Milk</div>
          </div>
          <div className="text-blue-600">
            <div className="text-2xl mb-1">🧃</div>
            <div>Juice</div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: 3,
    heading: 'GAS — Particles zooming around 💨',
    body: 'In a gas, particles are far apart and move very fast in all directions. Gases fill any space completely — that\'s why air fills an entire room.',
    voicePrompt: 'In a gas, particles are far apart and move very fast. Gases spread out to fill all available space. The air you breathe is made of gases — oxygen and other gases mixed together.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-4 w-48 h-28 relative overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-violet-400"
              animate={{
                x: [Math.random() * 120, Math.random() * 120, Math.random() * 120],
                y: [Math.random() * 60, Math.random() * 60, Math.random() * 60],
              }}
              transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <div className="flex gap-4 text-xs font-bold text-center">
          <div className="text-violet-600">
            <div className="text-2xl mb-1">♨️</div>
            <div>Steam</div>
          </div>
          <div className="text-violet-600">
            <div className="text-2xl mb-1">💨</div>
            <div>Air</div>
          </div>
          <div className="text-violet-600">
            <div className="text-2xl mb-1">🌬️</div>
            <div>Wind</div>
          </div>
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

export default function SolidsLiquidsGasesExplain({ onComplete, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const slide  = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  return (
    <ActivityWrapper
      title="Why States Are Different"
      voicePrompt={slide.voicePrompt}
      currentRound={idx + 1}
      totalRounds={SLIDES.length}
      onExit={onExit}
      onSuccess={onComplete}
      accentColor="bg-sky-500"
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
            <h3 className="font-display font-black text-lg text-gray-800 mb-3 text-center">
              {slide.heading}
            </h3>
            <div className="mb-4">{slide.visual}</div>
            <p className="text-gray-600 text-sm leading-relaxed text-center">{slide.body}</p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => isLast ? onComplete() : setIdx(i => i + 1)}
          className="mt-6 w-full py-4 bg-sky-500 shadow-[0_6px_0_#0284C7]
                     text-white font-display font-black text-xl rounded-3xl
                     flex items-center justify-center gap-2 btn-press"
        >
          {isLast ? 'Now test the tricky ones!' : 'Next'}
          <ChevronRight size={22} />
        </motion.button>
      </div>
    </ActivityWrapper>
  );
}
