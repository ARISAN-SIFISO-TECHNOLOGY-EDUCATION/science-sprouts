// Activity: Planet Earth — Day & Night — Age 10 (Band C · CAPS Gr 5)
//   Plan (predict) → Rotate Earth to make day and night → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const OBJECTIVE_ID = 'eb.earth_rotation';
const BADGE = 'Day & Night Badge 🌍';

const PLAN_VOICE = "The Earth is a giant ball spinning in space. It turns all the way around once every 24 hours. The side facing the sun has daytime. What does the side facing away from the sun have? Predict!";
const MISSION1 = "Mission 1: Turn the clock to a time when it is DAYTIME where you live.";
const MISSION2 = "Yes — your side faces the sun! Mission 2: Now spin the Earth to a time when it is NIGHT.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Day and Night Badge! Tonight, remember: it is not the sun moving — it is YOU, spinning on the Earth, turning away from the sun. Somewhere across the world, a child is just waking up to morning!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function RotationActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [hour, setHour] = useState(12);
  const [mission, setMission] = useState<0 | 1 | 2>(0);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const isDay = hour >= 6 && hour < 18;
  const clock = `${String(hour).padStart(2, '0')}:00`;

  function predict() { setPredicted(true); speak("Let's spin the Earth and make day and night!", 0.9, () => { setPhase('test'); setTimeout(() => speak(MISSION1), 300); }); }

  function onHour(v: number) {
    setHour(v);
    const day = v >= 6 && v < 18;
    if (mission === 0 && day) { setMission(1); speak(MISSION2, 0.9); }
    else if (mission === 1 && !day) { setMission(2); speak("Now your side faces away — it is night!", 0.9, () => setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 300)); }
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === '24' && blank2 === 'night') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The Earth spins once every 24 hours. The side facing the sun has day, and the side facing away has night. You are a Day and Night expert!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Earth spins once every 24 hours. The side facing away from the sun has night. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-violet-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">☀️🌍🌑</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">What does the side facing away from the sun have?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-violet-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">☀️</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">Day</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">🌑</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">Night</p></motion.button>
              </div>
            ) : <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-6xl">🌍</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-violet-700 text-base">{mission === 0 ? 'Mission 1 — find DAYTIME ☀️' : 'Mission 2 — find NIGHT 🌑'}</p>
            {/* Scene */}
            <div className={`w-full max-w-xs rounded-3xl p-6 flex items-center justify-around transition-colors duration-500 ${isDay ? 'bg-sky-200' : 'bg-indigo-900'}`}>
              <span className="text-4xl">{isDay ? '☀️' : '🌙'}</span>
              <motion.span animate={{ rotate: (hour / 24) * 360 }} className="text-6xl">🌍</motion.span>
              <span className="text-2xl">{isDay ? '🏠' : '😴'}</span>
            </div>
            <div className={`px-5 py-2 rounded-2xl font-display font-black text-lg ${isDay ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {clock} — {isDay ? 'Daytime' : 'Night'}
            </div>
            <div className="w-full max-w-xs">
              <p className="text-xs text-violet-600 font-bold text-center mb-1">Spin the Earth ⟳ (time of day)</p>
              <input type="range" min={0} max={23} value={hour} onChange={e => onHour(Number(e.target.value))} className="w-full accent-violet-600 h-3" />
              <div className="flex justify-between text-[10px] font-black text-violet-400 mt-1"><span>🌙 midnight</span><span>☀️ noon</span><span>🌙 midnight</span></div>
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-violet-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                The Earth spins around once every{' '}
                <span className={`inline-block min-w-[40px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank1 ?? '__'}</span>{' '}
                hours. The side facing away from the sun has{' '}
                <span className={`inline-block min-w-[48px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — spins once every…</p>
              <div className="flex gap-2">{['24', '100'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 ${blank1 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w} hours</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — side facing away has…</p>
              <div className="flex gap-2">{['night', 'day'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w}</button>))}</div>
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
        <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌍</div>
        <p className="font-display font-black text-violet-700 text-sm">Day & Night Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-violet-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">☀️🌍🌙</p>
        <p className="font-black text-gray-700 text-base leading-snug">Tonight, remember: the sun is not moving — YOU are, spinning on the Earth away from it. Across the world, someone is just waking up!</p>
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
