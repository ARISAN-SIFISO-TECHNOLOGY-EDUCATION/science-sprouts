// Activity: Light & Shadows — EXPLORE (Band B)
// 5E: explore    Kind: simulation    Tap through 4 scenes showing light + shadow.
// No prediction needed — pure observation of cause and effect.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import ActivityWrapper from '../components/ActivityWrapper';

interface Scene {
  id: number;
  label: string;
  description: string;
  voicePrompt: string;
  visual: React.ReactNode;
  observation: string;
}

// Shadow as a dark stretched oval, positioned relative to object + light direction.
function ShadowScene({ torchPos, shadowDir, shadowScale }: { torchPos: string; shadowDir: string; shadowScale: number }) {
  // torchPos: 'left' | 'right' | 'top' | 'top-left'
  // shadowDir: 'right' | 'left' | 'bottom' | 'bottom-right'
  const torchEmoji = '🔦';
  const objectEmoji = '🎁';

  const torchStyles: Record<string, string> = {
    left: 'absolute left-2 top-1/2 -translate-y-1/2',
    right: 'absolute right-2 top-1/2 -translate-y-1/2',
    top: 'absolute top-2 left-1/2 -translate-x-1/2',
    'top-left': 'absolute top-2 left-4',
  };

  const shadowStyles: Record<string, { className: string; style: React.CSSProperties }> = {
    right:        { className: 'absolute top-1/2 -translate-y-1/2 origin-left',   style: { left: '50%', width: 60 * shadowScale, height: 20 } },
    left:         { className: 'absolute top-1/2 -translate-y-1/2 origin-right',  style: { right: '50%', width: 60 * shadowScale, height: 20 } },
    bottom:       { className: 'absolute left-1/2 -translate-x-1/2 origin-top',   style: { top: '55%', width: 20, height: 60 * shadowScale } },
    'bottom-right': { className: 'absolute origin-top-left',                       style: { top: '55%', left: '52%', width: 50 * shadowScale, height: 14, transform: `rotate(25deg)` } },
  };

  const shadow = shadowStyles[shadowDir];

  return (
    <div className="relative w-full h-40 bg-amber-50 rounded-3xl border-2 border-amber-200 overflow-hidden">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-amber-100 rounded-b-3xl" />
      {/* Shadow */}
      <div className={`${shadow.className} bg-amber-900/20 rounded-full`} style={shadow.style} />
      {/* Object */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl z-10">{objectEmoji}</div>
      {/* Torch */}
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
        className={`${torchStyles[torchPos]} text-3xl z-10`}>{torchEmoji}</motion.div>
      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full bg-gradient-radial from-yellow-300 to-transparent" style={{ background: 'radial-gradient(circle at ' + (torchPos === 'left' ? '10% 50%' : torchPos === 'right' ? '90% 50%' : torchPos === 'top' ? '50% 10%' : '15% 15%') + ', #FDE68A 0%, transparent 70%)' }} />
      </div>
    </div>
  );
}

const SCENES: Scene[] = [
  {
    id: 1,
    label: 'Light from the left',
    description: 'The torch is on the LEFT. The shadow falls on the RIGHT side of the object.',
    voicePrompt: 'The torch is on the left. See how the shadow falls on the opposite side — to the right! Light always makes shadows on the side AWAY from the light.',
    observation: 'Shadow falls OPPOSITE the light source',
    visual: <ShadowScene torchPos="left" shadowDir="right" shadowScale={1} />,
  },
  {
    id: 2,
    label: 'Light from above',
    description: 'When the sun is high in the sky at midday, light comes from directly above. The shadow is short and falls straight down.',
    voicePrompt: 'The sun at midday is directly above. The shadow is short and falls straight below. This is why your shadow is smallest at midday!',
    observation: 'High light = SHORT shadow below',
    visual: <ShadowScene torchPos="top" shadowDir="bottom" shadowScale={0.5} />,
  },
  {
    id: 3,
    label: 'Light far away',
    description: 'When the light source moves farther away, the shadow gets SMALLER. Close light = big shadow. Far light = small shadow.',
    voicePrompt: 'When the light is far away, the shadow gets smaller. Move a torch far from your hand — smaller shadow! Move it close — bigger shadow!',
    observation: 'Far light = small shadow. Close light = big shadow',
    visual: <ShadowScene torchPos="left" shadowDir="right" shadowScale={0.4} />,
  },
  {
    id: 4,
    label: 'Light from the side (morning/evening)',
    description: 'When the sun is low in the sky — morning or evening — shadows are long because the light hits at an angle.',
    voicePrompt: 'In the morning and evening, the sun is low. Light hits at an angle and shadows stretch out long. This is why shadows are longest in the morning and evening!',
    observation: 'Low angle light = LONG shadow',
    visual: <ShadowScene torchPos="top-left" shadowDir="bottom-right" shadowScale={1.8} />,
  },
];

interface Props { onComplete: () => void; onExit: () => void; }

export default function LightShadowsExplore({ onComplete, onExit }: Props) {
  const [idx, setIdx] = useState(0);
  const scene = SCENES[idx];
  const isLast = idx === SCENES.length - 1;

  return (
    <ActivityWrapper title="Light & Shadows" voicePrompt={scene.voicePrompt} currentRound={idx + 1} totalRounds={SCENES.length} onExit={onExit} onSuccess={onComplete} accentColor="bg-amber-400">
      <div className="w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={scene.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h3 className="font-display font-black text-xl text-gray-800 mb-3 text-center">{scene.label}</h3>
            <div className="mb-4">{scene.visual}</div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 mb-3 text-center">
              <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">👀 What you see</p>
              <p className="text-sm font-bold text-amber-800">{scene.observation}</p>
            </div>
            <p className="text-gray-600 text-sm text-center leading-relaxed">{scene.description}</p>
          </motion.div>
        </AnimatePresence>
        <motion.button key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => isLast ? onComplete() : setIdx(i => i + 1)}
          className="mt-5 w-full py-4 bg-amber-400 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl flex items-center justify-center gap-2 btn-press">
          {isLast ? 'I\'ve seen it all! →' : 'Next scene'}<ChevronRight size={22} />
        </motion.button>
      </div>
    </ActivityWrapper>
  );
}
