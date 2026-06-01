// Activity: Mains Electricity & Power Stations — Age 10 (Band C · CAPS Gr 5)
//   Plan (predict) → Order the energy journey → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Step { id: string; emoji: string; name: string; }
// Correct journey order
const STEPS: Step[] = [
  { id: 'coal',    emoji: '🪨', name: 'Coal (fuel)' },
  { id: 'station', emoji: '🏭', name: 'Power station' },
  { id: 'wires',   emoji: '🗼', name: 'Power lines' },
  { id: 'home',    emoji: '🏠', name: 'Your home' },
];
// Display order (shuffled, but fixed so it is deterministic)
const SHUFFLED: Step[] = [STEPS[2], STEPS[0], STEPS[3], STEPS[1]];

const OBJECTIVE_ID = 'ec.mains_electricity';
const BADGE = 'Power Tracker Badge ⚡';

const PLAN_VOICE = "When you switch on a light, where does that electricity come from? Predict: from a power station, or straight from the sun?";
const TEST_VOICE = "Electricity makes a journey to your home. Tap the cards in the correct order, from where it starts to where it ends.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Power Tracker Badge! Tonight, look around. Count how many things in one room use mains electricity from the wall. What would happen if the power station stopped?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function PowerStationActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  function predict() { setPredicted(true); speak("Let's follow the journey of electricity to your home!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function tap(step: Step) {
    if (placed.includes(step.id)) return;
    const expected = STEPS[placed.length];
    if (step.id === expected.id) {
      const next = [...placed, step.id];
      setPlaced(next);
      speak(step.name, 0.95);
      if (next.length === STEPS.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 900);
    } else {
      setShake(true); speak("Not yet — what comes next in the journey?", 0.9);
      setTimeout(() => setShake(false), 500);
    }
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'power station' && blank2 === 'wires') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Electricity is made at a power station, often by burning coal. It travels along wires and power lines all the way to your home. You are a Power Tracker!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Electricity is made at a power station and travels through wires. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">💡🔌🏭</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Where does your home's electricity come from?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">🏭</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Power station</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">☀️</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">The sun</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⚡</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">⚡ The Journey of Electricity</p>
            <p className="text-xs text-amber-500 font-bold text-center">Tap the cards in order — start to home</p>
            {/* Ordered slots filled so far */}
            <div className="flex items-center justify-center gap-1 flex-wrap w-full max-w-sm min-h-[64px]">
              {placed.map((id, i) => {
                const s = STEPS.find(x => x.id === id)!;
                return (
                  <React.Fragment key={id}>
                    {i > 0 && <span className="text-amber-400 font-black">→</span>}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-amber-100 border-2 border-amber-300 rounded-2xl px-2 py-1 text-center">
                      <span className="text-2xl">{s.emoji}</span>
                    </motion.div>
                  </React.Fragment>
                );
              })}
              {placed.length === 0 && <span className="text-amber-300 text-sm font-bold">Step 1 first…</span>}
            </div>
            {/* Choice cards */}
            <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {SHUFFLED.map(s => {
                const used = placed.includes(s.id);
                return (
                  <motion.button key={s.id} whileTap={{ scale: used ? 1 : 0.92 }} onClick={() => tap(s)} disabled={used}
                    className={`p-4 rounded-3xl border-2 active:scale-95 flex flex-col items-center gap-1 ${used ? 'bg-amber-50 border-amber-100 opacity-40' : 'bg-white border-amber-200'}`}>
                    <span className="text-4xl">{s.emoji}</span>
                    <p className="font-black text-amber-700 text-[11px] uppercase text-center leading-tight">{s.name}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Electricity is made at a{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank1 ?? '____'}</span>.
                It travels through{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank2 ?? '____'}</span>{' '}
                to our homes.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — made at a…</p>
              <div className="flex gap-2">{['power station', 'rainbow'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — travels through…</p>
              <div className="flex gap-2">{['wires', 'rivers'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-amber-500 shadow-[0_5px_0_#D97706]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">⚡</div>
        <p className="font-display font-black text-amber-700 text-sm">Power Tracker Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🏭⚡🏠</p>
        <p className="font-black text-gray-700 text-base leading-snug">Look around one room. Count the things that use mains electricity from the wall. What would happen if the power station stopped?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FEF3C7" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D97706" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-amber-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-amber-600 shadow-[0_6px_0_#B45309] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
