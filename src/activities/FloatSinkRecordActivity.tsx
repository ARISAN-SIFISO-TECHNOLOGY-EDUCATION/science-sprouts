// Activity: Floating & Sinking — Age 6 (Band B6)
// Foundation Phase Gr 1 — the "graduate" version of bath play.
// Pattern: Predict → Test & Record (data table) → Fact → Badge + Caregiver Card
//
// NEW Age-6 mechanic: a real DATA TABLE. The child predicts, then tests each
// object and records the result. Reading level = 3–5 word sentences + voice.
// Completing the table earns the "Observer Badge".

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'predict' | 'record' | 'fact' | 'card';

interface TestObject { id: string; emoji: string; name: string; floats: boolean; }

const OBJECTS: TestObject[] = [
  { id: 'spoon', emoji: '🥄', name: 'Spoon',  floats: false },
  { id: 'leaf',  emoji: '🍃', name: 'Leaf',   floats: true  },
  { id: 'coin',  emoji: '🪙', name: 'Coin',   floats: false },
  { id: 'cap',   emoji: '🧴', name: 'Cap',    floats: true  },
  { id: 'stone', emoji: '🪨', name: 'Stone',  floats: false },
];

const OBJECTIVE_ID = 'mm.float_sink_record';
const BADGE = 'Observer Badge 🔭';

const PREDICT_VOICE = "Will a big rock float? Tap your guess!";
const RECORD_VOICE  = "Now test each thing! Tap it to drop it in the water. Watch — does it float or sink?";
const FACT_VOICE    = "Light things with air float. Heavy things sink!";
const CARD_VOICE    = "You earned the Observer Badge! Now do bath science. Test three things. Do they float or sink?";

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

export default function FloatSinkRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('predict');
  const [predicted, setPredicted] = useState(false);
  const [recorded, setRecorded]   = useState<Record<string, boolean>>({}); // id → floats
  const [dropping, setDropping]   = useState<TestObject | null>(null);

  useEffect(() => {
    speak(PREDICT_VOICE);
    return () => stopAudio();
  }, []);

  function predict() {
    setPredicted(true);
    speak("Good guess! A rock SINKS because it is heavy. Now let's test more things!", 0.85, () => {
      setPhase('record');
      setTimeout(() => speak(RECORD_VOICE), 300);
    });
  }

  function testObject(obj: TestObject) {
    if (obj.id in recorded) return;
    setDropping(obj);
    const isLast = Object.keys(recorded).length + 1 >= OBJECTS.length;
    speak(`${obj.name}. It ${obj.floats ? 'FLOATS' : 'SINKS'}!`, 0.85, () => {
      if (isLast) { awardBadge(OBJECTIVE_ID, BADGE); setTimeout(() => setPhase('fact'), 400); }
    });
    setRecorded(prev => ({ ...prev, [obj.id]: obj.floats }));
    setTimeout(() => setDropping(null), 1600);
  }

  const remaining = OBJECTS.filter(o => !(o.id in recorded));

  return (
    <div className="fixed inset-0 bg-blue-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && (
          <motion.div key="predict" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center w-full max-w-xs">
              <p className="text-6xl mb-3">🪨💧</p>
              <p className="font-display font-black text-2xl text-gray-800 leading-snug">Will a big rock float?</p>
              <button onClick={() => speak(PREDICT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-blue-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!predicted ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">🌊</span>
                  <span className="font-black text-sky-700 text-sm uppercase">Yes, floats</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={predict}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-3xl active:scale-95">
                  <span className="text-4xl">⬇️</span>
                  <span className="font-black text-blue-700 text-sm uppercase">No, sinks</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">🪨</motion.div>
            )}
          </motion.div>
        )}

        {/* ── TEST & RECORD (data table) ─────────────────────────────────── */}
        {phase === 'record' && (
          <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-blue-600 text-sm uppercase tracking-widest mb-1">
              Test it. Record it!
            </p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">Tap a thing to drop it in 💧</p>

            {/* Objects to test */}
            {remaining.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {remaining.map(o => (
                  <motion.button key={o.id} whileTap={{ scale: 0.88 }} onClick={() => testObject(o)}
                    className="flex flex-col items-center gap-0.5 p-2 bg-white rounded-2xl shadow-md border-2 border-gray-100 active:scale-95">
                    <span className="text-3xl">{o.emoji}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase">{o.name}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Water tank */}
            <div className="relative h-20 bg-blue-100 rounded-2xl border-2 border-blue-200 overflow-hidden mb-3 flex items-center justify-center">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-blue-300/60" />
              <AnimatePresence>
                {dropping && (
                  <motion.span key={dropping.id}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: dropping.floats ? -8 : 18, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-4xl">{dropping.emoji}</motion.span>
                )}
              </AnimatePresence>
              {!dropping && <span className="text-blue-300 text-xs font-bold">Water tank</span>}
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden flex-1">
              <div className="grid grid-cols-2 bg-blue-500 text-white text-xs font-black uppercase tracking-wide">
                <div className="p-2 text-center border-r border-blue-400">Object</div>
                <div className="p-2 text-center">What happened</div>
              </div>
              {OBJECTS.map(o => {
                const done = o.id in recorded;
                return (
                  <div key={o.id} className={`grid grid-cols-2 border-b border-gray-100 ${done ? '' : 'opacity-30'}`}>
                    <div className="p-2 flex items-center justify-center gap-2 border-r border-gray-100">
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="text-xs font-bold text-gray-600">{o.name}</span>
                    </div>
                    <div className="p-2 flex items-center justify-center">
                      {done ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className={`text-xs font-black px-2 py-1 rounded-full ${recorded[o.id] ? 'bg-sky-100 text-sky-700' : 'bg-blue-200 text-blue-800'}`}>
                          {recorded[o.id] ? '🌊 FLOAT' : '⬇️ SINK'}
                        </motion.span>
                      ) : (
                        <span className="text-gray-300 text-lg">?</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── FACT ──────────────────────────────────────────────────────── */}
        {phase === 'fact' && (
          <motion.div key="fact" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full items-center justify-center p-6 gap-5">
            {/* Badge reveal */}
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }}
              className="flex flex-col items-center">
              <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center text-6xl shadow-xl mb-2">🔭</div>
              <p className="font-display font-black text-blue-700 text-lg">Observer Badge!</p>
              <p className="text-xs text-gray-400 font-bold">You tested and recorded 5 things!</p>
            </motion.div>

            <div className="bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center max-w-xs">
              <p className="text-4xl mb-2">🍃 floats · 🪨 sinks</p>
              <p className="font-display font-black text-lg text-gray-800 leading-snug">
                Light things with air float. Heavy things sink.
              </p>
              <button onClick={() => speak(FACT_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-blue-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>

            <button onClick={() => { setPhase('card'); }}
              className="w-full max-w-xs py-4 bg-blue-500 shadow-[0_6px_0_#2563EB] text-white font-display font-black text-xl rounded-3xl btn-press">
              Next →
            </button>
          </motion.div>
        )}

        {/* ── CARD ──────────────────────────────────────────────────────── */}
        {phase === 'card' && (
          <CaregiverCard onComplete={onComplete} onExit={onExit} />
        )}

      </AnimatePresence>
    </div>
  );
}

function CaregiverCard({ onComplete, onExit }: { onComplete: () => void; onExit: () => void }) {
  const r = useCountdown(120, onComplete);
  const pct = (r / 120) * 100;
  useEffect(() => {
    const t = setTimeout(() => speak(CARD_VOICE), 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div key="card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full p-6 items-center">
      <button onClick={onExit} className="self-start text-blue-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-blue-100 border-2 border-blue-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-blue-600 uppercase tracking-widest">Bath Science!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-blue-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🛁🦆🥄</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          At bath time, test 3 things together. Does each one float or sink? Help your child say which is which!
        </p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#DBEAFE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3B82F6" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-blue-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-blue-500 shadow-[0_6px_0_#2563EB] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
