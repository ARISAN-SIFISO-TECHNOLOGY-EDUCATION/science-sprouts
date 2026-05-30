// ──────────────────────────────────────────────────────────────────────────────
// IndexedDB persistence — mirrors Numeracy Sprouts db.ts
// Stores: learner-profile, settings
// ──────────────────────────────────────────────────────────────────────────────

import { openDB, IDBPDatabase } from 'idb';
import { LearnerProfile, Band } from '../types';

const DB_NAME = 'science-sprouts-db';
const PROFILE_STORE = 'learner-profile';
const SETTINGS_STORE = 'settings';
const DB_VERSION = 1;

async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PROFILE_STORE)) {
        db.createObjectStore(PROFILE_STORE);
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE);
      }
    },
  });
}

export const DEFAULT_PROFILE: LearnerProfile = {
  displayName: 'Explorer',
  selectedBand: 'B',
  masteryByObjective: {},
  totalStars: 0,
  gardenFlowers: 0,
  settings: {
    audioEnabled: true,
    selectedLanguage: 'en',
    overrideSequence: false,
  },
  createdAt: new Date().toISOString(),
};

export async function getProfile(): Promise<LearnerProfile> {
  const db = await initDB();
  const stored = await db.get(PROFILE_STORE, 'current');
  if (!stored) return { ...DEFAULT_PROFILE, createdAt: new Date().toISOString() };

  // ── Migration: Band 'A' (legacy) → 'A5' ──────────────────────────────────
  // Before the A3/A4/A5 split, the single Band A was stored as 'A'.
  // Any profile written before that change needs upgrading.
  const VALID_BANDS: string[] = ['A3', 'A4', 'A5', 'B', 'C'];
  if (!VALID_BANDS.includes(stored.selectedBand)) {
    stored.selectedBand = 'A5';
    await db.put(PROFILE_STORE, stored, 'current');
  }

  return stored as LearnerProfile;
}

export async function saveProfile(profile: LearnerProfile): Promise<void> {
  const db = await initDB();
  await db.put(PROFILE_STORE, profile, 'current');
}

/** Award a star and grow the garden for a completed activity. */
export async function awardStar(objectiveId: string, activityId: string): Promise<LearnerProfile> {
  const profile = await getProfile();

  const mastery = profile.masteryByObjective[objectiveId] ?? {
    objectiveId,
    state: 'exploring',
    stars: 0,
    badges: [],
    completedActivityIds: [],
    updatedAt: '',
  };

  if (!mastery.completedActivityIds.includes(activityId)) {
    mastery.completedActivityIds.push(activityId);
    mastery.stars += 1;
    profile.totalStars += 1;
    profile.gardenFlowers += 1;
    mastery.updatedAt = new Date().toISOString();
    profile.masteryByObjective[objectiveId] = mastery;
    await saveProfile(profile);
  }

  return profile;
}

export async function updateBand(band: Band): Promise<LearnerProfile> {
  const profile = await getProfile();
  profile.selectedBand = band;
  await saveProfile(profile);
  return profile;
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await initDB();
  const val = await db.get(SETTINGS_STORE, key);
  return val === undefined ? defaultValue : (val as T);
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await initDB();
  await db.put(SETTINGS_STORE, value, key);
}

export async function resetProfile(): Promise<LearnerProfile> {
  const fresh = { ...DEFAULT_PROFILE, createdAt: new Date().toISOString() };
  const db = await initDB();
  await db.put(PROFILE_STORE, fresh, 'current');
  return fresh;
}
