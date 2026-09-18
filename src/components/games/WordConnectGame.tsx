import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Trophy, Sparkles, RotateCcw, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic } from '../../types';
import { getRandomWords } from '../../data/vocabulary';
import { sound } from '../../utils/audio';

interface WordConnectGameProps {
  topic: Topic;
  words: WordItem[];
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
}

interface LeftItem {
  id: string;
  word: WordItem;
  isMatched: boolean;
  colorIdx: number;
}

interface RightItem {
  id: string;
  word: WordItem;
  isMatched: boolean;
  colorIdx: number;
}

const PAIR_COLORS = [
  { bg: 'bg-amber-500', text: 'text-amber-900', border: 'border-amber-400', light: 'bg-amber-50' },
  { bg: 'bg-emerald-500', text: 'text-emerald-900', border: 'border-emerald-400', light: 'bg-emerald-50' },
  { bg: 'bg-sky-500', text: 'text-sky-900', border: 'border-sky-400', light: 'bg-sky-50' },
  { bg: 'bg-purple-500', text: 'text-purple-900', border: 'border-purple-400', light: 'bg-purple-50' },
];

export const WordConnectGame: React.FC<WordConnectGameProps> = ({
  topic,
  words,
  onBackToMenu,
  onAddStars,
}) => {
  const [round, setRound] = useState(0); // 2 rounds total
  const [leftItems, setLeftItems] = useState<LeftItem[]>([]);
  const [rightItems, setRightItems] = useState<RightItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const initRound = useCallback((roundNum: number) => {
    if (roundNum >= 2) {
      setIsGameOver(true);
      sound.playFanfare();
      onAddStars(8);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      return;
    }

    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedCount(0);

    const pool = words.length >= 8 ? words : getRandomWords(10, undefined, topic.id);
    const startIdx = roundNum * 4;
    const roundWords = pool.slice(startIdx, startIdx + 4);
    const selected = roundWords.length === 4 ? roundWords : getRandomWords(4, undefined, topic.id);

    const left: LeftItem[] = selected.map((w, idx) => ({
      id: w.id,
      word: w,
      isMatched: false,
      colorIdx: idx,
    }));

    const right: RightItem[] = [...selected]
      .sort(() => 0.5 - Math.random())
      .map(w => {
        const matchingLeft = left.find(l => l.id === w.id);
        return {
          id: w.id,
          word: w,
          isMatched: false,
          colorIdx: matchingLeft ? matchingLeft.colorIdx : 0,
        };
      });

    setLeftItems(left);
    setRightItems(right);
  }, [words, topic.id, onAddStars]);

  const startGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    initRound(0);
  }, [initRound]);

  useEffect(() => {
    startGame();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle clicking left word
  const handleSelectLeft = (item: LeftItem) => {
    if (item.isMatched) return;
    sound.playTap();
    sound.speak(item.word.en);
    setSelectedLeft(item.id);

    // If a right item was already selected, evaluate match
    if (selectedRight) {
      checkMatch(item.id, selectedRight);
    }
  };

  // Handle clicking right word
  const handleSelectRight = (item: RightItem) => {
    if (item.isMatched) return;
    sound.playTap();
    setSelectedRight(item.id);

    // If a left item was already selected, evaluate match
    if (selectedLeft) {
      checkMatch(selectedLeft, item.id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct match!
      sound.playCorrect();
      sound.playStar();
      setScore(s => s + 1);

      setLeftItems(prev =>
        prev.map(item => (item.id === leftId ? { ...item, isMatched: true } : item))
      );
      setRightItems(prev =>
        prev.map(item => (item.id === rightId ? { ...item, isMatched: true } : item))
      );

      setSelectedLeft(null);
      setSelectedRight(null);

      setMatchedCount(prev => {
        const next = prev + 1;
        if (next === 4) {
          // Round completed!
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
          setTimeout(() => {
            setRound(r => {
              const nextR = r + 1;
              initRound(nextR);
              return nextR;
            });
          }, 1000);
        }
        return next;
      });
    } else {
      // Wrong match
      sound.playWrong();
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playTap();
            onBackToMenu();
          }}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl cursor-pointer shadow-2xs hover:bg-slate-50 transition-all"
        >
          ◀ Danh Sách Trò Chơi
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black bg-teal-100 text-teal-800 px-3 py-1 rounded-xl border border-teal-200">
            Hiệp {round + 1}/2
          </span>
          <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
            Đã nối: {score}/8 ⭐
          </span>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            startGame();
          }}
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer shadow-2xs"
          title="Chơi lại ván mới"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {!isGameOver ? (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-teal-100">
          <div className="text-center mb-4">
            <h3 className="text-base sm:text-lg font-black font-heading text-slate-900">
              Nối Từ Tiếng Anh Với Nghĩa Tiếng Việt
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chạm vào từ Tiếng Anh ở cột trái, rồi chạm vào hình ảnh và nghĩa tương ứng ở cột phải!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-xl mx-auto">
            {/* Left Column: English words */}
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider text-center">
                Cột Tiếng Anh
              </div>
              {leftItems.map(item => {
                const isSelected = selectedLeft === item.id;
                const pairColor = PAIR_COLORS[item.colorIdx % PAIR_COLORS.length];

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectLeft(item)}
                    disabled={item.isMatched}
                    className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer select-none ${
                      item.isMatched
                        ? `${pairColor.light} ${pairColor.border} opacity-85`
                        : isSelected
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-300 scale-102 shadow-sm'
                        : 'bg-slate-50 hover:bg-teal-50/40 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm sm:text-base font-black font-heading text-slate-900">
                        {item.word.en}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono font-medium">
                        {item.word.ipa}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.isMatched ? (
                        <div className={`w-6 h-6 rounded-full ${pairColor.bg} text-white flex items-center justify-center`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-slate-400 hover:text-teal-600">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Vietnamese & Emojis */}
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider text-center">
                Nghĩa & Hình Ảnh
              </div>
              {rightItems.map(item => {
                const isSelected = selectedRight === item.id;
                const pairColor = PAIR_COLORS[item.colorIdx % PAIR_COLORS.length];

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectRight(item)}
                    disabled={item.isMatched}
                    className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 transition-all text-left flex items-center gap-3 cursor-pointer select-none ${
                      item.isMatched
                        ? `${pairColor.light} ${pairColor.border} opacity-85`
                        : isSelected
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-300 scale-102 shadow-sm'
                        : 'bg-slate-50 hover:bg-teal-50/40 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">{item.word.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-1">
                        {item.word.vi}
                      </div>
                    </div>
                    {item.isMatched && (
                      <div className={`w-6 h-6 rounded-full ${pairColor.bg} text-white flex items-center justify-center shrink-0`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-2 border-teal-300 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-teal-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
            🔗
          </div>
          <h3 className="text-2xl font-black font-heading text-slate-900">
            Hoàn Thành Ghép Cặp Nối Từ!
          </h3>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Bé đã kết nối chính xác toàn bộ <strong className="text-teal-600 font-extrabold">8 cặp từ vựng</strong> trong cả 2 hiệp!
          </p>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-teal-100 text-teal-900 font-black text-sm my-4 border border-teal-200">
            <Trophy className="w-4 h-4 text-teal-600" />
            <span>Thưởng thêm +8 Ngôi Sao ⭐</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                startGame();
              }}
              className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Chơi lại hiệp mới
            </button>
            <button
              onClick={() => {
                sound.playTap();
                onBackToMenu();
              }}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
            >
              Chọn trò khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
