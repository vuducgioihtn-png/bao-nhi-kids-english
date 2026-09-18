import { WordItem } from '../types';
import { PART1_VOCAB } from './vocab/part1';
import { PART2_VOCAB } from './vocab/part2';
import { PART3_VOCAB } from './vocab/part3';
import { PART4_VOCAB } from './vocab/part4';
import { PART5_VOCAB } from './vocab/part5';

// Consolidated vocabulary across all 35 BMyC topics (600+ words)
export const VOCABULARY: WordItem[] = [
  ...PART1_VOCAB,
  ...PART2_VOCAB,
  ...PART3_VOCAB,
  ...PART4_VOCAB,
  ...PART5_VOCAB,
];

// Helper functions for easy access
export function getWordsByTopic(topicId: string): WordItem[] {
  return VOCABULARY.filter(w => w.category === topicId);
}

export function getWordById(id: string): WordItem | undefined {
  return VOCABULARY.find(w => w.id === id);
}

export function getRandomWords(count: number, excludeId?: string, topicId?: string): WordItem[] {
  let pool = topicId && topicId !== 'all' ? getWordsByTopic(topicId) : VOCABULARY;
  if (excludeId) {
    pool = pool.filter(w => w.id !== excludeId);
  }
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
