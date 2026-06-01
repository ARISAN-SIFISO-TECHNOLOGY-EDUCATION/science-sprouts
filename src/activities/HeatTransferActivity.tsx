// Activity: Heat Transfer — Age 12 (Band C12 · CAPS Gr 7)
//   Plan (predict) → Classify how heat moves → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';
type Group = 'conduction' | 'convection' | 'radiation';

interface Scene { id: string; emoji: string; name: string; group: Group; }
const SCENES: Scene[] = [
  { id: 'spoon', emoji: '🥄', name: 'A metal spoon heats up in hot soup', group: 'conduction' },
  { id: 'pan',   emoji: '🍳', name: 'A pan handle gets hot on the stove',  group: 'conduction' },
  { id: 'air',   emoji: '♨️', name: 'Warm air rises above a heater',       group: 'convection' },
  { id: 'boil',  emoji: '🍲', name: 'Water circulates as it boils',        group: 'convection' },
  { id: 'sun',   emoji: '☀️', name: 'The sun warms your face',            group: 'radiation' },
  { id: 'fire',  emoji: '🔥', name: 'Heat reaches you across a room from a fire', group: 'radiation' },
];
const GROUPS: { id: Group; label: string; emoji: string }[] = [
  { id: 'conduction', label: 'Conduction', emoji: '🤝' },
  { id: 'convection', label: 'Convection', emoji: '🔄' },
  { id: 'radiation',  label: 'Radiation',  emoji: '📡' },
];

const OBJECTIVE_ID = 'ec.heat_transfer';
const BADGE = 'Heat Mover Badge 🔥';

const PLAN_VOICE = "Heat moves in three ways. Conduction is through touching solids. Convection is through moving liquids and gases. Radiation travels as rays, even through empty space. How does the sun's heat reach us across space — by conduction, or by radiation? Predict!";
const TEST_VOICE = "Sort each example. Is the heat moving by conduction, convection, or radiation?";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Heat Mover Badge! Hold your hand near a warm cup — feel radiation. Stir a hot drink with a metal spoon and feel it warm up — that is conduction. Heat is moving around you all the time!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function HeatTransferActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const cur = SCENES[idx];
  const done = idx >= SCENES.length;

  function predict() { setPredicted(true); speak("Let's sort how heat moves!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function sort(g: Group) {
    if (feedback !== 'idle') return;
    const correct = g === cur.group;
    setFeedback(correct ? 'right' : 'wrong');
    const grp = GROUPS.find(x => x.id === cur.group)!.label.toLowerCase();
    speak(correct ? `Correct! That is ${grp}.` : `Actually, that is ${grp}.`, 0.92);
    setTimeout(() => {
      setFeedback('idle');
      if (idx + 1 >= SCENES.length) setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 200);
      setIdx(i => i + 1);
    }, 1400);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'conduction' && blank2 === 'radiation') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Heat moving through a solid metal spoon is conduction. Heat reaching us from the sun across empty space is radiation. Moving air and water carry heat by convection. You are a Heat Mover!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Through a solid is conduction. From the sun is radiation. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-orange-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">☀️🥄🔥</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">How does the sun's heat reach us across space?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-orange-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-orange-200 rounded-3xl active:scale-95"><span className="text-3xl">🤝</span><p className="font-black text-orange-700 text-[11px] uppercase mt-1">Conduction</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-orange-200 rounded-3xl active:scale-95"><span className="text-3xl">📡</span><p className="font-black text-orange-700 text-[11px] uppercase mt-1">Radiation</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">🔥</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && !done && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <p className="text-center text-xs text-orange-400 font-black uppercase">Example {idx + 1} of {SCENES.length}</p>
            <motion.div key={cur.id} initial={{ scale: 0.8, opacity: 0 }} animate={feedback === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : { scale: 1, opacity: 1 }}
              className={`bg-white rounded-3xl p-6 border-2 shadow-md text-center w-full max-w-xs ${feedback === 'right' ? 'border-green-300' : feedback === 'wrong' ? 'border-red-300' : 'border-orange-100'}`}>
              <p className="text-6xl mb-2">{cur.emoji}</p>
              <p className="font-display font-black text-sm text-gray-800 leading-snug">{cur.name}</p>
            </motion.div>
            <p className="text-xs text-orange-500 font-bold">How is the heat moving?</p>
            <div className="flex gap-2 w-full max-w-xs">
              {GROUPS.map(g => (
                <motion.button key={g.id} whileTap={{ scale: 0.92 }} onClick={() => sort(g.id)} disabled={feedback !== 'idle'} className="flex-1 py-3 bg-white border-2 border-orange-200 rounded-2xl font-black text-orange-700 text-[9px] uppercase active:scale-95 flex flex-col items-center gap-1">
                  <span className="text-xl">{g.emoji}</span>{g.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-orange-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-orange-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-orange-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Heat moving through a metal spoon is{' '}
                <span className={`inline-block min-w-[72px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-orange-200 text-orange-300'}`}>{blank1 ?? '____'}</span>.
                Heat from the sun is{' '}
                <span className={`inline-block min-w-[64px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-orange-100 border-orange-400 text-orange-700' : 'border-orange-200 text-orange-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — through a solid spoon…</p>
              <div className="flex gap-2">{['conduction', 'radiation'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-700 border-orange-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — from the sun…</p>
              <div className="flex gap-2">{['radiation', 'convection'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-xs border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-700 border-orange-200'}`}>{w}</button>))}</div>
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
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🔥</div>
        <p className="font-display font-black text-orange-700 text-sm">Heat Mover Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-orange-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🥄♨️☀️</p>
        <p className="font-black text-gray-700 text-base leading-snug">Hold a hand near a warm cup — that is radiation. Stir a hot drink with a metal spoon and feel it warm — that is conduction!</p>
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
