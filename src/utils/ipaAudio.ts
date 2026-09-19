import { IPASoundItem } from '../data/ipaData';
import { sound } from './audio';

// Speech helpers specifically tuned for young learners practicing the 44 IPA sounds
export const speakIPASound = (
  item: IPASoundItem,
  slowMode: boolean = false
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  // Natural pronunciation utterance combining the isolated phoneme hint and example word
  // E.g., for /iː/: "ee... Sheep!"
  const rate = slowMode ? 0.65 : 0.85;
  const pitch = 1.05;

  const phraseToSpeak = `${item.primaryWord}`;
  sound.speak(phraseToSpeak, rate, pitch);
};

export const speakWordOnly = (
  word: string,
  slowMode: boolean = false
): void => {
  const rate = slowMode ? 0.6 : 0.85;
  sound.speak(word, rate, 1.05);
};
