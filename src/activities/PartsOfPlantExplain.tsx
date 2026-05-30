// Activity: Parts of a Plant — EXPLAIN (Band B)
// 5E: explain    Kind: story    3 slides: roots, leaves, flowers+seeds

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import ActivityWrapper from '../components/ActivityWrapper';

const SLIDES = [
  {
    id: 1,
    heading: 'Roots drink water 💧',
    body: 'Roots are hidden underground. They spread out in the soil and soak up water and minerals, then send it all the way up the stem to the leaves.',
    voicePrompt: 'Roots are underground. They spread through the soil and drink water. The water travels up the stem to feed the whole plant.',
    visual: (
      <div className="flex flex-col items-center py-4 gap-2">
        <div className="w-3 h-16 bg-green-400 rounded-full" />
        <div className="w-full h-0.5 bg-amber-300" />
        <div className="flex gap-3 text-3xl mt-1">
          {'🌱🌱🌱🌱🌱'.split('').map((e, i) => (
            <motion.span key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}>{e}</motion.span>
          ))}
        </div>
        <p className="text-xs font-black text-amber-600 uppercase tracking-wider mt-2">Roots in the soil</p>
        <div className="flex items-center gap-2 mt-1">
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl">💧</motion.span>
          <span className="text-xs font-bold text-blue-500">↑ Water travels up</span>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    heading: 'Leaves make food ☀️',
    body: 'Leaves are food factories! They catch sunlight through their wide flat shape. Using sunlight, water, and air, they make sugar — the plant\'s food. This is called PHOTOSYNTHESIS.',
    voicePrompt: 'Leaves are food factories. They use sunlight, water, and air to make sugar for the plant. This amazing process is called photosynthesis.',
    visual: (
      <div className="flex flex-col items-center py-3 gap-3">
        <div className="flex items-center gap-2">
          <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">☀️</motion.span>
          <span className="text-2xl text-amber-400 font-black">→</span>
          <span className="text-5xl">🍃</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 rounded-xl p-2">
            <div className="text-2xl">💧</div>
            <p className="text-[9px] font-black text-blue-600">Water</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-2">
            <div className="text-2xl">☀️</div>
            <p className="text-[9px] font-black text-amber-600">Sunlight</p>
          </div>
          <div className="bg-sky-50 rounded-xl p-2">
            <div className="text-2xl">💨</div>
            <p className="text-[9px] font-black text-sky-600">Air</p>
          </div>
        </div>
        <div className="text-2xl font-black text-gray-400">↓</div>
        <div className="bg-emerald-100 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl">🍬</span>
          <span className="text-xs font-black text-emerald-700">Sugar — plant food!</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    heading: 'Flowers make seeds 🌸',
    body: 'Flowers are the plant\'s way of making more plants! Bees visit flowers and carry pollen between them. This makes seeds. Seeds fall or blow away and grow into new plants.',
    voicePrompt: 'Flowers make seeds. Bees carry pollen from flower to flower, and this makes seeds form. Seeds can travel far and grow into brand new plants.',
    visual: (
      <div className="flex flex-col items-center py-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-5xl">🌸</span>
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-3xl">🐝</motion.span>
          <span className="text-5xl">🌸</span>
        </div>
        <span className="text-2xl text-gray-400 font-black">↓ seeds form</span>
        <div className="flex gap-3">
          {['🌱','🌱','🌱'].map((e, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.4 }} className="text-3xl">{e}</motion.span>
          ))}
        </div>
        <p className="text-xs font-bold text-emerald-600 text-center">New plants everywhere! 🎉</p>
      </div>
    ),
  },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function PartsOfPlantExplain({ onComplete, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  return (
    <ActivityWrapper title="What Each Part Does" voicePrompt={slide.voicePrompt} currentRound={idx + 1} totalRounds={SLIDES.length} onExit={onExit} onSuccess={onComplete} accentColor="bg-emerald-500">
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
          className="mt-6 w-full py-4 bg-emerald-500 shadow-[0_6px_0_#059669] text-white font-display font-black text-xl rounded-3xl flex items-center justify-center gap-2 btn-press">
          {isLast ? 'Test what I know!' : 'Next'}<ChevronRight size={22} />
        </motion.button>
      </div>
    </ActivityWrapper>
  );
}
