// ──────────────────────────────────────────────────────────────────────────────
// Science Sprouts — main app shell
// Phase 0 spike: Matter & Materials → Floating & Sinking (Band B)
//
// Architecture mirrors Numeracy Sprouts:
//   home → activity → home  (with success overlay inside ActivityWrapper)
// ──────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Star, Trophy, FlaskConical, Leaf, Zap, Globe, Lock,
} from 'lucide-react';

import { Band, LearnerProfile } from './types';
import { getProfile, saveProfile, awardStar } from './lib/db';
import { OBJECTIVES, ACTIVITIES_BY_OBJECTIVE, BAND_META, STRAND_META } from './curriculum';
import { cn } from './lib/utils';

import Garden       from './components/Garden';
import Dashboard    from './components/Dashboard';
import BandSelector from './components/BandSelector';

// Activities — Band B (6-9)
import FloatSinkExplore  from './activities/FloatSinkExplore';
import FloatSinkExplain  from './activities/FloatSinkExplain';
import FloatSinkEvaluate from './activities/FloatSinkEvaluate';
// Activities — Band A (3-5) and Band C (10-12)
import FloatSinkBandA    from './activities/FloatSinkBandA';
import FloatSinkBandC    from './activities/FloatSinkBandC';

// ── Strand icon map ───────────────────────────────────────────────────────────

const STRAND_ICON = {
  life_and_living:      <Leaf size={22} />,
  matter_and_materials: <FlaskConical size={22} />,
  energy_and_change:    <Zap size={22} />,
  earth_and_beyond:     <Globe size={22} />,
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Screen = 'bandSelect' | 'home' | 'activity';
// Band A has one activity id, Band B has three, Band C has one
type ActiveActivity =
  | 'fs.a.engage'
  | 'fs.b.explore' | 'fs.b.explain' | 'fs.b.evaluate'
  | 'fs.c.investigate';

// A profile that has never had its band explicitly chosen by the user
// (default value from db.ts is 'B'). We track whether the user has actively
// picked their band so we can show the selector on first launch.
const BAND_CHOSEN_KEY = 'bandExplicitlyChosen';

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading]             = useState(true);
  const [profile, setProfile]             = useState<LearnerProfile | null>(null);
  const [screen, setScreen]               = useState<Screen>('home');
  const [activeAct, setActiveAct]         = useState<ActiveActivity | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Load profile from IndexedDB
  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      // Show band selector on first launch (user hasn't explicitly chosen yet)
      const chosen = localStorage.getItem(BAND_CHOSEN_KEY);
      setScreen(chosen ? 'home' : 'bandSelect');
      setLoading(false);
    });
  }, [showDashboard]);

  // ── Band selection ────────────────────────────────────────────────────────

  async function handleBandSelect(band: Band) {
    if (!profile) return;
    const updated = { ...profile, selectedBand: band };
    await saveProfile(updated);
    setProfile(updated);
    localStorage.setItem(BAND_CHOSEN_KEY, '1');
    setScreen('home');
  }

  // ── Activity completion ───────────────────────────────────────────────────

  async function handleComplete(activityId: string) {
    if (!profile) return;
    const updated = await awardStar('mm.float_sink', activityId);
    setProfile(updated);
    setScreen('home');
    setActiveAct(null);
  }

  function handleExit() {
    setScreen('home');
    setActiveAct(null);
  }

  // ── Loading splash ────────────────────────────────────────────────────────

  if (loading || !profile) {
    return (
      <div className="fixed inset-0 bg-brand-cream flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          🌱
        </motion.div>
      </div>
    );
  }

  // ── Band selection screen ─────────────────────────────────────────────────

  if (screen === 'bandSelect') {
    // Show back button only if user has already chosen a band (not first launch)
    const alreadyChosen = !!localStorage.getItem(BAND_CHOSEN_KEY);
    return (
      <BandSelector
        currentBand={profile.selectedBand}
        onSelect={handleBandSelect}
        onBack={alreadyChosen ? () => setScreen('home') : undefined}
      />
    );
  }

  // ── Activity screens — routed by band + activity id ─────────────────────────

  // Band A (Ages 3–5): one caregiver-led activity
  if (screen === 'activity' && activeAct === 'fs.a.engage') {
    return (
      <FloatSinkBandA
        onComplete={() => handleComplete('fs.a.engage')}
        onExit={handleExit}
      />
    );
  }

  // Band B (Ages 6–9): full 5E trio
  if (screen === 'activity' && activeAct === 'fs.b.explore') {
    return (
      <FloatSinkExplore
        onComplete={() => handleComplete('fs.b.explore')}
        onExit={handleExit}
      />
    );
  }
  if (screen === 'activity' && activeAct === 'fs.b.explain') {
    return (
      <FloatSinkExplain
        onComplete={() => handleComplete('fs.b.explain')}
        onExit={handleExit}
      />
    );
  }
  if (screen === 'activity' && activeAct === 'fs.b.evaluate') {
    return (
      <FloatSinkEvaluate
        onComplete={() => handleComplete('fs.b.evaluate')}
        onExit={handleExit}
      />
    );
  }

  // Band C (Ages 10–12): variable-change inquiry investigation
  if (screen === 'activity' && activeAct === 'fs.c.investigate') {
    return (
      <FloatSinkBandC
        onComplete={() => handleComplete('fs.c.investigate')}
        onExit={handleExit}
      />
    );
  }

  // ── Home screen ───────────────────────────────────────────────────────────

  const band      = profile.selectedBand;
  const bandMeta  = BAND_META[band];
  const objective = OBJECTIVES.find(o => o.id === 'mm.float_sink')!;
  const mastery   = profile.masteryByObjective['mm.float_sink'];
  const completed = mastery?.completedActivityIds ?? [];

  // Activity sequence varies by band. Each band renders the same phenomenon differently.
  const BAND_ACTIVITIES: Record<typeof band, { id: ActiveActivity; label: string; fiveE: string; voiceHint: string }[]> = {
    A: [
      { id: 'fs.a.engage', label: 'Try with water!', fiveE: '① EXPLORE', voiceHint: 'A caregiver-led sensory activity' },
    ],
    B: [
      { id: 'fs.b.explore',  label: 'Explore',  fiveE: '① EXPLORE',  voiceHint: 'Drop objects into water' },
      { id: 'fs.b.explain',  label: 'Explain',  fiveE: '② EXPLAIN',  voiceHint: 'Find out WHY things float' },
      { id: 'fs.b.evaluate', label: 'Test it',  fiveE: '③ TEST',     voiceHint: 'Predict — then check!' },
    ],
    C: [
      { id: 'fs.c.investigate', label: 'Investigate', fiveE: '① INVESTIGATE', voiceHint: 'Change the variable — predict & test' },
    ],
  };

  const bandActs = BAND_ACTIVITIES[band];

  return (
    <div className="relative min-h-screen max-w-lg mx-auto bg-brand-cream pb-20 shadow-xl overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="p-6 min-h-screen flex flex-col"
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="flex items-center justify-between mb-4 pb-4 dashed-divider">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center
                              text-2xl shadow-[0_4px_0_#16A34A]">
                🌿
              </div>
              <div>
                <h1 className="font-display font-black text-xl text-gray-800 leading-tight">
                  Science Sprouts
                </h1>
                <p className="text-xs font-bold text-gray-400 tracking-wide">Ages 3 – 12</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center
                              gap-1 border-2 border-gray-100">
                <Star size={15} fill="currentColor" className="text-yellow-400" />
                <span className="font-black text-gray-700 text-sm">{profile.totalStars}</span>
              </div>
              <button
                onClick={() => setShowDashboard(true)}
                className="p-2.5 bg-gray-100 rounded-xl text-gray-500 hover:text-green-600
                           transition-colors"
                aria-label="Parent settings"
              >
                <Settings size={18} />
              </button>
            </div>
          </header>

          {/* ── Age band banner ─────────────────────────────────────────── */}
          {/* Shows the full 3-12 scope and which band is active. Tapping opens
              the full BandSelector so users understand all three age groups. */}
          <button
            onClick={() => setScreen('bandSelect')}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-2xl mb-5 text-left',
              'border-2 transition-all hover:brightness-95',
              band === 'A' ? 'bg-sky-50   border-sky-200'
            : band === 'B' ? 'bg-green-50  border-green-200'
            :                'bg-indigo-50 border-indigo-200'
            )}
            aria-label="Change age band"
          >
            {/* Big age emoji */}
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0',
              band === 'A' ? 'bg-sky-200'
            : band === 'B' ? 'bg-green-200'
            :                'bg-indigo-200'
            )}>
              {band === 'A' ? '👶' : band === 'B' ? '🧒' : '👦'}
            </div>

            {/* Text block */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                'font-display font-black text-lg leading-tight',
                band === 'A' ? 'text-sky-700'
              : band === 'B' ? 'text-green-700'
              :                'text-indigo-700'
              )}>
                {bandMeta.label}
              </p>
              <p className={cn(
                'text-sm font-bold',
                band === 'A' ? 'text-sky-500'
              : band === 'B' ? 'text-green-500'
              :                'text-indigo-500'
              )}>
                {bandMeta.ageRange} · {bandMeta.description}
              </p>
            </div>

            {/* Select age content pill */}
            <div className={cn(
              'flex-shrink-0 px-3 py-2 rounded-xl border-2 text-center',
              band === 'A' ? 'bg-sky-100   border-sky-300   text-sky-700'
            : band === 'B' ? 'bg-green-100 border-green-300 text-green-700'
            :                'bg-indigo-100 border-indigo-300 text-indigo-700'
            )}>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">
                Select
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                Age Content
              </p>
            </div>
          </button>

          {/* ── Garden ─────────────────────────────────────────────────── */}
          <Garden flowers={profile.gardenFlowers} />

          {/* ── Mission card ───────────────────────────────────────────── */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-2xl
                          border-2 border-gray-100 shadow-sm">
            <div className="p-2 bg-green-500 rounded-xl text-white shadow-[0_4px_0_#16A34A]">
              <Trophy size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Current Topic
              </p>
              <p className="font-black text-gray-800 truncate">{objective.topic}</p>
              <p className="text-xs text-gray-400 italic truncate">
                "{objective.anchoringPhenomenon}"
              </p>
            </div>
          </div>

          {/* ── Strand badge ───────────────────────────────────────────── */}
          <div className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-4 self-start',
            STRAND_META[objective.strand].color
          )}>
            {STRAND_META[objective.strand].icon}
            {STRAND_META[objective.strand].label}
          </div>

          {/* ── Activity cards — per-band sequence ───────────────────── */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            Your learning journey
          </p>
          <div className="space-y-3 flex-1">
            {bandActs.map((act, i) => {
              const isDone   = completed.includes(act.id);
              const prevDone = i === 0 || completed.includes(bandActs[i - 1].id);
              const isLocked = !profile.settings.overrideSequence && !prevDone && !isDone;
              const isNext   = !isDone && prevDone && !isLocked;

              // Accent colours per band
              const nextBg     = band === 'A' ? 'bg-sky-400 shadow-[0_4px_0_#0EA5E9]'
                               : band === 'C' ? 'bg-indigo-500 shadow-[0_4px_0_#4338CA]'
                               :                'bg-green-500 shadow-[0_4px_0_#16A34A]';
              const nextBorder = band === 'A' ? 'border-sky-300'
                               : band === 'C' ? 'border-indigo-300'
                               :                'border-green-300';
              const doneBg     = band === 'A' ? 'bg-sky-50  border-sky-200   text-sky-700'
                               : band === 'C' ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                               :                'bg-green-50 border-green-200 text-green-700';
              const goBadge    = band === 'A' ? 'bg-sky-400'
                               : band === 'C' ? 'bg-indigo-500'
                               :                'bg-green-500';

              return (
                <motion.button
                  key={act.id}
                  whileTap={!isLocked ? { scale: 0.97 } : {}}
                  disabled={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      setActiveAct(act.id);
                      setScreen('activity');
                    }
                  }}
                  className={cn(
                    'w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-4',
                    isDone    ? doneBg
                    : isNext  ? `bg-white ${nextBorder} shadow-md text-gray-800`
                    : isLocked ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                    :            'bg-white border-gray-200 text-gray-700'
                  )}
                >
                  {/* Step icon */}
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0',
                    isDone   ? 'bg-white/60'
                    : isNext ? `${nextBg} text-white`
                    :          'bg-gray-200'
                  )}>
                    {isDone ? '✅' : isLocked ? <Lock size={18} /> : STRAND_ICON[objective.strand]}
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                      {act.fiveE}
                    </p>
                    <p className="font-display font-black text-lg leading-tight">
                      {act.label}
                    </p>
                    <p className="text-xs opacity-60 truncate">{act.voiceHint}</p>
                  </div>

                  {/* Status badge */}
                  {isDone && (
                    <span className="text-[10px] font-black bg-white/60 px-2 py-0.5 rounded-full">
                      DONE ✓
                    </span>
                  )}
                  {isNext && (
                    <span className={cn(
                      'text-[10px] font-black text-white px-2 py-0.5 rounded-full animate-pulse',
                      goBadge
                    )}>
                      GO →
                    </span>
                  )}
                  {isLocked && (
                    <span className="text-[10px] font-black text-gray-400">
                      LOCKED
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* ── CAPS reference footer ─────────────────────────────────── */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[9px] text-gray-300 text-center font-medium tracking-wide">
              Aligned to {objective.capsRef} · South African CAPS curriculum
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Dashboard overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDashboard && (
          <Dashboard
            profile={profile}
            onUpdate={setProfile}
            onClose={() => setShowDashboard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
