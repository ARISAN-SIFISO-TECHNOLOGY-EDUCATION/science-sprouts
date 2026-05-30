// Activity: Building Things — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  paper roof leaks, plastic roof keeps house dry
// Predict (30s): "Which roof keeps the rain out?" — 2 choices
// Do      (60s): tap 4 materials onto a house → see if rain leaks through
// Card   (120s): "Build a small roof. Test it with water drops!"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';

interface Material { id: string; emoji: string; name: string; waterproof: boolean; voice: string; }

const MATERIALS: Material[] = [
  { id: 'plastic', emoji: '🟦', name: 'Plastic', waterproof: true,  voice: 'Plastic keeps the rain OUT! It is waterproof — the house stays dry!' },
  { id: 'paper',   emoji: '📄', name: 'Paper',   waterproof: false, voice: 'Paper lets the rain IN! It gets soggy and leaks. The house gets wet!' },
  { id: 'metal',   emoji: '🛡️', name: 'Metal',   waterproof: true,  voice: 'Metal keeps the rain OUT! Strong zinc roofs keep houses dry!' },
  { id: 'cloth',   emoji: '🧻', name: 'Cloth',   waterproof: false, voice: 'Cloth soaks up the rain and leaks! The house gets wet inside!' },
];

const SEE_VOICE  = "We build roofs to keep the rain out! A paper roof gets soggy and leaks — the house gets wet. A plastic roof keeps the rain out — the house stays dry! Different materials do different jobs.";
const CARD_VOICE = "Now build a tiny roof! Use a piece of plastic or cardboard. Drip a little water on top with a grown-up. Does the water go through, or does it stay dry underneath?";

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

export default function BuildingThingsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [predicted, setPredicted] = useState(false);
  const [tested, setTested]   = useState<Set<string>>(new Set());
  const [activeMat, setActiveMat] = useState<Material | null>(null);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('predict'), 8500);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function predict(waterproof: boolean) {
    setPredicted(true);
    speak(waterproof ? "Yes! Plastic keeps the rain out! Great thinking!" : "Let's find out! Plastic keeps the house dry!",
      0.85, () => setPhase('do'));
  }

  function testMaterial(m: Material) {
    if (tested.has(m.id)) return;
    const isLast = tested.size + 1 >= MATERIALS.length;
    setActiveMat(m);
    speak(m.voice, 0.85, isLast ? () => setTimeout(() => setPhase('card'), 600) : undefined);
    setTested(prev => new Set([...prev, m.id]));
    setTimeout(() => setActiveMat(null), 2200);
  }

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="flex gap-6 items-end">
              {/* Leaky paper house */}
              <div className="flex flex-col items-center gap-1">
                <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-2xl">🌧️</motion.span>
                <span className="text-4xl">📄</span>
                <span className="text-4xl">🏠</span>
                <span className="font-black text-red-600 text-[10px] uppercase">Wet inside! 💧</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-2xl">🌧️</motion.span>
                <span className="text-4xl">🟦</span>
                <span className="text-4xl">🏠</span>
                <span className="font-black text-green-600 text-[10px] uppercase">Stays dry! ✓</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-amber-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🏠🌧️</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Which roof keeps the rain OUT?</p>
              <button onClick={() => speak("Which roof keeps the rain out?")} className="mt-2 flex items-center gap-1 mx-auto text-amber-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(true)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🟦</span>
                <span className="font-black text-blue-700 text-sm uppercase">Plastic</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(false)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                <span className="text-5xl">📄</span>
                <span className="font-black text-amber-700 text-sm uppercase">Paper</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">🏠</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-amber-600 text-sm uppercase tracking-widest mb-3">
              Tap a roof — test it in the rain!
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {MATERIALS.map(m => (
                <div key={m.id} className={`w-3 h-3 rounded-full ${tested.has(m.id) ? 'bg-amber-400' : 'bg-amber-100'}`} />
              ))}
            </div>

            {/* House test stage */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 bg-gradient-to-b from-sky-100 to-green-50 rounded-3xl border-4 border-amber-200 flex flex-col items-center justify-end overflow-hidden pb-3">
                {/* Rain */}
                {activeMat && (
                  <div className="absolute inset-x-0 top-0 flex justify-around">
                    {[0,1,2,3,4].map(i => (
                      <motion.span key={i} animate={{ y: [0, activeMat.waterproof ? 50 : 120] }}
                        transition={{ duration: 0.8, repeat: 2, delay: i * 0.1 }} className="text-lg">💧</motion.span>
                    ))}
                  </div>
                )}
                {/* Roof material */}
                <div className="text-4xl z-10">{activeMat ? activeMat.emoji : '🏠'}</div>
                {/* House */}
                <div className="text-5xl z-10">🏠</div>
                {/* Result */}
                {activeMat && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className={`absolute bottom-2 px-3 py-1 rounded-full text-xs font-black ${activeMat.waterproof ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {activeMat.waterproof ? 'DRY ✓' : 'LEAKS! 💧'}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Material buttons */}
            <div className="grid grid-cols-2 gap-3">
              {MATERIALS.map(m => {
                const done = tested.has(m.id);
                return (
                  <motion.button key={m.id} whileTap={{ scale: 0.95 }} onClick={() => testMaterial(m)} disabled={done}
                    className={`py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all border-2
                      ${done
                        ? (m.waterproof ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700')
                        : 'bg-white border-gray-200 shadow-sm text-gray-700'}`}>
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="font-black text-sm uppercase">{m.name}{done ? (m.waterproof ? ' ✓' : ' 💧') : ''}</span>
                  </motion.button>
                );
              })}
            </div>
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
      <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-amber-100 border-2 border-amber-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-amber-600 uppercase tracking-widest">Builder Mission!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🏠🟦💧</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Build a tiny roof together! Use plastic or cardboard over a cup. Drip water on top. Does the cup stay dry, or does water get in?
        </p>
      </div>
      <div className="flex gap-3 w-full max-w-xs mb-5">
        <div className="flex-1 bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">🟦</span><p className="text-[10px] font-black text-blue-700 uppercase mt-1">Keeps dry</p>
        </div>
        <div className="flex-1 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">📄</span><p className="text-[10px] font-black text-amber-700 uppercase mt-1">Leaks!</p>
        </div>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F59E0B" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-amber-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-amber-500 shadow-[0_6px_0_#D97706] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
