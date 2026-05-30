// Activity: Water Sources — Age 7 (Band B7)
// Foundation Phase Gr 2 — trace where our tap water comes from.
// Pattern: Explore sources → Why? (trace it) → Badge + Caregiver Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'explore' | 'why' | 'card';

interface Source { id: string; emoji: string; name: string; voice: string; }

const SOURCES: Source[] = [
  { id: 'rain',  emoji: '🌧️', name: 'Rain',  voice: 'RAIN falls from clouds. It fills our rivers and dams!' },
  { id: 'river', emoji: '🏞️', name: 'River', voice: 'RIVERS carry water across the land to the dams.' },
  { id: 'dam',   emoji: '🌊', name: 'Dam',   voice: 'A DAM stores lots of water. Pipes carry it to our homes!' },
  { id: 'tap',   emoji: '🚰', name: 'Tap',   voice: 'The TAP gives us clean water — but it came a long way first!' },
];

const OBJECTIVE_ID = 'eb.water_sources';
const BADGE = 'Water Tracker Badge 🚰';

const EXPLORE_VOICE = "Water travels a long way to your tap! Tap each place to follow the journey.";
const WHY_VOICE     = "Where does the water in your tap really come from?";
const CARD_VOICE    = "You earned the Water Tracker Badge! Follow the water at home. Where does it go after the tap and the drain?";

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

export default function WaterSourcesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('explore');
  const [tapped, setTapped] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Source | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(EXPLORE_VOICE); return () => stopAudio(); }, []);

  function tap(s: Source) {
    if (tapped.has(s.id)) return;
    const isLast = tapped.size + 1 >= SOURCES.length;
    setActive(s);
    speak(s.voice, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 800) : undefined);
    setTapped(prev => new Set([...prev, s.id]));
    setTimeout(() => setActive(null), 1800);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! Tap water comes from rain that fills rivers and dams. Then pipes bring it to your home. You are a water tracker!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-cyan-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-cyan-600 text-sm uppercase tracking-widest mb-1">The water journey</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Tap each place 💧</p>

            <div className="h-14 flex items-center justify-center mb-2">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div key={active.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                    className="px-4 py-2 rounded-2xl font-bold text-sm bg-cyan-100 text-cyan-700 text-center">
                    {active.emoji} {active.voice}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Journey chain */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {SOURCES.map((s, i) => {
                  const done = tapped.has(s.id);
                  return (
                    <React.Fragment key={s.id}>
                      {i > 0 && <span className="text-cyan-300 font-black text-lg">→</span>}
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => tap(s)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all active:scale-95
                          ${done ? 'bg-cyan-100 border-cyan-300' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-4xl">{s.emoji}</span>
                        <span className={`text-[9px] font-black uppercase ${done ? 'text-cyan-700' : 'text-gray-400'}`}>{s.name}</span>
                      </motion.button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🚰❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">Where does tap water come from?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-cyan-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-cyan-50 border-2 border-cyan-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🌧️🌊</span><span className="font-black text-cyan-700 text-[11px] uppercase">Rain &amp; dams</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy} className="flex-1 flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🧊</span><span className="font-black text-gray-500 text-[11px] uppercase">The fridge</span>
                </motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🌧️🌊🚰</motion.div>}
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
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-cyan-400 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🚰</div>
        <p className="font-display font-black text-cyan-700 text-sm">Water Tracker Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-cyan-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌧️→🌊→🚰</p>
        <p className="font-black text-gray-700 text-base leading-snug">Follow the water at home. It comes from rain and dams to your tap. Where does it go after the drain?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CFFAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-cyan-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-cyan-500 shadow-[0_6px_0_#0891B2] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
