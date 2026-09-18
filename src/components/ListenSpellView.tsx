import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Volume2, Snail, Eye, EyeOff, Lightbulb, CheckCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic, UserProgress } from '../types';
import { sound } from '../utils/audio';

interface ListenSpellViewProps {
  topic: Topic;
  words: WordItem[];
  progress: UserProgress;
  onAddStars: (stars: number) => void;
}

interface LetterTile {
  char: string;
  originalIndex: number;
}

function scrambleWord(word: WordItem): LetterTile[] {
  const chars = word.en.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const tiles: LetterTile[] = chars.map((char, index) => ({ char, originalIndex: index }));
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

interface SpellWordCardProps {
  word: WordItem;
  showImage: boolean;
  onSuccess: () => void;
  onNextWord: () => void;
  childNickname?: string;
}

const SpellWordCard: React.FC<SpellWordCardProps> = ({
  word,
  showImage,
  onSuccess,
  onNextWord,
  childNickname = 'Bé Bảo Nhi',
}) => {
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<LetterTile[]>(() => scrambleWord(word));
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrongShake, setIsWrongShake] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const targetChars = useMemo(() => {
    return word.en.toUpperCase().replace(/[^A-Z]/g, '').split('');
  }, [word.en]);

  // Pronounce word when card appears (pure sound, NO setState)
  useEffect(() => {
    sound.speak(word.en);
  }, [word.id]);

  const verifySpelling = useCallback((letters: string[]) => {
    if (letters.length !== targetChars.length || targetChars.length === 0) return;

    const spelled = letters.join('');
    const target = targetChars.join('');

    if (spelled === target) {
      setIsCorrect(true);
      sound.playCorrect();
      sound.playStar();
      onSuccess();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
      });

      setTimeout(() => {
        sound.speak(word.en);
      }, 350);
    } else {
      setIsWrongShake(true);
      sound.playWrong();
      setTimeout(() => {
        setIsWrongShake(false);
      }, 500);
    }
  }, [targetChars, word, onSuccess]);

  const handleTileClick = (tile: LetterTile, tileIndex: number) => {
    if (isCorrect) return;
    sound.playTap();

    const nextLetters = [...userLetters, tile.char];
    setUserLetters(nextLetters);
    setAvailableTiles(prev => prev.filter((_, idx) => idx !== tileIndex));

    verifySpelling(nextLetters);
  };

  const handleRemoveLetter = (index: number) => {
    if (isCorrect) return;
    sound.playTap();

    const charToRemove = userLetters[index];
    setUserLetters(prev => prev.filter((_, idx) => idx !== index));
    setAvailableTiles(prev => [...prev, { char: charToRemove, originalIndex: Math.random() }]);
  };

  const handleClear = () => {
    sound.playTap();
    setUserLetters([]);
    setIsCorrect(false);
    setIsWrongShake(false);
    setAvailableTiles(scrambleWord(word));
  };

  const handleHint = () => {
    if (isCorrect) return;
    sound.playTap();
    const nextIdx = userLetters.length;
    if (nextIdx < targetChars.length) {
      const neededChar = targetChars[nextIdx];
      const tileIndex = availableTiles.findIndex(t => t.char === neededChar);
      if (tileIndex !== -1) {
        const tile = availableTiles[tileIndex];
        const nextLetters = [...userLetters, tile.char];
        setUserLetters(nextLetters);
        setAvailableTiles(prev => prev.filter((_, idx) => idx !== tileIndex));
        setHintsUsed(h => h + 1);

        verifySpelling(nextLetters);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-blue-100 text-center relative overflow-hidden">
      {/* Celebration Banner */}
      {isCorrect && (
        <div className="absolute top-0 inset-x-0 bg-linear-to-r from-emerald-500 to-teal-500 text-white py-1.5 px-4 text-xs font-black flex items-center justify-center gap-1 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4" /> {childNickname} giỏi quá! Chính xác rồi (+2 ⭐)
        </div>
      )}

      {/* Visual Cue or Mystery Box */}
      <div className="mt-2 mb-4">
        {showImage ? (
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center text-5xl shadow-2xs hover:scale-105 transition-transform">
            {word.emoji}
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-3xl text-slate-400">
            ❓
          </div>
        )}

        {/* Vietnamese Meaning Prompt */}
        <p className="text-base font-extrabold text-slate-700 mt-3">
          {word.vi}
        </p>
        <p className="text-xs text-slate-400 font-medium">
          Lắng nghe âm thanh và ghép các chữ cái lại cho đúng nhé!
        </p>
      </div>

      {/* Big Audio Buttons */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          id="listen-word-btn"
          onClick={() => {
            sound.playTap();
            sound.speak(word.en);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
          <span>Nghe phát âm</span>
        </button>

        <button
          id="listen-slow-btn"
          onClick={() => {
            sound.playTap();
            sound.speakSlow(word.en);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-sm transition-all active:scale-95 cursor-pointer"
          title="Nghe rùa đọc chậm"
        >
          <Snail className="w-4 h-4" />
          <span>Đọc chậm</span>
        </button>
      </div>

      {/* Word Input Slot Boxes */}
      <div
        className={`flex items-center justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap ${
          isWrongShake ? 'animate-shake' : ''
        }`}
      >
        {targetChars.map((_, idx) => {
          const letter = userLetters[idx];
          return (
            <button
              key={idx}
              onClick={() => letter && handleRemoveLetter(idx)}
              className={`w-10 h-12 sm:w-12 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all cursor-pointer ${
                letter
                  ? isCorrect
                    ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-sm'
                    : 'bg-blue-500 text-white border-2 border-blue-600 shadow-xs active:scale-90'
                  : 'bg-slate-100 border-2 border-dashed border-slate-300 text-transparent'
              }`}
              title={letter ? 'Nhấn để gỡ chữ này ra' : 'Ô trống'}
            >
              {letter || '_'}
            </button>
          );
        })}
      </div>

      {/* Available Scrambled Letter Blocks */}
      {!isCorrect ? (
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-2">
            Chạm vào chữ cái để ghép từ:
          </span>
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap min-h-[50px]">
            {availableTiles.map((tile, idx) => (
              <button
                key={`${tile.char}-${idx}`}
                onClick={() => handleTileClick(tile, idx)}
                className="w-10 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 hover:bg-amber-200 active:scale-90 text-amber-900 border-2 border-amber-300 text-lg sm:text-xl font-black shadow-2xs transition-all cursor-pointer"
              >
                {tile.char}
              </button>
            ))}
          </div>

          {/* Hint and Reset buttons */}
          <div className="flex items-center justify-center gap-3 mt-5 pt-3 border-t border-slate-100">
            <button
              id="hint-btn"
              onClick={handleHint}
              disabled={availableTiles.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Gợi ý 1 chữ</span>
            </button>

            <button
              id="clear-btn"
              onClick={handleClear}
              disabled={userLetters.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa làm lại</span>
            </button>
          </div>
        </div>
      ) : (
        /* Victory screen for current word */
        <div className="py-2 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-lg mb-2">
            <CheckCircle className="w-6 h-6" />
            <span>Chính xác: {word.en}!</span>
          </div>
          <p className="text-xs text-slate-500 mb-4 font-medium font-mono">
            Phát âm: {word.ipa}
          </p>

          <button
            id="next-spell-word-btn"
            onClick={onNextWord}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <span>Tiếp tục từ tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export const ListenSpellView: React.FC<ListenSpellViewProps> = ({
  topic,
  words,
  progress,
  onAddStars,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const [streak, setStreak] = useState(0);

  const safeIndex = Math.min(wordIndex, Math.max(0, words.length - 1));
  const currentWord = words[safeIndex] || words[0];

  const handleNextWord = () => {
    sound.playTap();
    setWordIndex(prev => (prev + 1) % words.length);
  };

  const handleSuccess = useCallback(() => {
    setStreak(s => s + 1);
    onAddStars(2);
  }, [onAddStars]);

  if (!currentWord) return null;

  const childNickname = progress.childProfile?.nickname || 'Bé Bảo Nhi';

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
            Từ {safeIndex + 1} / {words.length}
          </span>
          {streak > 1 && (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              🔥 Đúng liên tiếp: {streak}
            </span>
          )}
        </div>

        <button
          id="toggle-image-btn"
          onClick={() => {
            sound.playTap();
            setShowImage(!showImage);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
          title={showImage ? 'Ẩn hình để tăng độ thử thách' : 'Hiện hình ảnh gợi ý'}
        >
          {showImage ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showImage ? 'Ẩn gợi ý hình' : 'Hiện gợi ý hình'}</span>
        </button>
      </div>

      {/* Keyed SpellWordCard: cleanly unmounts and remounts fresh for each word with ZERO setState in useEffect! */}
      <SpellWordCard
        key={currentWord.id}
        word={currentWord}
        showImage={showImage}
        onSuccess={handleSuccess}
        onNextWord={handleNextWord}
        childNickname={childNickname}
      />

      {/* Footer Instructions */}
      <div className="mt-4 p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-center text-xs text-blue-900 font-medium">
        💡 <strong>Mẹo học nhớ sâu:</strong> {childNickname} hãy vừa bấm vừa đọc to từng chữ cái theo tiếng Anh nhé!
      </div>
    </div>
  );
};
