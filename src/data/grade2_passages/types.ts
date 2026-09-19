export interface Grade2Keyword {
  word: string;
  meaning: string;
  ipa?: string;
  readVi?: string;
}

export interface Grade2Sentence {
  id: string;
  en: string;
  vi: string;
  ipa?: string;
  readVi?: string;
}

export interface Grade2Passage {
  id: string;
  lessonNumber: number;
  titleEn: string;
  titleVi: string;
  topicGroup: string;
  topicGroupId: number;
  icon: string;
  contentEn: string;
  contentVi: string;
  sentences: Grade2Sentence[];
  keywords: Grade2Keyword[];
  presentationTips?: string[];
}

export interface TopicGroupInfo {
  id: number;
  nameVi: string;
  nameEn: string;
  icon: string;
  lessonCount: number;
}

