import React, { useState } from 'react';
import { Volume2, CheckCircle2, Sparkles, HelpCircle, ArrowRightLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONTRAST_PAIRS, IPA_BY_NUMBER, IPASoundItem } from '../../data/ipaData';
import { sound } from '../../utils/audio';
import { speakWordOnly } from '../../utils/ipaAudio';

interface IPAContrastPairsProps {
  onSelectSound: (sound: IPASoundItem) => void;
  onAddStars: (count: number) => void;
}

export const IPAContrastPairs: React.FC<IPAContrastPairsProps> = ({
  onSelectSound,
  onAddStars,
}) => {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [currentQuizTarget, setCurrentQuizTarget] = useState<'A' | 'B' | null>(null);

  const activePair = CONTRAST_PAIRS[selectedPairIndex];
  const soundA = IPA_BY_NUMBER.get(activePair.pair[0]);
  const soundB = IPA_BY_NUMBER.get(activePair.pair[1]);

  if (!soundA || !soundB) return null;

  // Start mini listening challenge
  const handleStartQuiz = () => {
    const target = Math.random() < 0.5 ? 'A' : 'B';
    setCurrentQuizTarget(target);
    setQuizResult(null);
    const chosenWord = target === 'A' ? soundA.primaryWord : soundB.primaryWord;
    speakWordOnly(chosenWord, true);
  };

  // User guess A or B
  const handleGuess = (choice: 'A' | 'B') => {
    if (!currentQuizTarget) {
      handleStartQuiz();
      return;
    }

    if (choice === currentQuizTarget) {
      sound.playSuccess();
      confetti({ particleCount: 40, spread: 50 });
      setQuizResult({
        isCorrect: true,
        message: `🎉 Chính xác! Đó là âm ${choice === 'A' ? soundA.symbol : soundB.symbol} trong từ "${choice === 'A' ? soundA.primaryWord : soundB.primaryWord}"!`,
      });
      onAddStars(2);
      setCurrentQuizTarget(null);
    } else {
      sound.playTap();
      setQuizResult({
        isCorrect: false,
        message: `Chưa đúng rồi! Bé bấm "Nghe lại âm đố" để lắng nghe kỹ hơn nhé!`,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Pair Picker Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CONTRAST_PAIRS.map((item, idx) => (
          <button
            key={item.title}
            type="button"
            onClick={() => {
              sound.playTap();
              setSelectedPairIndex(idx);
              setQuizResult(null);
              setCurrentQuizTarget(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPairIndex === idx
                ? 'bg-amber-500 text-white shadow-xs scale-102'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparison Box */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-600" />
              <span>Phân Biệt: {soundA.symbol} &bull; {soundB.symbol}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{activePair.tip}</p>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
            Cặp trọng điểm {selectedPairIndex + 1}/{CONTRAST_PAIRS.length}
          </span>
        </div>

        {/* 2 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Âm số #{soundA.number}
                </span>
                <span className="text-2xl">{soundA.emoji}</span>
              </div>

              <div className="text-center py-2">
                <div className="text-4xl font-mono font-black text-emerald-900">
                  {soundA.symbol}
                </div>
                <div className="text-lg font-extrabold text-slate-800 mt-1">
                  {soundA.primaryWord}
                </div>
                <div className="text-xs text-slate-500">
                  ({soundA.wordMeaningVi})
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                <div><span className="font-bold text-emerald-900">Khẩu hình:</span> {soundA.mouthAction}</div>
                <div><span className="font-bold text-emerald-900">Mẹo bé nhớ:</span> {soundA.kidTip}</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => speakWordOnly(soundA.primaryWord)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Từ "{soundA.primaryWord}"</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectSound(soundA)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold cursor-pointer"
                title="Xem chi tiết"
              >
                Chi Tiết
              </button>
            </div>
          </div>

          {/* Card B */}
          <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/40 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                  Âm số #{soundB.number}
                </span>
                <span className="text-2xl">{soundB.emoji}</span>
              </div>

              <div className="text-center py-2">
                <div className="text-4xl font-mono font-black text-teal-900">
                  {soundB.symbol}
                </div>
                <div className="text-lg font-extrabold text-slate-800 mt-1">
                  {soundB.primaryWord}
                </div>
                <div className="text-xs text-slate-500">
                  ({soundB.wordMeaningVi})
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-teal-100 space-y-1">
                <div><span className="font-bold text-teal-900">Khẩu hình:</span> {soundB.mouthAction}</div>
                <div><span className="font-bold text-teal-900">Mẹo bé nhớ:</span> {soundB.kidTip}</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => speakWordOnly(soundB.primaryWord)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Từ "{soundB.primaryWord}"</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectSound(soundB)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-teal-100 border border-teal-300 text-teal-800 text-xs font-bold cursor-pointer"
                title="Xem chi tiết"
              >
                Chi Tiết
              </button>
            </div>
          </div>
        </div>

        {/* Mini Listening Challenge */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs sm:text-sm font-extrabold text-amber-950">
                Thử Thách Đôi Tai: Bé Nghe Xem Máy Vừa Phát Âm Nào?
              </h4>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              +2 ⭐ thưởng
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleStartQuiz}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-2xs active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{currentQuizTarget ? 'Nghe Lại Âm Đố' : 'Bắt Đầu Nghe Đố'}</span>
            </button>

            {currentQuizTarget && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGuess('A')}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-extrabold text-xs shadow-2xs active:scale-95 cursor-pointer"
                >
                  Chọn {soundA.symbol} ({soundA.primaryWord})
                </button>
                <button
                  type="button"
                  onClick={() => handleGuess('B')}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-teal-100 border-2 border-teal-400 text-teal-900 font-extrabold text-xs shadow-2xs active:scale-95 cursor-pointer"
                >
                  Chọn {soundB.symbol} ({soundB.primaryWord})
                </button>
              </div>
            )}
          </div>

          {quizResult && (
            <div
              className={`p-2.5 rounded-xl text-xs font-bold ${
                quizResult.isCorrect
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {quizResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
