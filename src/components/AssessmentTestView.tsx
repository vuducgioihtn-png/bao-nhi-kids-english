import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Star,
  Sparkles,
  BookOpen,
  Search,
  Clock,
  Trophy,
  Filter,
  ArrowLeft,
  Play,
  Headphones,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic, TestResult, ChildProfile } from '../types';
import { VOCABULARY, getWordsByTopic, getRandomWords } from '../data/vocabulary';
import { TOPICS } from '../data/topics';
import { TEST_PACKAGES, TestPackage, getWordsForPackage } from '../data/testPackages';
import { sound } from '../utils/audio';

interface AssessmentTestViewProps {
  currentTopic: Topic;
  onSaveTestResult: (result: TestResult) => void;
  childProfile?: ChildProfile;
}

interface TestQuestion {
  id: string;
  type: 'listen-pick' | 'listen-to-image' | 'image-pick' | 'vi-pick' | 'en-pick' | 'fill-blank';
  word: WordItem;
  prompt: string;
  options: string[];
  correctAnswer: string;
  blankDisplay?: string;
}

type TabFilter = 'all' | 'grade' | 'skill' | 'master' | 'topic';

export const AssessmentTestView: React.FC<AssessmentTestViewProps> = ({
  currentTopic,
  onSaveTestResult,
  childProfile,
}) => {
  const childName = childProfile?.name || 'Bảo Nhi';
  const childNickname = childProfile?.nickname || 'Bé Bảo Nhi';
  const childAvatar = childProfile?.avatar || '👧';
  // Test state
  const [selectedTab, setSelectedTab] = useState<TabFilter>('all');
  const [activePackage, setActivePackage] = useState<TestPackage | null>(null);
  const [activeTopicForTest, setActiveTopicForTest] = useState<Topic>(currentTopic);
  const [topicSearchQuery, setTopicSearchQuery] = useState('');

  const [isTesting, setIsTesting] = useState(false);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [qIdx: number]: { userChoice: string; isCorrect: boolean } }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedResult, setCompletedResult] = useState<TestResult | null>(null);

  // Timer for speed challenge
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer helper
  const clearCurrentTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Generate test questions from package or chosen topic
  const startTestFromPackage = useCallback((pkg: TestPackage, chosenTopic?: Topic) => {
    clearCurrentTimer();
    setActivePackage(pkg);
    const targetTopic = chosenTopic || activeTopicForTest;

    let pool: WordItem[] = [];
    if (pkg.category === 'topic') {
      pool = getWordsByTopic(targetTopic.id);
    } else {
      pool = getWordsForPackage(pkg, targetTopic);
    }

    if (pool.length < 4) {
      pool = VOCABULARY;
    }

    const count = Math.min(pkg.questionCount, pool.length);
    // Shuffle and pick
    const testWords = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);

    const generated: TestQuestion[] = testWords.map((word, idx) => {
      let qType: TestQuestion['type'] = 'image-pick';

      if (pkg.forceQuestionType && pkg.forceQuestionType !== 'mixed') {
        qType = pkg.forceQuestionType;
      } else {
        // Diverse mixed types
        const types: TestQuestion['type'][] = [
          'listen-pick',
          'listen-to-image',
          'image-pick',
          'vi-pick',
          'en-pick',
          'fill-blank',
        ];
        qType = types[idx % types.length];
      }

      // Distractors pool
      const distractors = getRandomWords(3, word.id, pkg.category === 'topic' ? targetTopic.id : undefined);

      if (qType === 'listen-pick') {
        const allOpts = [word.en, ...distractors.map(d => d.en)].sort(() => 0.5 - Math.random());
        return {
          id: `q-${idx}`,
          type: qType,
          word,
          prompt: 'Lắng nghe phát âm và chọn từ tiếng Anh đúng:',
          options: allOpts,
          correctAnswer: word.en,
        };
      } else if (qType === 'listen-to-image') {
        // Options are emojis!
        const allOpts = [word.emoji, ...distractors.map(d => d.emoji)].sort(() => 0.5 - Math.random());
        return {
          id: `q-${idx}`,
          type: qType,
          word,
          prompt: 'Lắng nghe phát âm và chọn hình ảnh phù hợp:',
          options: allOpts,
          correctAnswer: word.emoji,
        };
      } else if (qType === 'image-pick') {
        const allOpts = [word.en, ...distractors.map(d => d.en)].sort(() => 0.5 - Math.random());
        return {
          id: `q-${idx}`,
          type: qType,
          word,
          prompt: `Bức tranh "${word.emoji}" có tên tiếng Anh là gì?`,
          options: allOpts,
          correctAnswer: word.en,
        };
      } else if (qType === 'vi-pick') {
        const allOpts = [word.vi, ...distractors.map(d => d.vi)].sort(() => 0.5 - Math.random());
        return {
          id: `q-${idx}`,
          type: qType,
          word,
          prompt: `Từ "${word.en}" có nghĩa tiếng Việt là gì?`,
          options: allOpts,
          correctAnswer: word.vi,
        };
      } else if (qType === 'en-pick') {
        const allOpts = [word.en, ...distractors.map(d => d.en)].sort(() => 0.5 - Math.random());
        return {
          id: `q-${idx}`,
          type: qType,
          word,
          prompt: `Nghĩa "${word.vi}" tương ứng với từ tiếng Anh nào?`,
          options: allOpts,
          correctAnswer: word.en,
        };
      } else {
        // Fill in missing letter
        const en = word.en.replace(/[^a-zA-Z]/g, '');
        const validLength = en.length > 0 ? en.length : word.en.length;
        const charToHideIdx = Math.floor(Math.random() * validLength);
        const hiddenChar = word.en[charToHideIdx]?.toUpperCase() || 'A';
        const display = word.en
          .split('')
          .map((c, i) => (i === charToHideIdx ? '_' : c))
          .join('');

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => c !== hiddenChar);
        const distLetter = [...alphabet].sort(() => 0.5 - Math.random()).slice(0, 3);
        const letterOpts = [hiddenChar, ...distLetter].sort(() => 0.5 - Math.random());

        return {
          id: `q-${idx}`,
          type: 'fill-blank',
          word,
          prompt: 'Điền chữ cái còn thiếu vào từ tiếng Anh:',
          blankDisplay: display,
          options: letterOpts,
          correctAnswer: hiddenChar,
        };
      }
    });

    setQuestions(generated);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setAnswers({});
    setIsCompleted(false);
    setCompletedResult(null);
    setIsTesting(true);

    // Initial audio speak if listen question
    if (generated[0]?.type === 'listen-pick' || generated[0]?.type === 'listen-to-image') {
      setTimeout(() => {
        sound.speak(generated[0].word.en);
      }, 350);
    }
  }, [activeTopicForTest, clearCurrentTimer]);

  const currentQ = questions[currentQuestionIdx];

  // Auto-speak on question change for listening types
  useEffect(() => {
    if (!isTesting || !currentQ) return;

    if (currentQ.type === 'listen-pick' || currentQ.type === 'listen-to-image') {
      sound.speak(currentQ.word.en);
    }

    // Speed challenge timer setup
    if (activePackage?.hasTimer) {
      const limit = activePackage.timerSecondsPerQ || 10;
      setTimeLeft(limit);
      clearCurrentTimer();

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearCurrentTimer();
            // Time out!
            sound.playWrong();
            setSelectedAnswer('__TIMEOUT__');
            setAnswers(old => ({
              ...old,
              [currentQuestionIdx]: { userChoice: '(Hết giờ)', isCorrect: false },
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearCurrentTimer();
    };
  }, [currentQuestionIdx, currentQ, isTesting, activePackage, clearCurrentTimer]);

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null || !currentQ) return;
    clearCurrentTimer();

    setSelectedAnswer(option);
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: { userChoice: option, isCorrect },
    }));
  };

  const handleNextQuestion = () => {
    sound.playTap();
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    clearCurrentTimer();
    let score = 0;
    const wrongWordIds: string[] = [];

    questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans?.isCorrect) {
        score++;
      } else {
        wrongWordIds.push(q.word.id);
      }
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const testName =
      activePackage?.category === 'topic'
        ? `Chủ đề: ${activeTopicForTest.nameVi}`
        : activePackage?.title || 'Bài kiểm tra định kỳ';

    const result: TestResult = {
      id: `test-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      topicId: activePackage?.category === 'topic' ? activeTopicForTest.id : 'all',
      topicName: testName,
      score,
      totalQuestions,
      percentage,
      wrongWordIds,
    };

    setCompletedResult(result);
    setIsCompleted(true);
    onSaveTestResult(result);

    if (percentage >= 80) {
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    } else {
      sound.playStar();
    }
  };

  // Helper to start topic test
  const handleStartTopicTest = (topic: Topic) => {
    sound.playTap();
    setActiveTopicForTest(topic);
    const customPkg: TestPackage = {
      id: `topic-${topic.id}`,
      category: 'topic',
      title: `Kiểm tra chuyên sâu: ${topic.nameVi}`,
      subtitle: topic.nameEn,
      description: `10 câu hỏi trắc nghiệm & nghe âm thanh độc quyền về chủ đề ${topic.nameVi}.`,
      icon: topic.icon,
      badgeLabel: `Chủ đề ${topic.number}`,
      badgeColor: {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
      },
      difficulty: 'Trung bình',
      difficultyStars: 2,
      questionCount: 10,
      rewardStars: 10,
      rewardTrophy: `Huy hiệu Bậc Thầy ${topic.nameVi} ⭐`,
    };
    startTestFromPackage(customPkg, topic);
  };

  // Filter packages based on selected tab
  const filteredPackages = TEST_PACKAGES.filter(pkg => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'grade') return pkg.category === 'grade';
    if (selectedTab === 'skill') return pkg.category === 'skill';
    if (selectedTab === 'master') return pkg.category === 'cambridge' || pkg.category === 'master';
    return true;
  });

  // Filter 35 topics for Topic tab
  const filteredTopics = TOPICS.filter(t => {
    if (!topicSearchQuery.trim()) return true;
    const q = topicSearchQuery.toLowerCase();
    return t.nameVi.toLowerCase().includes(q) || t.nameEn.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* ================= STATE 1: PRE-TEST SELECTOR ================= */}
      {!isTesting && !isCompleted && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="text-center bg-linear-to-b from-purple-50/80 via-white to-white rounded-3xl p-6 border-2 border-purple-200/80 shadow-xs relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-linear-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-3xl mb-3 shadow-md shadow-purple-200">
              {childAvatar}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100/90 text-purple-900 border border-purple-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Góc Khảo Thí Của {childNickname}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
              Kiểm Tra & Khảo Thí Định Kỳ BMyC
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto leading-relaxed">
              Hệ thống câu hỏi tương tác đa giác quan giúp đánh giá chính xác độ ghi nhớ phản xạ và vinh danh thành tích học tập của {childName}!
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-purple-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100/80 text-purple-900 border border-purple-200">
                <Trophy className="w-3.5 h-3.5 text-purple-700" />
                <span>15+ Đề Kiểm Tra Chuẩn Hóa</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100/80 text-amber-900 border border-amber-200">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Khối Lớp 1 Đến 5</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100/80 text-blue-900 border border-blue-200">
                <Award className="w-3.5 h-3.5 text-blue-700" />
                <span>Chuẩn Cambridge Starters & Movers</span>
              </span>
            </div>
          </div>

          {/* Filter Category Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-slate-200/80">
            <button
              onClick={() => {
                sound.playTap();
                setSelectedTab('all');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tất Cả ({TEST_PACKAGES.length + 1})</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setSelectedTab('grade');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedTab === 'grade'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🎒</span>
              <span>Theo Khối Lớp (1-5)</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setSelectedTab('skill');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedTab === 'skill'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Theo Kỹ Năng (Nghe, Vần, Tốc độ)</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setSelectedTab('master');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedTab === 'master'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Cambridge & Tổng Hợp</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setSelectedTab('topic');
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedTab === 'topic'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>35 Chủ Đề BMyC</span>
            </button>
          </div>

          {/* ================= TAB CONTENT: TOPIC SELECTOR ================= */}
          {selectedTab === 'topic' ? (
            <div className="space-y-4">
              {/* Highlight Card for Current Topic */}
              <div className="p-5 rounded-3xl bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="text-4xl p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-2xs">
                      {currentTopic.icon}
                    </span>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                        Chủ Đề Đang Học Hiện Tại
                      </span>
                      <h3 className="text-xl font-black text-slate-900 font-heading">
                        {currentTopic.nameVi} ({currentTopic.nameEn})
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {currentTopic.description} &bull; 10 câu hỏi trắc nghiệm chuyên sâu
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartTopicTest(currentTopic)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Làm Bài Ngay (+10 ⭐)</span>
                  </button>
                </div>
              </div>

              {/* Topic Search Input */}
              <div className="flex items-center gap-3 bg-white p-2 px-3 rounded-2xl border border-slate-200 shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={topicSearchQuery}
                  onChange={e => setTopicSearchQuery(e.target.value)}
                  placeholder="Tìm nhanh trong 35 chủ đề BMyC (ví dụ: hoa quả, động vật, màu sắc...)..."
                  className="w-full text-xs sm:text-sm bg-transparent border-none outline-none font-medium text-slate-800 placeholder-slate-400"
                />
                {topicSearchQuery && (
                  <button
                    onClick={() => setTopicSearchQuery('')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* 35 Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTopics.map(topic => {
                  const wordsCount = getWordsByTopic(topic.id).length;
                  return (
                    <div
                      key={topic.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                          {topic.icon}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-slate-900 truncate">
                            {topic.nameVi}
                          </h4>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {topic.nameEn} &bull; {wordsCount} từ
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartTopicTest(topic)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-black transition-all cursor-pointer shrink-0"
                      >
                        Kiểm tra ▶
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= TAB CONTENT: TEST PACKAGES CARDS ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Highlight topic test card if on "all" tab */}
              {selectedTab === 'all' && (
                <div className="p-5 rounded-3xl bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-400 shadow-sm transition-all flex flex-col justify-between md:col-span-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <span className="text-4xl p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-2xs">
                        {currentTopic.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-200/90 px-2.5 py-0.5 rounded-full">
                            Đang Học Hiện Tại
                          </span>
                          <span className="text-xs font-bold text-amber-700">
                            10 câu hỏi &bull; Mức độ: Trung bình
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
                          Kiểm Tra Chuyên Sâu: {currentTopic.nameVi}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Đánh giá khả năng nghe, nhìn hình và dịch nghĩa chuẩn theo chủ đề đang học.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-200">
                      <span className="text-xs font-black text-amber-800 whitespace-nowrap">
                        ⭐ Thưởng +10 Sao
                      </span>
                      <button
                        onClick={() => handleStartTopicTest(currentTopic)}
                        className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Làm bài ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* List of test package cards */}
              {filteredPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className="p-5 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                >
                  <div>
                    {/* Top Meta Line: Badge + Difficulty Stars + Timer indicator */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span
                        className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${pkg.badgeColor.bg} ${pkg.badgeColor.text} ${pkg.badgeColor.border}`}
                      >
                        {pkg.badgeLabel}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs">
                        {pkg.hasTimer && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <Clock className="w-3 h-3" />
                            <span>10s/câu</span>
                          </span>
                        )}
                        <span className="text-amber-500 font-bold tracking-tighter">
                          {'★'.repeat(pkg.difficultyStars)}
                          {'☆'.repeat(5 - pkg.difficultyStars)}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{pkg.difficulty}</span>
                      </div>
                    </div>

                    {/* Title and Icon */}
                    <div className="flex items-start gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform shrink-0">
                        {pkg.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-snug group-hover:text-purple-700 transition-colors">
                          {pkg.title}
                        </h3>
                        <p className="text-xs font-semibold text-purple-700 mt-0.5">
                          {pkg.subtitle}
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
                        +{pkg.rewardStars} ⭐
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                        {pkg.questionCount} câu hỏi
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playTap();
                        startTestFromPackage(pkg);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Bắt đầu làm bài</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= STATE 2: ACTIVE TEST ================= */}
      {isTesting && currentQ && !isCompleted && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Header Navigation & Question Counter */}
          <div className="flex items-center justify-between gap-3 bg-white p-3 px-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-purple-600 text-white px-3 py-1 rounded-xl shadow-2xs">
                Câu {currentQuestionIdx + 1} / {questions.length}
              </span>

              <span className="text-xs font-bold text-slate-600">
                {currentQ.type === 'listen-pick' && '🎧 Nghe & Chọn Từ'}
                {currentQ.type === 'listen-to-image' && '🎧 Nghe & Chọn Tranh'}
                {currentQ.type === 'image-pick' && '🖼️ Nhìn Tranh & Chọn Từ'}
                {currentQ.type === 'vi-pick' && '📖 Nghĩa Tiếng Việt'}
                {currentQ.type === 'en-pick' && '🌐 Dịch Sang Tiếng Anh'}
                {currentQ.type === 'fill-blank' && '✍️ Điền Khuyết Chữ Cái'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed challenge timer */}
              {activePackage?.hasTimer && (
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black border ${
                    timeLeft <= 3
                      ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                      : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              )}

              <button
                onClick={() => {
                  if (window.confirm('Bé có chắc muốn dừng bài kiểm tra này không?')) {
                    clearCurrentTimer();
                    setIsTesting(false);
                  }
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Hủy bài thi
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-purple-100 text-center relative overflow-hidden">
            <h3 className="text-base sm:text-lg font-black font-heading text-slate-900 mb-4">
              {currentQ.prompt}
            </h3>

            {/* Visual Prompts Based on Question Type */}
            {(currentQ.type === 'listen-pick' || currentQ.type === 'listen-to-image') && (
              <div className="my-5">
                <button
                  onClick={() => {
                    sound.playTap();
                    sound.speak(currentQ.word.en);
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span>Bấm vào để nghe lại âm thanh</span>
                </button>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  (Lắng nghe phát âm chuẩn giọng bản xứ)
                </p>
              </div>
            )}

            {currentQ.type === 'image-pick' && (
              <div className="my-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-6xl sm:text-7xl shadow-inner">
                  {currentQ.word.emoji}
                </div>
              </div>
            )}

            {currentQ.type === 'vi-pick' && (
              <div className="my-4">
                <div className="inline-block px-6 py-3 rounded-2xl bg-purple-50 border-2 border-purple-200 text-2xl sm:text-3xl font-black text-purple-900 font-heading">
                  {currentQ.word.en}
                </div>
                <p className="text-xs text-slate-400 mt-1.5 font-mono font-medium">
                  [{currentQ.word.ipa}]
                </p>
              </div>
            )}

            {currentQ.type === 'en-pick' && (
              <div className="my-4">
                <span className="text-4xl block mb-2">{currentQ.word.emoji}</span>
                <div className="inline-block px-6 py-2.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-xl sm:text-2xl font-black text-indigo-900 font-heading">
                  &ldquo;{currentQ.word.vi}&rdquo;
                </div>
              </div>
            )}

            {currentQ.type === 'fill-blank' && (
              <div className="my-4">
                <span className="text-5xl block mb-2">{currentQ.word.emoji}</span>
                <div className="inline-block px-6 py-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-widest">
                  {currentQ.blankDisplay}
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-1.5">
                  ({currentQ.word.vi})
                </p>
              </div>
            )}

            {/* Answer Options Grid */}
            <div
              className={`gap-3 mt-6 ${
                currentQ.type === 'listen-to-image'
                  ? 'grid grid-cols-2 sm:grid-cols-4'
                  : 'grid grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentQ.correctAnswer;
                let btnStyle =
                  'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-slate-800';

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-2xl border-2 font-black transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                      currentQ.type === 'listen-to-image' ? 'text-4xl sm:text-5xl py-5' : 'text-sm sm:text-base'
                    } ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedAnswer !== null && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {selectedAnswer !== null && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {selectedAnswer !== null && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentQuestionIdx + 1 === questions.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STATE 3: REPORT CARD ================= */}
      {isCompleted && completedResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-purple-200 text-center animate-in zoom-in-95 duration-200 max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-100 border-2 border-purple-200 flex items-center justify-center text-5xl mb-3 shadow-inner">
            {completedResult.percentage >= 90 ? '🏆' : completedResult.percentage >= 70 ? '🌟' : '🌱'}
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Phiếu Đánh Giá Tiến Độ &bull; {childNickname}
          </span>

          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-2">
            {completedResult.percentage >= 90
              ? `Xuất Sắc! ${childNickname} Giỏi Quá! 🎉`
              : completedResult.percentage >= 70
              ? `Rất Tốt! ${childName} Tiếp Tục Phát Huy! ⭐`
              : `Cố Lên Nhé ${childName}! Cùng Ôn Lại Nào! 💪`}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {completedResult.topicName} &bull; Ngày {completedResult.date}
          </p>

          {/* Reward Badge Display */}
          {activePackage?.rewardTrophy && completedResult.percentage >= 70 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Đạt danh hiệu: {activePackage.rewardTrophy}</span>
            </div>
          )}

          {/* Score Metric Box */}
          <div className="my-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-around">
            <div>
              <span className="text-xs font-bold text-slate-500 block">Điểm số</span>
              <span className="text-2xl sm:text-3xl font-black text-purple-900 font-heading">
                {completedResult.score}/{completedResult.totalQuestions}
              </span>
            </div>
            <div className="w-px h-10 bg-purple-200" />
            <div>
              <span className="text-xs font-bold text-slate-500 block">Tỷ lệ đúng</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
                {completedResult.percentage}%
              </span>
            </div>
            <div className="w-px h-10 bg-purple-200" />
            <div>
              <span className="text-xs font-bold text-slate-500 block">Sao nhận được</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-500 font-heading flex items-center justify-center gap-1">
                +{Math.round((completedResult.score / completedResult.totalQuestions) * (activePackage?.rewardStars || 10))}⭐
              </span>
            </div>
          </div>

          {/* Words Needing Review */}
          {completedResult.wrongWordIds.length > 0 ? (
            <div className="text-left my-5 p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
              <h4 className="font-black text-sm text-rose-900 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-rose-600" />
                <span>Các từ {childName} cần chú ý ôn lại để nhớ lâu hơn:</span>
              </h4>
              <div className="space-y-2">
                {completedResult.wrongWordIds.map(wId => {
                  const word = VOCABULARY.find(w => w.id === wId);
                  if (!word) return null;
                  return (
                    <div
                      key={wId}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-100 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{word.emoji}</span>
                        <div>
                          <span className="font-black text-slate-900 text-sm">{word.en}</span>
                          <span className="text-slate-500 ml-1.5 font-mono">[{word.ipa}]</span>
                          <span className="text-slate-600 ml-1.5 font-semibold">- {word.vi}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          sound.playTap();
                          sound.speak(word.en);
                        }}
                        className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors cursor-pointer"
                        title="Nghe lại phát âm từ này"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="my-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Thật tuyệt vời! {childNickname} không làm sai bất kỳ câu nào trong bài kiểm tra này!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button
              onClick={() => {
                sound.playTap();
                if (activePackage) {
                  startTestFromPackage(activePackage);
                } else {
                  handleStartTopicTest(activeTopicForTest);
                }
              }}
              className="w-full sm:flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại bài này</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setIsTesting(false);
                setIsCompleted(false);
              }}
              className="w-full sm:flex-none py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm transition-colors cursor-pointer"
            >
              Chọn bài kiểm tra khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
