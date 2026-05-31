// Activity: Seasons & Day Length — Age 9 (Band B · CAPS Gr 4)
// Earth's tilt + orbit gives us seasons and changing day length.
//   Plan (predict) → Move Earth to 4 positions, record daylight hours → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Season { id: string; emoji: string; name: string; daylight: number; }
const SEASONS: Season[] = [
  { id: 'summer', emoji: '☀️', name: 'Summer', daylight: 14 },
  { id: 'autumn', emoji: '🍂', name: 'Autumn', daylight: 12 },
  { id: 'winter', emoji: '❄️', name: 'Winter', daylight: 10 },
  { id: 'spring', emoji: '🌷', name: 'Spring', daylight: 12 },
];
const MAX_H = 16;

const OBJECTIVE_ID = 'eb.seasons';
const BADGE = 'Season Tracker Badge 🍂';

const PLAN_VOICE = "Earth is tilted as it orbits the sun. Why is summer hotter — is Earth closer to the sun, or tilted towards it? Predict!";
const TEST_VOICE = "Move the tilted Earth to each season. Record how many hours of daylight there are.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Season Tracker Badge! At home: notice what time the sun sets today. Check again in three months — are the days getting longer or shorter?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function SeasonsActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [recorded, setRecorded] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Season>(SEASONS[0]);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const all = recorded.size >= SEASONS.length;

  function predict() { setPredicted(true); speak("Let's move the Earth around the sun and record the daylight!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function record(s: Season) {
    setActive(s);
    if (recorded.has(s.id)) return;
    speak(`${s.name}: about ${s.daylight} hours of daylight.`, 0.92);
    setRecorded(prev => new Set([...prev, s.id]));
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'tilted' && blank2 === 'longer') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Summer is hotter because our part of Earth is tilted towards the sun, giving longer days. You are a Season Tracker!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("It is the tilt, not the distance, that makes summer. Summer days are longer. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-violet-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🌍↗️☀️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Why is summer hotter than winter?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-violet-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">↗️</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">Tilted toward sun</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">➡️</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">Closer to sun</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌍</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold mb-1">← Back</button>
            <p className="text-center font-display font-black text-violet-700 text-base">Seasons Lab 🌍</p>
            <p className="text-center text-[11px] text-violet-500 font-bold mb-2">Currently showing: {active.emoji} {active.name}</p>

            {/* tilted earth + sun */}
            <div className="rounded-2xl bg-violet-900 border-2 border-violet-200 h-28 relative flex items-center justify-around overflow-hidden">
              <span className="text-3xl">☀️</span>
              <div className="relative">
                <motion.span className="text-5xl inline-block" style={{ rotate: '23deg' }}>🌍</motion.span>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black text-violet-200">tilt 23°</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-violet-200 uppercase">Daylight</p>
                <p className="font-display font-black text-yellow-300 text-lg">{recorded.has(active.id) ? `${active.daylight}h` : '?'}</p>
              </div>
            </div>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mt-3 mb-1">Hours of daylight</p>
            <div className="flex-1 flex items-end justify-around gap-3 bg-white rounded-2xl border-2 border-violet-100 p-3 min-h-[110px]">
              {SEASONS.map(s => {
                const done = recorded.has(s.id);
                const top = s.id === 'summer';
                return (
                  <div key={s.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[10px] font-black text-violet-700 mb-0.5">{s.daylight}h</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(s.daylight / MAX_H) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-violet-600' : 'bg-violet-300') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-base mt-1">{s.emoji}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{s.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-4 gap-1.5 mt-3">
                {SEASONS.map(s => (
                  <button key={s.id} onClick={() => record(s)} className={`py-2 rounded-xl border-2 font-black text-[10px] active:scale-95 flex flex-col items-center ${recorded.has(s.id) ? 'bg-violet-100 border-violet-200 text-violet-400' : active.id === s.id ? 'bg-violet-500 text-white border-violet-500' : 'bg-white border-violet-200 text-violet-700'}`}>
                    <span className="text-sm">{s.emoji}</span>{recorded.has(s.id) ? '✓' : s.name}
                  </button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-violet-500 shadow-[0_5px_0_#7C3AED] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-violet-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Summer is hotter because our part of Earth is{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank1 ?? '____'}</span>{' '}
                towards the sun, giving{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank2 ?? '____'}</span>{' '}
                days.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['tilted', 'closer'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['longer', 'shorter'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-violet-500 shadow-[0_5px_0_#7C3AED]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🍂</div>
        <p className="font-display font-black text-violet-700 text-sm">Season Tracker Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-violet-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌇🕕</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: notice what time the sun sets today. Check again in 3 months — are the days getting longer or shorter?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EDE9FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7C3AED" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-violet-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-violet-600 shadow-[0_6px_0_#6D28D9] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
