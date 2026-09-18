import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Trophy, Sparkles, RotateCcw, Lightbulb, CheckCircle2, Delete } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic } from '../../types';
import { getRandomWords } from '../../data/vocabulary';
import { sound } from '../../utils/audio';

interface WordScrambleGameProps {
  topic: Topic;
  words: WordItem[];
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
}

interface LetterTile {
  id: number;
  char: string;
  isUsed: boolean;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({
  topic,
  words,
  onBackToMenu,
  onAddStars,
}) => {
  const [round, setRound] = useState(0);
  const [targetWord, setTargetWord] = useState<WordItem | null>(null);
  const [availableTiles, setAvailableTiles] = useState<LetterTile[]>([]);
  const [placedTiles, setPlacedTiles] = useState<(LetterTile | null)[]>([]);
  const [score, setScore] = useState(0);
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const scoreRef = useRef(0);

  const initRound = useCallback((roundNum: number) => {
    if (roundNum >= 5) {
      setIsGameOver(true);
      sound.playFanfare();
      onAddStars(Math.max(4, scoreRef.current * 2));
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      return;
    }

    setIsRoundWon(false);
    // Pick words with reasonable length (3 to 8 letters for elementary students)
    const pool = (words.length >= 5 ? words : getRandomWords(8, undefined, topic.id))
      .filter(w => {
        const clean = w.en.replace(/[^a-zA-Z]/g, '');
        return clean.length >= 3 && clean.length <= 8;
      });

    const candidatePool = pool.length >= 5 ? pool : words;
    const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
    const chosen = shuffled[roundNum % shuffled.length];

    const cleanLetters = chosen.en.toUpperCase().split('');
    const tiles: LetterTile[] = cleanLetters.map((char, index) => ({
      id: index,
      char,
      isUsed: false,
    }));

    // Shuffle letter tiles ensuring they aren't already in exact order
    const scrambled = [...tiles].sort(() => 0.5 - Math.random());

    setTargetWord(chosen);
    setAvailableTiles(scrambled);
    setPlacedTiles(new Array(cleanLetters.length).fill(null));

    // Audio cue
    setTimeout(() => {
      sound.speak(chosen.en);
    }, 250);
  }, [words, topic.id, onAddStars]);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    setRound(0);
    setScore(0);
    setHintsUsed(0);
    setIsGameOver(false);
    initRound(0);
  }, [initRound]);

  useEffect(() => {
    startGame();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle clicking an available letter tile
  const handlePickTile = (tile: LetterTile) => {
    if (tile.isUsed || isRoundWon || !targetWord) return;

    sound.playTap();

    // Find first empty slot
    const emptyIndex = placedTiles.findIndex(t => t === null);
    if (emptyIndex === -1) return;

    const newPlaced = [...placedTiles];
    newPlaced[emptyIndex] = tile;
    setPlacedTiles(newPlaced);

    setAvailableTiles(prev =>
      prev.map(t => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );

    // Check if word is completed
    const currentSpelled = newPlaced.map(t => t?.char || '').join('');
    const targetSpelled = targetWord.en.toUpperCase();

    if (currentSpelled.length === targetSpelled.length) {
      if (currentSpelled === targetSpelled) {
        // Correctly spelled!
        setIsRoundWon(true);
        sound.playCorrect();
        sound.speak(targetWord.en);
        setScore(s => s + 1);

        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          setRound(r => {
            const next = r + 1;
            initRound(next);
            return next;
          });
        }, 1500);
      } else {
        // Incorrectly spelled
        sound.playWrong();
      }
    }
  };

  // Handle clicking a placed tile in slot to undo/remove it
  const handleRemoveTile = (slotIndex: number) => {
    const tile = placedTiles[slotIndex];
    if (!tile || isRoundWon) return;

    sound.playTap();

    const newPlaced = [...placedTiles];
    newPlaced[slotIndex] = null;
    setPlacedTiles(newPlaced);

    setAvailableTiles(prev =>
      prev.map(t => (t.id === tile.id ? { ...t, isUsed: false } : t))
    );
  };

  // Reset all tiles in current round
  const handleResetLetters = () => {
    sound.playTap();
    setPlacedTiles(new Array(placedTiles.length).fill(null));
    setAvailableTiles(prev => prev.map(t => ({ ...t, isUsed: false })));
  };

  // Hint button: automatically places the next correct letter
  const handleUseHint = () => {
    if (isRoundWon || !targetWord) return;

    const targetLetters = targetWord.en.toUpperCase().split('');
    // Find first empty or incorrect slot
    let targetIndex = -1;
    for (let i = 0; i < targetLetters.length; i++) {
      if (!placedTiles[i] || placedTiles[i]?.char !== targetLetters[i]) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) return;

    const expectedChar = targetLetters[targetIndex];
    // Find available unused tile with this char
    const availableTile = availableTiles.find(t => !t.isUsed && t.char === expectedChar);

    if (availableTile) {
      sound.playStar();
      setHintsUsed(h => h + 1);

      // If current slot had another tile, release it
      if (placedTiles[targetIndex]) {
        const oldTile = placedTiles[targetIndex]!;
        setAvailableTiles(prev =>
          prev.map(t => (t.id === oldTile.id ? { ...t, isUsed: false } : t))
        );
      }

      const newPlaced = [...placedTiles];
      newPlaced[targetIndex] = availableTile;
      setPlacedTiles(newPlaced);

      setAvailableTiles(prev =>
        prev.map(t => (t.id === availableTile.id ? { ...t, isUsed: true } : t))
      );

      // Check if finished
      const currentSpelled = newPlaced.map(t => t?.char || '').join('');
      if (currentSpelled === targetWord.en.toUpperCase()) {
        setIsRoundWon(true);
        sound.playCorrect();
        sound.speak(targetWord.en);
        setScore(s => {
          const next = s + 1;
          scoreRef.current = next;
          return next;
        });
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => {
          setRound(r => {
            const next = r + 1;
            initRound(next);
            return next;
          });
        }, 1500);
      }
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
          <span className="text-xs font-black bg-indigo-100 text-indigo-800 px-3 py-1 rounded-xl border border-indigo-200">
            Từ {round + 1}/5
          </span>
          <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
            Đúng: {score} ⭐
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
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border-2 border-indigo-100 text-center">
          {/* Target Word Clue Card */}
          <div className="mb-6 flex flex-col items-center">
            <span className="text-6xl sm:text-7xl mb-2 drop-shadow-sm inline-block select-none hover:scale-105 transition-transform">
              {targetWord.emoji}
            </span>
            <div className="text-sm sm:text-base font-extrabold text-slate-700 mt-1">
              Nghĩa: <span className="text-indigo-600 font-black">{targetWord.vi}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  sound.playTap();
                  sound.speak(targetWord.en);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black border border-indigo-200 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe phát âm</span>
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  sound.speakSlow(targetWord.en);
                }}
                className="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 cursor-pointer"
                title="Nghe chậm"
              >
                🐢
              </button>
            </div>
          </div>

          {/* Answer Slots */}
          <div className="mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Các chữ cái ghép được:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {placedTiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveTile(idx)}
                  disabled={isRoundWon}
                  className={`w-11 h-13 sm:w-14 sm:h-16 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center border-2 transition-all cursor-pointer select-none shadow-xs ${
                    isRoundWon
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 scale-105 ring-2 ring-emerald-300'
                      : tile
                      ? 'bg-indigo-600 border-indigo-700 text-white hover:bg-rose-500 hover:border-rose-600'
                      : 'bg-slate-100 border-dashed border-slate-300 text-transparent'
                  }`}
                  title={tile ? 'Nhấp để gỡ chữ này' : 'Ô trống'}
                >
                  {tile ? tile.char : ''}
                </button>
              ))}
            </div>

            {isRoundWon && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-emerald-600 font-black text-sm animate-in zoom-in-90 duration-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Chính xác! Bé giỏi quá!</span>
              </div>
            )}
          </div>

          {/* Available Scrambled Letter Tiles */}
          <div className="mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Bé nhấp vào từng chữ cái để xếp thành từ đúng:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {availableTiles.map(tile => (
                <button
                  key={tile.id}
                  onClick={() => handlePickTile(tile)}
                  disabled={tile.isUsed || isRoundWon}
                  className={`w-11 h-13 sm:w-14 sm:h-16 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center border-2 transition-all select-none shadow-sm ${
                    tile.isUsed
                      ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed scale-95 opacity-50'
                      : 'bg-amber-400 hover:bg-amber-300 border-amber-500 text-amber-950 hover:scale-105 active:scale-95 cursor-pointer shadow-amber-200'
                  }`}
                >
                  {tile.char}
                </button>
              ))}
            </div>
          </div>

          {/* Action Helper Buttons */}
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={handleUseHint}
              disabled={isRoundWon}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 cursor-pointer transition-all disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Gợi ý 1 chữ</span>
            </button>

            <button
              onClick={handleResetLetters}
              disabled={isRoundWon}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xếp lại từ đầu</span>
            </button>
          </div>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-2 border-indigo-300 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
            🧩
          </div>
          <h3 className="text-2xl font-black font-heading text-slate-900">
            Bậc Thầy Xếp Chữ!
          </h3>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Bé đã xếp đúng hoàn chỉnh <strong className="text-indigo-600 font-extrabold">{score}/5 từ vựng</strong>!
          </p>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-100 text-indigo-900 font-black text-sm my-4 border border-indigo-200">
            <Trophy className="w-4 h-4 text-indigo-600" />
            <span>Thưởng thêm +{score * 2} Ngôi Sao ⭐</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                startGame();
              }}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Chơi ván mới
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
