import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Trophy, Sparkles, RotateCcw, Eye, Search, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic } from '../../types';
import { getRandomWords } from '../../data/vocabulary';
import { sound } from '../../utils/audio';

interface PictureDetectiveGameProps {
  topic: Topic;
  words: WordItem[];
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
}

export const PictureDetectiveGame: React.FC<PictureDetectiveGameProps> = ({
  topic,
  words,
  onBackToMenu,
  onAddStars,
}) => {
  const [round, setRound] = useState(0); // 5 rounds total
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<WordItem[]>([]);
  const [revealedTiles, setRevealedTiles] = useState<boolean[]>([false, false, false, false]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const scoreRef = useRef(0);

  const initRound = useCallback((roundNum: number) => {
    if (roundNum >= 5) {
      setIsGameOver(true);
      sound.playFanfare();
      onAddStars(Math.max(5, scoreRef.current * 2));
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      return;
    }

    setIsRoundFinished(false);
    setSelectedOption(null);
    setRevealedTiles([false, false, false, false]);

    const pool = words.length >= 5 ? words : getRandomWords(8, undefined, topic.id);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const target = shuffled[roundNum % shuffled.length];

    // Pick 3 distractors
    const otherWords = pool.filter(w => w.id !== target.id);
    const distractors = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const fourOptions = [target, ...distractors].sort(() => 0.5 - Math.random());

    setTargetWord(target);
    setOptions(fourOptions);

    // Speak initial mystery sound
    setTimeout(() => {
      sound.playTap();
    }, 200);
  }, [words, topic.id, onAddStars]);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    initRound(0);
  }, [initRound]);

  useEffect(() => {
    startGame();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reveal a tile piece
  const handleRevealTile = (index: number) => {
    if (isRoundFinished || revealedTiles[index]) return;
    sound.playTap();
    setRevealedTiles(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  // Reveal all tiles when child asks or guesses
  const handleRevealAll = () => {
    sound.playTap();
    setRevealedTiles([true, true, true, true]);
  };

  // Handle guessing option
  const handleGuess = (word: WordItem) => {
    if (selectedOption !== null || !targetWord || isRoundFinished) return;

    setSelectedOption(word.id);
    setIsRoundFinished(true);
    setRevealedTiles([true, true, true, true]); // Fully unmask picture

    if (word.id === targetWord.id) {
      // Correct!
      sound.playCorrect();
      sound.speak(targetWord.en);
      const tilesCount = revealedTiles.filter(Boolean).length;
      // Bonus based on how few tiles were needed:
      const points = tilesCount <= 1 ? 3 : tilesCount <= 2 ? 2 : 1;
      setScore(s => {
        const next = s + points;
        scoreRef.current = next;
        return next;
      });

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.55 },
      });

      setTimeout(() => {
        setRound(r => {
          const nextR = r + 1;
          initRound(nextR);
          return nextR;
        });
      }, 1500);
    } else {
      // Wrong
      sound.playWrong();
      setTimeout(() => {
        setRound(r => {
          const nextR = r + 1;
          initRound(nextR);
          return nextR;
        });
      }, 1800);
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
          <span className="text-xs font-black bg-violet-100 text-violet-800 px-3 py-1 rounded-xl border border-violet-200">
            Vụ án {round + 1}/5
          </span>
          <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
            Điểm thám tử: {score} ⭐
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

      {!isGameOver && targetWord ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border-2 border-violet-100 text-center">
          {/* Mystery Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 text-xs font-black mb-4">
            <Search className="w-3.5 h-3.5" />
            <span>Thám Tử Nhí: Đoán Bức Tranh Bí Ẩn!</span>
          </div>

          {/* Mystery Picture Box with 4 Uncoverable Tiles (2x2) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-3xl overflow-hidden border-4 border-violet-300 shadow-inner bg-slate-50 flex items-center justify-center mb-5">
            {/* The hidden picture underneath */}
            <div className="text-8xl sm:text-9xl select-none filter drop-shadow-md">
              {targetWord.emoji}
            </div>

            {/* 4 Puzzle Overlay Tiles */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 pointer-events-auto">
              {[0, 1, 2, 3].map(tileIdx => {
                const isRevealed = revealedTiles[tileIdx];
                return (
                  <button
                    key={tileIdx}
                    onClick={() => handleRevealTile(tileIdx)}
                    disabled={isRevealed || isRoundFinished}
                    className={`transition-all duration-300 flex items-center justify-center font-black text-xl cursor-pointer ${
                      isRevealed
                        ? 'opacity-0 pointer-events-none'
                        : 'bg-linear-to-br from-violet-600 to-indigo-700 text-white hover:from-violet-500 hover:to-indigo-600 active:scale-95 shadow-xs'
                    }`}
                    title="Nhấp để mở mảnh ghép"
                  >
                    {!isRevealed && (
                      <div className="flex flex-col items-center">
                        <span className="text-base opacity-75">🔍</span>
                        <span className="text-xs font-mono font-bold mt-0.5">Mảnh {tileIdx + 1}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detective Clues Bar */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 max-w-md mx-auto mb-5 text-left">
            <div className="text-[11px] font-black uppercase text-slate-400 mb-1 flex items-center justify-between">
              <span>Manh mối thám tử:</span>
              <button
                onClick={handleRevealAll}
                disabled={isRoundFinished || revealedTiles.every(Boolean)}
                className="text-violet-600 hover:text-violet-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Eye className="w-3 h-3" />
                Mở hết mảnh ghép (-1 điểm)
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 font-semibold space-y-1">
              <div>
                🔎 <strong>Nghĩa Tiếng Việt:</strong> {targetWord.vi}
              </div>
              <div className="flex items-center gap-2">
                <span>🔡 <strong>Bắt đầu bằng:</strong> "{targetWord.en.charAt(0).toUpperCase()}"</span>
                <span>&bull;</span>
                <span>Dài: <strong>{targetWord.en.length}</strong> chữ cái</span>
                <button
                  onClick={() => {
                    sound.playTap();
                    sound.speak(targetWord.en);
                  }}
                  className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-800 text-xs font-bold cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  Nghe âm thanh
                </button>
              </div>
            </div>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {options.map(opt => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === targetWord.id;
              let btnClass = 'bg-slate-50 border-slate-200 hover:border-violet-400 hover:bg-violet-50/40 text-slate-800';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 scale-102';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleGuess(opt)}
                  disabled={selectedOption !== null}
                  className={`p-3.5 rounded-2xl border-2 transition-all font-heading font-black text-center flex flex-col items-center justify-center cursor-pointer select-none ${btnClass}`}
                >
                  <span className="text-base sm:text-lg font-black">{opt.en}</span>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">{opt.ipa}</span>
                  {selectedOption !== null && isCorrect && (
                    <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Chính xác!
                    </span>
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <span className="text-[10px] font-black text-rose-600 flex items-center gap-0.5 mt-1">
                      <XCircle className="w-3 h-3" /> Sai rồi!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-2 border-violet-300 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
            🕵️
          </div>
          <h3 className="text-2xl font-black font-heading text-slate-900">
            Thám Tử Tài Ba Hoàn Thành!
          </h3>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Bé đã phá án thành công cả 5 câu đố bí ẩn với số điểm xuất sắc{' '}
            <strong className="text-violet-600 font-extrabold">{score} điểm</strong>!
          </p>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-violet-100 text-violet-900 font-black text-sm my-4 border border-violet-200">
            <Trophy className="w-4 h-4 text-violet-600" />
            <span>Thưởng thêm +{Math.max(5, score * 2)} Ngôi Sao ⭐</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                startGame();
              }}
              className="px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Phá án ván mới
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
