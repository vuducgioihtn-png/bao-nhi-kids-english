import { UserProgress, TestResult, Sticker, ChildProfile } from '../types';

const STORAGE_KEY = 'bmyc_kids_vocab_progress_v1';

export const DEFAULT_CHILD_PROFILE: ChildProfile = {
  name: 'Bảo Nhi',
  nickname: 'Bé Bảo Nhi',
  avatar: '👧',
  title: 'Ngôi Sao Nhí BMyC',
  grade: 'Tiểu Học (Lớp 1 - 5)',
};

export const ALL_STICKERS: Sticker[] = [
  {
    id: 'first-steps',
    name: 'Bước Đầu Tiên',
    description: 'Học thuộc 5 từ vựng đầu tiên',
    icon: '🌱',
    requirement: '5 từ thuộc',
    unlocked: false,
  },
  {
    id: 'speller-star',
    name: 'Thánh Đánh Vần',
    description: 'Viết đúng 10 từ trong phần Nghe & Viết',
    icon: '✍️',
    requirement: '10 từ viết đúng',
    unlocked: false,
  },
  {
    id: 'topic-champ',
    name: 'Chiến Thần Chủ Đề',
    description: 'Thuộc tất cả từ vựng của 1 chủ đề bất kỳ',
    icon: '🏆',
    requirement: '1 chủ đề hoàn thành',
    unlocked: false,
  },
  {
    id: 'perfect-quiz',
    name: 'Điểm 10 Hoàn Hảo',
    description: 'Đạt 100% điểm trong bài kiểm tra',
    icon: '⭐',
    requirement: 'Đạt 100% bài test',
    unlocked: false,
  },
  {
    id: 'vocab-collector',
    name: 'Nhà Thám Hiểm Từ',
    description: 'Thuộc 30 từ vựng tiếng Anh',
    icon: '🎒',
    requirement: '30 từ thuộc',
    unlocked: false,
  },
  {
    id: 'dino-genius',
    name: 'Khủng Long Thông Thái',
    description: 'Thuộc 60 từ vựng tiếng Anh',
    icon: '🦖',
    requirement: '60 từ thuộc',
    unlocked: false,
  },
  {
    id: 'super-streak',
    name: 'Chăm Chỉ Bền Bỉ',
    description: 'Học tập liên tiếp 3 ngày',
    icon: '🔥',
    requirement: 'Chuỗi 3 ngày',
    unlocked: false,
  },
  {
    id: 'rainbow-master',
    name: 'Bậc Thầy BMyC',
    description: 'Tích lũy được 100 ngôi sao lấp lánh',
    icon: '🌈',
    requirement: '100 ngôi sao',
    unlocked: false,
  },
];

const DEFAULT_PROGRESS: UserProgress = {
  childProfile: DEFAULT_CHILD_PROFILE,
  masteredWordIds: [],
  learningWordIds: [],
  favoriteWordIds: [],
  stars: 10, // Starting bonus
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  testHistory: [],
  unlockedStickers: ['first-steps'], // Default encouragement sticker
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    const childProfile =
      parsed.childProfile && parsed.childProfile.name
        ? { ...DEFAULT_CHILD_PROFILE, ...parsed.childProfile }
        : DEFAULT_CHILD_PROFILE;

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      childProfile,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving progress:', err);
  }
}

export function updateChildProfile(profile: Partial<ChildProfile>, current: UserProgress): UserProgress {
  const updated: UserProgress = {
    ...current,
    childProfile: {
      ...current.childProfile,
      ...profile,
    },
  };
  saveUserProgress(updated);
  return updated;
}

export function toggleMasteredWord(wordId: string, current: UserProgress): UserProgress {
  const isMastered = current.masteredWordIds.includes(wordId);
  let nextMastered: string[];
  let starsDelta = 0;

  if (isMastered) {
    nextMastered = current.masteredWordIds.filter(id => id !== wordId);
  } else {
    nextMastered = [...current.masteredWordIds, wordId];
    starsDelta = 2; // +2 stars for mastering a word
  }

  const updated: UserProgress = {
    ...current,
    masteredWordIds: nextMastered,
    stars: Math.max(0, current.stars + starsDelta),
  };

  saveUserProgress(updated);
  return updated;
}

export function addStars(count: number, current: UserProgress): UserProgress {
  const updated = {
    ...current,
    stars: current.stars + count,
  };
  saveUserProgress(updated);
  return updated;
}

export function saveTestResult(result: TestResult, current: UserProgress): UserProgress {
  const starsEarned = Math.round((result.score / result.totalQuestions) * 10);
  const updated: UserProgress = {
    ...current,
    stars: current.stars + starsEarned,
    testHistory: [result, ...current.testHistory.slice(0, 19)], // keep last 20 tests
  };
  saveUserProgress(updated);
  return updated;
}
