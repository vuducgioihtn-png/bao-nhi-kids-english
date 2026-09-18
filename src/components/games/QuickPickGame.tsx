import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordItem, Topic } from '../../types';
import { getRandomWords } from '../../data/vocabulary';
import { sound } from '../../utils/audio';

interface QuickPickGameProps {
  topic: Topic;
  words: WordItem[];
  onBackToMenu: () => void;
  onAddStars: (stars: number) => void;
}

export const QuickPickGame: React.FC<QuickPickGameProps> = ({
  topic,
  words,
  onBackToMenu,
  onAddStars,
}) => {
  const [qpRound, setQpRound] = useState(0);
  const [qpTarget, setQpTarget] = useState<WordItem | null>(null);
  const [qpOptions, setQpOptions] = useState<WordItem[]>([]);
  const [qpScore, setQpScore] = useState(0);
  const [qpSelected, setQpSelected] = useState<string | null>(null);
  const [qpGameOver, setQpGameOver] = useState(false);
  const [qpTimer, setQpTimer] = useState(10);
  const scoreRef = useRef(0);
  const roundRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const initQuickPickRound = useCallback((roundNum: number) => {
    roundRef.current = roundNum;
    if (roundNum >= 8) {
      // Finished 8 rounds
      clearTimer();
      setQpGameOver(true);
      sound.playFanfare();
      onAddStars(Math.max(2, scoreRef.current));
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      return;
    }

    setQpSelected(null);
    setQpTimer(10);

    // Pick 1 target and 3 distractors
    const allTopicWords = words.length >= 4 ? words : getRandomWords(8, undefined, topic.id);
    const shuffled = [...allTopicWords].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    const options = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

    setQpTarget(target);
    setQpOptions(options);

    // Speak the target word
    setTimeout(() => {
      sound.speak(target.en);
    }, 200);
  }, [words, topic.id, onAddStars]);

  const handleSelectPicture = useCallback((chosenWord: WordItem) => {
    if (qpSelected !== null || !qpTarget) return;

    clearTimer();
    setQpSelected(chosenWord.id);

    if (chosenWord.id === qpTarget.id) {
      sound.playCorrect();
      setQpScore(s => {
        const next = s + 1;
        scoreRef.current = next;
        return next;
      });
    } else {
      sound.playWrong();
    }

    setTimeout(() => {
      setQpRound(prevRound => {
        const nextRound = prevRound + 1;
        initQuickPickRound(nextRound);
        return nextRound;
      });
    }, 1200);
  }, [qpSelected, qpTarget, initQuickPickRound]);

  const startQuickPick = useCallback(() => {
    clearTimer();
    scoreRef.current = 0;
    roundRef.current = 0;
    setQpRound(0);
    setQpScore(0);
    setQpGameOver(false);
    initQuickPickRound(0);
  }, [initQuickPickRound]);

  // Start only on topic change or mount
  useEffect(() => {
    startQuickPick();
    return () => clearTimer();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer countdown
  useEffect(() => {
    if (qpGameOver || qpSelected !== null) {
      clearTimer();
      return;
    }

    clearTimer();
    timerRef.current = setInterval(() => {
      setQpTimer(prev => {
        if (prev <= 1) {
          clearTimer();
          handleSelectPicture({ id: 'timeout' } as WordItem);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [qpGameOver, qpSelected, qpRound, handleSelectPicture]);

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
          <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
            Câu {qpRound + 1}/8
          </span>
          <span className="text-xs font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-xl">
            Điểm: {qpScore} ⭐
          </span>
        </div>

        {/* Timer Badge */}
        <div className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl border transition-colors ${
          qpTimer <= 3 
            ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' 
            : 'bg-rose-50 text-rose-600 border-rose-200'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{qpTimer}s</span>
        </div>
      </div>

      {!qpGameOver && qpTarget ? (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-emerald-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Hãy nghe phát âm và nhanh tay chọn đúng bức tranh:
          </p>

          {/* Big Speak button */}
          <div className="mb-5 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  sound.speak(qpTarget.en);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>Nghe từ: "{qpTarget.en}"</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  sound.speakSlow(qpTarget.en);
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-black text-xs border border-purple-200 transition-all cursor-pointer"
                title="Nghe chậm"
              >
                <span>🐢 Chậm</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono font-bold">[{qpTarget.ipa}]</p>
          </div>

          {/* 4 Picture Options Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {qpOptions.map(opt => {
              const isSelected = qpSelected === opt.id;
              const isAnswer = opt.id === qpTarget.id;
              let cardStyle = 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40';

              if (qpSelected !== null) {
                if (isAnswer) {
                  cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400 scale-102';
                } else if (isSelected && !isAnswer) {
                  cardStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  cardStyle = 'bg-slate-50 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectPicture(opt)}
                  disabled={qpSelected !== null}
                  className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-center cursor-pointer select-none ${cardStyle}`}
                >
                  <span className="text-5xl sm:text-6xl mb-2 block">{opt.emoji}</span>
                  <span className="text-xs font-extrabold text-slate-700">{opt.vi}</span>
                  {qpSelected !== null && isAnswer && (
                    <span className="text-[11px] font-black text-emerald-600 flex items-center gap-0.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Chính xác!
                    </span>
                  )}
                  {qpSelected !== null && isSelected && !isAnswer && (
                    <span className="text-[11px] font-black text-rose-600 flex items-center gap-0.5 mt-1">
                      <XCircle className="w-3.5 h-3.5" /> Chưa đúng
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Quick Pick Game Over */
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border-2 border-emerald-300 shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
            ⚡
          </div>
          <h3 className="text-2xl font-black font-heading text-slate-900">
            Hoàn Thành Thử Thách!
          </h3>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Bé đã trả lời đúng <strong className="text-emerald-600 font-extrabold">{qpScore}/8</strong> câu hỏi!
          </p>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-sm my-4 border border-emerald-200">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>Thưởng thêm +{qpScore} Ngôi Sao ⭐</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playTap();
                startQuickPick();
              }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Chơi lại
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
