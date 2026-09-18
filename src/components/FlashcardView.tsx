import React, { useState, useEffect } from 'react';
import { Volume2, Snail, Check, ChevronLeft, ChevronRight, RotateCw, Play, Pause, Sparkles, Grid } from 'lucide-react';
import { WordItem, Topic, UserProgress } from '../types';
import { sound } from '../utils/audio';
import { getWordPhonetic } from '../utils/phonetics';
import { personalizeText } from '../utils/personalization';

interface FlashcardViewProps {
  topic: Topic;
  words: WordItem[];
  progress: UserProgress;
  onToggleMastered: (wordId: string) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  topic,
  words,
  progress,
  onToggleMastered,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const safeIndex = Math.min(currentIndex, Math.max(0, words.length - 1));
  const currentWord = words[safeIndex] || words[0];
  const childName = progress.childProfile?.name || 'Bảo Nhi';

  // Speak word when card changes (pure audio, NO setState)
  useEffect(() => {
    if (currentWord) {
      sound.speak(currentWord.en);
    }
  }, [currentWord?.id]);

  // Slideshow auto-play effect (advances words cleanly without nested updaters)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex(curr => (curr + 1) % words.length);
      setIsFlipped(false);
    }, 3500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, words.length]);

  if (!currentWord) {
    return (
      <div className="p-8 text-center text-slate-500">
        Chủ đề này chưa có từ vựng. Vui lòng chọn chủ đề khác.
      </div>
    );
  }

  const isMastered = progress.masteredWordIds.includes(currentWord.id);

  const handleNext = () => {
    sound.playCardFlip();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    sound.playCardFlip();
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + words.length) % words.length);
  };

  const handleFlip = () => {
    sound.playCardFlip();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playTap();
    sound.speak(currentWord.en);
  };

  const handleSpeakSlow = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playTap();
    sound.speakSlow(currentWord.en);
  };

  const handleMasteredClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMastered) {
      sound.playStar();
    } else {
      sound.playTap();
    }
    onToggleMastered(currentWord.id);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Controls: Progress counter, Auto-play, Jump grid */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
            Từ {currentIndex + 1} / {words.length}
          </span>
          {isMastered && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Check className="w-3.5 h-3.5" /> Đã thuộc
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Slideshow button */}
          <button
            id="autoplay-btn"
            onClick={() => {
              sound.playTap();
              setIsAutoPlaying(!isAutoPlaying);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Tự động phát thẻ cho bé xem"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? 'Tạm dừng' : 'Tự động chạy'}</span>
          </button>

          {/* Quick list view toggle */}
          <button
            id="grid-view-btn"
            onClick={() => {
              sound.playTap();
              setShowGrid(!showGrid);
            }}
            className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Danh sách từ trong chủ đề"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div className="perspective-1000 w-full min-h-[360px] sm:min-h-[400px]">
        <div
          id="active-flashcard"
          onClick={handleFlip}
          className={`relative w-full h-full min-h-[360px] sm:min-h-[400px] rounded-3xl transition-transform duration-500 transform-style-preserve-3d cursor-pointer shadow-lg hover:shadow-xl border-4 ${
            isMastered ? 'border-emerald-300' : 'border-amber-200'
          } ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* ================= CARD FRONT ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-linear-to-b from-white to-amber-50/50 p-6 sm:p-8 flex flex-col justify-between items-center text-center select-none">
            {/* Top Category Badge */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                {topic.nameVi} • {topic.icon}
              </span>
              <button
                id="toggle-mastered-front-btn"
                onClick={handleMasteredClick}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-transform active:scale-95 cursor-pointer ${
                  isMastered
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-amber-100 text-slate-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isMastered ? 'Đã thuộc (+2⭐)' : 'Chưa thuộc'}</span>
              </button>
            </div>

            {/* Big Emoji Illustration */}
            <div className="my-auto py-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-white shadow-md border-2 border-amber-100 flex items-center justify-center text-6xl sm:text-7xl group-hover:scale-105 transition-transform">
                {currentWord.emoji}
              </div>

              {/* English Word */}
              <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mt-4 tracking-tight">
                {currentWord.en}
              </h2>

              {/* Syllable Breakdown and Phonetics */}
              <div className="flex items-center justify-center gap-2 mt-1">
                {currentWord.syllables && (
                  <span className="text-xs sm:text-sm font-bold text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-lg">
                    {currentWord.syllables}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-semibold text-slate-500 font-mono">
                  {currentWord.ipa}
                </span>
              </div>

              {/* Vietnamese Reading Hint for Kids */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-xs font-bold text-amber-950">
                <span>🗣️ Đọc là:</span>
                <span className="font-extrabold text-amber-900">
                  &ldquo;{getWordPhonetic(currentWord.en).readVi}&rdquo;
                </span>
              </div>
            </div>

            {/* Audio Buttons & Flip Hint */}
            <div className="w-full">
              <div className="flex items-center justify-center gap-3 mb-2">
                <button
                  id="speak-normal-btn"
                  onClick={handleSpeak}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Phát âm chuẩn</span>
                </button>

                <button
                  id="speak-slow-btn"
                  onClick={handleSpeakSlow}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-sm transition-all active:scale-95 cursor-pointer"
                  title="Nghe phát âm chậm từng âm tiết"
                >
                  <Snail className="w-4 h-4" />
                  <span>Rùa đọc chậm</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                👉 Nhấn vào thẻ để xem nghĩa & ví dụ
              </p>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-linear-to-b from-amber-50 to-orange-50/50 p-6 sm:p-8 flex flex-col justify-between text-left select-none">
            {/* Header */}
            <div className="flex items-center justify-between w-full border-b border-amber-200/60 pb-2.5">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wide">
                Ý nghĩa từ vựng
              </span>
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-xl bg-white shadow-2xs text-amber-700 hover:bg-amber-100 transition-colors"
                title="Nghe lại"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="my-auto space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-0.5">Tiếng Anh:</span>
                <p className="text-2xl font-black text-slate-900 font-heading">
                  {currentWord.en} <span className="text-base text-slate-500 font-mono font-normal">[{currentWord.ipa}]</span>
                </p>
                <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                  <span>🗣️ Cách đọc:</span>
                  <span className="font-extrabold text-amber-950">&ldquo;{getWordPhonetic(currentWord.en).readVi}&rdquo;</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
                <span className="text-[11px] font-bold text-amber-700 uppercase block mb-1">Nghĩa tiếng Việt:</span>
                <p className="text-xl font-extrabold text-amber-900">
                  {currentWord.vi}
                </p>
              </div>

              {currentWord.exampleEn && (
                <div className="bg-white/80 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Mẫu câu cho {childName}:</span>
                  <p className="text-sm font-bold text-slate-800">
                    "{currentWord.exampleEn}"
                  </p>
                  <p className="text-xs font-medium text-slate-500 italic mt-0.5">
                    "{personalizeText(currentWord.exampleVi, childName)}"
                  </p>
                </div>
              )}

              {currentWord.hint && (
                <div className="flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-100/60 px-3 py-2 rounded-xl">
                  <span>💡</span>
                  <span><strong>Gợi ý:</strong> {currentWord.hint}</span>
                </div>
              )}
            </div>

            {/* Bottom hint */}
            <p className="text-center text-[11px] text-slate-400 font-medium pt-2 border-t border-amber-200/60">
              👉 Nhấn vào thẻ để quay lại mặt trước
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3 mt-5">
        <button
          id="prev-word-btn"
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-bold text-sm shadow-2xs hover:bg-amber-50/50 transition-all active:scale-98 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Từ trước</span>
        </button>

        <button
          id="flip-card-btn"
          onClick={handleFlip}
          className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-all active:scale-95 cursor-pointer"
          title="Lật thẻ"
        >
          <RotateCw className="w-5 h-5" />
        </button>

        <button
          id="next-word-btn"
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <span>Từ tiếp theo</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Word Grid Modal/Drawer */}
      {showGrid && (
        <div className="mt-6 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h4 className="font-extrabold text-sm text-slate-800 font-heading">
              Tất cả từ trong {topic.nameVi} ({words.length} từ)
            </h4>
            <span className="text-xs text-slate-400">Nhấn để xem từ đó</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {words.map((w, idx) => {
              const mastered = progress.masteredWordIds.includes(w.id);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    sound.playTap();
                    setCurrentIndex(idx);
                    setShowGrid(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'border-amber-500 bg-amber-100 font-bold text-amber-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-lg">{w.emoji}</span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate">{w.en}</p>
                    <p className="text-[10px] text-slate-400 truncate">{w.vi}</p>
                  </div>
                  {mastered && <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
