import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, Play, Pause, RotateCcw, Sparkles, Star, CheckCircle2, 
  Mic, MicOff, BookOpen, MessageCircle, ChevronRight, Eye, EyeOff,
  UserCheck, Award, ThumbsUp, VolumeX, CheckSquare, Square, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Dialogue, CommunicationDomain, KeyPatternOption, GradeLevel, ChildProfile } from '../types';
import { COMMUNICATION_DOMAINS, DIALOGUES } from '../data/dialogues';
import { sound } from '../utils/audio';
import { getPhoneticsForLine, generateSentencePhonetics } from '../utils/phonetics';
import { ALL_SPEAKING_PASSAGES, SpeakingPassage } from '../data/passages';
import { PassageSlider } from './speaking/PassageSlider';
import { PassageReader } from './speaking/PassageReader';
import { Grade2PresentationView } from './speaking/Grade2PresentationView';

const GRADE_CONFIG: {
  id: GradeLevel;
  label: string;
  badge: string;
  activeBg: string;
  hoverBg: string;
  badgeBg: string;
  badgeText: string;
}[] = [
  {
    id: 'all',
    label: 'Tất Cả Lớp 1 - 5',
    badge: 'Toàn diện',
    activeBg: 'bg-amber-600 text-white shadow-xs',
    hoverBg: 'text-amber-900 hover:bg-amber-200/50',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  {
    id: 'grade-1',
    label: '🌱 Lớp 1 (Khởi Động)',
    badge: 'Lớp 1',
    activeBg: 'bg-emerald-600 text-white shadow-xs',
    hoverBg: 'text-emerald-900 hover:bg-emerald-100',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
  {
    id: 'grade-2',
    label: '🌿 Lớp 2 (Mở Rộng)',
    badge: 'Lớp 2',
    activeBg: 'bg-teal-600 text-white shadow-xs',
    hoverBg: 'text-teal-900 hover:bg-teal-100',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
  },
  {
    id: 'grade-3',
    label: '🚀 Lớp 3 (Tự Tin)',
    badge: 'Lớp 3',
    activeBg: 'bg-blue-600 text-white shadow-xs',
    hoverBg: 'text-blue-900 hover:bg-blue-100',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
  },
  {
    id: 'grade-4',
    label: '⚡ Lớp 4 (Chủ Động)',
    badge: 'Lớp 4',
    activeBg: 'bg-indigo-600 text-white shadow-xs',
    hoverBg: 'text-indigo-900 hover:bg-indigo-100',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
  },
  {
    id: 'grade-5',
    label: '👑 Lớp 5 (Thành Thạo)',
    badge: 'Lớp 5',
    activeBg: 'bg-purple-600 text-white shadow-xs',
    hoverBg: 'text-purple-900 hover:bg-purple-100',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
  },
];

const getGradeBadgeStyle = (gradeLevel: string) => {
  switch (gradeLevel) {
    case 'grade-1':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'grade-2':
      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'grade-3':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'grade-4':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'grade-5':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-amber-100 text-amber-800 border-amber-200';
  }
};

interface SpeakingViewProps {
  onAddStars: (count: number) => void;
  soundEnabled: boolean;
  childProfile?: ChildProfile;
  onNavigateToIPA?: () => void;
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({
  onAddStars,
  soundEnabled,
  childProfile,
  onNavigateToIPA,
}) => {
  const childName = childProfile?.name || 'Bảo Nhi';
  const childNickname = childProfile?.nickname || 'Bé Bảo Nhi';
  const childAvatar = childProfile?.avatar || '👧';

  // Section toggle: 'grade2-presentation' (100 Bài Thuyết Trình Lớp 2) vs 'passages' (500 Đoạn Văn Luyện Nói) vs 'dialogues' (Hội Thoại Giao Tiếp 2 Chiều)
  const [speakingSection, setSpeakingSection] = useState<'grade2-presentation' | 'passages' | 'dialogues'>('grade2-presentation');

  // Passages State
  const [selectedPassageLevel, setSelectedPassageLevel] = useState<number>(0);
  const [activePassage, setActivePassage] = useState<SpeakingPassage>(ALL_SPEAKING_PASSAGES[0]);
  const [completedPassageIds, setCompletedPassageIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('bmcy_completed_passages');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const handleSelectPassage = (p: SpeakingPassage) => {
    setActivePassage(p);
  };

  const handleNextPassage = () => {
    const currentIndex = ALL_SPEAKING_PASSAGES.findIndex((p) => p.id === activePassage.id);
    if (currentIndex < ALL_SPEAKING_PASSAGES.length - 1) {
      sound.playTap();
      setActivePassage(ALL_SPEAKING_PASSAGES[currentIndex + 1]);
    }
  };

  const handlePrevPassage = () => {
    const currentIndex = ALL_SPEAKING_PASSAGES.findIndex((p) => p.id === activePassage.id);
    if (currentIndex > 0) {
      sound.playTap();
      setActivePassage(ALL_SPEAKING_PASSAGES[currentIndex - 1]);
    }
  };

  const handlePassageAddStars = (count: number) => {
    onAddStars(count);
    setCompletedPassageIds((prev) => {
      const updated = new Set([...prev, activePassage.id]);
      try {
        localStorage.setItem('bmcy_completed_passages', JSON.stringify(Array.from(updated)));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Navigation & Filtering (5 individual grades)
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('all');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [activeDialogue, setActiveDialogue] = useState<Dialogue>(DIALOGUES[0]);

  // Dialogue Interaction States
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [showTranslations, setShowTranslations] = useState(true);
  const [showIPA, setShowIPA] = useState(true);
  const [showReadVi, setShowReadVi] = useState(true);

  // Main Section Tab: Interactive Dialogue Chat vs Speaking Guide
  const [mainTab, setMainTab] = useState<'chat' | 'guide'>('chat');
  const [guideCheckedLines, setGuideCheckedLines] = useState<Record<string, { endingSound: boolean; stress: boolean }>>({});
  const [guideRecordingLineIdx, setGuideRecordingLineIdx] = useState<number | null>(null);
  const [guideFeedback, setGuideFeedback] = useState<Record<number, string>>({});

  // Key Pattern Interactive Substitution
  const [selectedSubOption, setSelectedSubOption] = useState<KeyPatternOption | null>(null);

  // Role-play mode
  const [rolePlayMode, setRolePlayMode] = useState(false);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [rolePlayStep, setRolePlayStep] = useState<number>(0);
  const [rolePlayFinished, setRolePlayFinished] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFeedback, setRecordingFeedback] = useState<string | null>(null);

  const abortPlayRef = useRef(false);

  // Filter dialogues
  const filteredDialogues = DIALOGUES.filter(d => {
    const matchGrade = selectedGrade === 'all' || d.gradeLevel === selectedGrade;
    const matchDomain = selectedDomainId === 'all' || d.domainId === selectedDomainId;
    return matchGrade && matchDomain;
  });

  const handleSelectGrade = (grade: GradeLevel) => {
    sound.playTap();
    setSelectedGrade(grade);
    if (grade !== 'all') {
      const match = DIALOGUES.find(d => d.gradeLevel === grade && (selectedDomainId === 'all' || d.domainId === selectedDomainId))
        || DIALOGUES.find(d => d.gradeLevel === grade);
      if (match) {
        setActiveDialogue(match);
      }
    }
  };

  // Reset dialogue states when active dialogue changes
  useEffect(() => {
    sound.stopSpeaking();
    setIsPlayingAll(false);
    setActiveLineIdx(null);
    setRolePlayMode(false);
    setMyRole(null);
    setRolePlayStep(0);
    setRolePlayFinished(false);
    setRecordingFeedback(null);
    setIsRecording(false);
    abortPlayRef.current = true;

    // Reset default substitution option
    if (activeDialogue.keyPattern.substitutions?.options.length) {
      setSelectedSubOption(activeDialogue.keyPattern.substitutions.options[0]);
    } else {
      setSelectedSubOption(null);
    }
  }, [activeDialogue]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      sound.stopSpeaking();
      abortPlayRef.current = true;
    };
  }, []);

  // Play a single line
  const handlePlayLine = useCallback((lineIdx: number, slow: boolean = false) => {
    const line = activeDialogue.lines[lineIdx];
    if (!line) return;
    setActiveLineIdx(lineIdx);
    if (slow) {
      sound.speakSlow(line.en);
    } else {
      sound.speak(line.en, line.rate || 0.85, line.pitch || 1.15);
    }
  }, [activeDialogue]);

  // Play entire conversation sequentially
  const handleTogglePlayAll = async () => {
    if (isPlayingAll) {
      sound.stopSpeaking();
      abortPlayRef.current = true;
      setIsPlayingAll(false);
      setActiveLineIdx(null);
      return;
    }

    sound.stopSpeaking();
    abortPlayRef.current = false;
    setIsPlayingAll(true);

    for (let i = 0; i < activeDialogue.lines.length; i++) {
      if (abortPlayRef.current) break;
      const line = activeDialogue.lines[i];
      setActiveLineIdx(i);
      await sound.speakAsync(line.en, line.rate || 0.85, line.pitch || 1.15);
      // Short friendly pause between lines
      await new Promise(r => setTimeout(r, 650));
    }

    if (!abortPlayRef.current) {
      setIsPlayingAll(false);
      setActiveLineIdx(null);
    }
  };

  // Start Role-play
  const handleStartRolePlay = (characterName: string) => {
    sound.stopSpeaking();
    abortPlayRef.current = true;
    setIsPlayingAll(false);
    setRolePlayMode(true);
    setMyRole(characterName);
    setRolePlayStep(0);
    setRolePlayFinished(false);
    setRecordingFeedback(null);

    // If first line is NOT the kid's role, auto speak the partner's line
    const firstLine = activeDialogue.lines[0];
    if (firstLine.speaker !== characterName) {
      setTimeout(() => {
        sound.speak(firstLine.en, firstLine.rate || 0.85, firstLine.pitch || 1.15);
      }, 400);
    }
  };

  // Advance role play turn
  const handleAdvanceRolePlay = (nextStep: number) => {
    if (nextStep >= activeDialogue.lines.length) {
      // Completed conversation!
      setRolePlayFinished(true);
      sound.playFanfare();
      onAddStars(3);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      return;
    }

    setRolePlayStep(nextStep);
    setRecordingFeedback(null);
    const nextLine = activeDialogue.lines[nextStep];

    // If next line belongs to the bot/partner, speak it automatically!
    if (nextLine.speaker !== myRole) {
      setTimeout(() => {
        sound.speak(nextLine.en, nextLine.rate || 0.85, nextLine.pitch || 1.15);
      }, 500);
    }
  };

  // Simulate speaking microphone practice
  const handleToggleMic = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setRecordingFeedback('Đang lắng nghe bé nói...');
    sound.playTap();

    setTimeout(() => {
      setIsRecording(false);
      sound.playCorrect();
      setRecordingFeedback('Tuyệt vời! Bé phát âm rất to và rõ ràng! 🌟');
    }, 2200);
  };

  // Practice individual line in Speaking Guide
  const handleGuidePracticeMic = (lineIdx: number) => {
    if (guideRecordingLineIdx === lineIdx) {
      setGuideRecordingLineIdx(null);
      return;
    }

    setGuideRecordingLineIdx(lineIdx);
    sound.playTap();
    setGuideFeedback(prev => ({ ...prev, [lineIdx]: 'Đang lắng nghe bé đọc câu này...' }));

    setTimeout(() => {
      setGuideRecordingLineIdx(null);
      sound.playCorrect();
      setGuideFeedback(prev => ({ 
        ...prev, 
        [lineIdx]: 'Hoan hô bé phát âm rất chuẩn! Âm đuôi và ngữ điệu rất tự nhiên! 🌟 (+1 Sao)' 
      }));
      onAddStars(1);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.65 },
      });
    }, 2000);
  };

  // Toggle self-check checklist in Speaking Guide
  const handleToggleGuideCheck = (lineKey: string, type: 'endingSound' | 'stress') => {
    sound.playTap();
    setGuideCheckedLines(prev => {
      const current = prev[lineKey] || { endingSound: false, stress: false };
      const updated = {
        ...current,
        [type]: !current[type],
      };
      return { ...prev, [lineKey]: updated };
    });
  };

  // Active Key Pattern sentence with substitution
  const currentSampleSentence = selectedSubOption && activeDialogue.keyPattern.substitutions
    ? activeDialogue.keyPattern.sample.replace(
        activeDialogue.keyPattern.substitutions.original, 
        selectedSubOption.en
      )
    : activeDialogue.keyPattern.sample;

  const currentPatternPhonetics = generateSentencePhonetics(currentSampleSentence);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-5 space-y-4">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-4 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-white/30 shrink-0">
            {childAvatar}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                Phòng Luyện Nói Của {childNickname}
              </h1>
              <span className="bg-white/25 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                BMyC Speaking
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1 max-w-xl">
              Hội thoại giao tiếp sinh động giúp {childName} tự tin phản xạ, phát âm chuẩn ngữ điệu bản ngữ!
            </p>
          </div>
        </div>

        {/* Quick Mode Stats */}
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/25">
          <span className="text-2xl">🌟</span>
          <div className="text-left">
            <span className="text-[11px] block font-bold text-amber-100 uppercase tracking-wide">Nhập vai tự tin</span>
            <span className="text-sm font-extrabold text-white">Thưởng +3 Sao mỗi bài</span>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher: 100 Bài Thuyết Trình Lớp 2 vs 500 Đoạn Văn Luyện Nói vs Hội Thoại Giao Tiếp 2 Chiều */}
      <div className="flex items-center gap-1.5 p-1.5 bg-amber-100/70 rounded-2xl border border-amber-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setSpeakingSection('grade2-presentation');
          }}
          className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            speakingSection === 'grade2-presentation'
              ? 'bg-linear-to-r from-teal-600 to-emerald-600 text-white shadow-sm scale-[1.01]'
              : 'text-teal-950 hover:bg-teal-100/60'
          }`}
        >
          <span className="text-base">🌟</span>
          <span>100 Bài Thuyết Trình Lớp 2</span>
          <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] bg-amber-300 text-amber-950 font-black shadow-2xs">
            Trực Quan Cho Bé
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setSpeakingSection('passages');
          }}
          className={`py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            speakingSection === 'passages'
              ? 'bg-amber-500 text-white shadow-sm scale-[1.01]'
              : 'text-amber-900 hover:bg-amber-200/50'
          }`}
        >
          <span className="text-base">📖</span>
          <span>500 Đoạn Văn Luyện Nói</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            setSpeakingSection('dialogues');
          }}
          className={`py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            speakingSection === 'dialogues'
              ? 'bg-amber-500 text-white shadow-sm scale-[1.01]'
              : 'text-amber-900 hover:bg-amber-200/50'
          }`}
        >
          <span className="text-base">💬</span>
          <span>Hội Thoại Giao Tiếp</span>
        </button>

        {onNavigateToIPA && (
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onNavigateToIPA();
            }}
            className="py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 shadow-2xs"
            title="Mở Bảng Phiên Âm 44 Âm IPA Quốc Tế"
          >
            <span className="text-base">🔤</span>
            <span>44 Âm IPA Chuẩn</span>
            <span className="text-[10px] bg-teal-200 text-teal-950 font-bold px-1.5 py-0.2 rounded-md">Mới</span>
          </button>
        )}
      </div>

      {speakingSection === 'grade2-presentation' ? (
        <Grade2PresentationView
          onAddStars={onAddStars}
          childName={childName}
          soundEnabled={soundEnabled}
        />
      ) : speakingSection === 'passages' ? (
        <div className="space-y-4">
          {/* Horizontal Draggable / Scrollable Slider for 500 Passages */}
          <PassageSlider
            passages={ALL_SPEAKING_PASSAGES}
            activePassage={activePassage}
            onSelectPassage={handleSelectPassage}
            selectedLevel={selectedPassageLevel}
            onSelectLevel={setSelectedPassageLevel}
            completedPassageIds={completedPassageIds}
            childName={childName}
          />

          {/* Interactive Passage Reader Arena with Karaoke, Audio Speed, Shadowing & Reflex Quiz */}
          <PassageReader
            passage={activePassage}
            onAddStars={handlePassageAddStars}
            childName={childName}
            onNextPassage={handleNextPassage}
            onPrevPassage={handlePrevPassage}
            isFirstPassage={activePassage.id === ALL_SPEAKING_PASSAGES[0]?.id}
            isLastPassage={activePassage.id === ALL_SPEAKING_PASSAGES[ALL_SPEAKING_PASSAGES.length - 1]?.id}
          />
        </div>
      ) : (
        <div className="space-y-4">
      {/* Grade Level Selector - All 5 Grades Separated */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 bg-amber-100/60 p-1.5 rounded-2xl border border-amber-200 shrink-0">
          {GRADE_CONFIG.map(gradeItem => {
            const isSelected = selectedGrade === gradeItem.id;
            return (
              <button
                key={gradeItem.id}
                onClick={() => handleSelectGrade(gradeItem.id)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? gradeItem.activeBg
                    : gradeItem.hoverBg
                }`}
              >
                <span>{gradeItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Translation Toggle */}
        <button
          onClick={() => {
            sound.playTap();
            setShowTranslations(prev => !prev);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs whitespace-nowrap cursor-pointer shrink-0"
        >
          {showTranslations ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>{showTranslations ? 'Hiện nghĩa TV' : 'Ẩn nghĩa TV'}</span>
        </button>
      </div>

      {/* Domains Selector Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            sound.playTap();
            setSelectedDomainId('all');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shrink-0 ${
            selectedDomainId === 'all'
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
          }`}
        >
          <span>🌈</span>
          <span>Tất cả lĩnh vực</span>
        </button>

        {COMMUNICATION_DOMAINS.map(domain => {
          const isSelected = selectedDomainId === domain.id;
          return (
            <button
              key={domain.id}
              onClick={() => {
                sound.playTap();
                setSelectedDomainId(domain.id);
                // Switch to first dialogue of that domain prioritizing current grade
                const match = DIALOGUES.find(d => d.domainId === domain.id && (selectedGrade === 'all' || d.gradeLevel === selectedGrade))
                  || DIALOGUES.find(d => d.domainId === domain.id);
                if (match) setActiveDialogue(match);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
              }`}
            >
              <span>{domain.icon}</span>
              <span>{domain.nameVi}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left is Dialogue Selector Gallery, Right is Active Dialogue Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Topic / Dialogue List */}
        <div className="lg:col-span-4 space-y-2 max-h-[580px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Danh sách hội thoại ({filteredDialogues.length})
            </span>
          </div>

          <div className="space-y-2">
            {filteredDialogues.length === 0 ? (
              <div className="p-5 text-center bg-white rounded-2xl border border-dashed border-amber-300 text-slate-500 space-y-2">
                <span className="text-3xl block">🔍</span>
                <p className="text-xs font-bold text-slate-700">Chưa có bài hội thoại cho bộ lọc này</p>
                <p className="text-[11px] text-slate-500">Hãy chọn lĩnh vực khác hoặc xem toàn bộ hội thoại của khối lớp này nhé!</p>
                <button
                  onClick={() => {
                    sound.playTap();
                    setSelectedDomainId('all');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-2xs cursor-pointer"
                >
                  Xem tất cả lĩnh vực
                </button>
              </div>
            ) : (
              filteredDialogues.map(d => {
                const isCurrent = d.id === activeDialogue.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      sound.playTap();
                      setActiveDialogue(d);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
                      {d.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getGradeBadgeStyle(d.gradeLevel)}`}>
                          {d.gradeLabel}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate">
                        {d.titleVi}
                      </h3>
                      <p className="text-[11px] text-slate-500 italic truncate">
                        {d.titleEn}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 self-center ${isCurrent ? 'text-amber-600' : 'text-slate-300'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Dialogue Playground */}
        <div className="lg:col-span-8 space-y-4">
          {/* Dialogue Header Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs relative overflow-hidden">
            {/* Subtle decorative accent */}
            <div className="absolute top-0 right-0 w-80 h-32 bg-linear-to-bl from-amber-100/40 via-orange-50/20 to-transparent -z-0 pointer-events-none rounded-bl-full" />

            {/* Top Row: Title + Lesson Info + Audio Player Button */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-slate-100">
              {/* Left: Avatar Squircle + Metadata & Title */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-amber-100 to-orange-100 border-2 border-amber-200/80 flex items-center justify-center text-3xl shrink-0 shadow-2xs select-none">
                  {activeDialogue.emoji}
                </div>

                <div className="min-w-0">
                  {/* Badges: Grade + Domain + Line Count */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getGradeBadgeStyle(activeDialogue.gradeLevel)}`}>
                      {activeDialogue.gradeLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60 flex items-center gap-1">
                      <span>{COMMUNICATION_DOMAINS.find(dm => dm.id === activeDialogue.domainId)?.icon}</span>
                      <span>{COMMUNICATION_DOMAINS.find(dm => dm.id === activeDialogue.domainId)?.nameVi}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      &bull; {activeDialogue.lines.length} câu thoại
                    </span>
                  </div>

                  {/* Title in Vietnamese */}
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading tracking-tight leading-snug">
                    {activeDialogue.titleVi}
                  </h2>

                  {/* English Translation */}
                  <p className="text-xs sm:text-sm font-semibold text-amber-800/90 mt-0.5">
                    &ldquo;{activeDialogue.titleEn}&rdquo;
                  </p>
                </div>
              </div>

              {/* Right: Primary Audio Playback Button */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={handleTogglePlayAll}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap ${
                    isPlayingAll
                      ? 'bg-rose-500 text-white hover:bg-rose-600 ring-4 ring-rose-100'
                      : 'bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-200'
                  }`}
                >
                  {isPlayingAll ? (
                    <>
                      <Pause className="w-4 h-4 fill-white animate-pulse" />
                      <span>Tạm Dừng Phát</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Nghe Toàn Bài</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Middle Action Bar: Integrated Mode Navigation & Role Play Button */}
            <div className="relative z-10 pt-3 flex flex-wrap items-center justify-between gap-2.5">
              {/* Mode Switcher Segmented Control */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
                <button
                  onClick={() => {
                    sound.playTap();
                    setMainTab('chat');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    mainTab === 'chat'
                      ? 'bg-white text-blue-900 shadow-2xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Đoạn Hội Thoại</span>
                </button>

                <button
                  onClick={() => {
                    sound.playTap();
                    setMainTab('guide');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    mainTab === 'guide'
                      ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-2xs'
                      : 'text-purple-800 hover:bg-purple-100/50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Speaking Guide (IPA)</span>
                </button>
              </div>

              {/* Role-Play Mode Button */}
              <button
                onClick={() => {
                  sound.playTap();
                  if (rolePlayMode) {
                    setRolePlayMode(false);
                    setMyRole(null);
                  } else {
                    setMainTab('chat');
                    handleStartRolePlay(activeDialogue.characters[0].name);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border active:scale-95 ${
                  rolePlayMode
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{rolePlayMode ? 'Đang Đóng Vai (Bấm để thoát)' : '🎭 Đóng Vai Hội Thoại'}</span>
              </button>
            </div>

            {/* Scenario Description */}
            <div className="mt-3 p-3 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-start gap-2.5">
              <span className="text-base">💡</span>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                <strong className="font-bold">Tình huống: </strong>{activeDialogue.scenario}
              </p>
            </div>

            {/* Core Sentence Pattern Box with Interactive Substitutions */}
            <div className="mt-3 p-3.5 bg-linear-to-r from-indigo-50/80 via-blue-50/80 to-purple-50/80 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    Mẫu Câu Cốt Lõi (Key Pattern)
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.speak(currentSampleSentence, 0.85, 1.15);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white/70 px-2.5 py-1 rounded-lg border border-blue-200 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Nghe mẫu</span>
                </button>
              </div>

              <div className="bg-white rounded-xl p-2.5 border border-blue-100">
                <p className="text-xs sm:text-sm font-extrabold text-blue-950 font-heading">
                  {activeDialogue.keyPattern.structure}
                </p>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Ý nghĩa: {activeDialogue.keyPattern.vi}
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1.5 flex-wrap text-xs font-semibold text-indigo-700">
                  <span>Ví dụ:</span>
                  <span className="font-bold text-indigo-950 underline decoration-indigo-300">
                    &ldquo;{currentSampleSentence}&rdquo;
                  </span>
                </div>

                {/* Pronunciation & Vietnamese reading hint for pattern */}
                {(showReadVi || showIPA) && (
                  <div className="mt-2 pt-1.5 border-t border-blue-100/70 space-y-1">
                    {showReadVi && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold bg-amber-50/90 px-2 py-1 rounded-lg border border-amber-200">
                        <span className="shrink-0">🗣️ Gợi ý đọc:</span>
                        <span className="text-amber-950 font-black">&ldquo;{currentPatternPhonetics.readVi}&rdquo;</span>
                      </div>
                    )}
                    {showIPA && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-700 bg-purple-50/70 px-2 py-0.5 rounded-md">
                        <span className="font-sans font-bold text-purple-900 text-[10px] uppercase">IPA:</span>
                        <span>{currentPatternPhonetics.ipa}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Substitution Chips */}
              {activeDialogue.keyPattern.substitutions && (
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-blue-900 mr-1">
                    Bé thử thay từ:
                  </span>
                  {activeDialogue.keyPattern.substitutions.options.map(opt => {
                    const isSelected = selectedSubOption?.en === opt.en;
                    return (
                      <button
                        key={opt.en}
                        onClick={() => {
                          sound.playTap();
                          setSelectedSubOption(opt);
                          // Auto speak new sentence
                          const newSentence = activeDialogue.keyPattern.sample.replace(
                            activeDialogue.keyPattern.substitutions!.original, 
                            opt.en
                          );
                          sound.speak(newSentence, 0.85, 1.15);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <span>{opt.emoji}</span>
                        <span>{opt.en}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* CHAT TAB CONTENT */}
          {mainTab === 'chat' && (
            <>
              {/* Role Play Mode Banner */}
          {rolePlayMode && (
            <div className="bg-emerald-500 rounded-3xl p-4 text-white shadow-md space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-xl">🎭</span>
                    <h3 className="font-black text-base font-heading">
                      Chế Độ Đóng Vai: {childNickname} đóng vai &ldquo;{myRole}&rdquo;
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-100 font-medium">
                    Hãy lắng nghe đối tác và đến lượt mình hãy tự tin nói thật to nhé!
                  </p>
                </div>

                {/* Switch Character Selector */}
                <div className="flex items-center gap-1 bg-white/20 p-1 rounded-xl border border-white/30">
                  {activeDialogue.characters.map(char => {
                    const isMyChar = myRole === char.name;
                    return (
                      <button
                        key={char.name}
                        onClick={() => handleStartRolePlay(char.name)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isMyChar ? 'bg-white text-emerald-900 shadow-2xs' : 'text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{char.avatar}</span>
                        <span>{char.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-1.5 w-full bg-emerald-700/40 p-1.5 rounded-full">
                {activeDialogue.lines.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      idx < rolePlayStep
                        ? 'bg-amber-300'
                        : idx === rolePlayStep
                        ? 'bg-white ring-2 ring-amber-300'
                        : 'bg-emerald-800/60'
                    }`}
                  />
                ))}
              </div>

              {/* Role Play Completion Celebration */}
              {rolePlayFinished && (
                <div className="bg-white rounded-2xl p-4 text-slate-800 text-center space-y-2 border border-emerald-200 shadow-lg animate-in zoom-in-95">
                  <div className="text-3xl">🎉 ⭐ 🏆</div>
                  <h4 className="font-black text-lg text-emerald-800 font-heading">
                    Hoan Hô Bé Đã Hoàn Thành Xuất Sắc!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Bé đã tự tin đóng vai và luyện nói trôi chảy toàn bộ đoạn hội thoại!
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>Thưởng +3 Sao vào Bảng Vàng!</span>
                  </div>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleStartRolePlay(myRole || activeDialogue.characters[0].name)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Luyện Lại Lần Nữa</span>
                    </button>
                    <button
                      onClick={() => {
                        const nextIdx = (DIALOGUES.findIndex(d => d.id === activeDialogue.id) + 1) % DIALOGUES.length;
                        setActiveDialogue(DIALOGUES[nextIdx]);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                    >
                      <span>Bài Tiếp Theo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dialogue Lines Chat Box */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="font-black text-slate-800 text-xs sm:text-sm">
                  Đoạn hội thoại ({activeDialogue.lines.length} câu)
                </span>
                <span className="block sm:inline sm:ml-2 text-[11px] text-slate-500 italic">
                  Nhấn loa để nghe từng câu
                </span>
              </div>

              {/* Display Toggle Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => {
                    sound.playTap();
                    setShowReadVi(!showReadVi);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showReadVi
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Bật/Tắt gợi ý cách đọc tiếng Việt"
                >
                  <span>🗣️</span>
                  <span>Cách đọc TV</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${showReadVi ? 'bg-amber-600' : 'bg-slate-400'}`} />
                </button>

                <button
                  onClick={() => {
                    sound.playTap();
                    setShowIPA(!showIPA);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showIPA
                      ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Bật/Tắt phiên âm quốc tế IPA"
                >
                  <span>🔤</span>
                  <span>IPA</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${showIPA ? 'bg-purple-600' : 'bg-slate-400'}`} />
                </button>

                <button
                  onClick={() => {
                    sound.playTap();
                    setShowTranslations(!showTranslations);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showTranslations
                      ? 'bg-blue-100 text-blue-900 border-blue-300 shadow-2xs'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Bật/Tắt dịch nghĩa tiếng Việt"
                >
                  <span>🌐</span>
                  <span>Dịch nghĩa</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${showTranslations ? 'bg-blue-600' : 'bg-slate-400'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {activeDialogue.lines.map((line, idx) => {
                const isSpeakerA = line.speaker === activeDialogue.characters[0].name;
                const isCurrentActive = activeLineIdx === idx;
                const isMyTurnInRolePlay = rolePlayMode && line.speaker === myRole && rolePlayStep === idx;
                const isPartnerTurnInRolePlay = rolePlayMode && line.speaker !== myRole && rolePlayStep === idx;
                const phonetics = getPhoneticsForLine(line);

                return (
                  <div
                    key={idx}
                    className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 ${
                      isCurrentActive || isMyTurnInRolePlay || isPartnerTurnInRolePlay
                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                        : isSpeakerA
                        ? 'bg-slate-50/60 border-slate-200'
                        : 'bg-orange-50/40 border-orange-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Character Avatar and Speaker */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-xl">
                          {line.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-800 font-heading">
                              {line.speaker}
                            </span>
                            {rolePlayMode && line.speaker === myRole && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Bé đóng vai
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Line Audio Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePlayLine(idx, false)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-amber-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          title="Nghe phát âm chuẩn"
                          aria-label="Nghe câu này"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePlayLine(idx, true)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-600 flex items-center justify-center transition-colors shadow-2xs text-xs cursor-pointer"
                          title="Phát âm chậm (Rùa con 🐢)"
                          aria-label="Phát âm chậm"
                        >
                          🐢
                        </button>
                      </div>
                    </div>

                    {/* English Dialogue Text */}
                    <div className="mt-2 text-slate-900 font-extrabold text-sm sm:text-base leading-relaxed pl-1 font-heading">
                      {line.en}
                    </div>

                    {/* International Phonetic Alphabet (IPA) */}
                    {showIPA && (
                      <div className="mt-1 flex items-center gap-1.5 pl-1 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 font-mono tracking-wider">
                          IPA
                        </span>
                        <span className="font-mono text-xs sm:text-sm text-purple-900 font-semibold tracking-wide">
                          {phonetics.ipa}
                        </span>
                      </div>
                    )}

                    {/* Vietnamese Reading Hint (Cách đọc tiếng Việt dễ hiểu cho học sinh) */}
                    {showReadVi && (
                      <div className="mt-1.5 bg-amber-100/70 border border-amber-300/80 rounded-xl px-2.5 py-1.5 flex items-start gap-2">
                        <span className="text-xs shrink-0 mt-0.5">🗣️</span>
                        <div className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
                          <span className="text-[11px] font-black text-amber-800 mr-1.5 uppercase tracking-wider">
                            Gợi ý đọc:
                          </span>
                          <span className="text-amber-950 font-extrabold">&ldquo;{phonetics.readVi}&rdquo;</span>
                        </div>
                      </div>
                    )}

                    {/* Vietnamese Translation */}
                    {showTranslations && (
                      <div className="mt-1 text-slate-600 text-xs sm:text-sm italic pl-1 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 not-italic uppercase">Nghĩa:</span>
                        <span>{line.vi}</span>
                      </div>
                    )}

                    {/* Interactive Role Play Turn Actions */}
                    {isMyTurnInRolePlay && !rolePlayFinished && (
                      <div className="mt-3 p-3 bg-white rounded-xl border-2 border-emerald-400 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
                            <span className="text-base">📢</span>
                            <span>ĐẾN LƯỢT BÉ NÓI!</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-semibold">
                            Hãy đọc to câu tiếng Anh trên
                          </span>
                        </div>

                        {/* Pronunciation prompt during turn */}
                        <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 space-y-1">
                          <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">
                            🗣️ Gợi ý đọc cho bé:
                          </div>
                          <p className="text-sm font-extrabold text-emerald-950">
                            &ldquo;{phonetics.readVi}&rdquo;
                          </p>
                          {showIPA && (
                            <p className="text-xs font-mono text-purple-700 font-semibold">
                              IPA: {phonetics.ipa}
                            </p>
                          )}
                        </div>

                        {recordingFeedback && (
                          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 animate-in fade-in">
                            {recordingFeedback}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={handleToggleMic}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              isRecording
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
                            }`}
                          >
                            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                            <span>{isRecording ? 'Dừng thu âm' : 'Bé Thử Giọng'}</span>
                          </button>

                          <button
                            onClick={() => handleAdvanceRolePlay(idx + 1)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Em Đã Đọc Xong! (Tiếp tục)</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Partner's Turn Button in Role Play */}
                    {isPartnerTurnInRolePlay && !rolePlayFinished && (
                      <div className="mt-2.5 flex justify-end">
                        <button
                          onClick={() => handleAdvanceRolePlay(idx + 1)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 cursor-pointer shadow-2xs"
                        >
                          <span>Đến lượt tôi</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* SPEAKING GUIDE TAB CONTENT */}
      {mainTab === 'guide' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Speaking Guide Overview Banner */}
          <div className="bg-linear-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-4 sm:p-5 text-white shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl border border-white/30 shrink-0">
                  📖
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-base sm:text-lg font-heading">
                      Speaking Guide &bull; Cẩm Nang Phát Âm & Tự Sửa Lỗi
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-300 text-amber-950">
                      {activeDialogue.gradeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-purple-100 mt-0.5">
                    Tra cứu phiên âm quốc tế IPA và gợi ý phát âm thuần Việt cho từng câu hội thoại
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playTap();
                  setMainTab('chat');
                  handleStartRolePlay(activeDialogue.characters[0].name);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-amber-400 text-amber-950 hover:bg-amber-300 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <span>Áp dụng vào Đóng Vai</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Golden Self-Correction Rules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/20">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/20">
                <div className="text-[11px] font-black text-amber-300 flex items-center gap-1 mb-1">
                  <span>1.</span>
                  <span>BẬT RÕ ÂM ĐUÔI (ENDING)</span>
                </div>
                <p className="text-[11px] text-purple-100 leading-snug">
                  Chú ý các âm gió cuối như <strong className="text-white font-mono">/s/, /t/, /d/, /k/, /z/</strong> để không bị nuốt âm.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/20">
                <div className="text-[11px] font-black text-amber-300 flex items-center gap-1 mb-1">
                  <span>2.</span>
                  <span>NHẤN TRỌNG ÂM (STRESS)</span>
                </div>
                <p className="text-[11px] text-purple-100 leading-snug">
                  Đọc cao và ngân dài hơn ở âm tiết có dấu nháy <strong className="text-white font-mono">/ˈ.../</strong> trong phiên âm IPA.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/20">
                <div className="text-[11px] font-black text-amber-300 flex items-center gap-1 mb-1">
                  <span>3.</span>
                  <span>ĐỐI CHIẾU TIẾNG VIỆT & NGHE CHẬM</span>
                </div>
                <p className="text-[11px] text-purple-100 leading-snug">
                  Đọc gợi ý tiếng Việt để bắt nhịp, sau đó ấn nút <strong className="text-white">🐢 Nghe chậm 0.6x</strong> để tự sửa lỗi.
                </p>
              </div>
            </div>
          </div>

          {/* Phrase-by-Phrase Speaking Guide Cards */}
          <div className="space-y-3">
            {activeDialogue.lines.map((line, idx) => {
              const char = activeDialogue.characters.find(c => c.name === line.speaker);
              const phonetics = getPhoneticsForLine(line);
              const lineKey = `${activeDialogue.id}_line_${idx}`;
              const selfCheck = guideCheckedLines[lineKey] || { endingSound: false, stress: false };
              const isSelfCheckDone = selfCheck.endingSound && selfCheck.stress;
              const feedback = guideFeedback[idx];
              const isLineRecording = guideRecordingLineIdx === idx;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all shadow-xs ${
                    isSelfCheckDone ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header: Character info + Audio Speeds */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl sm:text-3xl p-1 bg-slate-100 rounded-xl">
                        {char?.avatar || '👤'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800 text-sm">
                            {line.speaker}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Câu {idx + 1} / {activeDialogue.lines.length}
                          </span>
                          {isSelfCheckDone && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Đã tự sửa chuẩn
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 italic">
                          {char?.roleVi || 'Nhân vật hội thoại'}
                        </span>
                      </div>
                    </div>

                    {/* Audio Listen Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          sound.speak(line.en, line.rate || 0.85, line.pitch || 1.15);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-all cursor-pointer"
                        title="Nghe phát âm tốc độ chuẩn"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe Chuẩn (0.85x)</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.speakSlow(line.en);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-all cursor-pointer"
                        title="Nghe phát âm chậm để soi từng âm vị"
                      >
                        <span>🐢</span>
                        <span>Nghe Chậm (0.6x)</span>
                      </button>
                    </div>
                  </div>

                  {/* English Sentence Display */}
                  <div className="mt-3 text-slate-900 font-extrabold text-base sm:text-lg font-heading leading-relaxed">
                    {line.en}
                  </div>

                  {/* IPA International Phonetic Alphabet Box */}
                  <div className="mt-2 bg-purple-50/80 border border-purple-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-200 text-purple-900 font-mono tracking-wider">
                          Phiên Âm Quốc Tế (IPA)
                        </span>
                        <span className="text-[11px] text-purple-700 font-medium">
                          (Chuẩn Oxford / Cambridge)
                        </span>
                      </div>
                      <div className="font-mono text-sm sm:text-base text-purple-950 font-bold tracking-wide">
                        {phonetics.ipa}
                      </div>
                    </div>
                  </div>

                  {/* Vietnamese Reading Hint Box */}
                  <div className="mt-2 bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3 flex items-start gap-2.5">
                    <span className="text-lg shrink-0 mt-0.5">🗣️</span>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                        Gợi Ý Phát Âm Thuần Việt (Dễ Đọc & Tự Chỉnh)
                      </div>
                      <div className="text-sm sm:text-base text-amber-950 font-extrabold leading-relaxed">
                        &ldquo;{phonetics.readVi}&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Vietnamese Meaning */}
                  <div className="mt-2 text-slate-600 text-xs sm:text-sm pl-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Dịch nghĩa:</span>
                    <span className="italic font-medium">{line.vi}</span>
                  </div>

                  {/* Self-Correction Checklist & Mic Practice */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/60 p-3 rounded-2xl">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Bé Tự Kiểm Tra & Sửa Lỗi:
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleToggleGuideCheck(lineKey, 'endingSound')}
                          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                            selfCheck.endingSound
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {selfCheck.endingSound ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>Đã bật rõ âm đuôi (/-s/, /-t/, /-d/...)</span>
                        </button>

                        <button
                          onClick={() => handleToggleGuideCheck(lineKey, 'stress')}
                          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                            selfCheck.stress
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {selfCheck.stress ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>Đã nhấn đúng trọng âm câu</span>
                        </button>
                      </div>
                    </div>

                    {/* Mic Practice */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <button
                        onClick={() => handleGuidePracticeMic(idx)}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs ${
                          isLineRecording
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95'
                        }`}
                      >
                        {isLineRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isLineRecording ? 'Đang lắng nghe...' : 'Bé Thử Đọc Câu Này'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Individual Line Feedback */}
                  {feedback && (
                    <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <span>{feedback}</span>
                      <span className="text-base">⭐</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Encouragement Card */}
          <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-black font-heading flex items-center justify-center sm:justify-start gap-2">
                <span>🌟</span>
                <span>Bé Đã Nắm Vững Phát Âm Đoạn Hội Thoại Này Chưa?</span>
              </h4>
              <p className="text-xs text-amber-100">
                Hãy chuyển sang tab <strong>Đoạn Hội Thoại</strong> để bắt đầu đóng vai và nói chuyện với bạn nhé!
              </p>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setMainTab('chat');
                handleStartRolePlay(activeDialogue.characters[0].name);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black bg-white text-orange-900 hover:bg-amber-50 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <UserCheck className="w-4 h-4 text-orange-600" />
              <span>Vào Đóng Vai Ngay!</span>
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
