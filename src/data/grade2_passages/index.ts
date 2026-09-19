// Auto-generated 100 Grade 2 Presentation Lessons
import { Grade2Passage, TopicGroupInfo } from './types';
import rawLessons from './lessons.json';

export * from './types';

export const GRADE2_PASSAGES: Grade2Passage[] = rawLessons as Grade2Passage[];

export const TOPIC_GROUPS: TopicGroupInfo[] = [
  { id: 1, nameVi: "Bản thân & Thói quen", nameEn: "Myself & Daily Habits", icon: "👦", lessonCount: 10 },
  { id: 2, nameVi: "Gia đình & Ngôi nhà yêu thương", nameEn: "Family & Loving Home", icon: "🏡", lessonCount: 10 },
  { id: 3, nameVi: "Trường học & Thầy cô, Bạn bè", nameEn: "School, Teachers & Friends", icon: "🏫", lessonCount: 10 },
  { id: 4, nameVi: "Thế giới Động vật quanh em", nameEn: "Animal World", icon: "🐾", lessonCount: 10 },
  { id: 5, nameVi: "Thiên nhiên, Thời tiết & 4 Mùa", nameEn: "Nature & Four Seasons", icon: "🌈", lessonCount: 10 },
  { id: 6, nameVi: "Đồ ăn thức uống & Dinh dưỡng", nameEn: "Food & Healthy Habits", icon: "🍎", lessonCount: 10 },
  { id: 7, nameVi: "Sở thích, Thể thao & Hoạt động vui chơi", nameEn: "Hobbies & Sports", icon: "⚽", lessonCount: 10 },
  { id: 8, nameVi: "Cộng đồng, Nghề nghiệp & Xã hội", nameEn: "Community & Occupations", icon: "👮", lessonCount: 10 },
  { id: 9, nameVi: "Kỹ năng sống, Đạo đức & Lễ phép", nameEn: "Life Skills & Good Values", icon: "⭐", lessonCount: 10 },
  { id: 10, nameVi: "Khám phá Thế giới, Lễ hội & Ước mơ", nameEn: "World, Festivals & Dreams", icon: "🚀", lessonCount: 10 }
];

export function getPassageByNumber(lessonNum: number): Grade2Passage | undefined {
  return GRADE2_PASSAGES.find(p => p.lessonNumber === lessonNum);
}

export function getPassagesByGroup(groupId: number): Grade2Passage[] {
  return GRADE2_PASSAGES.filter(p => p.topicGroupId === groupId);
}
