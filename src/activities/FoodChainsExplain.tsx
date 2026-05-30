// Activity: Food Chains — EXPLAIN (Band B)
// 5E: explain    3 slides: producers → herbivores → carnivores + energy direction

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import ActivityWrapper from '../components/ActivityWrapper';

const SLIDES = [
  {
    id: 1,
    heading: 'Producers — Plants make food ☀️',
    body: 'Plants are called PRODUCERS because they produce (make) their own food using sunlight. They are always at the start of a food chain. Without plants, no animals could survive.',
    voicePrompt: 'Plants are called producers because they make their own food from sunlight. They are always at the start of a food chain. Without plants, no animals could survive.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="flex items-center gap-2">
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">☀️</motion.span>
          <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl text-amber-400">→</motion.span>
          <span className="text-5xl">🌿</span>
        </div>
        <div className="bg-green-100 rounded-2xl px-4 py-2 border-2 border-green-200 text-center">
          <p className="text-xs font-black text-green-700 uppercase">🌿 PRODUCER</p>
          <p className="text-xs text-green-600">Makes its own food from sunlight</p>
        </div>
        <p className="text-xs font-bold text-gray-500 text-center">Examples: grass, trees, seaweed, corn, flowers</p>
      </div>
    ),
  },
  {
    id: 2,
    heading: 'Herbivores — Plant eaters 🐇',
    body: 'Animals that eat ONLY plants are called HERBIVORES. They are the second link in the food chain. When a rabbit eats grass, the energy stored in the grass moves into the rabbit.',
    voicePrompt: 'Animals that eat only plants are called herbivores. They are the second link in a food chain. The energy from the plant passes into the herbivore when it is eaten.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="flex items-center gap-2">
          <span className="text-4xl">🌿</span>
          <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl text-green-400">→</motion.span>
          <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="text-5xl">🐇</motion.span>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="bg-green-50 rounded-xl p-2 text-center border border-green-200">
            <p className="text-xs font-black text-green-700">HERBIVORES</p>
            <p className="text-xs text-green-600">eat only plants</p>
            <div className="flex justify-center gap-1 mt-1">
              {['🐇','🐄','🦒','🐘'].map(e => <span key={e} className="text-lg">{e}</span>)}
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-2 text-center border border-amber-200">
            <p className="text-xs font-black text-amber-700">Energy flows →</p>
            <p className="text-xs text-amber-600">Sun → Plant → Animal</p>
            <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-2xl mt-1">⚡</motion.div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    heading: 'Carnivores — Animal eaters 🦊',
    body: 'Animals that eat other animals are called CARNIVORES. They sit at the top of the food chain. Energy flows in ONE direction — Sun → Plant → Herbivore → Carnivore. It never goes backwards!',
    voicePrompt: 'Carnivores eat other animals. They are at the top of the food chain. Energy always flows in one direction — from the sun through plants to herbivores to carnivores. It never flows backwards.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="flex items-center gap-1">
          {[
            { emoji: '☀️', label: 'Sun' },
            { emoji: '🌿', label: 'Plant' },
            { emoji: '🐇', label: 'Rabbit' },
            { emoji: '🦊', label: 'Fox' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} className="text-lg text-green-400 font-black">→</motion.span>}
              <div className="flex flex-col items-center">
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-[8px] font-black text-gray-500 uppercase">{item.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="bg-green-50 rounded-2xl px-4 py-2 border-2 border-green-200 text-center w-full">
          <p className="text-xs font-black text-green-700">⚡ Energy direction: ONE WAY only →</p>
          <p className="text-xs text-green-600">A fox cannot give energy back to the grass!</p>
        </div>
        <div className="flex gap-2 text-center">
          <div className="bg-orange-50 rounded-xl p-2 border border-orange-200 flex-1">
            <p className="text-xs font-black text-orange-700">CARNIVORES</p>
            <div className="flex justify-center gap-1">
              {['🦊','🦁','🐺','🦅'].map(e => <span key={e} className="text-lg">{e}</span>)}
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-2 border border-purple-200 flex-1">
            <p className="text-xs font-black text-purple-700">OMNIVORES</p>
            <div className="flex justify-center gap-1">
              {['🐻','🐖','🐒','👤'].map(e => <span key={e} className="text-lg">{e}</span>)}
            </div>
            <p className="text-[8px] text-purple-600">eat both!</p>
          </div>
        </div>
      </div>
    ),
  },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function FoodChainsExplain({ onComplete, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;
  return (
    <ActivityWrapper title="How Food Chains Work" voicePrompt={slide.voicePrompt} currentRound={idx + 1} totalRounds={SLIDES.length} onExit={onExit} onSuccess={onComplete} accentColor="bg-green-500">
      <div className="w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={slide.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100">
            <h3 className="font-display font-black text-xl text-gray-800 mb-3 text-center">{slide.heading}</h3>
            <div className="mb-4">{slide.visual}</div>
            <p className="text-gray-600 text-sm leading-relaxed text-center">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
        <motion.button key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => isLast ? onComplete() : setIdx(i => i + 1)}
          className="mt-6 w-full py-4 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-xl rounded-3xl flex items-center justify-center gap-2 btn-press">
          {isLast ? 'Test what I know!' : 'Next'}<ChevronRight size={22} />
        </motion.button>
      </div>
    </ActivityWrapper>
  );
}
