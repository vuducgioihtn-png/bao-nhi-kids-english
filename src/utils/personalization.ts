/**
 * Personalization utilities for child profile (Default: Bảo Nhi)
 */

export function personalizeText(text: string | undefined, childName: string = 'Bảo Nhi'): string {
  if (!text) return '';
  return text
    .replace(/\bBé\s+(chải|đung|xoay|ngạc|đã|cẩn|có|khoe|làm|đạt)/g, `${childName} $1`)
    .replace(/tặng bé\b/gi, `tặng ${childName}`)
    .replace(/khen bé\b/gi, `khen ${childName}`)
    .replace(/cho bé\b/gi, `cho ${childName}`)
    .replace(/của bé\b/gi, `của ${childName}`)
    .replace(/giúp bé\b/gi, `giúp ${childName}`);
}

const PRAISES = [
  'Bảo Nhi thông minh và chăm chỉ quá! 🌟',
  'Tuyệt vời lắm Bảo Nhi ơi! Cố lên nhé! ✨',
  'Bảo Nhi phát âm siêu chuẩn luôn! 💖',
  'Thêm một từ vựng mới vào kho báu của Bảo Nhi! 🏆',
  'Bảo Nhi xứng đáng là ngôi sao nhí BMyC! 👑',
];

export function getRandomPraise(childName: string = 'Bảo Nhi'): string {
  const template = PRAISES[Math.floor(Math.random() * PRAISES.length)];
  return template.replace(/Bảo Nhi/g, childName);
}
