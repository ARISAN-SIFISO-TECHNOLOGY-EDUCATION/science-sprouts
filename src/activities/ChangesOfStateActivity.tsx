// Activity: Changes of State — Age 11 (Band C11 · CAPS Gr 6)
//   Plan (predict) → Classify changes as heating / cooling → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';
type Group = 'heat' | 'cool';

interface Change { id: string; emoji: string; name: string; group: Group; }
const CHANGES: Change[] = [
  { id: 'melt',   emoji: '🧊', name: 'Ice melting',        group: 'heat' },
  { id: 'evap',   emoji: '💨', name: 'A puddle drying up', group: 'heat' },
  { id: 'wax',    emoji: '🕯️', name: 'Candle wax melting', group: 'heat' },
  { id: 'freeze', emoji: '❄️', name: 'Water freezing',     group: 'cool' },
  { id: 'dew',    emoji: '💧', name: 'Dew forming at night', group: 'cool' },
  { id: 'mist',   emoji: '🌫️', name: 'Mist on a cold mirror', group: 'cool' },
];
const GROUPS: { id: Group; label: string; emoji: string }[] = [
  { id: 'heat', label: 'Add heat',  emoji: '🔥' },
  { id: 'cool', label: 'Take heat away', emoji: '❄️' },
];

const OBJECTIVE_ID = 'mm.changes_of_state';
const BADGE = 'State Changer Badge 🌡️';

const PLAN_VOICE = "Matter changes state when it gains or loses heat. Adding heat can melt a solid or boil a liquid. Taking heat away can freeze a liquid. Does ice need heat ADDED or heat TAKEN AWAY to melt? Predict!";
const TEST_VOICE = "Sort each change. Does it happen when we ADD heat, or when we take heat AWAY?";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the State Changer Badge! Put an ice cube on a plate and watch it melt — heat from the room is changing it from solid to liquid. Where could you see water vapour turn back into drops?";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function ChangesOfStateActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const cur = CHANGES[idx];
  const done = idx >= CHANGES.length;

  function predict() { setPredicted(true); speak("Let's sort changes of state!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function sort(g: Group) {
    if (feedback !== 'idle') return;
    const correct = g === cur.group;
    setFeedback(correct ? 'right' : 'wrong');
    const word = cur.group === 'heat' ? 'heat is ADDED' : 'heat is TAKEN AWAY';
    speak(correct ? `Correct! Here, ${word}.` : `Actually, here, ${word}.`, 0.92);
    setTimeout(() => {
      setFeedback('idle');
      if (idx + 1 >= CHANGES.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 200);
      setIdx(i => i + 1);
    }, 1400);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'melt' && blank2 === 'condense') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Adding heat makes ice melt into water. Taking heat away makes water vapour condense back into drops. Heat is the key to every change of state. You are a State Changer!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Adding heat melts ice. Cooling makes vapour condense. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-blue-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🧊🔥❄️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">Does ice need heat ADDED or TAKEN AWAY to melt?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-blue-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">🔥</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">Add heat</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-blue-200 rounded-3xl active:scale-95"><span className="text-3xl">❄️</span><p className="font-black text-blue-700 text-[11px] uppercase mt-1">Take away</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🌡️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && !done && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-blue-400 font-black uppercase">Change {idx + 1} of {CHANGES.length}</p>
            <motion.div key={cur.id} initial={{ scale: 0.8, opacity: 0 }} animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
              className={`bg-white rounded-3xl p-6 border-2 shadow-md text-center w-full max-w-xs ${feedback === 'right' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-blue-100'}`}>
              <p className="text-6xl mb-2">{cur.emoji}</p>
              <p className="font-display font-black text-base text-gray-800">{cur.name}</p>
            </motion.div>
            <p className="text-xs text-blue-500 font-bold">Heat added — or heat taken away?</p>
            <div className="flex gap-2 w-full max-w-xs">
              {GROUPS.map(g => (
                <motion.button key={g.id} whileTap={{ scale: 0.92 }} onClick={() => sort(g.id)} disabled={feedback !== 'idle'} className="flex-1 py-3 bg-white border-2 border-blue-200 rounded-2xl font-black text-blue-700 text-[10px] uppercase active:scale-95 flex flex-col items-center gap-1">
                  <span className="text-xl">{g.emoji}</span>{g.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-blue-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Adding heat makes ice{' '}
                <span className={`inline-block min-w-[48px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank1 ?? '____'}</span>.
                Taking heat away makes water vapour{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-blue-200 text-blue-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — adding heat makes ice…</p>
              <div className="flex gap-2">{['melt', 'freeze'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — cooling makes vapour…</p>
              <div className="flex gap-2">{['condense', 'evaporate'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-700 border-blue-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-blue-500 shadow-[0_5px_0_#2563EB]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌡️</div>
        <p className="font-display font-black text-blue-700 text-sm">State Changer Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-blue-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🧊💧💨</p>
        <p className="font-black text-gray-700 text-base leading-snug">Put an ice cube on a plate and watch it melt — heat from the room turns solid into liquid. Where could vapour turn back into drops?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DBEAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563EB" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-blue-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-blue-600 shadow-[0_6px_0_#1D4ED8] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
