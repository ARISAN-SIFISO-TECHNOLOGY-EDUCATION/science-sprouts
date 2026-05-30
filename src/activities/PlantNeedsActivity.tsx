// Activity: Plant Needs — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  Two plants — one with sun+water (big), one without (wilted)
// Predict (30s): "Which plant will grow big?" — 2 choices
// Do      (60s): Tap the watering can + sun on a seed → grows seed→sprout→flower
// Card   (120s): "Water one plant at home. Watch it for 3 days!"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';

const GROWTH = ['🌰', '🌱', '🌿', '🌷'];   // seed → sprout → plant → flower
const GROWTH_WORDS = ['SEED', 'SPROUT', 'GROWING', 'FLOWER!'];

const SEE_VOICE  = "Plants need two special things to grow — SUN and WATER! This plant got sun and water, so it grew big and strong. This one got nothing, so it stayed small.";
const CARD_VOICE = "Now try at home! Pick one plant. Give it water every day. Watch it for three days. Does it grow bigger?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => {
    if (r <= 0) { onDone(); return; }
    const id = setTimeout(() => setR(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function PlantNeedsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [predicted, setPredicted] = useState(false);
  const [stage, setStage]     = useState(0);   // index into GROWTH
  const [gaveWater, setGaveWater] = useState(false);
  const [gaveSun, setGaveSun]     = useState(false);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('predict'), 8000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function predict(big: boolean) {
    setPredicted(true);
    const msg = big
      ? "Yes! The plant with sun and water grows big! Great thinking!"
      : "Let's find out! Plants need sun AND water to grow big!";
    speak(msg, 0.85, () => setPhase('do'));
  }

  // DO: child taps water, then sun. Each "feed" grows the plant one stage.
  function feed(kind: 'water' | 'sun') {
    if (kind === 'water' && gaveWater) return;
    if (kind === 'sun' && gaveSun) return;

    if (kind === 'water') setGaveWater(true);
    if (kind === 'sun') setGaveSun(true);

    const nextStage = Math.min(stage + 1, GROWTH.length - 1);
    setStage(nextStage);

    const grewToFlower = nextStage >= GROWTH.length - 1;
    speak(
      `${kind === 'water' ? 'Water' : 'Sunshine'}! ${GROWTH_WORDS[nextStage]}`,
      0.85,
      grewToFlower ? () => setTimeout(() => setPhase('card'), 800) : undefined
    );
  }

  const bothGiven = gaveWater && gaveSun;

  return (
    <div className="fixed inset-0 bg-green-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold">← Back</button>
            <div className="flex gap-6 items-end">
              {/* Healthy plant */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl">☀️</motion.span>
                  <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-3xl">💧</motion.span>
                </div>
                <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl">🌻</motion.span>
                <span className="font-black text-green-700 text-xs uppercase">Big &amp; strong!</span>
              </div>
              <span className="text-3xl text-green-300 font-black mb-8">vs</span>
              {/* Wilted plant */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl opacity-30">🚫💧</span>
                <span className="text-5xl opacity-60 grayscale">🥀</span>
                <span className="font-black text-gray-400 text-xs uppercase">Small &amp; sad</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-green-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-green-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-green-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌱❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Which plant will grow BIG?</p>
              <button onClick={() => speak("Which plant will grow big?")} className="mt-2 flex items-center gap-1 mx-auto text-green-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(true)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-3xl active:scale-95">
                <span className="text-4xl">☀️💧</span>
                <span className="text-3xl">🌻</span>
                <span className="font-black text-green-700 text-xs uppercase">Sun + water</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(false)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                <span className="text-4xl opacity-40">🚫</span>
                <span className="text-3xl opacity-50">🥀</span>
                <span className="font-black text-gray-500 text-xs uppercase">Nothing</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">🌻</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-green-600 text-sm uppercase tracking-widest mb-3">
              Give the seed sun and water! 🌱
            </p>

            {/* Growing plant in soil */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 bg-gradient-to-b from-sky-100 to-amber-100 rounded-3xl border-4 border-amber-200 flex items-end justify-center overflow-hidden">
                {/* Sun */}
                {gaveSun && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ duration: 1 }}
                    className="absolute top-3 right-3 text-4xl">☀️</motion.span>
                )}
                {/* Plant */}
                <motion.span key={stage} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                  className="text-7xl mb-4">{GROWTH[stage]}</motion.span>
                {/* Soil */}
                <div className="absolute bottom-0 w-full h-8 bg-amber-300" />
              </div>
              <motion.p key={GROWTH_WORDS[stage]} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="mt-4 font-display font-black text-3xl text-green-600">{GROWTH_WORDS[stage]}</motion.p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => feed('water')} disabled={gaveWater}
                className={`flex-1 py-5 rounded-3xl flex flex-col items-center gap-1 active:scale-95 transition-all
                  ${gaveWater ? 'bg-blue-100 border-2 border-blue-200 opacity-60' : 'bg-blue-400 shadow-[0_5px_0_#2563EB] text-white'}`}>
                <span className="text-4xl">💧</span>
                <span className="font-black text-sm uppercase">{gaveWater ? 'Water ✓' : 'Give water'}</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => feed('sun')} disabled={gaveSun}
                className={`flex-1 py-5 rounded-3xl flex flex-col items-center gap-1 active:scale-95 transition-all
                  ${gaveSun ? 'bg-yellow-100 border-2 border-yellow-200 opacity-60' : 'bg-yellow-400 shadow-[0_5px_0_#D97706] text-white'}`}>
                <span className="text-4xl">☀️</span>
                <span className="font-black text-sm uppercase">{gaveSun ? 'Sun ✓' : 'Give sun'}</span>
              </motion.button>
            </div>
            {bothGiven && stage >= GROWTH.length - 1 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-600 font-black mt-3">
                It grew a flower! 🌷🎉
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ── CARD ──────────────────────────────────────────────────────── */}
        {phase === 'card' && <CaregiverCard onComplete={onComplete} onExit={onExit} />}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const r = useCountdown(120, onComplete);
  const pct = (r / 120) * 100;
  useEffect(() => {
    const t = setTimeout(() => speak(CARD_VOICE), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-green-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-green-100 border-2 border-green-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-green-600 uppercase tracking-widest">Growing Mission!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-green-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🪴💧☀️</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Pick a plant at home together. Give it water every day. Put it where the sun shines. Watch it for 3 days — does it grow?
        </p>
      </div>
      <div className="flex gap-3 w-full max-w-xs mb-5">
        <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">💧</span><p className="text-[10px] font-black text-blue-700 uppercase mt-1">Water daily</p>
        </div>
        <div className="flex-1 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">☀️</span><p className="text-[10px] font-black text-yellow-700 uppercase mt-1">Needs sun</p>
        </div>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DCFCE7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22C55E" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-green-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-green-500 shadow-[0_6px_0_#16A34A] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
