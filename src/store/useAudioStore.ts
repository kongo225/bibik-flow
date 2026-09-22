import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  currentVerseNum: number | null;
  playbackRate: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  activeBookId: number | null;
  activeChapter: number | null;
  bookName: string;
  totalVerses: number;
  sleepTimerMinutes: number | null;
  playerModalVisible: boolean;

  setPlaybackState: (isPlaying: boolean, isPaused: boolean) => void;
  setCurrentVerseNum: (verseNum: number | null) => void;
  setPlaybackRate: (rate: number) => void;
  setActivePassage: (bookId: number, chapter: number, bookName: string, totalVerses: number) => void;
  setSleepTimerMinutes: (minutes: number | null) => void;
  setPlayerModalVisible: (visible: boolean) => void;
  stopAudio: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  isPaused: false,
  currentVerseNum: null,
  playbackRate: 1.0,
  activeBookId: null,
  activeChapter: null,
  bookName: '',
  totalVerses: 0,
  sleepTimerMinutes: null,
  playerModalVisible: false,

  setPlaybackState: (isPlaying, isPaused) => set({ isPlaying, isPaused }),
  setCurrentVerseNum: (verseNum) => set({ currentVerseNum: verseNum }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setActivePassage: (bookId, chapter, bookName, totalVerses) =>
    set({ activeBookId: bookId, activeChapter: chapter, bookName, totalVerses }),
  setSleepTimerMinutes: (minutes) => set({ sleepTimerMinutes: minutes }),
  setPlayerModalVisible: (visible) => set({ playerModalVisible: visible }),
  stopAudio: () =>
    set({
      isPlaying: false,
      isPaused: false,
      currentVerseNum: null,
      activeBookId: null,
      activeChapter: null,
    }),
}));
