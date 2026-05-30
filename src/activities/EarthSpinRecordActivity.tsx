// Activity: Day & Night — Age 6 (Band B6)
// Foundation Phase Gr 1 — the Earth spins, giving us day and night.
// Pattern: Spin the Earth (see day/night) → Why? → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'spin' | 'why' | 'card';

const OBJECTIVE_ID = 'eb.day_night_spin';
const BADGE = 'Earth Badge 🌍';

const SPIN_VOICE = "The Earth spins like a top! Spin it. When our side faces the sun, it is DAY. When it turns away, it is NIGHT!";
const WHY_VOICE  = "Why do we have NIGHT?";
const CARD_VOICE = "You earned the Earth Badge! Spin slowly like the Earth. When you face the lamp it is day. When you turn away it is night!";

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

export default function EarthSpinRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('spin');
  const [spins, setSpins] = useState(0);          // half-turns
  const [sawDay, setSawDay] = useState(true);     // start facing sun = day
  const [sawNight, setSawNight] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(SPIN_VOICE); return () => stopAudio(); }, []);

  // even half-turns = day (facing sun on left), odd = night
  const isDay = spins % 2 === 0;

  function spin() {
    const next = spins + 1;
    setSpins(next);
    const nowDay = next % 2 === 0;
    if (nowDay) setSawDay(true); else setSawNight(true);
    speak(nowDay ? "DAY! Our side faces the sun!" : "NIGHT! Our side turned away from the sun!");
  }

  const bothSeen = sawDay && sawNight;

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! It is night because the Earth turns away from the sun! You are an Earth scientist!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'spin' && (
          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`flex flex-col h-full transition-colors duration-700 ${isDay ? 'bg-sky-100' : 'bg-indigo-950'}`}>
            <button onClick={onExit} className={`self-start m-4 text-sm font-bold ${isDay ? 'text-sky-400' : 'text-indigo-300'}`}>← Back</button>

            <p className={`text-center font-display font-black text-sm uppercase tracking-widest mb-1 ${isDay ? 'text-sky-600' : 'text-indigo-200'}`}>
              Spin the Earth!
            </p>

            {/* Scene: sun on left, Earth in middle */}
            <div className="flex-1 flex items-center justify-center gap-6 relative">
              {/* Stars at night */}
              {!isDay && (
                <div className="absolute inset-0 pointer-events-none">
                  {['⭐','✨','🌟','⭐','✨'].map((s, i) => (
                    <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5 + i * 0.3, repeat: Infinity }}
                      className="absolute text-lg" style={{ top: `${15 + (i * 15) % 50}%`, left: `${10 + (i * 18) % 75}%` }}>{s}</motion.span>
                  ))}
                </div>
              )}
              <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl z-10">☀️</motion.span>
              {/* Earth with child marker */}
              <div className="relative">
                <motion.div animate={{ rotate: spins * 180 }} transition={{ duration: 0.8 }} className="text-7xl">🌍</motion.div>
                <motion.span animate={{ rotate: spins * 180 }} transition={{ duration: 0.8 }}
                  className="absolute -right-1 top-1/2 -translate-y-1/2 text-xl">🧒</motion.span>
              </div>
            </div>

            {/* Big DAY/NIGHT label */}
            <p className={`text-center font-display font-black text-4xl mb-3 ${isDay ? 'text-amber-500' : 'text-indigo-200'}`}>
              {isDay ? '☀️ DAY' : '🌙 NIGHT'}
            </p>

            {/* Visited dots */}
            <div className="flex justify-center gap-3 mb-3">
              <span className={`text-xs font-black px-2 py-1 rounded-full ${sawDay ? 'bg-amber-400 text-white' : 'bg-gray-300 text-gray-500'}`}>☀️ Day {sawDay ? '✓' : ''}</span>
              <span className={`text-xs font-black px-2 py-1 rounded-full ${sawNight ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-500'}`}>🌙 Night {sawNight ? '✓' : ''}</span>
            </div>

            <div className="flex items-center gap-3 px-4 pb-5">
              <button onClick={spin}
                className="flex-1 py-4 bg-blue-500 shadow-[0_5px_0_#2563EB] text-white font-display font-black text-lg rounded-3xl active:scale-95 transition-transform">
                🔄 Spin the Earth
              </button>
              <button onClick={() => speak(SPIN_VOICE)} className="p-4 bg-white/90 rounded-2xl text-blue-500 active:scale-95 transition-transform">
                <Volume2 size={22} />
              </button>
            </div>

            {bothSeen && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('why'); speak(WHY_VOICE); }}
                className="mx-4 mb-5 py-4 bg-amber-400 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl btn-press">
                I saw day AND night! →
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5 bg-indigo-50">
            <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-indigo-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌍🌙</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Why do we have NIGHT?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-indigo-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🌍↪️</span><span className="font-black text-indigo-700 text-[11px] uppercase">Earth turns away</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">☀️💤</span><span className="font-black text-amber-700 text-[11px] uppercase">Sun sleeps</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ duration: 1.5, repeat: 1 }} className="text-6xl">🌍</motion.div>
            )}
          </motion.div>
        )}

        {phase === 'card' && <CaregiverCard onComplete={onComplete} onExit={onExit} />}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const r = useCountdown(120, onComplete);
  const pct = (r / 120) * 100;
  useEffect(() => { const t = setTimeout(() => speak(CARD_VOICE), 400); return () => clearTimeout(t); }, []);
  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full p-6 items-center bg-indigo-50">
      <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌍</div>
        <p className="font-display font-black text-indigo-700 text-sm">Earth Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-indigo-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">💡🔄🧒</p>
        <p className="font-black text-gray-700 text-base leading-snug">Pretend to be the Earth! Spin slowly near a lamp. Facing the lamp is DAY. Turned away is NIGHT!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0E7FF" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-indigo-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-indigo-500 shadow-[0_6px_0_#4338CA] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
