// Activity: Day & Night — Age 5 (Band A5)
// Pattern: See → Predict → Do → Caregiver Card
//
// See     (8s):  Sky auto-cycles day → sunset → night with big DAY / NIGHT labels
// Predict (30s): "When is it DARK?" — 2 choices
// Do      (60s): Tap ← → to move the sun. Sky + child in window change with it.
// Card   (120s): "Tonight find 3 stars! Look at the sky."

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';

type Phase = 'see' | 'predict' | 'do' | 'card';

// 4 sky positions: dawn → day → dusk → night
const SKY_STATES = [
  { id: 'dawn',  emoji: '🌅', label: 'MORNING', sky: 'from-orange-200 to-yellow-100', stars: false, childAwake: true,  voice: 'Morning! The sun is rising. It is starting to get light!' },
  { id: 'day',   emoji: '☀️', label: 'DAY',     sky: 'from-sky-400 to-sky-100',      stars: false, childAwake: true,  voice: 'Daytime! The sun is high. It is bright and warm!' },
  { id: 'dusk',  emoji: '🌇', label: 'EVENING', sky: 'from-orange-400 to-purple-200', stars: false, childAwake: true,  voice: 'Evening! The sun is going down. It is getting darker.' },
  { id: 'night', emoji: '🌙', label: 'NIGHT',   sky: 'from-indigo-900 to-slate-700', stars: true,  childAwake: false, voice: 'Night time! The sun has gone. It is DARK! Time to sleep.' },
];

const SEE_VOICE    = "Look at the sky! In the DAY the sun shines and it is bright. At NIGHT the sun is gone and it is DARK. Let us see the sky change!";
const CARD_VOICE   = "Tonight, go outside with a grown-up after dark! Look up at the sky. Can you find three stars? Count them on your fingers!";

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

export default function DayNightActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]     = useState<Phase>('see');
  const [seeIdx, setSeeIdx]   = useState(0);
  const [skyIdx, setSkyIdx]   = useState(1);    // start at day in DO phase
  const [visited, setVisited] = useState<Set<number>>(new Set([1]));
  const [predicted, setPredicted] = useState(false);
  const allVisited = visited.size >= SKY_STATES.length;

  // SEE: auto-cycle through all 4 sky states
  useEffect(() => {
    speak(SEE_VOICE);
    const ts = [0, 1, 2, 3].map(i => setTimeout(() => setSeeIdx(i), i * 1800));
    const tEnd = setTimeout(() => setPhase('predict'), 4 * 1800 + 500);
    return () => { ts.forEach(clearTimeout); clearTimeout(tEnd); stopAudio(); };
  }, []);

  // DO: speak when sky changes
  const prevSkyIdx = useRef(skyIdx);
  useEffect(() => {
    if (phase !== 'do') return;
    if (skyIdx === prevSkyIdx.current) return;
    prevSkyIdx.current = skyIdx;
    const s = SKY_STATES[skyIdx];
    const isNewAndLast = !visited.has(skyIdx) && visited.size + 1 >= SKY_STATES.length;
    speak(s.voice, 0.85, isNewAndLast ? () => setPhase('card') : undefined);
    setVisited(prev => new Set([...prev, skyIdx]));
  }, [skyIdx, phase, visited]);

  function goLeft()  { setSkyIdx(i => (i - 1 + SKY_STATES.length) % SKY_STATES.length); }
  function goRight() { setSkyIdx(i => (i + 1) % SKY_STATES.length); }

  function predict(isNight: boolean) {
    setPredicted(true);
    const msg = isNight
      ? "Yes! It is DARK at night when the sun goes away! Great thinking!"
      : "Let's find out! It is dark at NIGHT when the sun goes away!";
    speak(msg, 0.85, () => setPhase('do'));
  }

  const seeSky   = SKY_STATES[seeIdx];
  const doSky    = SKY_STATES[skyIdx];

  return (
    <div className="fixed inset-0 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {/* ── SEE ───────────────────────────────────────────────────────── */}
        {phase === 'see' && (
          <motion.div key="see" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
            <button onClick={onExit} className="absolute top-4 left-4 z-10 text-white/70 text-sm font-bold">← Back</button>
            <AnimatePresence mode="wait">
              <motion.div key={seeIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
                className={`flex-1 bg-gradient-to-b ${seeSky.sky} flex flex-col items-center justify-center`}>
                <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl mb-3">
                  {seeSky.emoji}
                </motion.span>
                <motion.p key={seeSky.label} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                  className="font-display font-black text-5xl text-white drop-shadow-xl mb-2">
                  {seeSky.label}
                </motion.p>
                {seeSky.stars && (
                  <div className="flex gap-3 text-3xl">
                    {['⭐', '🌟', '✨', '⭐', '🌟'].map((s, i) => (
                      <motion.span key={i} animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}>{s}</motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="bg-white p-4 border-t-2 border-gray-100 text-center">
              <p className="font-bold text-gray-700 text-sm leading-snug">{SEE_VOICE}</p>
              <button onClick={() => speak(SEE_VOICE)} className="mt-1 flex items-center gap-1 mx-auto text-sky-400 text-sm font-bold">
                <Volume2 size={14} /> Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PREDICT ───────────────────────────────────────────────────── */}
        {phase === 'predict' && !predicted && (
          <motion.div key="predict" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌙🤔</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">When is it DARK outside?</p>
              <button onClick={() => speak("When is it dark outside?")} className="mt-2 flex items-center gap-1 mx-auto text-sky-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(false)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-3xl active:scale-95">
                <span className="text-5xl">☀️</span>
                <span className="font-black text-yellow-700 text-sm uppercase">When sun shines</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => predict(true)}
                className="flex-1 flex flex-col items-center gap-2 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-3xl active:scale-95">
                <span className="text-5xl">🌙</span>
                <span className="font-black text-indigo-700 text-sm uppercase">When sun goes away</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'predict' && predicted && (
          <motion.div key="predDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col h-full items-center justify-center gap-3">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-7xl">🌙</motion.div>
          </motion.div>
        )}

        {/* ── DO ────────────────────────────────────────────────────────── */}
        {phase === 'do' && (
          <motion.div key="do" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
            <AnimatePresence mode="wait">
              <motion.div key={skyIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                className={`relative flex-1 bg-gradient-to-b ${doSky.sky} flex flex-col items-center justify-center overflow-hidden`}>

                <button onClick={onExit} className="absolute top-4 left-4 text-white/60 text-sm font-bold">← Back</button>

                {/* Stars */}
                {doSky.stars && (
                  <div className="absolute inset-0 pointer-events-none">
                    {['⭐','🌟','✨','⭐','🌟','✨','⭐'].map((s, i) => (
                      <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5 + i * 0.2, repeat: Infinity }}
                        className="absolute text-xl" style={{ top: `${10 + (i * 11) % 40}%`, left: `${5 + (i * 13) % 85}%` }}>{s}</motion.span>
                    ))}
                  </div>
                )}

                {/* Sky icon */}
                <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-2">
                  {doSky.emoji}
                </motion.span>

                {/* Big label */}
                <p className="font-display font-black text-4xl text-white drop-shadow-lg mb-4">{doSky.label}</p>

                {/* House with child */}
                <div className="bg-white/20 rounded-3xl px-6 py-4 text-center">
                  <p className="text-5xl">{doSky.childAwake ? '🧒😊' : '🧒😴'}</p>
                  <p className="text-xs font-black text-white/80 mt-1">{doSky.childAwake ? 'Awake & playing' : 'Sleeping 💤'}</p>
                </div>

                {/* Visited dots */}
                <div className="absolute bottom-4 flex gap-2">
                  {SKY_STATES.map((s, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all ${visited.has(i) ? 'bg-white' : 'bg-white/30'}`} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="bg-white p-4 border-t-2 border-gray-100 flex items-center gap-3">
              <button onClick={goLeft} className="flex-1 py-4 bg-gray-100 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                <ChevronLeft size={32} className="text-gray-600" />
              </button>
              <button onClick={() => speak(doSky.voice)} className="p-4 bg-sky-400 rounded-2xl text-white active:scale-95 transition-transform">
                <Volume2 size={24} />
              </button>
              <button onClick={goRight} className="flex-1 py-4 bg-gray-100 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                <ChevronRight size={32} className="text-gray-600" />
              </button>
            </div>
            {allVisited && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setPhase('card')}
                className="mx-4 mb-4 py-4 bg-indigo-500 shadow-[0_4px_0_#4338CA] text-white font-display font-black text-xl rounded-3xl btn-press">
                I found day AND night! →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── CARD ──────────────────────────────────────────────────────── */}
        {phase === 'card' && <CaregiverCard onComplete={onComplete} onExit={onExit} />}

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
      className="flex flex-col h-full p-6 items-center bg-indigo-50">
      <button onClick={onExit} className="self-start text-indigo-300 text-sm font-bold mb-4">← Back</button>
      <div className="bg-indigo-100 border-2 border-indigo-200 rounded-2xl px-4 py-2 flex items-center gap-2 mb-4">
        <span>👨‍👩‍👧</span><span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Night Mission!</span>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-indigo-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">🌙⭐🔭</p>
        <p className="font-black text-gray-700 text-base leading-snug">
          Tonight, go outside after dark with a grown-up! Look up. Can you find THREE stars? Count them on your fingers!
        </p>
      </div>
      <div className="flex gap-3 w-full max-w-xs mb-5">
        <div className="flex-1 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">☀️</span><p className="text-[10px] font-black text-yellow-700 uppercase mt-1">DAY = Sun is up</p>
        </div>
        <div className="flex-1 bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3 text-center">
          <span className="text-3xl">🌙</span><p className="text-[10px] font-black text-indigo-700 uppercase mt-1">NIGHT = Stars come out</p>
        </div>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0E7FF" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366F1" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-black text-indigo-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-indigo-500 shadow-[0_6px_0_#4338CA] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
