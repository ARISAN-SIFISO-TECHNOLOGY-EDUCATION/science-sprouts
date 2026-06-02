// Progress — celebration page. Shows the garden, headline counts, and every
// badge the child has earned across all topics. Read-only; reward, not judgement.

import React from 'react';
import { motion } from 'motion/react';
import { Star, Sprout } from 'lucide-react';
import { LearnerProfile } from '../types';
import { OBJECTIVES, BAND_META } from '../curriculum';
import Garden from './Garden';

interface ProgressProps {
  profile: LearnerProfile;
  onBrowse: () => void;
}

export default function Progress({ profile, onBrowse }: ProgressProps) {
  // Collect every earned badge across all objectives, paired with its topic.
  const earned: { badge: string; topic: string }[] = [];
  let topicsCompleted = 0;

  for (const obj of OBJECTIVES) {
    const m = profile.masteryByObjective[obj.id];
    if (!m) continue;
    if (m.badges.length > 0 && m.completedActivityIds.length > 0) topicsCompleted += 1;
    for (const badge of m.badges) earned.push({ badge, topic: obj.topic });
  }
  // De-dupe identical badge strings (a few topics share a generic badge name).
  const seen = new Set<string>();
  const badges = earned.filter(b => (seen.has(b.badge) ? false : (seen.add(b.badge), true)));

  const bandMeta = BAND_META[profile.selectedBand];

  return (
    <motion.div
      key="progress"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-6 pb-nav"
    >
      <header className="mb-5">
        <h1 className="font-display font-black text-2xl text-gray-800 leading-tight">My Progress</h1>
        <p className="text-sm text-gray-500">{bandMeta.label} · {bandMeta.ageRange}</p>
      </header>

      {/* Headline counts */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard value={profile.totalStars} label="Stars" icon={<Star size={18} fill="currentColor" className="text-yellow-400" />} />
        <StatCard value={profile.gardenFlowers} label="Flowers" icon={<Sprout size={18} className="text-green-500" />} />
        <StatCard value={topicsCompleted} label="Topics" icon={<span className="text-base">🔬</span>} />
      </div>

      {/* Garden */}
      <Garden flowers={profile.gardenFlowers} />

      {/* Badges */}
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6 mb-3">
        🏆 Badges earned
      </p>

      {badges.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 px-6
                        bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <span className="text-5xl mb-3">🌱</span>
          <p className="font-display font-black text-gray-600">No badges yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Finish a topic to earn your first badge!</p>
          <button
            onClick={onBrowse}
            className="px-6 py-3 bg-green-500 shadow-[0_4px_0_#16A34A] text-white
                       font-display font-black rounded-2xl text-sm btn-press"
          >
            🌿 Explore topics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {badges.map(({ badge, topic }, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm text-center"
            >
              <div className="text-3xl mb-1">{badgeEmoji(badge)}</div>
              <p className="font-display font-black text-[13px] text-gray-800 leading-tight">
                {badgeName(badge)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{topic}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function StatCard({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-3 border-2 border-gray-100 shadow-sm text-center">
      <div className="flex items-center justify-center mb-0.5">{icon}</div>
      <p className="font-display font-black text-xl text-gray-800 leading-none">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}

// Badge strings look like "Heat Mover Badge 🔥" — split the trailing emoji from
// the name for a nicer two-line card.
function badgeEmoji(badge: string): string {
  const m = badge.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*$/u);
  return m ? m[0].trim() : '🏅';
}
function badgeName(badge: string): string {
  return badge.replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*$/u, '').trim();
}
