import os
import json
import sys

from data_p1 import DATA_1_25
from data_p2 import DATA_26_50
from data_p3 import DATA_51_75
from data_p4 import DATA_76_100

all_raw = DATA_1_25 + DATA_26_50 + DATA_51_75 + DATA_76_100

print(f"Total raw lessons loaded: {len(all_raw)}")

# Verify all 100 numbers
numbers = [item["num"] for item in all_raw]
assert len(numbers) == 100, f"Expected 100 items, got {len(numbers)}"
assert sorted(numbers) == list(range(1, 101)), "Lesson numbers are not 1 to 100"

processed_lessons = []
for item in all_raw:
    lesson_num = item["num"]
    lesson_id = f"grade2_lesson_{lesson_num:03d}"
    
    # Process sentences
    sentences = []
    full_en = []
    full_vi = []
    for s_idx, s in enumerate(item["sentences"]):
        sentences.append({
            "id": f"{lesson_id}_s{s_idx + 1}",
            "en": s["en"],
            "vi": s["vi"]
        })
        full_en.append(s["en"])
        full_vi.append(s["vi"])
    
    # Process keywords
    keywords = []
    for k in item.get("keywords", []):
        keywords.append({
            "word": k["word"],
            "meaning": k["meaning"],
            "ipa": k.get("ipa", ""),
            "readVi": k.get("readVi", "")
        })
    
    # Child-friendly presentation tips tailored to 2nd graders
    tips = [
        "Mỉm cười tươi và đứng thẳng lưng khi bắt đầu",
        "Chào mở đầu rõ ràng: 'Hello everyone!'",
        "Đọc to, rõ từng câu theo nhịp điệu tự nhiên",
        "Kết thúc bằng lời cảm ơn: 'Thank you for listening!'"
    ]
    
    processed_lessons.append({
        "id": lesson_id,
        "lessonNumber": lesson_num,
        "titleEn": item["titleEn"],
        "titleVi": item["titleVi"],
        "topicGroup": item["group"],
        "topicGroupId": item["groupId"],
        "icon": item["icon"],
        "contentEn": " ".join(full_en),
        "contentVi": " ".join(full_vi),
        "sentences": sentences,
        "keywords": keywords,
        "presentationTips": tips
    })

out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/grade2_passages"))
os.makedirs(out_dir, exist_ok=True)

json_path = os.path.join(out_dir, "lessons.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(processed_lessons, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {json_path} with {len(processed_lessons)} lessons!")

# Also write index.ts that exports them
ts_content = f"""// Auto-generated 100 Grade 2 Presentation Lessons
import {{ Grade2Passage, TopicGroupInfo }} from './types';
import rawLessons from './lessons.json';

export * from './types';

export const GRADE2_PASSAGES: Grade2Passage[] = rawLessons as Grade2Passage[];

export const TOPIC_GROUPS: TopicGroupInfo[] = [
  {{ id: 1, nameVi: "Bản thân & Thói quen", nameEn: "Myself & Daily Habits", icon: "👦", lessonCount: 10 }},
  {{ id: 2, nameVi: "Gia đình & Ngôi nhà yêu thương", nameEn: "Family & Loving Home", icon: "🏡", lessonCount: 10 }},
  {{ id: 3, nameVi: "Trường học & Thầy cô, Bạn bè", nameEn: "School, Teachers & Friends", icon: "🏫", lessonCount: 10 }},
  {{ id: 4, nameVi: "Thế giới Động vật quanh em", nameEn: "Animal World", icon: "🐾", lessonCount: 10 }},
  {{ id: 5, nameVi: "Thiên nhiên, Thời tiết & 4 Mùa", nameEn: "Nature & Four Seasons", icon: "🌈", lessonCount: 10 }},
  {{ id: 6, nameVi: "Đồ ăn thức uống & Dinh dưỡng", nameEn: "Food & Healthy Habits", icon: "🍎", lessonCount: 10 }},
  {{ id: 7, nameVi: "Sở thích, Thể thao & Hoạt động vui chơi", nameEn: "Hobbies & Sports", icon: "⚽", lessonCount: 10 }},
  {{ id: 8, nameVi: "Cộng đồng, Nghề nghiệp & Xã hội", nameEn: "Community & Occupations", icon: "👮", lessonCount: 10 }},
  {{ id: 9, nameVi: "Kỹ năng sống, Đạo đức & Lễ phép", nameEn: "Life Skills & Good Values", icon: "⭐", lessonCount: 10 }},
  {{ id: 10, nameVi: "Khám phá Thế giới, Lễ hội & Ước mơ", nameEn: "World, Festivals & Dreams", icon: "🚀", lessonCount: 10 }}
];

export function getPassageByNumber(lessonNum: number): Grade2Passage | undefined {{
  return GRADE2_PASSAGES.find(p => p.lessonNumber === lessonNum);
}}

export function getPassagesByGroup(groupId: number): Grade2Passage[] {{
  return GRADE2_PASSAGES.filter(p => p.topicGroupId === groupId);
}}
"""

ts_path = os.path.join(out_dir, "index.ts")
with open(ts_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {ts_path}!")
