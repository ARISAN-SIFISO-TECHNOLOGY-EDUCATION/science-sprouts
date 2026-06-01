// Activity: Levers & Simple Machines — Age 11 (Band C11 · CAPS Gr 6)
//   Plan (predict) → Investigate: move the effort along a lever → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const OBJECTIVE_ID = 'ec.levers';
const BADGE = 'Lever Master Badge ⚖️';

const PLAN_VOICE = "A lever is a simple machine. It balances on a point called a pivot. To lift a heavy load with less effort, where should you push — close to the pivot, or far from it? Predict!";
const TEST_VOICE = "Drag the slider to move where you push. Watch the effort it takes to lift the heavy rock. When the lever tips, you have lifted it — then record your result.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Lever Master Badge! Find a lever at home — a bottle opener, a see-saw, scissors, or a spoon prying a lid. They all help you push or lift with less effort. Simple machines make hard jobs easy!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function LeversActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [armLen, setArmLen] = useState(1);   // 1 (near pivot) … 5 (far)
  const [lifted, setLifted] = useState(false);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const effort = Math.max(10, 110 - armLen * 20);  // % effort needed, falls as arm grows
  const tipped = armLen >= 4;

  function predict() { setPredicted(true); speak("Let's lift a heavy rock with a lever!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function onArm(v: number) {
    setArmLen(v);
    if (v >= 4 && !lifted) { setLifted(true); speak("It tipped! With a long effort arm, it lifts easily.", 0.92); }
  }

  function record() { setPhase('conclude'); speak(CONCLUDE_VOICE); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'easier' && blank2 === 'machine') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! Pushing far from the pivot makes lifting easier — a longer effort arm gives you more turning force. A lever is a simple machine that helps us do work. You are a Lever Master!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Pushing far from the pivot makes it easier. A lever is a simple machine. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  return (
    <div className="fixed inset-0 bg-teal-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">⚖️🪨💪</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">To lift with less effort, push near the pivot or far from it?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-teal-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-teal-200 rounded-3xl active:scale-95"><span className="text-3xl">👌</span><p className="font-black text-teal-700 text-[11px] uppercase mt-1">Near</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-teal-200 rounded-3xl active:scale-95"><span className="text-3xl">🫳</span><p className="font-black text-teal-700 text-[11px] uppercase mt-1">Far</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⚖️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-teal-700 text-base">⚖️ Lever Test</p>
            {/* Lever beam */}
            <div className="relative w-full max-w-xs h-28 flex items-end justify-center">
              <motion.div animate={{ rotate: tipped ? -18 : 14 }} style={{ transformOrigin: '50% 100%' }} className="absolute bottom-6 w-64 h-3 bg-teal-600 rounded-full flex items-center justify-between px-1">
                <span className="text-2xl -mt-6">🪨</span>
                <span className="text-2xl -mt-6">💪</span>
              </motion.div>
              <div className="absolute bottom-0 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[28px] border-l-transparent border-r-transparent border-b-teal-700" />
            </div>
            <div className={`px-5 py-2 rounded-2xl font-display font-black text-lg ${tipped ? 'bg-green-100 text-green-700' : 'bg-teal-100 text-teal-700'}`}>
              {tipped ? 'Lifted! 🎉' : `Effort needed: ${effort}%`}
            </div>
            <div className="w-full max-w-xs">
              <p className="text-xs text-teal-600 font-bold text-center mb-1">Push distance from pivot: {armLen}</p>
              <input type="range" min={1} max={5} value={armLen} onChange={e => onArm(Number(e.target.value))} className="w-full accent-teal-600 h-3" />
              <div className="flex justify-between text-[10px] font-black text-teal-400 mt-1"><span>near pivot</span><span>far from pivot</span></div>
            </div>
            <button onClick={record} disabled={!lifted} className={`px-8 py-4 rounded-3xl font-display font-black text-lg text-white btn-press ${lifted ? 'bg-teal-600 shadow-[0_5px_0_#0F766E]' : 'bg-gray-300'}`}>
              {lifted ? 'Record result →' : 'Move the effort out…'}
            </button>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-teal-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-teal-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                Pushing far from the pivot makes lifting{' '}
                <span className={`inline-block min-w-[52px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-teal-100 border-teal-400 text-teal-700' : 'border-teal-200 text-teal-300'}`}>{blank1 ?? '____'}</span>.
                A lever is a simple{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-teal-100 border-teal-400 text-teal-700' : 'border-teal-200 text-teal-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — far from pivot, lifting is…</p>
              <div className="flex gap-2">{['easier', 'harder'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-teal-700 border-teal-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — a lever is a simple…</p>
              <div className="flex gap-2">{['machine', 'animal'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-teal-700 border-teal-200'}`}>{w}</button>))}</div>
            </div>
            <button onClick={check} disabled={!blank1 || !blank2 || result === 'correct'} className={`w-full py-4 font-display font-black text-lg rounded-3xl btn-press text-white ${blank1 && blank2 ? 'bg-teal-600 shadow-[0_5px_0_#0F766E]' : 'bg-gray-300'}`}>{result === 'correct' ? '✓ Brilliant!' : 'Check my conclusion ✓'}</button>
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
      <button onClick={onExit} className="self-start text-teal-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">⚖️</div>
        <p className="font-display font-black text-teal-700 text-sm">Lever Master Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-teal-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">⚖️✂️🥄</p>
        <p className="font-black text-gray-700 text-base leading-snug">Find a lever at home — a bottle opener, see-saw, scissors, or a spoon prying a lid. Simple machines make hard jobs easy!</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CCFBF1" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0F766E" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-teal-600 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-teal-700 shadow-[0_6px_0_#115E59] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
