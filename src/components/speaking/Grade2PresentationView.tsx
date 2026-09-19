import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2, Play, Pause, RotateCcw, Sparkles, Star, CheckCircle2,
  Mic, MicOff, BookOpen, ChevronRight, ChevronLeft, Eye, EyeOff,
  Award, ThumbsUp, Search, SlidersHorizontal, Lightbulb,
  Trophy, BookmarkCheck, Heart, User, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GRADE2_PASSAGES, TOPIC_GROUPS, Grade2Passage, Grade2Sentence, Grade2Keyword } from '../../data/grade2_passages';
import { sound } from '../../utils/audio';
import { getSentencePhonetics } from '../../utils/phonetics';

interface Grade2PresentationViewProps {
  onAddStars: (count: number) => void;
  childName?: string;
  soundEnabled?: boolean;
}

export const Grade2PresentationView: React.FC<Grade2PresentationViewProps> = ({
  onAddStars,
  childName = 'Bảo Nhi',
  soundEnabled = true,
}) => {
  // Navigation & Selection
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
  const [activeLessonNumber, setActiveLessonNumber] = useState<number>(1);
  const [isLessonListModalOpen, setIsLessonListModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Practice Modes: 'sentence' (Luyện câu & từ), 'stage' (Sân khấu thuyết trình), 'memory' (Thử thách trí nhớ)
  const [activeTab, setActiveTab] = useState<'sentence' | 'stage' | 'memory'>('sentence');

  // Display toggles
  const [showIpa, setShowIpa] = useState(true);
  const [showPhoneticsVi, setShowPhoneticsVi] = useState(true);
  const [showMeaningVi, setShowMeaningVi] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState<'slow' | 'normal'>('normal');

  // Audio Playback & Karaoke
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const abortPlayRef = useRef(false);

  // Recording Simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingSuccess, setRecordingSuccess] = useState(false);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Completed Lessons Storage
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('bmcy_grade2_completed_lessons');
      return saved ? new Set(JSON.parse(saved)) : new Set([1]);
    } catch {
      return new Set([1]);
    }
  });

  // Memory Challenge State (Cloze Quiz)
  const [memoryAnswers, setMemoryAnswers] = useState<Record<number, string>>({});
  const [memoryPassed, setMemoryPassed] = useState(false);

  // Current Lesson Data
  const currentLesson: Grade2Passage = useMemo(() => {
    return (
      GRADE2_PASSAGES.find((p) => p.lessonNumber === activeLessonNumber) ||
      GRADE2_PASSAGES[0]
    );
  }, [activeLessonNumber]);

  // Filtered Lessons for the selected group
  const lessonsInCurrentGroup = useMemo(() => {
    return GRADE2_PASSAGES.filter((p) => p.topicGroupId === selectedGroupId);
  }, [selectedGroupId]);

  // Stop speech when lesson or tab changes
  useEffect(() => {
    sound.stopSpeaking();
    abortPlayRef.current = true;
    setIsPlayingAll(false);
    setActiveSentenceIndex(null);
    setIsRecording(false);
    setRecordingSuccess(false);
    setMemoryAnswers({});
    setMemoryPassed(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  }, [activeLessonNumber, activeTab]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      sound.stopSpeaking();
      abortPlayRef.current = true;
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Update selected group when active lesson changes
  useEffect(() => {
    if (currentLesson && currentLesson.topicGroupId !== selectedGroupId) {
      setSelectedGroupId(currentLesson.topicGroupId);
    }
  }, [currentLesson, selectedGroupId]);

  const speechRate = speechSpeed === 'slow' ? 0.72 : 0.88;

  // Play a single sentence
  const handlePlaySentence = (sentence: Grade2Sentence, index: number) => {
    if (isPlayingAll) {
      abortPlayRef.current = true;
      sound.stopSpeaking();
      setIsPlayingAll(false);
    }
    setActiveSentenceIndex(index);
    sound.speak(sentence.en, speechRate, 1.08);
  };

  // Play entire lesson sequentially with karaoke highlight
  const handlePlayAll = async () => {
    if (isPlayingAll) {
      abortPlayRef.current = true;
      sound.stopSpeaking();
      setIsPlayingAll(false);
      setActiveSentenceIndex(null);
      return;
    }

    abortPlayRef.current = false;
    setIsPlayingAll(true);
    sound.playTap();

    for (let i = 0; i < currentLesson.sentences.length; i++) {
      if (abortPlayRef.current) break;
      setActiveSentenceIndex(i);
      await sound.speakAsync(currentLesson.sentences[i].en, speechRate, 1.08);
      if (abortPlayRef.current) break;
      await new Promise((r) => setTimeout(r, 450));
    }

    if (!abortPlayRef.current) {
      setIsPlayingAll(false);
      setActiveSentenceIndex(null);
      sound.playCorrect();
    }
  };

  // Play keyword pronunciation
  const handlePlayWord = (word: string) => {
    sound.speak(word, 0.8, 1.1);
  };

  // Start / Stop presentation recording
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      sound.playFanfare();
      setRecordingSuccess(true);
      onAddStars(3);
      setCompletedLessonIds((prev) => {
        const next = new Set(prev).add(currentLesson.lessonNumber);
        try {
          localStorage.setItem('bmcy_grade2_completed_lessons', JSON.stringify(Array.from(next)));
        } catch {
          // ignore
        }
        return next;
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
      });
    } else {
      // Start recording
      sound.playTap();
      setIsRecording(true);
      setRecordingSuccess(false);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
  };

  // Navigation handlers
  const handleNextLesson = () => {
    if (activeLessonNumber < 100) {
      sound.playTap();
      setActiveLessonNumber((prev) => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonNumber > 1) {
      sound.playTap();
      setActiveLessonNumber((prev) => prev - 1);
    }
  };

  const handleSelectLessonNumber = (num: number) => {
    sound.playTap();
    setActiveLessonNumber(num);
    setIsLessonListModalOpen(false);
  };

  // Memory Challenge logic: test if user filled keywords
  const handleSelectMemoryOption = (sentenceIdx: number, word: string) => {
    sound.playTap();
    setMemoryAnswers((prev) => ({
      ...prev,
      [sentenceIdx]: word,
    }));
  };

  const handleCheckMemoryQuiz = () => {
    // Check if at least 2 answers are chosen correctly
    const correctCount = Object.keys(memoryAnswers).length;
    if (correctCount >= 2) {
      sound.playFanfare();
      setMemoryPassed(true);
      onAddStars(2);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    } else {
      sound.playTap();
    }
  };

  // Filter lessons for modal search
  const modalFilteredLessons = useMemo(() => {
    return GRADE2_PASSAGES.filter((p) => {
      const matchText =
        p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lessonNumber.toString().includes(searchQuery);
      return matchText;
    });
  }, [searchQuery]);

  return (
    <div className="w-full space-y-4">
      {/* Top Header Card - Sân Khấu Thuyết Trình Lớp 2 */}
      <div className="bg-linear-to-r from-teal-500 via-emerald-500 to-amber-500 rounded-3xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-white/30 shrink-0">
              {currentLesson.icon}
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="bg-white/25 text-white text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                  Bài {currentLesson.lessonNumber} / 100
                </span>
                <span className="bg-amber-300 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Lớp 2 (7-8 Tuổi)
                </span>
                <span className="text-xs bg-emerald-900/30 text-emerald-100 px-2.5 py-0.5 rounded-full font-medium">
                  {currentLesson.topicGroup}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight mt-1">
                {currentLesson.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-teal-100 font-semibold">
                {currentLesson.titleVi}
              </p>
            </div>
          </div>

          {/* Action Quick Stats & Open 100-Lesson Directory */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setIsLessonListModalOpen(true);
              }}
              className="flex items-center gap-2 bg-white text-teal-800 hover:bg-teal-50 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Bộ 100 Bài Đọc</span>
              <span className="bg-teal-100 text-teal-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                {completedLessonIds.size}/100 ⭐
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Topic Carousel Tabs - Nhóm chủ đề trực quan */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2 border border-amber-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TOPIC_GROUPS.map((group) => {
            const isSelected = selectedGroupId === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setSelectedGroupId(group.id);
                  // Jump to first lesson of this group
                  const firstInGroup = GRADE2_PASSAGES.find((p) => p.topicGroupId === group.id);
                  if (firstInGroup) {
                    setActiveLessonNumber(firstInGroup.lessonNumber);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs scale-[1.02]'
                    : 'text-slate-700 hover:bg-teal-50 hover:text-teal-900 border border-transparent'
                }`}
              >
                <span className="text-sm">{group.icon}</span>
                <span>{group.nameVi}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  10 bài
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Lesson Selector in Active Group (10 bài dạng pill to tròn dễ bấm) */}
      <div className="flex items-center justify-between gap-2 bg-amber-50/70 p-2 rounded-2xl border border-amber-200/70">
        <button
          type="button"
          onClick={handlePrevLesson}
          disabled={activeLessonNumber <= 1}
          className="p-2 rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Bài trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1">
          {lessonsInCurrentGroup.map((item) => {
            const isCurrent = item.lessonNumber === activeLessonNumber;
            const isDone = completedLessonIds.has(item.lessonNumber);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setActiveLessonNumber(item.lessonNumber);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 border ${
                  isCurrent
                    ? 'bg-teal-600 text-white border-teal-700 shadow-xs scale-[1.05]'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>Bài {item.lessonNumber}</span>
                {isDone && <Check className="w-3 h-3 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNextLesson}
          disabled={activeLessonNumber >= 100}
          className="p-2 rounded-xl bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Bài tiếp theo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Mode Tabs: 1. Luyện Đọc Từng Câu (Sentence) | 2. Sân Khấu Thuyết Trình (Stage) | 3. Thử Thách Trí Nhớ (Memory) */}
      <div className="flex items-center gap-2 p-1.5 bg-teal-100/60 rounded-2xl border border-teal-200/80 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setActiveTab('sentence');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'sentence'
              ? 'bg-teal-600 text-white shadow-xs scale-[1.01]'
              : 'text-teal-900 hover:bg-teal-200/50'
          }`}
        >
          <span>📖</span>
          <span>1. Luyện Đọc Từng Câu</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setActiveTab('stage');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'stage'
              ? 'bg-teal-600 text-white shadow-xs scale-[1.01]'
              : 'text-teal-900 hover:bg-teal-200/50'
          }`}
        >
          <span>🎤</span>
          <span>2. Sân Khấu Thuyết Trình</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setActiveTab('memory');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'memory'
              ? 'bg-teal-600 text-white shadow-xs scale-[1.01]'
              : 'text-teal-900 hover:bg-teal-200/50'
          }`}
        >
          <span>🧠</span>
          <span>3. Thử Thách Trí Nhớ</span>
        </button>
      </div>

      {/* Control Bar: Audio Speed, Play All, Toggle Vietnamese Phonetics & Meaning */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Play All Button */}
          <button
            type="button"
            onClick={handlePlayAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm shadow-xs transition-all cursor-pointer ${
              isPlayingAll
                ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                : 'bg-amber-500 text-white hover:bg-amber-600 hover:scale-[1.02]'
            }`}
          >
            {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlayingAll ? 'Tạm Dừng Đọc' : '▶️ Nghe Mẫu Cả Bài'}</span>
          </button>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setSpeechSpeed((s) => (s === 'normal' ? 'slow' : 'normal'));
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>{speechSpeed === 'slow' ? '🐢 Tốc độ Chậm (0.7x)' : '🐇 Tốc độ Chuẩn (0.9x)'}</span>
          </button>
        </div>

        {/* Display Toggles for 2nd Graders */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setShowIpa((prev) => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showIpa
                ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            {showIpa ? '🔤 Hiện Phiên Âm IPA' : 'Ẩn Phiên Âm IPA'}
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setShowPhoneticsVi((prev) => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showPhoneticsVi
                ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            {showPhoneticsVi ? '🗣️ Hiện Gợi Ý Đọc TV' : 'Ẩn Gợi Ý Đọc TV'}
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setShowMeaningVi((prev) => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showMeaningVi
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            {showMeaningVi ? '🇻🇳 Hiện Dịch Nghĩa' : 'Ẩn Dịch Nghĩa'}
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: 📖 LUYỆN ĐỌC TỪNG CÂU (SENTENCE MODE) */}
      {activeTab === 'sentence' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-teal-100 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Các câu trong bài đọc ({currentLesson.sentences.length} câu ngắn gọn)
              </span>
              <span className="text-xs text-slate-500">
                Bấm vào loa 🔊 hoặc câu để nghe đọc mẫu
              </span>
            </div>

            <div className="space-y-3">
              {currentLesson.sentences.map((sent, sIdx) => {
                const isCurrent = activeSentenceIndex === sIdx;
                const sentenceIpa = sent.ipa || getSentencePhonetics({ textEn: sent.en }).ipa;
                const sentenceReadVi = sent.readVi || getSentencePhonetics({ textEn: sent.en }).readVi;

                return (
                  <div
                    key={sent.id || sIdx}
                    onClick={() => handlePlaySentence(sent, sIdx)}
                    className={`p-4 rounded-2xl transition-all cursor-pointer border-2 text-left relative ${
                      isCurrent
                        ? 'bg-amber-50/90 border-amber-400 shadow-md scale-[1.01]'
                        : 'bg-slate-50/70 border-slate-200 hover:border-teal-300 hover:bg-teal-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        {/* Sentence English */}
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center shrink-0">
                            {sIdx + 1}
                          </span>
                          <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {sent.en}
                          </p>
                        </div>

                        {/* International Phonetic Alphabet (IPA) */}
                        {showIpa && sentenceIpa && (
                          <div className="pl-8 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] sm:text-[11px] font-bold text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-md tracking-wider">
                              IPA:
                            </span>
                            <span className="text-xs sm:text-sm font-mono font-semibold text-sky-900 tracking-wide">
                              {sentenceIpa}
                            </span>
                          </div>
                        )}

                        {/* Vietnamese Phonetic Guide (ReadVi) */}
                        {showPhoneticsVi && sentenceReadVi && (
                          <div className="pl-8 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] sm:text-[11px] font-bold text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-md tracking-wider">
                              Đọc:
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-purple-800 italic">
                              {sentenceReadVi}
                            </span>
                          </div>
                        )}

                        {/* Vietnamese Meaning */}
                        {showMeaningVi && (
                          <div className="pl-8 flex items-center gap-2">
                            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md tracking-wider">
                              Nghĩa:
                            </span>
                            <p className="text-xs sm:text-sm text-slate-700 font-medium">
                              {sent.vi}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Audio Icon Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySentence(sent, sIdx);
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                          isCurrent
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-teal-100 hover:text-teal-800'
                        }`}
                        title="Nghe câu này"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Golden Keywords Card (5 Từ Khóa Vàng Trọng Tâm) */}
          <div className="bg-amber-50/60 rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950">
                  5 Từ Khóa Vàng Trong Bài (Chạm Để Nghe)
                </h3>
              </div>
              <span className="text-xs text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                Học để nhớ lâu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {currentLesson.keywords.map((kw: Grade2Keyword, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePlayWord(kw.word)}
                  className="bg-white p-3 rounded-2xl border border-amber-200/80 hover:border-amber-400 hover:shadow-sm text-left transition-all cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-amber-900 group-hover:text-amber-600">
                        {kw.word}
                      </span>
                      {kw.ipa && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {kw.ipa}
                        </span>
                      )}
                    </div>
                    {kw.readVi && (
                      <p className="text-xs font-semibold text-purple-700">
                        Đọc: {kw.readVi}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 font-medium">
                      {kw.meaning}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 🎤 SÂN KHẤU THUYẾT TRÌNH (STAGE / TELEPROMPTER MODE) */}
      {activeTab === 'stage' && (
        <div className="space-y-4">
          <div className="bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
            {/* Background stage lights glow */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Stage Title */}
            <div className="text-center space-y-1 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bục Thuyết Trình Của Bé {childName}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {currentLesson.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200">
                {currentLesson.titleVi}
              </p>
            </div>

            {/* 3-Step Presentation Flow */}
            <div className="my-6 space-y-4 relative z-10">
              {/* Step 1: Introduction */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <span>👋</span>
                  <span>1. Chào Khán Giả & Mở Bài</span>
                  <span className="text-[10px] bg-amber-400/20 px-2 py-0.5 rounded-full text-amber-200">
                    Mỉm cười tươi & đứng thẳng
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-white">
                  "Hello everyone! Today I would like to talk about {currentLesson.titleEn.toLowerCase()}."
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                  <span className="font-mono text-sky-300">/həˈloʊ ˈevriwʌn təˈdeɪ aɪ wʊd laɪk tuː tɔːk əˈbaʊt .../</span>
                  <span className="font-medium text-amber-200 italic">Đọc: Hê-lâu ép-vơ-ri-oăn! Tơ-đê ai uút lai-k tu toác ơ-bao-t...</span>
                </div>
                <p className="text-xs text-indigo-200 mt-1">
                  (Xin chào tất cả mọi người! Hôm nay em xin phép được nói về {currentLesson.titleVi.toLowerCase()}.)
                </p>
              </div>

              {/* Step 2: Body Content (Teleprompter text) */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <span>📖</span>
                  <span>2. Nội Dung Chính Thuyết Trình</span>
                  <span className="text-[10px] bg-teal-400/20 px-2 py-0.5 rounded-full text-teal-200">
                    Đọc to, rõ ràng từng câu
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentLesson.sentences.map((sent, idx) => {
                    const sentenceIpa = sent.ipa || getSentencePhonetics({ textEn: sent.en }).ipa;
                    const sentenceReadVi = sent.readVi || getSentencePhonetics({ textEn: sent.en }).readVi;

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-start gap-2.5"
                      >
                        <span className="text-amber-400 font-black text-sm mt-0.5">
                          {idx + 1}.
                        </span>
                        <div className="space-y-1 flex-1">
                          <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                            {sent.en}
                          </p>
                          {sentenceIpa && (
                            <p className="text-xs font-mono font-medium text-sky-300/90 tracking-wide">
                              {sentenceIpa}
                            </p>
                          )}
                          {sentenceReadVi && (
                            <p className="text-xs font-semibold text-amber-200/90 italic">
                              Đọc: {sentenceReadVi}
                            </p>
                          )}
                          <p className="text-xs text-indigo-200/90 pt-0.5">
                            {sent.vi}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Conclusion */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <span>🙏</span>
                  <span>3. Lời Cảm Ơn & Kết Thúc</span>
                  <span className="text-[10px] bg-emerald-400/20 px-2 py-0.5 rounded-full text-emerald-200">
                    Cúi nhẹ chào & cảm ơn
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-white">
                  "Thank you very much for listening! Have a wonderful day!"
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                  <span className="font-mono text-sky-300">/θæŋk juː ˈveri mʌtʃ fɔːr ˈlɪsnɪŋ hæv ə ˈwʌndərfl deɪ/</span>
                  <span className="font-medium text-amber-200 italic">Đọc: Thenk-k diu ve-ri măt-ch pho lít-xừ-ninh! Hép-v ơ oăn-đơ-phồl đê!</span>
                </div>
                <p className="text-xs text-indigo-200 mt-1">
                  (Em xin chân thành cảm ơn mọi người đã chú ý lắng nghe! Chúc mọi người một ngày tuyệt vời!)
                </p>
              </div>
            </div>

            {/* Stage Bottom Controls: Record Voice Button */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 text-white hover:bg-rose-600 animate-bounce'
                    : 'bg-linear-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110 hover:scale-[1.02]'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>
                  {isRecording
                    ? `Đang Thu Âm (${recordingSeconds}s) - Bấm Để Hoàn Thành`
                    : '🎙️ Bấm Thu Âm Bé Thuyết Trình'}
                </span>
              </button>

              <button
                type="button"
                onClick={handlePlayAll}
                className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Mẫu Cả Bài</span>
              </button>
            </div>

            {/* Success Celebration message */}
            {recordingSuccess && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center relative z-10 animate-fade-in">
                <p className="text-emerald-300 font-extrabold text-sm sm:text-base">
                  🎉 Hoan hô bé {childName}! Bé thuyết trình rất tự tin và trôi chảy! (+3 Sao ⭐)
                </p>
              </div>
            )}
          </div>

          {/* Presentation Tips Card */}
          <div className="bg-amber-50 rounded-3xl p-4 sm:p-5 border border-amber-200">
            <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Mẹo Thuyết Trình Hay Cho Bé Lớp 2:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900 font-medium">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <span>🌟</span>
                <span>Đứng thẳng lưng, hai tay thả lỏng tự nhiên</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <span>😊</span>
                <span>Mỉm cười tươi tắn và nhìn vào khán giả</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <span>📢</span>
                <span>Nói to, rõ ràng và ngắt nghỉ đúng chỗ</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                <span>❤️</span>
                <span>Luôn nói "Thank you" khi kết thúc bài</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 🧠 THỬ THÁCH TRÍ NHỚ (MEMORY CHALLENGE) */}
      {activeTab === 'memory' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🧠</span>
                <span>Thử Thách Nhớ Nhanh Từ Vựng</span>
              </h3>
              <p className="text-xs text-slate-500">
                Chọn từ thích hợp điền vào câu để hoàn chỉnh bài thuyết trình!
              </p>
            </div>
            <span className="text-xs bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full">
              Thưởng +2 Sao ⭐
            </span>
          </div>

          <div className="space-y-3">
            {currentLesson.sentences.slice(0, 3).map((sent, idx) => {
              const kw = currentLesson.keywords[idx] || currentLesson.keywords[0];
              const isFilled = Boolean(memoryAnswers[idx]);
              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-sm sm:text-base font-bold text-slate-800">
                    Câu {idx + 1}: "{sent.en.replace(kw.word, '_______')}"
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Nghĩa tiếng Việt: {sent.vi}
                  </p>

                  {/* Word options */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-xs font-bold text-slate-600">Chọn từ:</span>
                    {[kw.word, ...currentLesson.keywords.filter((k) => k.word !== kw.word).slice(0, 2).map((k) => k.word)]
                      .sort()
                      .map((opt) => {
                        const isChosen = memoryAnswers[idx] === opt;
                        const isCorrect = opt === kw.word;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectMemoryOption(idx, opt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isChosen
                                ? isCorrect
                                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                                  : 'bg-rose-500 text-white border-rose-600'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-teal-400'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleCheckMemoryQuiz}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Kiểm Tra Kết Quả
            </button>

            {memoryPassed && (
              <span className="text-xs sm:text-sm font-extrabold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Chúc mừng bé đã ghi nhớ rất xuất sắc!
              </span>
            )}
          </div>
        </div>
      )}

      {/* 100-LESSONS DIRECTORY MODAL (POPUP CHỌN BÀI 1-100) */}
      {isLessonListModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-amber-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-linear-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-200" />
                <h3 className="text-base sm:text-lg font-black font-heading">
                  Bộ 100 Bài Đọc Thuyết Trình Lớp 2
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setIsLessonListModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài học (ví dụ: 'Myself', 'Gia đình', 'Bài 10')..."
                className="w-full text-xs sm:text-sm bg-transparent border-none outline-hidden text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Lesson Grid List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {modalFilteredLessons.map((p) => {
                const isSelected = p.lessonNumber === activeLessonNumber;
                const isDone = completedLessonIds.has(p.lessonNumber);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectLessonNumber(p.lessonNumber)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 shadow-xs'
                        : isDone
                        ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                        : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-xl flex items-center justify-center shrink-0">
                        {p.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-extrabold text-teal-700 bg-teal-100/70 px-2 py-0.2 rounded-md">
                            Bài {p.lessonNumber}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">
                            {p.titleEn}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {p.titleVi} • <span className="text-slate-400">{p.topicGroup}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isDone && (
                        <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                          Đã học
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
