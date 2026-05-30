// Activity: Light Sources — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  dark room → add sun / lamp / candle → room lights up
// Predict (30s): "What gives light at NIGHT?" — 2 choices (lamp vs sun)
// Do      (60s): tap light sources in a dark room → each brightens it + word LIGHT
// Card   (120s): "At night, which gives light — sun or lamp?"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';

interface LightSource { id: string; emoji: string; name: string; voice: string; }

const SOURCES: LightSource[] = [
  { id: 'sun',    emoji: '☀️', name: 'Sun',    voice: 'The SUN gives us light in the day! It is the brightest light of all!' },
  { id: 'lamp',   emoji: '💡', name: 'Lamp',   voice: 'A LAMP gives light at night! Flick the switch and the room lights up!' },
  { id: 'candle', emoji: '🕯️', name: 'Candle', voice: 'A CANDLE gives a small light! Its little flame glows in the dark.' },
  { id: 'torch',  emoji: '🔦', name: 'Torch',  voice: 'A TORCH gives light you can carry! Shine it wherever you want to see!' },
];

const SEE_VOICE  = "Light helps us see! In the day, the SUN gives us light. At night, we use a LAMP or a CANDLE. Without light, everything is dark!";
const CARD_VOICE = "Now look around at night! Which things give light in your home? A lamp? A candle? A phone? Point to each light you can find!";

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

export default function LightSourcesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [seeLit, setSeeLit]   = useState(false);
  const [predicted, setPredicted] = useState(false);
  const [litSources, setLitSources] = useState<Set<string>>(new Set());
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    speak(SEE_VOICE);
    const t1 = setTimeout(() => setSeeLit(true), 3000);
    const t2 = setTimeout(() => setPhase('predict'), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); stopAudio(); };
  }, []);

  function predict(isLamp: boolean) {
    setPredicted(true);
    speak(isLamp ? "Yes! At night we use a LAMP for light! Great thinking!" : "Let's find out! At night the sun is gone — we use a LAMP!",
      0.85, () => setPhase('do'));
  }

  function tapSource(s: LightSource) {
    if (litSources.has(s.id)) return;
    const isLast = litSources.size + 1 >= SOURCES.length;
    speak(s.voice, 0.85, isLast ? () => setTimeout(() => setPhase('card'), 600) : undefined);
    setFlashing(true);
    setLitSources(prev => new Set([...prev, s.id]));
    setTimeout(() => setFlashing(false), 700);
  }

  // brightness increases with each lit source in DO phase
  const brightness = litSources.size / SOURCES.length;

  return (
    <div className="fixed inset-0 bg-yellow-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold">← Back</button>
            {/* Room that lights up */}
            <motion.div
              animate={{ backgroundColor: seeLit ? '#FEF9C3' : '#1E293B' }}
              transition={{ duration: 1 }}
              className="w-56 h-40 rounded-3xl border-4 border-yellow-200 flex items-center justify-center relative overflow-hidden">
              <motion.span animate={{ opacity: seeLit ? 1 : 0.3, scale: seeLit ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 1.5, repeat: seeLit ? Infinity : 0 }} className="text-6xl">
                {seeLit ? '💡' : '🌑'}
              </motion.span>
              <motion.span animate={{ opacity: seeLit ? 1 : 0 }} className="absolute bottom-3 text-3xl">🧒</motion.span>
            </motion.div>
            <div className="bg-white rounded-2xl p-4 border-2 border-yellow-100 text-center max-w-xs">
              <p className="font-bold text-gray-700 text-base leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-yellow-500 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-yellow-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌙❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">What gives light at NIGHT?</p>
              <button onClick={() => speak("What gives light at night?")} className="mt-2 flex items-center gap-1 mx-auto text-yellow-500 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(true)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-3xl active:scale-95">
                <span className="text-5xl">💡</span>
                <span className="font-black text-yellow-700 text-sm uppercase">Lamp</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(false)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                <span className="text-5xl">☀️</span>
                <span className="font-black text-sky-700 text-sm uppercase">Sun</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">💡</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-yellow-600 text-sm uppercase tracking-widest mb-3">
              Tap a light — brighten the room!
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {SOURCES.map(s => (
                <div key={s.id} className={`w-3 h-3 rounded-full ${litSources.has(s.id) ? 'bg-yellow-400' : 'bg-yellow-100'}`} />
              ))}
            </div>

            {/* Dark room that brightens */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                animate={{ backgroundColor: `rgba(254, 249, 195, ${0.15 + brightness * 0.85})` }}
                className="relative w-56 h-44 rounded-3xl border-4 border-yellow-200 flex items-center justify-center overflow-hidden">
                {flashing && (
                  <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-yellow-200" />
                )}
                <span className="text-5xl z-10" style={{ filter: `brightness(${0.5 + brightness})` }}>
                  {brightness >= 1 ? '🌟' : brightness > 0 ? '🧒' : '🌑'}
                </span>
                {brightness >= 1 && (
                  <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute bottom-3 font-display font-black text-yellow-700 text-lg">LIGHT! ✨</motion.p>
                )}
              </motion.div>
            </div>

            {/* Source buttons */}
            <div className="grid grid-cols-4 gap-2">
              {SOURCES.map(s => {
                const done = litSources.has(s.id);
                return (
                  <motion.button key={s.id} whileTap={{ scale: 0.92 }} onClick={() => tapSource(s)} disabled={done}
                    className={`py-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-all border-2
                      ${done ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <span className="text-3xl">{s.emoji}</span>
                    <span className={`text-[9px] font-black uppercase ${done ? 'text-yellow-700' : 'text-gray-400'}`}>
                      {s.name}{done ? ' ✓' : ''}
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
      <button onClick={onExit} className="self-start text-yellow-500 text-sm font-bold mb-4">← Back</button>
      <div className="bg-yellow-100 border-2 border-yellow-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-yellow-700 uppercase tracking-widest">Light Hunt!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-yellow-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">💡🕯️🔦</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Go on a light hunt at night! Point to each thing that gives light — a lamp, a candle, a phone, the TV. How many lights can you find?
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full max-w-xs mb-5">
        {[{ e: '☀️', t: 'Sun' }, { e: '💡', t: 'Lamp' }, { e: '🕯️', t: 'Candle' }, { e: '🔦', t: 'Torch' }].map(x => (
          <div key={x.t} className="bg-yellow-50 border-2 border-yellow-100 rounded-2xl p-2 text-center">
            <span className="text-2xl">{x.e}</span><p className="text-[8px] font-black text-yellow-700 uppercase mt-0.5">{x.t}</p>
          </div>
        ))}
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF9C3" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EAB308" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-yellow-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-yellow-400 shadow-[0_6px_0_#CA8A04] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
