// Activity: Electrical Circuits — Age 9 (Band B · CAPS Gr 4)
// Circuit builder sim: a bulb lights only when the loop is complete.
//   Plan (predict) → Build: make it light, then break it → Conclude → Apply

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'plan' | 'build' | 'conclude' | 'card';

const OBJECTIVE_ID = 'ec.circuits';
const BADGE = 'Circuit Builder Badge ⚡';

const PLAN_VOICE = "What do we need to make a bulb light up? Do you think a battery alone is enough? Predict!";
const BUILD_VOICE = "Build the circuit. Add the battery, wire and bulb, and close the switch. Make the bulb light up!";
const BREAK_VOICE = "It lights! Now break the circuit — open the switch or take a part away — to turn it off.";
const CONCLUDE_VOICE = "Finish your conclusion. Choose a word for each blank.";
const CARD_VOICE = "You earned the Circuit Builder Badge! At home: find three things that use electricity. Trace the path the electricity takes from the wall plug to the device.";

function useCountdown(s: number, onDone: () => void) {
  const [r, setR] = useState(s);
  useEffect(() => { if (r <= 0) { onDone(); return; } const id = setTimeout(() => setR(v => v - 1), 1000); return () => clearTimeout(id); }, [r]); // eslint-disable-line react-hooks/exhaustive-deps
  return r;
}

interface Props { onComplete: () => void; onExit: () => void; }

export default function CircuitBuilderActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>('plan');
  const [predicted, setPredicted] = useState(false);

  // circuit parts
  const [battery, setBattery] = useState(false);
  const [wire, setWire] = useState(false);
  const [bulb, setBulb] = useState(false);
  const [switchClosed, setSwitchClosed] = useState(false);

  const [litOnce, setLitOnce] = useState(false);   // mission 1 done
  const [brokeIt, setBrokeIt] = useState(false);    // mission 2 done

  const [blank1, setBlank1] = useState<string | null>(null);
  const [blank2, setBlank2] = useState<string | null>(null);
  const [result, setResult] = useState<'idle' | 'wrong' | 'correct'>('idle');

  useEffect(() => { speak(PLAN_VOICE); return () => stopAudio(); }, []);

  const lit = battery && wire && bulb && switchClosed;

  // track missions
  useEffect(() => {
    if (lit && !litOnce) { setLitOnce(true); speak("Yes! The bulb lights because the circuit is a complete loop.", 0.9, () => setTimeout(() => speak(BREAK_VOICE), 200)); }
  }, [lit]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (litOnce && !lit && !brokeIt) { setBrokeIt(true); speak("The bulb went out! A break in the loop stops the electricity flowing.", 0.9); }
  }, [lit, litOnce]); // eslint-disable-line react-hooks/exhaustive-deps

  const bothDone = litOnce && brokeIt;

  function predict() { setPredicted(true); speak("Let's build a circuit and find out!", 0.9, () => { setPhase('build'); setTimeout(() => speak(BUILD_VOICE), 300); }); }

  function check() {
    if (!blank1 || !blank2) return;
    if (blank1 === 'complete' && blank2 === 'break') {
      setResult('correct'); awardBadge(OBJECTIVE_ID, BADGE);
      speak("Correct! A bulb lights only when the circuit is a complete loop. If there is a break, the electricity cannot flow. You are a Circuit Builder!", 0.85, () => setTimeout(() => setPhase('card'), 400));
    } else { setResult('wrong'); speak("Think about when the bulb was on and when it went off. Try again.", 0.9); setTimeout(() => setResult('idle'), 1600); }
  }

  const Part = ({ on, label, emoji, onTap }: { on: boolean; label: string; emoji: string; onTap: () => void }) => (
    <button onClick={onTap} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-2 active:scale-95 transition-colors ${on ? 'bg-amber-100 border-amber-400' : 'bg-white border-gray-200'}`}>
      <span className="text-2xl">{emoji}</span>
      <span className={`text-[9px] font-black uppercase ${on ? 'text-amber-700' : 'text-gray-400'}`}>{on ? label : `+ ${label}`}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-amber-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md text-center w-full max-w-sm">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">🔬 Predict</p>
              <p className="text-4xl mb-2">🔋💡</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">What does a bulb need to light up?</p>
              <button onClick={() => speak(PLAN_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-amber-500 text-sm font-bold"><Volume2 size={14} /> Hear it</button>
            </div>
            {!predicted ? (
              <div className="flex gap-3 w-full max-w-sm">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">🔋</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">Battery alone</p></motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict} className="flex-1 p-4 bg-white border-2 border-amber-200 rounded-3xl active:scale-95"><span className="text-3xl">🔄</span><p className="font-black text-amber-700 text-[11px] uppercase mt-1">A full loop</p></motion.button>
              </div>
            ) : <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1 }} className="text-6xl">⚡</motion.div>}
          </motion.div>
        )}

        {phase === 'build' && (
          <motion.div key="build" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold mb-1">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">Circuit Builder ⚡</p>
            <p className="text-center text-[11px] text-amber-500 font-bold mb-2">{!litOnce ? '🎯 Make the bulb light up!' : !brokeIt ? '🎯 Now break the circuit to switch it off' : '✓ Great — you did both!'}</p>

            {/* circuit board */}
            <div className={`flex-1 rounded-3xl border-2 flex items-center justify-center transition-colors ${lit ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-amber-100'}`}>
              <div className="relative w-56 h-44">
                {/* loop wire */}
                <div className={`absolute inset-4 rounded-2xl border-4 ${battery && wire ? (switchClosed ? 'border-amber-500' : 'border-amber-300 border-dashed') : 'border-gray-200 border-dashed'}`} />
                {/* battery top */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-3xl">{battery ? '🔋' : '⬜'}</div>
                {/* bulb bottom */}
                <motion.div animate={lit ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.8, repeat: lit ? Infinity : 0 }} className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-4xl">
                  {bulb ? (lit ? '💡' : '🔘') : '⬜'}
                </motion.div>
                {/* wire left */}
                <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-2xl">{wire ? '➰' : '·'}</div>
                {/* switch right */}
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-2xl">{switchClosed ? '🔛' : '🔣'}</div>
                {lit && <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-amber-700">⚡ Flowing!</span>}
              </div>
            </div>

            {/* part toggles */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              <Part on={battery} label="Battery" emoji="🔋" onTap={() => setBattery(b => !b)} />
              <Part on={wire} label="Wire" emoji="➰" onTap={() => setWire(w => !w)} />
              <Part on={bulb} label="Bulb" emoji="💡" onTap={() => setBulb(b => !b)} />
              <button onClick={() => setSwitchClosed(s => !s)} className={`flex flex-col items-center gap-1 px-2 py-2 rounded-2xl border-2 active:scale-95 ${switchClosed ? 'bg-amber-100 border-amber-400' : 'bg-white border-gray-200'}`}>
                <span className="text-2xl">{switchClosed ? '🔛' : '🔣'}</span>
                <span className={`text-[9px] font-black uppercase ${switchClosed ? 'text-amber-700' : 'text-gray-400'}`}>{switchClosed ? 'Closed' : 'Open'}</span>
              </button>
            </div>

            {bothDone && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setPhase('conclude'); speak(CONCLUDE_VOICE); }} className="mt-3 w-full py-4 bg-amber-500 shadow-[0_5px_0_#D97706] text-white font-display font-black text-lg rounded-3xl btn-press">Write my conclusion →</motion.button>
            )}
          </motion.div>
        )}

        {phase === 'conclude' && (
          <motion.div key="conclude" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full p-5 justify-center gap-4">
            <button onClick={onExit} className="self-start text-amber-300 text-sm font-bold">← Back</button>
            <p className="text-center font-display font-black text-amber-700 text-base">✍️ My Conclusion</p>
            <motion.div animate={result === 'wrong' ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 border-2 border-amber-100 shadow-md">
              <p className="text-lg text-gray-800 font-bold leading-relaxed text-center">
                A bulb lights only when the circuit is a{' '}
                <span className={`inline-block min-w-[72px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank1 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank1 ?? '______'}</span>{' '}
                loop. If there is a{' '}
                <span className={`inline-block min-w-[60px] px-2 py-0.5 rounded-lg font-black border-b-4 ${blank2 ? 'bg-amber-100 border-amber-400 text-amber-700' : 'border-amber-200 text-amber-300'}`}>{blank2 ?? '____'}</span>, it goes out.
              </p>
            </motion.div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 1</p>
              <div className="flex gap-2">{['complete', 'broken'].map(w => (<button key={w} onClick={() => setBlank1(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank1 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Blank 2</p>
              <div className="flex gap-2">{['break', 'battery'].map(w => (<button key={w} onClick={() => setBlank2(w)} className={`flex-1 py-2 rounded-2xl font-black text-sm border-2 active:scale-95 capitalize ${blank2 === w ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-200'}`}>{w}</button>))}</div>
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
        <p className="font-display font-black text-amber-700 text-sm">Circuit Builder Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-amber-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🔌💡📺</p>
        <p className="font-black text-gray-700 text-base leading-snug">At home: find 3 things that use electricity. Trace the path the electricity takes from the wall plug to the device.</p>
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
