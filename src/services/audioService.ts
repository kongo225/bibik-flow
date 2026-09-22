import * as Speech from 'expo-speech';
import { useAudioStore } from '../store/useAudioStore';
import { Verse } from '../data/repositories/bibleRepository';

let currentVersesQueue: Verse[] = [];
let currentVerseIndex = 0;
let sleepTimeout: any = null;

export const audioService = {
  async playChapter(verses: Verse[], bookName: string, startVerse = 1, language = 'fr'): Promise<void> {
    if (verses.length === 0) return;

    this.stop();

    currentVersesQueue = verses;
    const startIndex = verses.findIndex((v) => v.verse >= startVerse);
    currentVerseIndex = startIndex >= 0 ? startIndex : 0;

    const firstVerse = currentVersesQueue[currentVerseIndex];

    useAudioStore.getState().setActivePassage(
      firstVerse.book_id,
      firstVerse.chapter,
      bookName,
      verses.length
    );
    useAudioStore.getState().setPlaybackState(true, false);

    this.speakCurrentVerse(language);
  },

  speakCurrentVerse(language = 'fr'): void {
    if (currentVerseIndex >= currentVersesQueue.length) {
      this.stop();
      return;
    }

    const verse = currentVersesQueue[currentVerseIndex];
    useAudioStore.getState().setCurrentVerseNum(verse.verse);

    const rate = useAudioStore.getState().playbackRate;

    Speech.speak(verse.text, {
      language,
      rate,
      onDone: () => {
        const state = useAudioStore.getState();
        if (state.isPlaying && !state.isPaused) {
          currentVerseIndex++;
          this.speakCurrentVerse(language);
        }
      },
      onError: () => {
        this.stop();
      },
    });
  },

  pause(): void {
    Speech.stop();
    useAudioStore.getState().setPlaybackState(true, true);
  },

  resume(language = 'fr'): void {
    useAudioStore.getState().setPlaybackState(true, false);
    this.speakCurrentVerse(language);
  },

  stop(): void {
    Speech.stop();
    if (sleepTimeout) {
      clearTimeout(sleepTimeout);
      sleepTimeout = null;
    }
    useAudioStore.getState().stopAudio();
    currentVersesQueue = [];
    currentVerseIndex = 0;
  },

  nextVerse(language = 'fr'): void {
    if (currentVerseIndex < currentVersesQueue.length - 1) {
      Speech.stop();
      currentVerseIndex++;
      this.speakCurrentVerse(language);
    }
  },

  prevVerse(language = 'fr'): void {
    if (currentVerseIndex > 0) {
      Speech.stop();
      currentVerseIndex--;
      this.speakCurrentVerse(language);
    }
  },

  setRate(rate: number, language = 'fr'): void {
    useAudioStore.getState().setPlaybackRate(rate);
    const { isPlaying, isPaused } = useAudioStore.getState();
    if (isPlaying && !isPaused) {
      Speech.stop();
      this.speakCurrentVerse(language);
    }
  },

  setSleepTimer(minutes: number): void {
    if (sleepTimeout) clearTimeout(sleepTimeout);
    useAudioStore.getState().setSleepTimerMinutes(minutes);

    sleepTimeout = setTimeout(() => {
      this.stop();
    }, minutes * 60 * 1000);
  },
};
