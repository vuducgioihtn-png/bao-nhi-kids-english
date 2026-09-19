export interface WordItem {
  id: string;
  en: string; // English word
  vi: string; // Vietnamese translation
  ipa: string; // Pronunciation IPA
  syllables?: string; // Syllable breakdown e.g. wa-ter-mel-on
  emoji: string; // High-fidelity visual emoji or icon
  category: string; // Topic ID
  exampleEn?: string; // Example sentence in English
  exampleVi?: string; // Example sentence in Vietnamese
  hint?: string; // Visual memory hint
  color?: string; // Primary accent color for cards
}

export interface Topic {
  id: string;
  number: number;
  nameVi: string;
  nameEn: string;
  icon: string; // Topic emoji
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    light: string;
  };
  description: string;
}

export type LearningMode = 'flashcards' | 'listen-spell' | 'games' | 'speaking' | 'ipa' | 'test' | 'progress';

export interface DialogueLine {
  speaker: string;
  avatar: string;
  en: string;
  vi: string;
  ipa?: string;
  readVi?: string; // Gợi ý cách đọc tiếng Việt dễ hiểu cho học sinh tiểu học
  pitch?: number;
  rate?: number;
  highlightWords?: string[];
}

export interface KeyPatternOption {
  en: string;
  vi: string;
  emoji: string;
}

export interface KeyPattern {
  structure: string;
  vi: string;
  sample: string;
  substitutions?: {
    original: string;
    options: KeyPatternOption[];
  };
}

export type GradeLevel = 'all' | 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5';

export interface Dialogue {
  id: string;
  titleVi: string;
  titleEn: string;
  domainId: string;
  gradeLevel: 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5';
  gradeLabel: string;
  emoji: string;
  scenario: string;
  characters: { name: string; avatar: string; role: string }[];
  lines: DialogueLine[];
  keyPattern: KeyPattern;
}

export interface CommunicationDomain {
  id: string;
  nameVi: string;
  nameEn: string;
  icon: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  description: string;
}

export interface ChildProfile {
  name: string;
  nickname: string;
  avatar: string;
  title: string;
  grade: string;
}

export interface UserProgress {
  childProfile: ChildProfile;
  masteredWordIds: string[];
  learningWordIds: string[];
  favoriteWordIds: string[];
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  testHistory: TestResult[];
  unlockedStickers: string[];
}

export interface TestResult {
  id: string;
  date: string;
  topicId: string | 'all';
  topicName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  wrongWordIds: string[];
}

export interface GameScore {
  gameType: 'matching' | 'listen-pick' | 'bubble-pop';
  score: number;
  starsEarned: number;
  date: string;
}

export interface Sticker {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
}
