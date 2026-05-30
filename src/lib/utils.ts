import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shuffle an array (Fisher-Yates). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Audio system ──────────────────────────────────────────────────────────────
//
// Fallback chain (priority order):
//   1. Pre-recorded audio file for the requested language   ← correct voice, offline
//   2. Pre-recorded audio file for English (en)             ← at least correct, not mispronounced
//   3. Web Speech API with English text                     ← stopgap, ONLY for English
//   4. Silent — captions are already visible on screen      ← acceptable final state
//
// isiZulu (zu-ZA) is NOT routed through Web Speech API.
// The OS voice for 'zu-ZA' is absent on most low-end Androids, and the
// fallback Google TTS voice reading Zulu text aloud mispronounces it, which
// is worse than silence for a product whose differentiator is mother-tongue audio.

let currentAudio: HTMLAudioElement | null = null;

/**
 * Play a pre-recorded audio file. Returns true if playback started,
 * false if the file is missing or playback fails.
 */
async function tryPlayFile(src: string): Promise<boolean> {
  return new Promise(resolve => {
    const audio = new Audio(src);
    audio.oncanplay = () => {
      currentAudio?.pause();
      currentAudio = audio;
      audio.play().then(() => resolve(true)).catch(() => resolve(false));
    };
    audio.onerror = () => resolve(false);
    // Give it 2 s to load before giving up
    setTimeout(() => resolve(false), 2000);
  });
}

/** Stop whatever is currently playing. */
export function stopAudio(): void {
  currentAudio?.pause();
  currentAudio = null;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/**
 * Play narration using the fallback chain described above.
 *
 * @param text       English text to display as caption and speak if falling back.
 * @param lang       Requested language code ('en' | 'zu').
 * @param audioFiles Pre-recorded files keyed by language, e.g. { en: ['file.mp3'], zu: ['file_zu.mp3'] }
 */
export async function playNarration(
  text: string,
  lang: 'en' | 'zu' = 'en',
  audioFiles: Record<string, string[]> = {}
): Promise<void> {
  stopAudio();

  // 1. Try the requested language's pre-recorded files
  const langFiles = audioFiles[lang] ?? [];
  for (const src of langFiles) {
    if (await tryPlayFile(src)) return;
  }

  // 2. Fall back to English pre-recorded files (never mispronounces)
  if (lang !== 'en') {
    const enFiles = audioFiles['en'] ?? [];
    for (const src of enFiles) {
      if (await tryPlayFile(src)) return;
    }
  }

  // 3. Web Speech API — English text only. Never feed isiZulu text to this.
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text); // always English text
    utter.rate = 0.85;
    utter.lang = 'en-ZA'; // South African English accent if available
    window.speechSynthesis.speak(utter);
  }

  // 4. Silent — captions visible on screen. No further action needed.
}

/**
 * Convenience wrapper: speak English text only via Web Speech (no file).
 * Used for dynamic/generated text that will never have a pre-recorded file.
 * NEVER called with isiZulu text.
 */
export function speak(text: string, rate = 0.85): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.lang = 'en-ZA';
  window.speechSynthesis.speak(utter);
}
