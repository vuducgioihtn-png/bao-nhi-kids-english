import { WordItem, Topic } from '../types';
import { VOCABULARY, getWordsByTopic } from './vocabulary';

export interface TestPackage {
  id: string;
  category: 'grade' | 'skill' | 'cambridge' | 'master' | 'topic';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badgeLabel: string;
  badgeColor: {
    bg: string;
    text: string;
    border: string;
  };
  difficulty: 'Dễ' | 'Trung bình' | 'Khá' | 'Nâng cao' | 'Thử thách';
  difficultyStars: number;
  questionCount: number;
  rewardStars: number;
  rewardTrophy: string;
  allowedTopicIds?: string[];
  forceQuestionType?: 'listen-pick' | 'listen-to-image' | 'fill-blank' | 'image-pick' | 'mixed';
  hasTimer?: boolean;
  timerSecondsPerQ?: number;
}

export const TEST_PACKAGES: TestPackage[] = [
  // ================= 1. GRADE-LEVEL ASSESSMENTS =================
  {
    id: 'grade-1',
    category: 'grade',
    title: 'Đề Thi Định Kỳ: Lớp 1 (Khởi Động)',
    subtitle: 'Nền tảng phát âm & nhận thức đầu đời',
    description: '10 câu hỏi bao quát từ vựng Lớp 1: Số đếm, màu sắc, gia đình, hình khối, cơ thể và thú cưng quen thuộc.',
    icon: '🎒',
    badgeLabel: 'Khối Lớp 1',
    badgeColor: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
    },
    difficulty: 'Dễ',
    difficultyStars: 1,
    questionCount: 10,
    rewardStars: 10,
    rewardTrophy: 'Huy hiệu Ngôi Sao Lớp 1 🌟',
    allowedTopicIds: ['family', 'body', 'face', 'colors', 'shapes', 'numbers', 'pets'],
    forceQuestionType: 'mixed',
  },
  {
    id: 'grade-2',
    category: 'grade',
    title: 'Đề Thi Định Kỳ: Lớp 2 (Khám Phá)',
    subtitle: 'Mở rộng thế giới trường lớp & sinh hoạt',
    description: '10 câu hỏi kiểm tra từ vựng trường học, đồ dùng học tập, đồ chơi, nhà cửa, phòng ốc và thức ăn ngon miệng.',
    icon: '🏫',
    badgeLabel: 'Khối Lớp 2',
    badgeColor: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
    },
    difficulty: 'Trung bình',
    difficultyStars: 2,
    questionCount: 10,
    rewardStars: 10,
    rewardTrophy: 'Huy hiệu Nhà Khám Phá Lớp 2 🧭',
    allowedTopicIds: ['school', 'supplies', 'toys', 'house', 'furniture', 'hygiene', 'food', 'fruit'],
    forceQuestionType: 'mixed',
  },
  {
    id: 'grade-3',
    category: 'grade',
    title: 'Đề Thi Định Kỳ: Lớp 3 (Giao Tiếp)',
    subtitle: 'Đời sống, thiên nhiên & cảm xúc',
    description: '12 câu hỏi trắc nghiệm kiểm tra trang phục, thời tiết bốn mùa, muôn loài động vật hoang dã & đại dương.',
    icon: '🦁',
    badgeLabel: 'Khối Lớp 3',
    badgeColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    difficulty: 'Khá',
    difficultyStars: 3,
    questionCount: 12,
    rewardStars: 12,
    rewardTrophy: 'Huy hiệu Thám Hiểm Lớp 3 ⛺',
    allowedTopicIds: ['clothing', 'footwear', 'vegetables', 'drinks', 'wildlife', 'marine', 'feelings', 'weather'],
    forceQuestionType: 'mixed',
  },
  {
    id: 'grade-4',
    category: 'grade',
    title: 'Đề Thi Định Kỳ: Lớp 4 (Bứt Phá)',
    subtitle: 'Xã hội, phương tiện & hành động',
    description: '12 câu hỏi chuyên sâu về phương tiện giao thông, nghề nghiệp tương lai, hành động và danh lam thiên nhiên.',
    icon: '🚀',
    badgeLabel: 'Khối Lớp 4',
    badgeColor: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
    },
    difficulty: 'Nâng cao',
    difficultyStars: 4,
    questionCount: 12,
    rewardStars: 12,
    rewardTrophy: 'Huy hiệu Bứt Phá Lớp 4 🥇',
    allowedTopicIds: ['transport', 'jobs', 'actions', 'nature', 'places', 'insects', 'birds'],
    forceQuestionType: 'mixed',
  },
  {
    id: 'grade-5',
    category: 'grade',
    title: 'Đề Thi Định Kỳ: Lớp 5 (Chinh Phục Master)',
    subtitle: 'Tốt nghiệp toàn diện chuẩn bị chuyển cấp',
    description: '15 câu hỏi bao quát công nghệ số, thời gian, vị trí, thể thao và vốn tính từ mô tả nâng cao.',
    icon: '👑',
    badgeLabel: 'Khối Lớp 5',
    badgeColor: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
    },
    difficulty: 'Thử thách',
    difficultyStars: 5,
    questionCount: 15,
    rewardStars: 15,
    rewardTrophy: 'Cúp Vàng BMyC Master Lớp 5 🏆',
    allowedTopicIds: ['technology', 'time', 'positions', 'sports', 'phrases', 'adjectives'],
    forceQuestionType: 'mixed',
  },

  // ================= 2. SKILL-BASED TESTS =================
  {
    id: 'skill-listen',
    category: 'skill',
    title: 'Chuyên Khảo: Luyện Nghe Phản Xạ 100%',
    subtitle: 'Rèn luyện đôi tai tiếng Anh chuẩn bản ngữ',
    description: '10 câu hỏi chỉ nghe âm thanh phát âm và nhận diện nghĩa hoặc hình ảnh tương ứng. Chuẩn phương pháp BMyC!',
    icon: '🎧',
    badgeLabel: 'Chuyên Kỹ Năng Nghe',
    badgeColor: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      border: 'border-violet-200',
    },
    difficulty: 'Trung bình',
    difficultyStars: 3,
    questionCount: 10,
    rewardStars: 10,
    rewardTrophy: 'Huy hiệu Đôi Tai Thần Kỳ 🎵',
    forceQuestionType: 'listen-pick',
  },
  {
    id: 'skill-spelling',
    category: 'skill',
    title: 'Chuyên Khảo: Đánh Vần & Chính Tả Phonics',
    subtitle: 'Nhớ mặt chữ & quy tắc điền khuyết',
    description: '10 câu hỏi điền các chữ cái còn thiếu vào từ vựng tiếng Anh. Giúp bé viết đúng chính tả và nhớ sâu mặt chữ.',
    icon: '✍️',
    badgeLabel: 'Đánh Vần & Chính Tả',
    badgeColor: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
    difficulty: 'Khá',
    difficultyStars: 3,
    questionCount: 10,
    rewardStars: 10,
    rewardTrophy: 'Huy hiệu Bậc Thầy Ghép Vần 📝',
    forceQuestionType: 'fill-blank',
  },
  {
    id: 'skill-visual',
    category: 'skill',
    title: 'Chuyên Khảo: Trí Nhớ Thị Giác & Tranh Ẩn',
    subtitle: 'Quan sát hình ảnh & liên kết từ vựng',
    description: '10 câu hỏi thử thách nhìn hình đoán từ và chọn tranh đúng. Kích hoạt bán cầu não phải qua hình ảnh trực quan!',
    icon: '🖼️',
    badgeLabel: 'Thị Giác & Tranh Ảnh',
    badgeColor: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
    },
    difficulty: 'Dễ',
    difficultyStars: 2,
    questionCount: 10,
    rewardStars: 10,
    rewardTrophy: 'Huy hiệu Mắt Thần Nhanh Nhạy 👁️',
    forceQuestionType: 'image-pick',
  },
  {
    id: 'skill-speed',
    category: 'skill',
    title: 'Thử Thách: Tốc Độ Chớp Nhoáng (10s/câu)',
    subtitle: 'Đếm ngược phản xạ không đắn đo',
    description: '10 câu hỏi tính thời gian đếm ngược 10 giây mỗi câu! Rèn luyện phản xạ bật từ tức thì không qua dịch thầm.',
    icon: '⚡',
    badgeLabel: 'Thử Thách Tốc Độ',
    badgeColor: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
    },
    difficulty: 'Thử thách',
    difficultyStars: 4,
    questionCount: 10,
    rewardStars: 15,
    rewardTrophy: 'Huy hiệu Tia Chớp BMyC ⚡',
    hasTimer: true,
    timerSecondsPerQ: 10,
    forceQuestionType: 'mixed',
  },

  // ================= 3. CAMBRIDGE & MASTER EXAMS =================
  {
    id: 'cambridge-starters',
    category: 'cambridge',
    title: 'Đề Thi Thử: Cambridge Pre-A1 Starters',
    subtitle: 'Mô phỏng kỳ thi chứng chỉ quốc tế thiếu nhi',
    description: '12 câu hỏi chuẩn cấu trúc Cambridge: Nghe nhận diện, Đọc hiểu tranh ảnh và Ghép từ cơ bản cho học sinh tiểu học.',
    icon: '🏅',
    badgeLabel: 'Cambridge Starters',
    badgeColor: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    difficulty: 'Khá',
    difficultyStars: 3,
    questionCount: 12,
    rewardStars: 12,
    rewardTrophy: 'Chứng Chỉ Sao Cambridge Starters ⭐',
    allowedTopicIds: ['family', 'colors', 'numbers', 'school', 'supplies', 'toys', 'animals-wild', 'food'],
    forceQuestionType: 'mixed',
  },
  {
    id: 'cambridge-movers',
    category: 'cambridge',
    title: 'Đề Thi Thử: Cambridge A1 Movers',
    subtitle: 'Cấp độ thử thách nâng cao Cambridge',
    description: '15 câu hỏi nâng cao mô phỏng chuẩn A1 Movers: Vốn từ rộng mở, phân biệt ngữ cảnh và chính tả chính xác.',
    icon: '🥇',
    badgeLabel: 'Cambridge Movers',
    badgeColor: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    difficulty: 'Nâng cao',
    difficultyStars: 4,
    questionCount: 15,
    rewardStars: 15,
    rewardTrophy: 'Chứng Chỉ Vàng Cambridge Movers 🏆',
    forceQuestionType: 'mixed',
  },
  {
    id: 'master-all',
    category: 'master',
    title: 'Đại Khảo Thí: Tổng Hợp 35 Chủ Đề BMyC',
    subtitle: 'Đánh giá định kỳ toàn diện nhất',
    description: '15 câu hỏi ngẫu nhiên từ kho 600+ từ vựng tiếng Anh. Thích hợp kiểm tra định kỳ hàng tháng của bé!',
    icon: '🌍',
    badgeLabel: 'Toàn Diện 35 Chủ Đề',
    badgeColor: {
      bg: 'bg-fuchsia-50',
      text: 'text-fuchsia-700',
      border: 'border-fuchsia-200',
    },
    difficulty: 'Nâng cao',
    difficultyStars: 4,
    questionCount: 15,
    rewardStars: 15,
    rewardTrophy: 'Cúp Đại Khảo Thí Toàn Diện BMyC 🏆',
    forceQuestionType: 'mixed',
  },
];

// Helper to filter words for a test package
export function getWordsForPackage(pkg: TestPackage, currentTopic?: Topic): WordItem[] {
  if (pkg.category === 'topic' && currentTopic) {
    return getWordsByTopic(currentTopic.id);
  }

  if (pkg.allowedTopicIds && pkg.allowedTopicIds.length > 0) {
    const pool = VOCABULARY.filter(w => pkg.allowedTopicIds!.includes(w.category));
    if (pool.length >= 10) return pool;
  }

  return VOCABULARY;
}
