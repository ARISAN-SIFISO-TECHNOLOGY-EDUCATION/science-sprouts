// ──────────────────────────────────────────────────────────────────────────────
// Science Sprouts — main app shell
// Multi-topic architecture: topic list → topic detail → activity
//
// Screen flow:
//   bandSelect  (first launch / band change)
//   home        (two sub-views via selectedObjective state)
//     └─ topic list     (selectedObjective === null)
//     └─ topic detail   (selectedObjective set)
//   activity    (full-screen activity component)
// ──────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Star, FlaskConical, Leaf, Zap, Globe, Lock, ChevronLeft,
} from 'lucide-react';

import { Band, LearnerProfile } from './types';
import { getProfile, saveProfile, awardStar } from './lib/db';
import { OBJECTIVES, BAND_META, STRAND_META } from './curriculum';
import { cn } from './lib/utils';

import Garden       from './components/Garden';
import Dashboard    from './components/Dashboard';
import BandSelector from './components/BandSelector';

// ── Activity imports ──────────────────────────────────────────────────────────

// Matter & Materials — Floating & Sinking
import FloatSinkExplore  from './activities/FloatSinkExplore';
import FloatSinkExplain  from './activities/FloatSinkExplain';
import FloatSinkEvaluate from './activities/FloatSinkEvaluate';
import FloatSinkBandA    from './activities/FloatSinkBandA';
import FloatSinkBandC    from './activities/FloatSinkBandC';

// Matter & Materials — Solids, Liquids & Gases
import SolidsLiquidsGasesBandA    from './activities/SolidsLiquidsGasesBandA';
import SolidsLiquidsGasesExplore  from './activities/SolidsLiquidsGasesExplore';
import SolidsLiquidsGasesExplain  from './activities/SolidsLiquidsGasesExplain';
import SolidsLiquidsGasesEvaluate from './activities/SolidsLiquidsGasesEvaluate';

// Life & Living — Living vs Non-Living
import LivingNonLivingBandA    from './activities/LivingNonLivingBandA';
import LivingNonLivingExplore  from './activities/LivingNonLivingExplore';
import LivingNonLivingExplain  from './activities/LivingNonLivingExplain';
import LivingNonLivingEvaluate from './activities/LivingNonLivingEvaluate';

// ── Curriculum activity definitions ──────────────────────────────────────────

/** Display metadata for one activity card on the topic detail screen. */
type ActivityDef = {
  id: string;
  label: string;
  fiveE: string;
  voiceHint: string;
};

/**
 * ALL_BAND_ACTIVITIES maps objectiveId → band → activity card definitions.
 * When adding a new topic, add an entry here AND a component in ACTIVITY_REGISTRY.
 */
const ALL_BAND_ACTIVITIES: Record<string, Partial<Record<Band, ActivityDef[]>>> = {
  'mm.float_sink': {
    A: [
      { id: 'fs.a.engage',       label: 'Try with water!', fiveE: '① EXPLORE',     voiceHint: 'A caregiver-led sensory activity' },
    ],
    B: [
      { id: 'fs.b.explore',      label: 'Explore',         fiveE: '① EXPLORE',     voiceHint: 'Drop objects into water' },
      { id: 'fs.b.explain',      label: 'Why it floats',   fiveE: '② EXPLAIN',     voiceHint: 'Find out WHY things float' },
      { id: 'fs.b.evaluate',     label: 'Predict & Test',  fiveE: '③ TEST',        voiceHint: 'Predict — then check!' },
    ],
    C: [
      { id: 'fs.c.investigate',  label: 'Investigate',     fiveE: '① INVESTIGATE', voiceHint: 'Change the variable — predict & test' },
    ],
  },

  'mm.solids_liquids_gases': {
    A: [
      { id: 'mm.slg.a.engage',   label: 'Hard or Liquid?',  fiveE: '① EXPLORE', voiceHint: 'A caregiver-led hands-on hunt' },
    ],
    B: [
      { id: 'mm.slg.b.explore',  label: 'Sort it!',         fiveE: '① EXPLORE', voiceHint: 'Sort objects into Solid, Liquid, Gas' },
      { id: 'mm.slg.b.explain',  label: 'Why different?',   fiveE: '② EXPLAIN', voiceHint: 'Discover particle theory' },
      { id: 'mm.slg.b.evaluate', label: 'Tricky States!',   fiveE: '③ TEST',    voiceHint: 'Is steam a gas? Is sand a solid?' },
    ],
  },

  'll.non_living': {
    A: [
      { id: 'll.non_living.a.engage', label: 'Alive or Not?', fiveE: '① EXPLORE', voiceHint: 'A caregiver-led outdoor explore' },
    ],
    B: [
      { id: 'll.b.explore',   label: 'Sort it out!',    fiveE: '① EXPLORE', voiceHint: 'Sort things into Living and Not Living' },
      { id: 'll.b.explain',   label: 'What is ALIVE?',  fiveE: '② EXPLAIN', voiceHint: 'Discover what makes something alive' },
      { id: 'll.b.evaluate',  label: 'Tricky Things!',  fiveE: '③ TEST',    voiceHint: 'Is fire alive? Is a robot?' },
    ],
  },
};

/**
 * ACTIVITY_REGISTRY maps activity ID → React component.
 * When adding a new topic, register its components here.
 */
const ACTIVITY_REGISTRY: Record<
  string,
  React.ComponentType<{ onComplete: () => void; onExit: () => void }>
> = {
  'fs.a.engage':        FloatSinkBandA,
  'fs.b.explore':       FloatSinkExplore,
  'fs.b.explain':       FloatSinkExplain,
  'fs.b.evaluate':      FloatSinkEvaluate,
  'fs.c.investigate':   FloatSinkBandC,
  'mm.slg.a.engage':         SolidsLiquidsGasesBandA,
  'mm.slg.b.explore':        SolidsLiquidsGasesExplore,
  'mm.slg.b.explain':        SolidsLiquidsGasesExplain,
  'mm.slg.b.evaluate':       SolidsLiquidsGasesEvaluate,
  'll.non_living.a.engage':  LivingNonLivingBandA,
  'll.b.explore':            LivingNonLivingExplore,
  'll.b.explain':            LivingNonLivingExplain,
  'll.b.evaluate':           LivingNonLivingEvaluate,
};

// ── Strand icon map ───────────────────────────────────────────────────────────

const STRAND_ICON: Record<string, React.ReactNode> = {
  life_and_living:      <Leaf size={20} />,
  matter_and_materials: <FlaskConical size={20} />,
  energy_and_change:    <Zap size={20} />,
  earth_and_beyond:     <Globe size={20} />,
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Screen = 'bandSelect' | 'home' | 'activity';

const BAND_CHOSEN_KEY = 'bandExplicitlyChosen';

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading]               = useState(true);
  const [profile, setProfile]               = useState<LearnerProfile | null>(null);
  const [screen, setScreen]                 = useState<Screen>('home');
  const [activeAct, setActiveAct]           = useState<string | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [showDashboard, setShowDashboard]   = useState(false);

  // Load profile from IndexedDB
  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      const chosen = localStorage.getItem(BAND_CHOSEN_KEY);
      setScreen(chosen ? 'home' : 'bandSelect');
      setLoading(false);
    });
  }, [showDashboard]);

  // ── Band selection ──────────────────────────────────────────────────────────

  async function handleBandSelect(band: Band) {
    if (!profile) return;
    const updated = { ...profile, selectedBand: band };
    await saveProfile(updated);
    setProfile(updated);
    localStorage.setItem(BAND_CHOSEN_KEY, '1');
    setSelectedObjective(null);  // return to topic list for new band
    setScreen('home');
  }

  // ── Activity lifecycle ──────────────────────────────────────────────────────

  async function handleComplete(activityId: string) {
    if (!profile || !selectedObjective) return;
    const updated = await awardStar(selectedObjective, activityId);
    setProfile(updated);
    setScreen('home');
    setActiveAct(null);
    // Keep selectedObjective so user returns to their topic's activity list
  }

  function handleExit() {
    setScreen('home');
    setActiveAct(null);
    // Keep selectedObjective — return to topic detail
  }

  // ── Loading splash ──────────────────────────────────────────────────────────

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

  // ── Band selection screen ───────────────────────────────────────────────────

  if (screen === 'bandSelect') {
    const alreadyChosen = !!localStorage.getItem(BAND_CHOSEN_KEY);
    return (
      <BandSelector
        currentBand={profile.selectedBand}
        onSelect={handleBandSelect}
        onBack={alreadyChosen ? () => setScreen('home') : undefined}
      />
    );
  }

  // ── Activity screen — registry-driven routing ───────────────────────────────

  if (screen === 'activity' && activeAct && selectedObjective) {
    const Component = ACTIVITY_REGISTRY[activeAct];
    if (Component) {
      return (
        <Component
          onComplete={() => handleComplete(activeAct)}
          onExit={handleExit}
        />
      );
    }
  }

  // ── Home screen helpers ─────────────────────────────────────────────────────

  const band      = profile.selectedBand;
  const bandMeta  = BAND_META[band];

  // Topics available for the current band (have at least one activity)
  const availableObjectives = OBJECTIVES.filter(obj => {
    const acts = ALL_BAND_ACTIVITIES[obj.id]?.[band];
    return acts && acts.length > 0;
  });

  // ── Topic detail view (an objective is selected) ────────────────────────────

  if (selectedObjective) {
    const objective = OBJECTIVES.find(o => o.id === selectedObjective);
    if (!objective) { setSelectedObjective(null); return null; }

    const mastery   = profile.masteryByObjective[selectedObjective];
    const completed = mastery?.completedActivityIds ?? [];
    const bandActs  = ALL_BAND_ACTIVITIES[selectedObjective]?.[band] ?? [];

    // Band accent colours
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
      <div className="relative min-h-screen max-w-lg mx-auto bg-brand-cream pb-20 shadow-xl overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="topic-detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="p-6 min-h-screen flex flex-col"
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <header className="flex items-center justify-between mb-5 pb-4 dashed-divider">
              <button
                onClick={() => setSelectedObjective(null)}
                className="flex items-center gap-1 text-sm font-black text-gray-500
                           hover:text-gray-800 transition-colors"
                aria-label="Back to topics"
              >
                <ChevronLeft size={18} />
                Topics
              </button>

              <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center
                              gap-1 border-2 border-gray-100">
                <Star size={15} fill="currentColor" className="text-yellow-400" />
                <span className="font-black text-gray-700 text-sm">{profile.totalStars}</span>
              </div>
            </header>

            {/* ── Topic header card ───────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm mb-4">
              <div className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-3',
                STRAND_META[objective.strand].color
              )}>
                {STRAND_ICON[objective.strand]}
                {STRAND_META[objective.strand].label}
              </div>
              <h2 className="font-display font-black text-2xl text-gray-800 leading-tight mb-1">
                {objective.topic}
              </h2>
              <p className="text-xs text-gray-400 italic">"{objective.anchoringPhenomenon}"</p>
            </div>

            {/* ── Activity sequence ───────────────────────────────────────── */}
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Your learning journey
            </p>

            {bandActs.length === 0 ? (
              <div className="text-center p-8 text-gray-400 text-sm font-bold">
                No activities yet for this age group. Coming soon! 🌱
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {bandActs.map((act, i) => {
                  const isDone   = completed.includes(act.id);
                  const prevDone = i === 0 || completed.includes(bandActs[i - 1].id);
                  const isLocked = !profile.settings.overrideSequence && !prevDone && !isDone;
                  const isNext   = !isDone && prevDone && !isLocked;

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
                      {isDone   && <span className="text-[10px] font-black bg-white/60 px-2 py-0.5 rounded-full flex-shrink-0">DONE ✓</span>}
                      {isNext   && <span className={cn('text-[10px] font-black text-white px-2 py-0.5 rounded-full animate-pulse flex-shrink-0', goBadge)}>GO →</span>}
                      {isLocked && <span className="text-[10px] font-black text-gray-400 flex-shrink-0">LOCKED</span>}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* CAPS reference */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-[9px] text-gray-300 text-center font-medium tracking-wide">
                {objective.capsRef} · South African CAPS curriculum
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dashboard overlay */}
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

  // ── Topic list view (home) ──────────────────────────────────────────────────

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
          {/* ── Header ──────────────────────────────────────────────────── */}
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

          {/* ── Band banner ─────────────────────────────────────────────── */}
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
            <div className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0',
              band === 'A' ? 'bg-sky-200'
            : band === 'B' ? 'bg-green-200'
            :                'bg-indigo-200'
            )}>
              {band === 'A' ? '👶' : band === 'B' ? '🧒' : '👦'}
            </div>

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
                Age Group
              </p>
            </div>
          </button>

          {/* ── Garden ──────────────────────────────────────────────────── */}
          <Garden flowers={profile.gardenFlowers} />

          {/* ── Topic list ──────────────────────────────────────────────── */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-5 mb-3">
            🌿 Choose a Topic
          </p>

          <div className="space-y-3 flex-1">
            {availableObjectives.map(obj => {
              const mastery    = profile.masteryByObjective[obj.id];
              const completed  = mastery?.completedActivityIds ?? [];
              const bandActs   = ALL_BAND_ACTIVITIES[obj.id]?.[band] ?? [];
              const doneCount  = bandActs.filter(a => completed.includes(a.id)).length;
              const allDone    = bandActs.length > 0 && doneCount === bandActs.length;
              const inProgress = doneCount > 0 && !allDone;

              return (
                <motion.button
                  key={obj.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedObjective(obj.id)}
                  className="w-full p-4 rounded-2xl border-2 bg-white border-gray-100
                             shadow-sm text-left flex items-center gap-4
                             active:scale-95 transition-transform hover:shadow-md"
                >
                  {/* Strand icon pill */}
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
                    STRAND_META[obj.strand].color
                  )}>
                    {STRAND_ICON[obj.strand]}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                      {STRAND_META[obj.strand].label}
                    </p>
                    <p className="font-display font-black text-base text-gray-800 leading-tight">
                      {obj.topic}
                    </p>
                    <p className="text-xs text-gray-400 italic truncate mt-0.5">
                      "{obj.anchoringPhenomenon}"
                    </p>
                  </div>

                  {/* Progress badge */}
                  <div className="flex-shrink-0">
                    {allDone ? (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50
                                       border border-emerald-200 px-2 py-1 rounded-full">
                        ✓ DONE
                      </span>
                    ) : inProgress ? (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50
                                       border border-amber-200 px-2 py-1 rounded-full">
                        {doneCount}/{bandActs.length} ✦
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50
                                       border border-indigo-200 px-2 py-1 rounded-full">
                        START →
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[9px] text-gray-300 text-center font-medium tracking-wide">
              South African CAPS curriculum · Ages 3–12 · Offline &amp; free
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dashboard overlay */}
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
