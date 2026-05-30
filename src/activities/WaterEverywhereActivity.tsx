// Activity: Water Everywhere — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  rain falls, river flows, tap runs — water is everywhere!
// Predict (30s): "Where does RAIN come from?" — 2 choices (cloud vs ground)
// Do      (60s): tap each water place → water appears + word label
// Card   (120s): "Find 3 places water comes from at home!"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';

interface WaterPlace { id: string; emoji: string; name: string; voice: string; }

const PLACES: WaterPlace[] = [
  { id: 'cloud', emoji: '🌧️', name: 'Rain',  voice: 'RAIN! Water falls from the clouds in the sky!' },
  { id: 'tap',   emoji: '🚰', name: 'Tap',   voice: 'TAP! Clean water comes out when you turn the tap!' },
  { id: 'river', emoji: '🏞️', name: 'River', voice: 'RIVER! Water flows along the ground in rivers!' },
  { id: 'sea',   emoji: '🌊', name: 'Sea',   voice: 'SEA! There is so much water in the big blue sea!' },
];

const SEE_VOICE  = "Water is everywhere! RAIN falls from clouds. Water flows in RIVERS. It comes from the TAP in your home. Water helps everything live!";
const CARD_VOICE = "Now go on a water hunt at home! Find three places where water comes from. The tap? The shower? A water bottle? Point to each one!";

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

export default function WaterEverywhereActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [predicted, setPredicted] = useState(false);
  const [tapped, setTapped]   = useState<Set<string>>(new Set());
  const [glowing, setGlowing] = useState<string | null>(null);
  const [splash, setSplash]   = useState(false);

  useEffect(() => {
    speak(SEE_VOICE);
    const t = setTimeout(() => setPhase('predict'), 8000);
    return () => { clearTimeout(t); stopAudio(); };
  }, []);

  function predict(isCloud: boolean) {
    setPredicted(true);
    speak(isCloud ? "Yes! Rain comes from the clouds in the sky! Great thinking!" : "Let's find out! Rain falls down from the clouds in the sky!",
      0.85, () => setPhase('do'));
  }

  function tapPlace(p: WaterPlace) {
    if (tapped.has(p.id)) return;
    const isLast = tapped.size + 1 >= PLACES.length;
    speak(p.voice, 0.85, isLast ? () => setTimeout(() => setPhase('card'), 600) : undefined);
    setGlowing(p.id);
    setSplash(true);
    setTapped(prev => new Set([...prev, p.id]));
    setTimeout(() => { setGlowing(null); setSplash(false); }, 1400);
  }

  return (
    <div className="fixed inset-0 bg-cyan-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold">← Back</button>
            <div className="flex gap-4">
              {[
                { e: '🌧️', w: 'Rain',  a: { y: [0, 6, 0] } },
                { e: '🏞️', w: 'River', a: { x: [0, 5, 0] } },
                { e: '🚰', w: 'Tap',   a: { scale: [1, 1.1, 1] } },
              ].map((x, i) => (
                <div key={x.w} className="flex flex-col items-center gap-2">
                  <motion.span animate={x.a} transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.2 }} className="text-5xl">{x.e}</motion.span>
                  <span className="font-black text-cyan-700 text-xs uppercase">{x.w}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-cyan-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-cyan-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌧️❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Where does RAIN come from?</p>
              <button onClick={() => speak("Where does rain come from?")} className="mt-2 flex items-center gap-1 mx-auto text-cyan-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(true)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                <span className="text-5xl">☁️</span>
                <span className="font-black text-sky-700 text-sm uppercase">Clouds</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(false)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🟫</span>
                <span className="font-black text-amber-700 text-sm uppercase">Ground</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">🌧️</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-cyan-600 text-sm uppercase tracking-widest mb-3">
              Tap each place — find the water! 💧
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {PLACES.map(p => (
                <div key={p.id} className={`w-3 h-3 rounded-full ${tapped.has(p.id) ? 'bg-cyan-400' : 'bg-cyan-100'}`} />
              ))}
            </div>

            {/* Splash overlay */}
            <AnimatePresence>
              {splash && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.3, opacity: 0 }}
                  className="absolute inset-x-8 top-24 z-20 bg-cyan-500 rounded-3xl p-4 text-center shadow-xl">
                  <p className="font-display font-black text-5xl text-white">💧 WATER!</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4 flex-1 content-center">
              {PLACES.map(p => {
                const done = tapped.has(p.id);
                const glow = glowing === p.id;
                return (
                  <motion.button key={p.id} animate={glow ? { scale: [1, 1.15, 0.9, 1] } : {}} transition={{ duration: 0.4 }}
                    onClick={() => tapPlace(p)}
                    className={`flex flex-col items-center justify-center gap-2 p-5 rounded-3xl border-2 min-h-[100px] active:scale-95 transition-all
                      ${done ? 'bg-cyan-100 border-cyan-300' : 'bg-white border-gray-100 shadow-md'}`}>
                    <span className="text-5xl">{p.emoji}</span>
                    <span className={`font-black text-sm uppercase ${done ? 'text-cyan-700' : 'text-gray-400'}`}>
                      {p.name}{done ? ' ✓' : ''}
                    </span>
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
      <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold mb-4">← Back</button>
      <div className="bg-cyan-100 border-2 border-cyan-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-cyan-600 uppercase tracking-widest">Water Hunt!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-cyan-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🚰🚿💧</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Go on a water hunt together! Find THREE places water comes from at home. The tap? The shower? A water bottle? Point and count them!
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full max-w-xs mb-5">
        {[{ e: '🚰', t: 'Tap' }, { e: '🚿', t: 'Shower' }, { e: '🌧️', t: 'Rain' }, { e: '🍶', t: 'Bottle' }].map(x => (
          <div key={x.t} className="bg-cyan-50 border-2 border-cyan-100 rounded-2xl p-2 text-center">
            <span className="text-2xl">{x.e}</span><p className="text-[8px] font-black text-cyan-700 uppercase mt-0.5">{x.t}</p>
          </div>
        ))}
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CFFAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#06B6D4" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-cyan-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-cyan-500 shadow-[0_6px_0_#0891B2] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
