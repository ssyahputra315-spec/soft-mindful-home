export type Mood = "calm" | "good" | "neutral" | "stressed" | "sad";

export const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "calm", emoji: "😌", label: "Calm" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "stressed", emoji: "😣", label: "Stressed" },
  { value: "sad", emoji: "😔", label: "Sad" },
];

export const moodEmoji = (m?: Mood) => MOODS.find((x) => x.value === m)?.emoji ?? "🌸";

export interface JournalEntry {
  id: string;
  date: string; // ISO
  mood: Mood;
  reflection: string;
  gratitude: string;
  kindness: string;
  lettingGo: string;
}

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: Mood;
  mindfulnessLevel: number;
}

export interface MeditationSession {
  date: string; // ISO
  duration: number; // minutes
}

export interface DailyQuote {
  date: string; // YYYY-MM-DD
  quote: string;
}

export interface AppData {
  favoriteQuotes: string[];
  journalEntries: JournalEntry[];
  dailyMood: MoodEntry[];
  meditationSessions: MeditationSession[];
  dailyQuote?: DailyQuote;
  settings: { bellSound: boolean };
}

const KEY = "dhamma-reflection-v1";

const defaultData: AppData = {
  favoriteQuotes: [],
  journalEntries: [],
  dailyMood: [],
  meditationSessions: [],
  settings: { bellSound: true },
};

export function loadData(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function updateData(updater: (d: AppData) => AppData): AppData {
  const next = updater(loadData());
  saveData(next);
  return next;
}

export const todayKey = () => new Date().toISOString().slice(0, 10);
