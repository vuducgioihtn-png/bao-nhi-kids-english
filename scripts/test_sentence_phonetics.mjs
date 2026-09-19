import fs from 'fs';
import { dictionary } from 'cmu-pronouncing-dictionary';

const lessons = JSON.parse(fs.readFileSync('src/data/grade2_passages/lessons.json', 'utf8'));

// Test on Lesson 1
const lesson1 = lessons[0];
console.log('Lesson 1:', lesson1.titleEn);
for (const s of lesson1.sentences) {
  console.log('EN:', s.en);
  console.log('VI:', s.vi);
}
