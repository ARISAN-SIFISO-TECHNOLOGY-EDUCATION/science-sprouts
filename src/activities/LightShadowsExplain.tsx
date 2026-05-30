// Activity: Light & Shadows — EXPLAIN (Band B)
// 5E: explain    3 slides: light travels straight → shadows form → size changes

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import ActivityWrapper from '../components/ActivityWrapper';

const SLIDES = [
  {
    id: 1,
    heading: 'Light travels in straight lines 💡',
    body: 'Light always moves in perfectly straight lines from its source. It cannot bend around corners. That is why you can\'t see around a wall — light can\'t follow you!',
    voicePrompt: 'Light always travels in straight lines. It cannot bend around corners. This is why we cannot see around walls and why shadows have sharp edges.',
    visual: (
      <div className="py-4 space-y-3">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-4xl">☀️</span>
          {[1,2,3,4,5].map(i => (
            <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
              className="w-6 h-0.5 bg-yellow-400 rounded" />
          ))}
          <span className="text-3xl">🌳</span>
        </div>
        <p className="text-center text-xs font-bold text-amber-600">Light rays travel in straight lines →</p>
        <div className="flex items-center gap-2 justify-center">
          <span className="text-4xl">☀️</span>
          {[1,2,3].map(i => (
            <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
              className="w-6 h-0.5 bg-yellow-400 rounded" />
          ))}
          <span className="text-3xl">🧱</span>
          <div className="w-12 h-8 bg-gray-800/20 rounded" />
          <p className="text-xs font-black text-gray-400">dark!</p>
        </div>
        <p className="text-center text-xs font-bold text-gray-500">Wall blocks light → shadow behind</p>
      </div>
    ),
  },
  {
    id: 2,
    heading: 'Objects block light → shadow 🌑',
    body: 'When an object gets in the way of light, it blocks the straight-travelling rays. The area behind the object gets no light — that dark area is the shadow.',
    voicePrompt: 'When an object blocks light, the area behind it receives no light. That dark area is a shadow. The shadow is always on the opposite side from the light source.',
    visual: (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="relative w-full h-36 bg-amber-50 rounded-2xl border-2 border-amber-200 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 15% 50%, #FDE68A 0%, transparent 60%)' }} />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-3xl">🔦</span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl z-10">🏠</span>
          <div className="absolute top-1/2 -translate-y-1/2 bg-gray-800/25 rounded-r-2xl" style={{ left: '54%', width: 80, height: 32 }} />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500">shadow →</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className="bg-yellow-100 rounded-xl p-2"><span className="text-xl">🔦</span><p className="text-yellow-700">Light source</p></div>
          <div className="bg-gray-100 rounded-xl p-2"><span className="text-xl">🏠</span><p className="text-gray-600">Object blocks</p></div>
          <div className="bg-gray-800/10 rounded-xl p-2"><span className="text-xl">🌑</span><p className="text-gray-500">Shadow forms</p></div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    heading: 'Shadow size changes 📏',
    body: 'Move the light source close → shadow gets BIGGER. Move it far → shadow gets SMALLER. Sun is low in the morning → long shadows. Sun is high at midday → short shadows.',
    voicePrompt: 'Shadow size changes depending on where the light is. Light close to an object makes a big shadow. Light far away makes a small shadow. The sun is closest to the horizon in the morning and evening, making long shadows.',
    visual: (
      <div className="grid grid-cols-2 gap-3 py-3">
        <div className="bg-amber-50 rounded-2xl p-3 text-center border-2 border-amber-200">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-2xl">🔦</span>
            <span className="text-sm font-black text-amber-600">CLOSE</span>
          </div>
          <span className="text-3xl">🎁</span>
          <div className="w-full h-4 bg-amber-900/20 rounded-full mt-1" style={{ width: '90%', margin: '4px auto' }} />
          <p className="text-[9px] font-black text-amber-700 mt-1">BIG shadow</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-3 text-center border-2 border-amber-200">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-sm font-black text-amber-600">FAR</span>
            <span className="text-2xl">🔦</span>
          </div>
          <span className="text-3xl">🎁</span>
          <div className="bg-amber-900/20 rounded-full mt-1" style={{ width: '40%', height: 10, margin: '4px auto' }} />
          <p className="text-[9px] font-black text-amber-700 mt-1">small shadow</p>
        </div>
      </div>
    ),
  },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function LightShadowsExplain({ onComplete, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;
  return (
    <ActivityWrapper title="Why Shadows Form" voicePrompt={slide.voicePrompt} currentRound={idx + 1} totalRounds={SLIDES.length} onExit={onExit} onSuccess={onComplete} accentColor="bg-amber-400">
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
          className="mt-6 w-full py-4 bg-amber-400 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl flex items-center justify-center gap-2 btn-press">
          {isLast ? 'Test what I know!' : 'Next'}<ChevronRight size={22} />
        </motion.button>
      </div>
    </ActivityWrapper>
  );
}
