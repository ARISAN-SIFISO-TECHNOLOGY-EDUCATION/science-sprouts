// Activity: Forces — Push/Pull, Heavy/Light — Age 8 (Band B8)
// Intermediate Phase Gr 3 — measure force in Newtons with a spring scale.
//   Plan (predict) → Measure force on 3 objects → Conclude (fill blanks) → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

interface Obj { id: string; emoji: string; name: string; force: number; } // force in Newtons to lift
const OBJECTS: Obj[] = [
  { id: 'feather', emoji: '🪶', name: 'Feather', force: 1 },
  { id: 'book',    emoji: '📚', name: 'Book',    force: 5 },
  { id: 'rock',    emoji: '🪨', name: 'Rock',    force: 12 },
];
const MAX_N = 15;

const OBJECTIVE_ID = 'ec.forces_b8';
const BADGE = 'Force Measurer ⚖️';

const PLAN_VOICE = "A spring scale measures force in Newtons. Does a heavier object need MORE force to lift? Predict yes or no.";
const TEST_VOICE = "Tap each object to hook on the spring scale and read the force in Newtons.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Force Measurer Badge! At home: try to push a heavy book, then pull it. Which takes more force?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function ForcesActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const all = measured.size >= OBJECTS.length;
  const winner = OBJECTS.reduce((a, b) => (b.force > a.force ? b : a));

  function predict() { setPredicted(true); speak("Let's measure and find out!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }
  function measure(o: Obj) { if (measured.has(o.id)) return; speak(`${o.name}: ${o.force} Newtons.`, 0.95); setMeasured(prev => new Set([...prev, o.id])); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'rock' && blank2 === 'heaviest') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The rock needed the most force because it is the heaviest. Heavier objects need more force. You are a Force Measurer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Look at your graph — which object needed the most Newtons? Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-orange-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🪶📚🪨</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does a heavier object need more force to lift?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-orange-400 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-orange-200 rounded-3xl active:scale-95"><span className="text-3xl">✅</span><p className="font-black text-orange-700 text-[11px] uppercase mt-1">Yes, more</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-orange-200 rounded-3xl active:scale-95"><span className="text-3xl">🟰</span><p className="font-black text-orange-700 text-[11px] uppercase mt-1">No, same</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⚖️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-orange-700 text-base mb-1">Spring Scale ⚖️</p>
            <p className="text-center text-xs text-orange-500 font-bold mb-3">Tap each object · read the force in Newtons (N)</p>

            <p className="text-center text-[10px] font-black text-gray-400 uppercase mb-1">Force needed (N)</p>
            <div className="flex-1 flex items-end justify-around gap-4 bg-white rounded-2xl border-2 border-orange-100 p-3 min-h-[150px]">
              {OBJECTS.map(o => {
                const done = measured.has(o.id);
                const top = o.id === winner.id;
                return (
                  <div key={o.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    {done && <span className="text-[11px] font-black text-orange-700 mb-0.5">{o.force}N</span>}
                    <motion.div initial={{ height: 0 }} animate={{ height: done ? `${(o.force / MAX_N) * 100}%` : 0 }} transition={{ type: 'spring', damping: 14 }} className={`w-full rounded-t-xl ${done ? (top ? 'bg-orange-600' : 'bg-orange-300') : 'bg-gray-100'}`} style={{ minHeight: done ? 6 : 0 }} />
                    <span className="text-xl mt-1">{o.emoji}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase">{o.name}</span>
                  </div>
                );
              })}
            </div>

            {!all ? (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {OBJECTS.map(o => (
                  <button key={o.id} onClick={() => measure(o)} disabled={measured.has(o.id)} className={`py-3 rounded-2xl border-2 font-black text-xs active:scale-95 flex flex-col items-center gap-0.5 ${measured.has(o.id) ? 'bg-orange-100 border-orange-200 text-orange-400' : 'bg-white border-orange-200 text-orange-700'}`}>
                    <span className="text-xl">{o.emoji}</span>{measured.has(o.id) ? '✓' : o.name}
                  </button>
                ))}
              </div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-orange-500 shadow-[0_5px_0_#EA580C] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-orange-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                The{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-orange-200 text-orange-300'}`}>{blank1 ?? '____'}</span>{' '}
                needed the most force because it is the{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-orange-200 text-orange-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — which object?</p>
              <div className="flex gap-2">{['feather', 'book', 'rock'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-700 border-orange-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — why?</p>
              <div className="flex gap-2">{['heaviest', 'lightest'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-700 border-orange-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-orange-500 shadow-[0_5px_0_#EA580C]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">⚖️</div>
        <p className="font-display font-black text-orange-700 text-sm">Force Measurer!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">📚➡️⬅️</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: push a heavy book across a table, then pull it. Which one feels easier? Why do you think so?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FFEDD5" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EA580C" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-orange-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-orange-600 shadow-[0_6px_0_#C2410C] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
