export type PassageLevel = 1 | 2 | 3 | 4;

export interface PassageVocabulary {
  word: string;
  meaning: string;
  ipa?: string;
  readVi?: string; // Gợi ý cách đọc tiếng Việt chuẩn tiếng Anh cho bé (vd: "két-t", "rên-bâu")
}

export interface ReflexQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[]; // Multiple choice options for interactive practice
}

export interface ReadingSentence {
  textEn: string;
  textVi: string;
  ipa?: string; // Phiên âm quốc tế IPA (vd: "/ðɪs ɪz maɪ kæt/")
  readVi?: string; // Gợi ý cách đọc tiếng Việt chuẩn tiếng Anh cho bé (vd: "Đít-s i-z mai két-t.")
}

export interface SpeakingPassage {
  id: number; // 1 to 300
  titleEn: string;
  titleVi: string;
  level: PassageLevel;
  levelLabel: string;
  ageGroup: string;
  theme: string;
  icon: string;
  passageEn: string;
  passageVi: string;
  passageIpa?: string;
  passageReadVi?: string;
  sentences: ReadingSentence[];
  vocabulary: PassageVocabulary[];
  questions: ReflexQuestion[];
}
