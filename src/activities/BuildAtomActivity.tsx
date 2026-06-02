// Activity: Build an Atom — Age 12 (Band C12 · CAPS Gr 7)
//   Plan (predict) → Add electrons to balance the atom → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'test' | 'conclude' | 'card';

const PROTONS = 3;   // a lithium-like atom
const OBJECTIVE_ID = 'mm.atom';
const BADGE = 'Atom Builder Badge ⚛️';

const PLAN_VOICE = "Everything is made of atoms. At the centre is the nucleus, holding positive protons. Tiny negative electrons whizz around it. An atom is balanced when it has the same number of electrons as protons. This nucleus has three protons. How many electrons do we need? Predict — three, or one?";
const TEST_VOICE = "Tap to add electrons, one at a time, until the atom is balanced — the same number of electrons as the three protons.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Atom Builder Badge! Atoms are so small that millions would fit on this full stop. Yet everything — you, the air, the stars — is built from them. You just balanced one!";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function BuildAtomActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);
  const [electrons, setElectrons] = useState(0);
  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);
  const balanced = electrons === PROTONS;

  function predict() { setPredicted(true); speak("Let's build a balanced atom!", 0.9, () => { setPhase('test'); setTimeout(() => speak(TEST_VOICE), 300); }); }

  function addElectron() {
    if (electrons >= PROTONS) return;
    const next = electrons + 1;
    setElectrons(next);
    if (next === PROTONS) speak("Balanced! Three electrons match the three protons.", 0.9, () => setTimeout(() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }, 400));
    else speak(`${next} electron${next > 1 ? 's' : ''}. Keep going.`, 0.95);
  }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'nucleus' && blank2 === 'protons') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! The centre of an atom is the nucleus, where the protons are. An atom is balanced when the number of electrons equals the number of protons. You are an Atom Builder!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("The centre is the nucleus, and electrons balance the protons. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  // electron positions around the nucleus
  const positions = [0, 120, 240];

  return (
    <div className="fixed inset-0 bg-violet-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">⚛️</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">3 protons — how many electrons to balance it?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-violet-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">3️⃣</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">Three</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-violet-200 rounded-3xl active:scale-95"><span className="text-3xl">1️⃣</span><p className="font-black text-violet-700 text-[11px] uppercase mt-1">One</p></motion.button>
              </div>
            ) : <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-6xl">⚛️</motion.div>}
          </motion.div>
        )}

        {phase === 'test' && (
          <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-violet-700 text-base">⚛️ Build a Balanced Atom</p>
            {/* Atom model */}
            <div className="relative w-56 h-56">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border-2 border-dashed border-violet-200" />
              {/* Nucleus */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-violet-500 rounded-full flex flex-col items-center justify-center text-white shadow-lg">
                  <span className="font-black text-lg">+{PROTONS}</span>
                  <span className="text-[9px] font-bold uppercase">nucleus</span>
                </div>
              </div>
              {/* Electrons */}
              {positions.slice(0, electrons).map((deg, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0"
                  style={{ transform: `rotate(${deg}deg)` }}>
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">−</div>
                </motion.div>
              ))}
            </div>
            <p className="font-display font-black text-violet-700">Electrons: {electrons} / {PROTONS}</p>
            <motion.button whileTap={{ scale: 0.94 }} onClick={addElectron} disabled={balanced}
              className={`px-8 py-4 rounded-3xl font-display font-black text-lg text-white btn-press ${balanced ? 'bg-green-500 shadow-[0_5px_0_#16A34A]' : 'bg-blue-500 shadow-[0_5px_0_#2563EB]'}`}>
              {balanced ? 'Balanced! ✓' : '+ Add an electron'}
            </motion.button>
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-violet-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-violet-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-violet-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                The centre of an atom is the{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank1 ?? '____'}</span>.
                An atom is balanced when its electrons equal its{' '}
                <span className={`inline-block min-w-[56px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-violet-200 text-violet-300'}`}>{blank2 ?? '____'}</span>.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1 — the centre is the…</p>
              <div className="flex gap-2">{['nucleus', 'electron'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2 — electrons equal the…</p>
              <div className="flex gap-2">{['protons', 'planets'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200'}`}>{w}</button>))}</div>
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
        <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">⚛️</div>
        <p className="font-display font-black text-violet-700 text-sm">Atom Builder Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-violet-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">⚛️➕➖</p>
        <p className="font-black text-gray-700 text-base leading-snug">Atoms are so small that millions fit on a full stop. Yet you, the air, and the stars are all built from them — and you just balanced one!</p>
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
