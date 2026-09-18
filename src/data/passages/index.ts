import { SpeakingPassage } from './types';
export * from './types';
import { getSentencePhonetics, getVocabPhonetics } from '../../utils/phonetics';
import { LEVEL_1_PASSAGES } from './level1';
import { LEVEL_2_PASSAGES } from './level2';
import { LEVEL_3_PASSAGES } from './level3';
import { LEVEL_4_PASSAGES } from './level4';
import { PART2_LEVEL_1_PASSAGES } from './part2_level1';
import { PART2_LEVEL_2_PASSAGES } from './part2_level2';
import { PART2_LEVEL_3_PASSAGES } from './part2_level3';
import { PART2_LEVEL_4_PASSAGES } from './part2_level4';
import { PART3_LEVEL_1_PASSAGES } from './part3_level1';
import { PART3_LEVEL_2_PASSAGES } from './part3_level2';
import { PART3_LEVEL_3_PASSAGES } from './part3_level3';
import { PART3_LEVEL_4_PASSAGES } from './part3_level4';
import { PART4_LEVEL_1_PASSAGES } from './part4_level1';
import { PART4_LEVEL_2_PASSAGES } from './part4_level2';
import { PART4_LEVEL_3_PASSAGES } from './part4_level3';
import { PART4_LEVEL_4_PASSAGES } from './part4_level4';
import { PART5_LEVEL_1_PASSAGES } from './part5_level1';
import { PART5_LEVEL_2_PASSAGES } from './part5_level2';
import { PART5_LEVEL_3_PASSAGES } from './part5_level3';
import { PART5_LEVEL_4_PASSAGES } from './part5_level4';

/**
 * Tự động đồng bộ và bổ sung phiên âm IPA và Gợi ý đọc tiếng Việt chuẩn tiếng Anh cho bé
 * trên toàn bộ 400 bài đọc
 */
export function enrichPassagePhonetics(p: SpeakingPassage): SpeakingPassage {
  const enrichedSentences = p.sentences.map((s) => {
    const ph = getSentencePhonetics(s);
    return {
      ...s,
      ipa: s.ipa || ph.ipa,
      readVi: s.readVi || ph.readVi,
    };
  });

  const enrichedVocab = p.vocabulary.map((v) => {
    const ph = getVocabPhonetics(v);
    return {
      ...v,
      ipa: v.ipa || ph.ipa,
      readVi: v.readVi || ph.readVi,
    };
  });

  return {
    ...p,
    passageIpa: p.passageIpa || enrichedSentences.map((s) => s.ipa).join(' '),
    passageReadVi: p.passageReadVi || enrichedSentences.map((s) => s.readVi).join(' '),
    sentences: enrichedSentences,
    vocabulary: enrichedVocab,
  };
}

const RAW_PASSAGES: SpeakingPassage[] = [
  ...LEVEL_1_PASSAGES,
  ...LEVEL_2_PASSAGES,
  ...LEVEL_3_PASSAGES,
  ...LEVEL_4_PASSAGES,
  ...PART2_LEVEL_1_PASSAGES,
  ...PART2_LEVEL_2_PASSAGES,
  ...PART2_LEVEL_3_PASSAGES,
  ...PART2_LEVEL_4_PASSAGES,
  ...PART3_LEVEL_1_PASSAGES,
  ...PART3_LEVEL_2_PASSAGES,
  ...PART3_LEVEL_3_PASSAGES,
  ...PART3_LEVEL_4_PASSAGES,
  ...PART4_LEVEL_1_PASSAGES,
  ...PART4_LEVEL_2_PASSAGES,
  ...PART4_LEVEL_3_PASSAGES,
  ...PART4_LEVEL_4_PASSAGES,
  ...PART5_LEVEL_1_PASSAGES,
  ...PART5_LEVEL_2_PASSAGES,
  ...PART5_LEVEL_3_PASSAGES,
  ...PART5_LEVEL_4_PASSAGES,
];

export const ALL_SPEAKING_PASSAGES: SpeakingPassage[] = RAW_PASSAGES.map(enrichPassagePhonetics);


export interface LevelInfo {
  level: number;
  label: string;
  badge: string;
  range: string;
  age: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  icon: string;
}

export const SPEAKING_LEVELS: LevelInfo[] = [
  {
    level: 1,
    label: 'Starters',
    badge: 'Cơ bản',
    range: 'Bài 1-25 & 101-125 & 201-225 & 301-325 & 401-425',
    age: '4 – 6 tuổi (Mầm non - Lớp 1)',
    count: LEVEL_1_PASSAGES.length + PART2_LEVEL_1_PASSAGES.length + PART3_LEVEL_1_PASSAGES.length + PART4_LEVEL_1_PASSAGES.length + PART5_LEVEL_1_PASSAGES.length,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Từ ngữ gần gũi, câu ngắn 3-5 từ, chủ đề gia đình, đồ chơi, màu sắc, thú cưng',
    icon: '🌱',
  },
  {
    level: 2,
    label: 'Explorers',
    badge: 'Mở rộng',
    range: 'Bài 26-50 & 126-150 & 226-250 & 326-350 & 426-450',
    age: '6 – 7 tuổi (Lớp 1 - 2)',
    count: LEVEL_2_PASSAGES.length + PART2_LEVEL_2_PASSAGES.length + PART3_LEVEL_2_PASSAGES.length + PART4_LEVEL_2_PASSAGES.length + PART5_LEVEL_2_PASSAGES.length,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Khám phá trường học, thói quen tốt, thiên nhiên và kỹ năng sống tích cực',
    icon: '🌿',
  },
  {
    level: 3,
    label: 'Achievers',
    badge: 'Nâng cao',
    range: 'Bài 51-75 & 151-175 & 251-275 & 351-375 & 451-475',
    age: '7 – 8 tuổi (Lớp 2 - 3)',
    count: LEVEL_3_PASSAGES.length + PART2_LEVEL_3_PASSAGES.length + PART3_LEVEL_3_PASSAGES.length + PART4_LEVEL_3_PASSAGES.length + PART5_LEVEL_3_PASSAGES.length,
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    description: 'Khoa học kỳ thú, danh lam thắng cảnh Việt Nam, danh nhân và văn hóa thế giới',
    icon: '🚀',
  },
  {
    level: 4,
    label: 'Masters',
    badge: 'Chuyên sâu',
    range: 'Bài 76-100 & 176-200 & 276-300 & 376-400 & 476-500',
    age: '8 – 10+ tuổi (Lớp 3 - 5)',
    count: LEVEL_4_PASSAGES.length + PART2_LEVEL_4_PASSAGES.length + PART3_LEVEL_4_PASSAGES.length + PART4_LEVEL_4_PASSAGES.length + PART5_LEVEL_4_PASSAGES.length,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Văn minh nhân loại, vũ trụ, sinh thái học, tư duy logic và công nghệ tương lai',
    icon: '👑',
  },
];

export function getPassagesByLevel(level: number): SpeakingPassage[] {
  switch (level) {
    case 1:
      return [...LEVEL_1_PASSAGES, ...PART2_LEVEL_1_PASSAGES, ...PART3_LEVEL_1_PASSAGES, ...PART4_LEVEL_1_PASSAGES, ...PART5_LEVEL_1_PASSAGES];
    case 2:
      return [...LEVEL_2_PASSAGES, ...PART2_LEVEL_2_PASSAGES, ...PART3_LEVEL_2_PASSAGES, ...PART4_LEVEL_2_PASSAGES, ...PART5_LEVEL_2_PASSAGES];
    case 3:
      return [...LEVEL_3_PASSAGES, ...PART2_LEVEL_3_PASSAGES, ...PART3_LEVEL_3_PASSAGES, ...PART4_LEVEL_3_PASSAGES, ...PART5_LEVEL_3_PASSAGES];
    case 4:
      return [...LEVEL_4_PASSAGES, ...PART2_LEVEL_4_PASSAGES, ...PART3_LEVEL_4_PASSAGES, ...PART4_LEVEL_4_PASSAGES, ...PART5_LEVEL_4_PASSAGES];
    default:
      return ALL_SPEAKING_PASSAGES;
  }
}

export function getPassageById(id: number): SpeakingPassage | undefined {
  return ALL_SPEAKING_PASSAGES.find((p) => p.id === id);
}

