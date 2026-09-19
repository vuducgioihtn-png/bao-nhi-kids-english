import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Sparkles, CheckCircle2, XCircle, RotateCcw, Award, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { IPA_SOUNDS_DATA, IPASoundItem } from '../../data/ipaData';
import { sound } from '../../utils/audio';
import { speakWordOnly, speakIPASound } from '../../utils/ipaAudio';

interface IPAGameQuizProps {
  onAddStars: (count: number) => void;
  onSelectSound: (item: IPASoundItem) => void;
}

interface Question {
  correctSound: IPASoundItem;
  options: IPASoundItem[];
  type: 'sound_to_symbol' | 'word_to_symbol';
}

export const IPAGameQuiz: React.FC<IPAGameQuizProps> = ({
  onAddStars,
  onSelectSound,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Generate a random question
  const generateQuestion = useCallback((): Question => {
    // Pick 1 correct sound randomly
    const correctIdx = Math.floor(Math.random() * IPA_SOUNDS_DATA.length);
    const correctSound = IPA_SOUNDS_DATA[correctIdx];

    // Pick 3 distractors from same or similar category
    const distractors: IPASoundItem[] = [];
    const pool = IPA_SOUNDS_DATA.filter((s) => s.id !== correctSound.id);

    while (distractors.length < 3) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      if (!distractors.some((d) => d.id === rand.id)) {
        distractors.push(rand);
      }
    }

    const options = [correctSound, ...distractors].sort(() => Math.random() - 0.5);
    const type = Math.random() > 0.5 ? 'sound_to_symbol' : 'word_to_symbol';

    return { correctSound, options, type };
  }, []);

  const nextQuestion = useCallback(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    const q = generateQuestion();
    setCurrentQuestion(q);

    // Auto play question sound
    setTimeout(() => {
      if (q.type === 'word_to_symbol') {
        speakWordOnly(q.correctSound.primaryWord, true);
      } else {
        speakIPASound(q.correctSound, true);
      }
    }, 300);
  }, [generateQuestion]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  // Play prompt sound
  const handlePlayPrompt = () => {
    if (!currentQuestion) return;
    if (currentQuestion.type === 'word_to_symbol') {
      speakWordOnly(currentQuestion.correctSound.primaryWord, true);
    } else {
      speakIPASound(currentQuestion.correctSound, true);
    }
  };

  // Check answer
  const handleSelectOption = (option: IPASoundItem) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);
    setTotalQuestions((prev) => prev + 1);

    if (option.id === currentQuestion.correctSound.id) {
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      onAddStars(2);
    } else {
      sound.playTap();
      setStreak(0);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-200 p-4 sm:p-6 shadow-sm space-y-5 max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-black text-slate-900 text-base sm:text-lg">
            Thử Tài 44 Âm IPA
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Điểm: {score}</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-orange-900 bg-orange-100 px-2.5 py-1 rounded-xl">
            <span>Chuỗi: {streak} 🔥</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-linear-to-b from-amber-50/70 to-orange-50/40 border border-amber-200 p-5 text-center space-y-3">
        <p className="text-xs sm:text-sm font-bold text-slate-600">
          {currentQuestion.type === 'word_to_symbol'
            ? `Bé hãy nghe từ mẫu "${currentQuestion.correctSound.primaryWord}" và chọn ký hiệu âm IPA tương ứng:`
            : `Bé hãy nghe âm thanh phát ra và chọn ký hiệu âm IPA đúng:`}
        </p>

        <button
          type="button"
          onClick={handlePlayPrompt}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer animate-pulse"
        >
          <Volume2 className="w-5 h-5" />
          <span>Bấm Nghe Lại Âm Đố</span>
        </button>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((opt) => {
          const isCorrect = opt.id === currentQuestion.correctSound.id;
          const isChosen = opt.id === selectedOptionId;

          let btnStyle = 'bg-white border-slate-200 hover:border-amber-400 text-slate-800';
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400';
            } else if (isChosen) {
              btnStyle = 'bg-rose-100 border-rose-500 text-rose-950';
            } else {
              btnStyle = 'bg-slate-50 border-slate-200 opacity-60';
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(opt)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 shadow-2xs cursor-pointer ${btnStyle}`}
            >
              <span className="text-2xl sm:text-3xl font-mono font-black">
                {opt.symbol}
              </span>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <span>{opt.primaryWord}</span>
                <span>{opt.emoji}</span>
              </span>

              {isAnswered && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1" />
              )}
              {isAnswered && isChosen && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Next Button */}
      {isAnswered && (
        <div className="pt-2 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="text-xs sm:text-sm font-bold">
            {selectedOptionId === currentQuestion.correctSound.id ? (
              <span className="text-emerald-700">
                🎉 Tuyệt vời! Bé đã chọn đúng âm {currentQuestion.correctSound.symbol} ({currentQuestion.correctSound.primaryWord} {currentQuestion.correctSound.emoji})!
              </span>
            ) : (
              <span className="text-rose-700">
                💡 Đáp án đúng là: {currentQuestion.correctSound.symbol} ({currentQuestion.correctSound.primaryWord} {currentQuestion.correctSound.emoji})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={nextQuestion}
            className="shrink-0 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 cursor-pointer"
          >
            Câu Tiếp Theo →
          </button>
        </div>
      )}
    </div>
  );
};
