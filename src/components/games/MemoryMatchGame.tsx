import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RotateCcw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic } from '../../types';
import { getRandomWords } from '../../data/vocabulary';
import { sound } from '../../utils/audio';

interface MemoryMatchGameProps {
  topic: Topic;
  words: WordItem[];
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
}

interface MemoryCard {
  id: string;
  uniqueId: number;
  type: 'word' | 'image';
  text: string;
  emoji?: string;
  isFlipped: boolean;
  isMatched: boolean;
  wordObj: WordItem;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  topic,
  words,
  onBackToMenu,
  onAddStars,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const initMemoryGame = useCallback(() => {
    // Pick 6 random words from current topic or general pool
    const selected = words.length >= 6 
      ? [...words].sort(() => 0.5 - Math.random()).slice(0, 6)
      : getRandomWords(6, undefined, topic.id);
    
    const deck: MemoryCard[] = [];

    selected.forEach((word, idx) => {
      // Card A: English word
      deck.push({
        id: word.id,
        uniqueId: idx * 2,
        type: 'word',
        text: word.en,
        isFlipped: false,
        isMatched: false,
        wordObj: word,
      });
      // Card B: Picture & Vietnamese
      deck.push({
        id: word.id,
        uniqueId: idx * 2 + 1,
        type: 'image',
        text: word.vi,
        emoji: word.emoji,
        isFlipped: false,
        isMatched: false,
        wordObj: word,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setIsLocked(false);
    setMoves(0);
    setMatches(0);
    setMemoryWon(false);
  }, [topic.id, words]);

  useEffect(() => {
    initMemoryGame();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = (card: MemoryCard) => {
    if (isLocked || card.isFlipped || card.isMatched) return;

    sound.playCardFlip();
    sound.speak(card.wordObj.en);

    const newCards = cards.map(c =>
      c.uniqueId === card.uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);

      const [first, second] = newFlipped;
      if (first.id === second.id && first.type !== second.type) {
        // Matched!
        setTimeout(() => {
          sound.playCorrect();
          sound.playStar();
          setCards(prev =>
            prev.map(c => (c.id === first.id ? { ...c, isMatched: true } : c))
          );
          setFlippedCards([]);
          setIsLocked(false);
          setMatches(m => {
            const next = m + 1;
            if (next === 6) {
              // Won!
              setMemoryWon(true);
              sound.playFanfare();
              onAddStars(6);
              confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            }
            return next;
          });
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          sound.playWrong();
          setCards(prev =>
            prev.map(c =>
              c.uniqueId === first.uniqueId || c.uniqueId === second.uniqueId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playTap();
            onBackToMenu();
          }}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl cursor-pointer shadow-2xs transition-all hover:bg-slate-50"
        >
          ◀ Danh Sách Trò Chơi
        </button>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-black">
          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-xl border border-amber-200">
            Đã ghép: {matches}/6
          </span>
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
            Lượt lật: {moves}
          </span>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            initMemoryGame();
          }}
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer shadow-2xs"
          title="Chơi lại ván mới"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {!memoryWon ? (
        /* Cards Grid (3x4) */
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {cards.map(card => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(card)}
                className={`h-24 sm:h-28 rounded-2xl border-2 transition-all duration-300 font-bold flex flex-col items-center justify-center p-2 text-center relative cursor-pointer select-none ${
                  card.isMatched
                    ? 'bg-emerald-50 border-emerald-400 opacity-80 scale-98'
                    : isRevealed
                    ? 'bg-white border-amber-400 shadow-md scale-102 ring-2 ring-amber-100'
                    : 'bg-linear-to-tr from-amber-400 to-orange-400 border-amber-500 text-white shadow-xs hover:scale-102 hover:shadow-md'
                }`}
              >
                {isRevealed ? (
                  <div>
                    {card.type === 'image' ? (
                      <>
                        <span className="text-3xl sm:text-4xl block mb-1">{card.emoji}</span>
                        <span className="text-[11px] text-slate-600 font-extrabold line-clamp-1">
                          {card.text}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm sm:text-base text-slate-900 font-black font-heading block">
                          {card.text}
                        </span>
                        <span className="text-[10px] text-amber-700 font-mono font-medium block">
                          {card.wordObj.ipa}
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-2xl font-black opacity-80">❓</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Victory Screen */
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-2 border-amber-300 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
            🏆
          </div>
          <h3 className="text-2xl font-black font-heading text-slate-900">
            Chúc Mừng Bé Chiến Thắng!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Bé đã ghi nhớ và ghép đúng tất cả các thẻ chỉ trong {moves} lượt lật!
          </p>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 font-black text-sm my-4 border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Thưởng ngay +6 Ngôi Sao ⭐</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                initMemoryGame();
              }}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
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
              Đổi trò chơi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
