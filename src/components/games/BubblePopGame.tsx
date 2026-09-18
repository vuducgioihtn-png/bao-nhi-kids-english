import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Trophy, Sparkles, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic } from '../../types';
import { getRandomWords } from '../../data/vocabulary';
import { sound } from '../../utils/audio';

interface BubblePopGameProps {
  topic: Topic;
  words: WordItem[];
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
}

interface BubbleItem {
  id: string;
  word: WordItem;
  colorClass: string;
  isPopped: boolean;
  isWobbling: boolean;
  size: string; // px or class
  speedDelay: string;
}

const BUBBLE_COLORS = [
  'from-pink-400 to-rose-500 border-pink-300 text-white shadow-pink-200',
  'from-sky-400 to-blue-500 border-sky-300 text-white shadow-sky-200',
  'from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-200',
  'from-emerald-400 to-teal-500 border-emerald-300 text-white shadow-emerald-200',
  'from-purple-400 to-indigo-500 border-purple-300 text-white shadow-purple-200',
  'from-fuchsia-400 to-violet-500 border-fuchsia-300 text-white shadow-fuchsia-200',
];

export const BubblePopGame: React.FC<BubblePopGameProps> = ({
  topic,
  words,
  onBackToMenu,
  onAddStars,
}) => {
  const [round, setRound] = useState(0);
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const scoreRef = useRef(0);

  const initRound = useCallback((roundIndex: number) => {
    if (roundIndex >= 6) {
      setIsGameOver(true);
      sound.playFanfare();
      onAddStars(Math.max(4, scoreRef.current + 2));
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      return;
    }

    setHintMessage(null);
    const pool = words.length >= 6 ? words : getRandomWords(8, undefined, topic.id);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const choices = shuffled.slice(0, 6).sort(() => 0.5 - Math.random());

    // Ensure target is in choices
    if (!choices.some(c => c.id === target.id)) {
      choices[0] = target;
      choices.sort(() => 0.5 - Math.random());
    }

    const bubbleItems: BubbleItem[] = choices.map((w, idx) => ({
      id: `${w.id}_${idx}`,
      word: w,
      colorClass: BUBBLE_COLORS[idx % BUBBLE_COLORS.length],
      isPopped: false,
      isWobbling: false,
      size: idx % 2 === 0 ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-26 h-26 sm:w-30 sm:h-30',
      speedDelay: `${(idx * 0.4).toFixed(1)}s`,
    }));

    setTargetWord(target);
    setBubbles(bubbleItems);

    // Speak prompt
    setTimeout(() => {
      sound.speak(target.en);
    }, 250);
  }, [words, topic.id, onAddStars]);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    setRound(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setIsGameOver(false);
    initRound(0);
  }, [initRound]);

  useEffect(() => {
    startGame();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePopBubble = (bubble: BubbleItem) => {
    if (bubble.isPopped || !targetWord) return;

    if (bubble.word.id === targetWord.id) {
      // Correct!
      sound.playPop();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);

      if (nextCombo >= 2) {
        sound.playCombo();
      }

      const points = 1 + (nextCombo >= 3 ? 1 : 0);
      setScore(s => {
        const next = s + points;
        scoreRef.current = next;
        return next;
      });

      setBubbles(prev =>
        prev.map(b => (b.id === bubble.id ? { ...b, isPopped: true } : b))
      );

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.5 },
      });

      // Advance to next round
      setTimeout(() => {
        setRound(r => {
          const nextR = r + 1;
          initRound(nextR);
          return nextR;
        });
      }, 900);
    } else {
      // Wrong bubble
      sound.playWrong();
      setCombo(0);
      setHintMessage(`Bong bóng vừa bấm là "${bubble.word.en}" (${bubble.word.vi}). Bé tìm "${targetWord.en}" nhé!`);

      setBubbles(prev =>
        prev.map(b => (b.id === bubble.id ? { ...b, isWobbling: true } : b))
      );

      setTimeout(() => {
        setBubbles(prev =>
          prev.map(b => (b.id === bubble.id ? { ...b, isWobbling: false } : b))
        );
      }, 600);
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
          <span className="text-xs font-black bg-purple-100 text-purple-800 px-3 py-1 rounded-xl border border-purple-200">
            Vòng {round + 1}/6
          </span>
          <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
            Điểm: {score} ⭐
          </span>
          {combo > 1 && (
            <span className="text-xs font-black bg-rose-500 text-white px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs scale-105 transition-transform">
              <Flame className="w-3.5 h-3.5" />
              Combo x{combo}!
            </span>
          )}
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

      {!isGameOver && targetWord ? (
        <div className="bg-linear-to-b from-sky-100/70 via-blue-50/50 to-indigo-100/60 rounded-3xl p-4 sm:p-6 shadow-md border-2 border-sky-200 text-center relative overflow-hidden">
          {/* Target Word Mission Card */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-sky-200 shadow-sm max-w-md mx-auto mb-5">
            <div className="text-[11px] font-black uppercase text-sky-700 tracking-wider mb-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Nhiệm Vụ: Bắn Vỡ Bong Bóng Đúng!
            </div>

            <div className="flex items-center justify-center gap-3 mt-1">
              <span className="text-3xl sm:text-4xl">{targetWord.emoji}</span>
              <div className="text-left">
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  {targetWord.en}
                </div>
                <div className="text-xs font-bold text-amber-600 font-mono">
                  {targetWord.ipa} &bull; <span className="font-sans text-slate-500 font-normal">{targetWord.vi}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => {
                    sound.playTap();
                    sound.speak(targetWord.en);
                  }}
                  className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playTap();
                    sound.speakSlow(targetWord.en);
                  }}
                  className="px-2 py-2 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs hover:bg-purple-200 cursor-pointer"
                  title="Nghe chậm"
                >
                  🐢
                </button>
              </div>
            </div>

            {hintMessage && (
              <div className="mt-2 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 animate-in fade-in duration-150">
                {hintMessage}
              </div>
            )}
          </div>

          {/* Bubbles Floating Arena */}
          <div className="min-h-[300px] sm:min-h-[340px] flex items-center justify-center p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center items-center w-full max-w-lg">
              {bubbles.map(bubble => {
                if (bubble.isPopped) {
                  return (
                    <div
                      key={bubble.id}
                      className={`${bubble.size} rounded-full flex flex-col items-center justify-center opacity-0 scale-125 transition-all duration-300 pointer-events-none`}
                    >
                      <span className="text-3xl">💥</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={bubble.id}
                    onClick={() => handlePopBubble(bubble)}
                    className={`${bubble.size} rounded-full bg-linear-to-tr ${bubble.colorClass} border-4 shadow-md hover:shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 hover:scale-105 select-none relative group ${
                      bubble.isWobbling ? 'ring-4 ring-rose-400 scale-95' : ''
                    }`}
                  >
                    {/* Bubble Highlight shine */}
                    <div className="absolute top-2 left-3 w-4 h-2 bg-white/60 rounded-full rotate-[-30deg]" />

                    <span className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                      {bubble.word.emoji}
                    </span>
                    <span className="text-xs sm:text-sm font-black font-heading mt-0.5 tracking-wide text-white drop-shadow-md px-1 text-center line-clamp-1">
                      {bubble.word.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-sky-700 font-bold mt-2">
            💡 Nhấp đúng bong bóng mang từ "{targetWord.en}" để nổ và nhận điểm thưởng liên hoàn!
          </p>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-2 border-purple-300 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
            🎈
          </div>
          <h3 className="text-2xl font-black font-heading text-slate-900">
            Bắn Bong Bóng Xuất Sắc!
          </h3>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Bé đã hoàn thành 6 lượt bắn bong bóng với tổng điểm{' '}
            <strong className="text-purple-600 font-extrabold">{score} điểm</strong>!
          </p>

          {maxCombo > 1 && (
            <div className="mt-2 text-xs font-black text-rose-600 bg-rose-50 inline-block px-3 py-1 rounded-full border border-rose-200">
              🔥 Kỷ lục Combo cao nhất: x{maxCombo}!
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-100 text-purple-900 font-black text-sm my-4 border border-purple-200">
            <Trophy className="w-4 h-4 text-purple-600" />
            <span>Thưởng thêm +{Math.max(4, score)} Ngôi Sao ⭐</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                startGame();
              }}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Bắn thêm ván nữa
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
