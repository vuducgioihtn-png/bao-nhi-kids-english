import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2, Trophy, Sparkles, RotateCcw, Search, CheckCircle2,
  ArrowLeft, Star, Lightbulb, Compass, Heart, HelpCircle,
  Play, Eye, Zap, VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic } from '../../types';
import { getRandomWords } from '../../data/vocabulary';
import { sound } from '../../utils/audio';

interface HideAndSeekGameProps {
  topic: Topic;
  words: WordItem[];
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
  childName?: string;
  childNickname?: string;
}

// 8 Rich Hiding Spots with distinctive interactive themes & sounds
interface HidingSpotTheme {
  id: string;
  nameVi: string;
  nameEn: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
  soundType: 'rustle' | 'knock' | 'pop';
  hintClue: string;
}

const HIDING_THEMES: HidingSpotTheme[] = [
  {
    id: 'bush',
    nameVi: 'Bụi Cây Xanh',
    nameEn: 'Green Bush',
    icon: '🌿',
    bgGradient: 'from-emerald-400 via-green-500 to-emerald-600',
    borderColor: 'border-emerald-300',
    soundType: 'rustle',
    hintClue: 'nghe tiếng lá xào xạc ở bụi cây xanh!',
  },
  {
    id: 'tree',
    nameVi: 'Cây Táo To',
    nameEn: 'Apple Tree',
    icon: '🌳',
    bgGradient: 'from-green-500 via-emerald-600 to-teal-700',
    borderColor: 'border-green-300',
    soundType: 'rustle',
    hintClue: 'thấy cành cây táo đang rung rinh!',
  },
  {
    id: 'gift',
    nameVi: 'Hộp Quà Thần Kỳ',
    nameEn: 'Magic Gift',
    icon: '🎁',
    bgGradient: 'from-rose-400 via-pink-500 to-rose-600',
    borderColor: 'border-rose-300',
    soundType: 'pop',
    hintClue: 'thấy chiếc nơ hộp quà vừa nhúc nhích!',
  },
  {
    id: 'tent',
    nameVi: 'Lều Cắm Trại',
    nameEn: 'Cozy Tent',
    icon: '⛺',
    bgGradient: 'from-amber-400 via-orange-500 to-amber-600',
    borderColor: 'border-amber-300',
    soundType: 'rustle',
    hintClue: 'thấy cửa lều vừa bay bay trong gió!',
  },
  {
    id: 'door',
    nameVi: 'Cửa Thần Tiên',
    nameEn: 'Fairy Door',
    icon: '🚪',
    bgGradient: 'from-amber-600 via-yellow-700 to-amber-800',
    borderColor: 'border-amber-400',
    soundType: 'knock',
    hintClue: 'nghe tiếng gõ cốc cốc sau cánh cửa gỗ!',
  },
  {
    id: 'chest',
    nameVi: 'Rương Kho Báu',
    nameEn: 'Treasure Box',
    icon: '🧳',
    bgGradient: 'from-purple-500 via-indigo-600 to-purple-700',
    borderColor: 'border-purple-300',
    soundType: 'knock',
    hintClue: 'thấy ổ khóa rương kho báu phát sáng lấp lánh!',
  },
  {
    id: 'cloud',
    nameVi: 'Đám Mây Cầu Vồng',
    nameEn: 'Fluffy Cloud',
    icon: '☁️',
    bgGradient: 'from-sky-300 via-blue-400 to-indigo-500',
    borderColor: 'border-sky-300',
    soundType: 'rustle',
    hintClue: 'thấy đám mây bồng bềnh có vệt sáng!',
  },
  {
    id: 'basket',
    nameVi: 'Giỏ Dã Ngoại',
    nameEn: 'Picnic Basket',
    icon: '🧺',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-500',
    borderColor: 'border-amber-300',
    soundType: 'rustle',
    hintClue: 'thấy khăn trải giỏ picnic đang cử động!',
  },
];

interface SpotState {
  index: number;
  theme: HidingSpotTheme;
  word: WordItem;
  isOpened: boolean;
  isTarget: boolean;
}

// Guide avatar mood states
type GuideMood = 'counting' | 'seeking' | 'hinting' | 'celebrating' | 'puzzled';

export const HideAndSeekGame: React.FC<HideAndSeekGameProps> = ({
  topic,
  words,
  onBackToMenu,
  onAddStars,
  childName = 'Bảo Nhi',
  childNickname = 'Bé Bảo Nhi',
}) => {
  const [round, setRound] = useState(0); // 5 rounds
  const totalRounds = 5;

  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [spots, setSpots] = useState<SpotState[]>([]);
  const [attemptsInRound, setAttemptsInRound] = useState(0);

  // Phases: 'countdown' (bịt mắt đếm 1, 2, 3...) -> 'playing' (đi tìm) -> 'round_won' -> 'game_over'
  const [phase, setPhase] = useState<'countdown' | 'playing' | 'round_won' | 'game_over'>('countdown');
  const [countdownNum, setCountdownNum] = useState<number>(3);

  // Guide Mascot State (Thám Tử Cáo Toby)
  const [guideMood, setGuideMood] = useState<GuideMood>('counting');
  const [guideMessage, setGuideMessage] = useState<string>('');

  // Clues & Animations
  const [score, setScore] = useState(0);
  const [foundHistory, setFoundHistory] = useState<WordItem[]>([]);
  const [hintActive, setHintActive] = useState(false);
  const [shakingSpotIndex, setShakingSpotIndex] = useState<number | null>(null);
  const [peekingSpotIndex, setPeekingSpotIndex] = useState<number | null>(null);

  const scoreRef = useRef(0);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a round
  const initRound = useCallback((roundNum: number) => {
    if (roundNum >= totalRounds) {
      setPhase('game_over');
      setGuideMood('celebrating');
      sound.playFanfare();
      onAddStars(10);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      return;
    }

    setAttemptsInRound(0);
    setHintActive(false);
    setShakingSpotIndex(null);
    setPeekingSpotIndex(null);

    // Number of spots: 4 in round 1-2, 5 in round 3-4, 6 in round 5
    const spotCount = roundNum < 2 ? 4 : roundNum < 4 ? 5 : 6;

    const wordPool = words.length >= spotCount ? words : getRandomWords(8, undefined, topic.id);
    const shuffledPool = [...wordPool].sort(() => 0.5 - Math.random());
    const selectedTarget = shuffledPool[0];
    const roundWords = shuffledPool.slice(0, spotCount).sort(() => 0.5 - Math.random());

    if (!roundWords.some(w => w.id === selectedTarget.id)) {
      roundWords[0] = selectedTarget;
    }
    const randomizedSpotsWords = [...roundWords].sort(() => 0.5 - Math.random());

    const shuffledThemes = [...HIDING_THEMES].sort(() => 0.5 - Math.random());
    const newSpots: SpotState[] = randomizedSpotsWords.map((word, idx) => ({
      index: idx,
      theme: shuffledThemes[idx % shuffledThemes.length],
      word,
      isOpened: false,
      isTarget: word.id === selectedTarget.id,
    }));

    setTargetWord(selectedTarget);
    setSpots(newSpots);

    // Start in countdown phase
    setPhase('countdown');
    setGuideMood('counting');
    setCountdownNum(3);
    setGuideMessage(`Toby đang bịt mắt đếm ngược... Cùng trốn nào!`);

    // Voice: One, two, three... ready or not!
    sound.speak(`One, two, three! Ready or not, here I come!`);
  }, [words, topic.id, onAddStars]);

  // Countdown step timer
  useEffect(() => {
    if (phase !== 'countdown') return;

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    let count = 3;
    setCountdownNum(3);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        sound.playPop();
      } else {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        // Switch to playing phase
        handleStartSeeking();
      }
    }, 1100);

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fast skip countdown to start seeking immediately
  const handleStartSeeking = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setPhase('playing');
    setGuideMood('seeking');
    sound.playCorrect();

    if (targetWord) {
      setGuideMessage(`${childName} ơi, hãy tìm xem "${targetWord.en}" đang trốn ở đâu nào!`);
      setTimeout(() => {
        sound.speak(`Where is the ${targetWord.en}?`);
      }, 300);
    }
  };

  // Start whole game
  const startGame = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    setRound(0);
    setFoundHistory([]);
    initRound(0);
  }, [initRound]);

  useEffect(() => {
    startGame();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Random peek-a-boo teasers during seeking
  useEffect(() => {
    if (phase !== 'playing') return;

    const interval = setInterval(() => {
      setSpots(currSpots => {
        const unopened = currSpots.filter(s => !s.isOpened);
        if (unopened.length === 0) return currSpots;
        const randomSpot = unopened[Math.floor(Math.random() * unopened.length)];
        setPeekingSpotIndex(randomSpot.index);
        sound.playRustle();
        setTimeout(() => setPeekingSpotIndex(null), 1400);
        return currSpots;
      });
    }, 4200);

    return () => clearInterval(interval);
  }, [phase]);

  // Guide Hint Clue
  const handleAskGuideHint = () => {
    if (hintActive || phase !== 'playing' || !targetWord) return;

    sound.playTap();
    setHintActive(true);
    setGuideMood('hinting');

    const targetSpot = spots.find(s => s.isTarget);
    if (targetSpot) {
      setShakingSpotIndex(targetSpot.index);
      targetSpot.theme.soundType === 'knock' ? sound.playKnock() : sound.playRustle();

      setGuideMessage(`Psst ${childName}! Toby ${targetSpot.theme.hintClue} Mau bấm vào xem thử!`);
      sound.speak(`Listen! The ${targetWord.en} is near the ${targetSpot.theme.nameEn}!`);
    }

    setTimeout(() => {
      setHintActive(false);
      setShakingSpotIndex(null);
      if (phase === 'playing') {
        setGuideMood('seeking');
      }
    }, 3500);
  };

  // Re-pronounce target question
  const handleRepeatQuestion = () => {
    if (!targetWord) return;
    sound.playTap();
    setGuideMood('seeking');
    setGuideMessage(`Toby nhắc lại nè: "Where is the ${targetWord.en}?" (${targetWord.vi})`);
    sound.speak(`Where is the ${targetWord.en}? Can you find the ${targetWord.en}?`);
  };

  // Tap Guide Toby for friendly interaction
  const handleTapGuide = () => {
    sound.playPop();
    const greetings = [
      `Chào ${childNickname}! Cậu tìm thấy bạn ấy chưa?`,
      `Toby đang đi tìm cùng ${childName} nè! Cố lên nào!`,
      `Ú òa! Trốn kỹ thật đấy! Hãy thử mở bụi cây hoặc hộp quà xem!`,
      `You can do it, ${childName}!`,
    ];
    const picked = greetings[Math.floor(Math.random() * greetings.length)];
    setGuideMessage(picked);
    sound.speak(`Let's find it, ${childName}!`);
  };

  // Open Spot
  const handleOpenSpot = (spotIndex: number) => {
    if (phase !== 'playing' || !targetWord) return;

    const clickedSpot = spots[spotIndex];
    if (!clickedSpot || clickedSpot.isOpened) return;

    // Play tactile sound based on spot type
    if (clickedSpot.theme.soundType === 'knock') {
      sound.playKnock();
    } else if (clickedSpot.theme.soundType === 'rustle') {
      sound.playRustle();
    } else {
      sound.playPop();
    }

    const newAttempts = attemptsInRound + 1;
    setAttemptsInRound(newAttempts);

    // Reveal spot
    setSpots(prev =>
      prev.map(s => (s.index === spotIndex ? { ...s, isOpened: true } : s))
    );

    if (clickedSpot.isTarget) {
      // TARGET FOUND!
      setPhase('round_won');
      setGuideMood('celebrating');
      sound.playCorrect();

      const earnedStars = newAttempts === 1 ? 3 : newAttempts === 2 ? 2 : 1;
      scoreRef.current += earnedStars;
      setScore(scoreRef.current);
      setFoundHistory(prev => [...prev, targetWord]);

      setGuideMessage(`🎉 Ú ÒA! Hoan hô ${childName}! Bạn đã tìm thấy ${targetWord.en} rồi! (+${earnedStars} ⭐)`);

      setTimeout(() => {
        sound.speak(`Peek-a-boo! You found the ${targetWord.en}! Good job!`);
      }, 300);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      // Not the target - friendly discovery
      setGuideMood('puzzled');
      setGuideMessage(`😅 Ối! Đó là bạn "${clickedSpot.word.en}" (${clickedSpot.word.vi}), không phải "${targetWord.en}". Cùng tìm tiếp nhé!`);
      setTimeout(() => {
        sound.speak(`Oops! That is a ${clickedSpot.word.en}. Keep looking!`);
      }, 250);

      setTimeout(() => {
        if (phase === 'playing') {
          setGuideMood('seeking');
        }
      }, 3000);
    }
  };

  // Next Round
  const handleNextRound = () => {
    sound.playTap();
    const nextR = round + 1;
    setRound(nextR);
    initRound(nextR);
  };

  // Guide Mascot Avatar Graphic & Mood
  const renderGuideAvatar = () => {
    switch (guideMood) {
      case 'counting':
        return (
          <div className="relative text-5xl sm:text-6xl animate-pulse select-none">
            <span role="img" aria-label="Counting">🙈</span>
            <span className="absolute -top-2 -right-2 text-xl">🕒</span>
          </div>
        );
      case 'hinting':
        return (
          <div className="relative text-5xl sm:text-6xl animate-bounce select-none">
            <span role="img" aria-label="Hinting">🦊</span>
            <span className="absolute -top-3 -right-2 text-2xl animate-spin">💡</span>
          </div>
        );
      case 'celebrating':
        return (
          <div className="relative text-5xl sm:text-6xl animate-bounce select-none">
            <span role="img" aria-label="Celebrating">🦊</span>
            <span className="absolute -top-3 -right-3 text-2xl">🎉</span>
          </div>
        );
      case 'puzzled':
        return (
          <div className="relative text-5xl sm:text-6xl select-none animate-wiggle">
            <span role="img" aria-label="Puzzled">🦊</span>
            <span className="absolute -top-2 -right-2 text-2xl">🧐</span>
          </div>
        );
      case 'seeking':
      default:
        return (
          <div className="relative text-5xl sm:text-6xl select-none hover:scale-110 transition-transform">
            <span role="img" aria-label="Seeking">🦊</span>
            <span className="absolute -bottom-1 -right-2 text-2xl animate-pulse">🔍</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-100/70 via-amber-50/50 to-emerald-50/60 rounded-3xl p-3 sm:p-5 border-2 border-amber-300/80 shadow-lg relative overflow-hidden select-none">
      {/* Decorative Sky & Sun / Clouds in Background */}
      <div className="absolute top-2 left-6 text-2xl opacity-40 pointer-events-none">☁️</div>
      <div className="absolute top-4 right-10 text-3xl opacity-50 pointer-events-none animate-spin-slow">☀️</div>
      <div className="absolute top-10 right-24 text-xl opacity-30 pointer-events-none">☁️</div>

      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/80 relative z-10">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 bg-white/90 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Khu Trò Chơi</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Round Counter */}
          <div className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black border border-amber-300 flex items-center gap-1 shadow-2xs">
            <span>🎯 Vòng {Math.min(round + 1, totalRounds)}/{totalRounds}</span>
          </div>

          {/* Stars Earned */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 rounded-full text-xs font-black border border-amber-500 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
            <span>{score} ⭐</span>
          </div>
        </div>
      </div>

      {/* ================= CHARISMATIC GUIDE HOST: THÁM TỬ CÁO TOBY ================= */}
      <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border-2 border-amber-300 shadow-sm mb-4 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Toby Avatar Button (Interactive: tap to talk!) */}
          <button
            type="button"
            onClick={handleTapGuide}
            title="Bấm vào Thám Tử Toby để trò chuyện!"
            className="flex flex-col items-center shrink-0 cursor-pointer p-1 rounded-2xl hover:bg-amber-50 transition-all active:scale-95 group"
          >
            {renderGuideAvatar()}
            <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full mt-1 border border-amber-300">
              Thám Tử Toby
            </span>
          </button>

          {/* Toby Speech Bubble */}
          <div className="flex-1 min-w-0 bg-amber-50/90 rounded-2xl p-2.5 sm:p-3 border border-amber-200/90 relative">
            {/* Bubble arrow */}
            <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-200"></div>

            <div className="flex items-start justify-between gap-2">
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                {guideMessage}
              </p>

              {/* Speaker to repeat question */}
              {targetWord && phase === 'playing' && (
                <button
                  type="button"
                  onClick={handleRepeatQuestion}
                  className="shrink-0 p-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  title="Nghe lại câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick interactive buttons under Toby's bubble */}
            {phase === 'playing' && targetWord && (
              <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={handleAskGuideHint}
                  disabled={hintActive}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                    hintActive
                      ? 'bg-amber-300 text-amber-950 animate-pulse ring-2 ring-amber-400'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>{hintActive ? 'Đang soi manh mối...' : '🔍 Xin Toby gợi ý chỗ trốn!'}</span>
                </button>

                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  (Bé bấm vào Toby để trò chuyện nhé!)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= COUNTDOWN PHASE (BỊT MẮT ĐẾM NGƯỢC) ================= */}
      {phase === 'countdown' && targetWord && (
        <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-6 text-center border-2 border-amber-300 shadow-md space-y-4 animate-in zoom-in-95 duration-200 my-4">
          <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-md animate-bounce ring-4 ring-rose-200">
            {countdownNum}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Sẵn sàng trốn tìm chưa nào?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
              Thám Tử Toby đang bịt mắt đếm ngược! Hãy nhớ nhân vật bé cần tìm là:
            </p>
          </div>

          {/* Mission Card Preview */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-100 border-2 border-amber-300 shadow-xs">
            <span className="text-4xl">{targetWord.emoji}</span>
            <div className="text-left">
              <span className="text-sm sm:text-base font-black text-amber-950 block">
                {targetWord.en}
              </span>
              <span className="text-xs text-amber-800 font-bold block">
                {targetWord.vi} ({targetWord.ipa})
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleStartSeeking}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Ú ÒA! CÙNG ĐI TÌM NGAY!</span>
              <span>➡️</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= PLAYING PHASE: THE INTERACTIVE HIDING GARDEN ================= */}
      {phase === 'playing' && targetWord && (
        <div className="space-y-3">
          {/* Target Card Banner */}
          <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 rounded-2xl p-2.5 sm:p-3 text-white shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                🔍
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-amber-100 block">
                  Nhiệm vụ của {childNickname}:
                </span>
                <span className="text-sm sm:text-base font-black leading-tight block">
                  Where is the <span className="underline decoration-white decoration-2">{targetWord.en}</span>? ({targetWord.vi})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => sound.speak(targetWord.en)}
              className="px-2.5 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 text-xs font-black shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Phát âm</span>
            </button>
          </div>

          {/* Interactive Hiding Spots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 py-1">
            {spots.map((spot) => {
              const isPeeking = peekingSpotIndex === spot.index && !spot.isOpened;
              const isShaking = shakingSpotIndex === spot.index && !spot.isOpened;

              return (
                <div key={spot.index} className="relative">
                  <button
                    type="button"
                    onClick={() => handleOpenSpot(spot.index)}
                    disabled={spot.isOpened}
                    className={`w-full h-36 sm:h-40 rounded-3xl p-3 flex flex-col items-center justify-between border-2 transition-all cursor-pointer relative overflow-hidden select-none shadow-sm ${
                      spot.isOpened
                        ? spot.isTarget
                          ? 'bg-gradient-to-b from-amber-100 via-rose-50 to-white border-amber-400 ring-4 ring-amber-300 scale-102 shadow-md'
                          : 'bg-slate-100/90 border-slate-300 opacity-90'
                        : `bg-gradient-to-br ${spot.theme.bgGradient} ${spot.theme.borderColor} hover:scale-104 active:scale-96 hover:shadow-md text-white`
                    } ${isShaking ? 'animate-bounce ring-4 ring-amber-400' : ''}`}
                  >
                    {!spot.isOpened ? (
                      /* CLOSED SPOT */
                      <div className="w-full h-full flex flex-col items-center justify-between py-1">
                        {/* Peeking Teaser Eyes */}
                        <div className="h-5 flex items-center justify-center">
                          {isPeeking ? (
                            <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full text-white font-black animate-bounce">
                              👀 Ú òa!
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">
                              Chỗ #{spot.index + 1}
                            </span>
                          )}
                        </div>

                        {/* Spot Icon */}
                        <div className="text-4xl sm:text-5xl drop-shadow-md transform transition-transform group-hover:scale-110">
                          {spot.theme.icon}
                        </div>

                        {/* Spot Name */}
                        <div className="text-center">
                          <span className="text-xs sm:text-[13px] font-black text-white drop-shadow-xs block leading-tight">
                            {spot.theme.nameVi}
                          </span>
                          <span className="text-[10px] text-white/80 font-semibold block">
                            {spot.theme.nameEn}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* OPENED SPOT */
                      <div className="w-full h-full flex flex-col items-center justify-between py-1 animate-in zoom-in-90 duration-300">
                        {/* Tag */}
                        <div className="w-full flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400">
                            {spot.theme.icon} {spot.theme.nameVi}
                          </span>
                          {spot.isTarget ? (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full font-black text-[9px]">
                              ✓ TÌM THẤY!
                            </span>
                          ) : (
                            <span className="text-slate-400">Bạn đi lạc</span>
                          )}
                        </div>

                        {/* Revealed Character Emoji */}
                        <div className={`text-4xl sm:text-5xl ${spot.isTarget ? 'scale-125 animate-bounce' : 'scale-95'}`}>
                          {spot.word.emoji}
                        </div>

                        {/* Word Text */}
                        <div className="text-center">
                          <span className={`text-xs sm:text-sm font-black block leading-tight ${spot.isTarget ? 'text-amber-950 font-extrabold' : 'text-slate-700'}`}>
                            {spot.word.en}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                            {spot.word.vi}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ROUND WON CELEBRATION ================= */}
      {phase === 'round_won' && targetWord && (
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500 p-4 sm:p-5 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300 my-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shrink-0 animate-bounce">
              {targetWord.emoji}
            </div>
            <div>
              <h4 className="text-base sm:text-xl font-black leading-tight">
                Ú ÒA! {childName} ĐÃ TÌM THẤY &ldquo;{targetWord.en}&rdquo;!
              </h4>
              <p className="text-xs sm:text-sm text-amber-100 font-bold mt-0.5">
                {attemptsInRound === 1
                  ? '⭐ Siêu thám tử! Tìm thấy ngay ở lần đầu (+3 Sao)'
                  : attemptsInRound === 2
                  ? '⭐ Rất xuất sắc! Tìm thấy ở lần thứ hai (+2 Sao)'
                  : '⭐ Hoan hô! Bé đã khám phá ra chỗ trốn (+1 Sao)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextRound}
            className="px-6 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            {round + 1 < totalRounds ? 'Vòng Tiếp Theo ➡️' : 'Nhận Cúp Thám Tử 🏆'}
          </button>
        </div>
      )}

      {/* ================= GRAND VICTORY (GAME OVER) ================= */}
      {phase === 'game_over' && (
        <div className="text-center py-6 sm:py-8 space-y-4 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center text-4xl mx-auto shadow-lg ring-4 ring-amber-200 animate-bounce">
            🏆
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Chúc Mừng Siêu Thám Tử {childName}!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Thám Tử Toby vô cùng tự hào về {childNickname}! Bé đã xuất sắc tìm ra tất cả các bạn đang trốn!
            </p>
          </div>

          {/* Star Reward */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-amber-100 text-amber-900 rounded-2xl border-2 border-amber-300 text-sm font-black shadow-xs">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500 animate-spin" />
            <span>Phần thưởng: +10 Sao Kỷ Lục ⭐</span>
            <span className="text-xs font-bold text-amber-700">(Điểm ván này: {score}⭐)</span>
          </div>

          {/* Friends Found Gallery */}
          <div className="bg-white/95 rounded-2xl p-4 border-2 border-amber-200 max-w-lg mx-auto text-left shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Các bạn nhỏ {childName} vừa tìm được:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {foundHistory.map((w, idx) => (
                <button
                  key={`${w.id}-${idx}`}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    sound.speak(w.en);
                  }}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 flex items-center gap-2 text-left transition-all cursor-pointer shadow-2xs"
                  title="Bấm để nghe phát âm"
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block truncate">
                      {w.en}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {w.vi}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              (Bé có thể chạm vào từng bạn để nghe lại phát âm nhé!)
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi Lại Trốn Tìm Cùng Toby</span>
            </button>
            <button
              type="button"
              onClick={onBackToMenu}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
            >
              Về Menu Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
