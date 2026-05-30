// Activity: Weather & Seasons — Age 6 (Band B6)
// Foundation Phase Gr 1 — observe and record the weather over a week.
// Pattern: Fill a weekly weather CHART (data table) → Why? → Badge + Card

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, stopAudio } from '../lib/utils';
import { awardBadge } from '../lib/db';

type Phase = 'chart' | 'why' | 'card';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

interface Weather { id: string; emoji: string; name: string; }
const WEATHERS: Weather[] = [
  { id: 'sun',   emoji: '☀️', name: 'Sunny'  },
  { id: 'cloud', emoji: '⛅', name: 'Cloudy' },
  { id: 'rain',  emoji: '🌧️', name: 'Rainy'  },
];

const OBJECTIVE_ID = 'eb.weather_seasons';
const BADGE = 'Weather Watcher Badge 🌦️';

const CHART_VOICE = "Be a weather watcher! For each day, tap the weather. Fill in your chart!";
const WHY_VOICE   = "What do we wear when it is RAINY?";
const CARD_VOICE  = "You earned the Weather Watcher Badge! For 3 days, look at the sky each morning. Draw the weather you see!";

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

export default function WeatherChartRecordActivity({ onComplete, onExit }: Props) {
  const [phase, setPhase]   = useState<Phase>('chart');
  const [chart, setChart]   = useState<Record<string, Weather>>({}); // day → weather
  const [activeDay, setActiveDay] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => { speak(CHART_VOICE); return () => stopAudio(); }, []);

  function pick(w: Weather) {
    const day = DAYS[activeDay];
    if (day in chart) return;
    const next = { ...chart, [day]: w };
    setChart(next);
    const isLast = Object.keys(next).length >= DAYS.length;
    speak(`${day}: ${w.name}!`, 0.9, isLast ? () => setTimeout(() => { setPhase('why'); speak(WHY_VOICE); }, 700) : undefined);
    if (!isLast) setActiveDay(d => d + 1);
  }

  function answerWhy() {
    setAnswered(true);
    awardBadge(OBJECTIVE_ID, BADGE);
    speak("Yes! We wear a raincoat when it rains! You are a weather watcher!", 0.85, () => setTimeout(() => setPhase('card'), 400));
  }

  return (
    <div className="fixed inset-0 bg-sky-50 z-40 flex flex-col max-w-lg mx-auto overflow-hidden">
      <AnimatePresence mode="wait">

        {phase === 'chart' && (
          <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-4">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-2">← Back</button>
            <p className="text-center font-display font-black text-sky-600 text-sm uppercase tracking-widest mb-1">My Weather Chart</p>
            <p className="text-center text-xs text-gray-400 font-bold mb-3">
              {Object.keys(chart).length < DAYS.length ? `Tap the weather for ${DAYS[activeDay]}` : 'Chart complete! 🎉'}
            </p>

            {/* Weekly chart */}
            <div className="bg-white rounded-2xl border-2 border-sky-100 overflow-hidden mb-4">
              {DAYS.map((day, i) => {
                const filled = chart[day];
                const isActive = i === activeDay && !filled;
                return (
                  <div key={day} className={`grid grid-cols-2 border-b border-gray-100 ${isActive ? 'bg-sky-50' : ''}`}>
                    <div className="p-3 flex items-center gap-2 border-r border-gray-100">
                      <span className="font-display font-black text-gray-600 text-sm">{day}</span>
                      {isActive && <span className="text-[9px] font-black text-sky-500 animate-pulse">← pick</span>}
                    </div>
                    <div className="p-2 flex items-center justify-center">
                      {filled ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">{filled.emoji}</motion.span>
                      ) : (
                        <span className="text-gray-200 text-lg">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weather picker */}
            {Object.keys(chart).length < DAYS.length && (
              <div className="grid grid-cols-3 gap-3">
                {WEATHERS.map(w => (
                  <motion.button key={w.id} whileTap={{ scale: 0.9 }} onClick={() => pick(w)}
                    className="py-4 bg-white rounded-2xl border-2 border-sky-200 shadow-sm flex flex-col items-center gap-1 active:scale-95">
                    <span className="text-4xl">{w.emoji}</span>
                    <span className="text-[10px] font-black text-sky-600 uppercase">{w.name}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {phase === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full p-6 items-center justify-center gap-5">
            <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold">← Back</button>
            <div className="bg-white rounded-3xl p-5 border-2 border-sky-100 shadow-md text-center w-full max-w-xs">
              <p className="text-5xl mb-3">🌧️❓</p>
              <p className="font-display font-black text-xl text-gray-800 leading-snug">What do we wear when it is RAINY?</p>
              <button onClick={() => speak(WHY_VOICE)} className="mt-2 flex items-center gap-1 mx-auto text-sky-400 text-sm font-bold">
                <Volume2 size={14} /> Hear it
              </button>
            </div>
            {!answered ? (
              <div className="flex gap-4 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🧥☂️</span><span className="font-black text-sky-700 text-xs uppercase">Raincoat</span>
                </motion.button>
                <motion.button whileTap={{ scale: 0.92 }} onClick={answerWhy}
                  className="flex-1 flex flex-col items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl active:scale-95">
                  <span className="text-5xl">🩳😎</span><span className="font-black text-amber-700 text-xs uppercase">Swimsuit</span>
                </motion.button>
              </div>
            ) : (
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="text-6xl">☂️</motion.div>
            )}
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
      <button onClick={onExit} className="self-start text-sky-300 text-sm font-bold mb-3">← Back</button>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 9 }} className="flex flex-col items-center mb-3">
        <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-4xl shadow-xl mb-1">🌦️</div>
        <p className="font-display font-black text-sky-700 text-sm">Weather Watcher Badge!</p>
      </motion.div>
      <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-sky-200 w-full max-w-xs mb-5 text-center">
        <p className="text-5xl mb-3">📅🌤️</p>
        <p className="font-black text-gray-700 text-base leading-snug">For 3 mornings, look at the sky together. Draw the weather you see. Was it sunny, cloudy, or rainy?</p>
      </div>
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E0F2FE" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#38BDF8" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - pct} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-black text-sky-500 text-sm">{Math.floor(r / 60)}:{String(r % 60).padStart(2, '0')}</span></div>
      </div>
      <button onClick={onComplete} className="px-10 py-4 bg-sky-500 shadow-[0_6px_0_#0284C7] text-white font-display font-black text-xl rounded-3xl btn-press">🌱 All done!</button>
    </motion.div>
  );
}
