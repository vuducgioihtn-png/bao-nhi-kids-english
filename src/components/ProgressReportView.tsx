import React, { useState } from 'react';
import { Award, Flame, Sparkles, CheckCircle2, TrendingUp, BookOpen, Volume2, ArrowRight, Printer, Heart, Edit3 } from 'lucide-react';
import { UserProgress, Topic } from '../types';
import { TOPICS } from '../data/topics';
import { VOCABULARY, getWordsByTopic } from '../data/vocabulary';
import { ALL_STICKERS } from '../utils/storage';
import { sound } from '../utils/audio';
import { CertificateModal } from './CertificateModal';

interface ProgressReportViewProps {
  progress: UserProgress;
  onSelectTopic: (topic: Topic) => void;
  onNavigateToFlashcards: () => void;
  onOpenProfileModal?: () => void;
}

export const ProgressReportView: React.FC<ProgressReportViewProps> = ({
  progress,
  onSelectTopic,
  onNavigateToFlashcards,
  onOpenProfileModal,
}) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const totalWords = VOCABULARY.length;
  const masteredCount = progress.masteredWordIds.length;
  const overallPercent = Math.round((masteredCount / totalWords) * 100);

  const profile = progress.childProfile;
  const childName = profile?.name || 'Bảo Nhi';
  const childNickname = profile?.nickname || 'Bé Bảo Nhi';
  const childAvatar = profile?.avatar || '👧';
  const childTitle = profile?.title || 'Ngôi Sao Nhí BMyC ⭐';

  // Check stickers dynamically
  const stickers = ALL_STICKERS.map(s => {
    let unlocked = progress.unlockedStickers.includes(s.id);

    if (s.id === 'first-steps' && masteredCount >= 5) unlocked = true;
    if (s.id === 'vocab-collector' && masteredCount >= 30) unlocked = true;
    if (s.id === 'dino-genius' && masteredCount >= 60) unlocked = true;
    if (s.id === 'rainbow-master' && progress.stars >= 100) unlocked = true;
    if (s.id === 'perfect-quiz' && progress.testHistory.some(t => t.percentage === 100)) unlocked = true;

    return {
      ...s,
      unlocked,
    };
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Overview Card */}
      <div className="bg-linear-to-r from-rose-400 via-pink-400 to-amber-400 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl shadow-inner border-2 border-white/30">
              {childAvatar}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                <span className="text-xs font-black uppercase tracking-wider text-rose-100 bg-black/15 px-2.5 py-0.5 rounded-full">
                  Bảng Vàng &bull; {childNickname}
                </span>
                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      sound.playTap();
                      onOpenProfileModal();
                    }}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                    title="Chỉnh sửa thông tin bé"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight drop-shadow-xs">
                {masteredCount} / {totalWords} Từ Đã Thuộc
              </h2>
              <p className="text-xs text-rose-100 font-semibold mt-0.5">
                {childName} đã chinh phục được {overallPercent}% kho từ vựng BMyC!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 text-center">
              <span className="text-[10px] uppercase font-black text-rose-100 block">Ngôi Sao</span>
              <span className="text-xl font-black flex items-center justify-center gap-1">
                ⭐ {progress.stars}
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 text-center">
              <span className="text-[10px] uppercase font-black text-rose-100 block">Chuỗi Ngày</span>
              <span className="text-xl font-black flex items-center justify-center gap-1">
                🔥 {progress.streakDays}d
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 pt-4 border-t border-white/20">
          <div className="w-full h-3 rounded-full bg-black/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-700 shadow-sm"
              style={{ width: `${Math.max(4, overallPercent)}%` }}
            />
          </div>
        </div>

        {/* Quick Certificate & Trophy Action Bar */}
        <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-white font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Danh hiệu: {childTitle}</span>
          </div>

          <button
            onClick={() => {
              sound.playFanfare();
              setIsCertificateOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-black text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Award className="w-4 h-4 text-rose-500" />
            <span>Xem & In Bằng Khen Dành Cho {childName} 🎓</span>
          </button>
        </div>
      </div>

      {/* ================= STICKERS & BADGES SHOWCASE ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-base sm:text-lg text-slate-800 font-heading">
              Bộ Sưu Tập Huy Hiệu Của {childNickname}
            </h3>
          </div>
          <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {stickers.filter(s => s.unlocked).length}/{stickers.length} Đã mở
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stickers.map(sticker => (
            <div
              key={sticker.id}
              className={`p-3 rounded-2xl border text-center transition-all ${
                sticker.unlocked
                  ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-40 grayscale'
              }`}
            >
              <span className="text-3xl sm:text-4xl block mb-1">
                {sticker.unlocked ? sticker.icon : '🔒'}
              </span>
              <h4 className="font-black text-xs text-slate-800 line-clamp-1">{sticker.name}</h4>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-0.5">
                {sticker.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TOPIC BREAKDOWN (20 TOPICS) ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-black text-base sm:text-lg text-slate-800 font-heading">
              Tiến Độ Theo 20 Chủ Đề
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Bấm vào để học chủ đề</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {TOPICS.map(topic => {
            const words = getWordsByTopic(topic.id);
            const mastered = words.filter(w => progress.masteredWordIds.includes(w.id)).length;
            const pct = words.length > 0 ? Math.round((mastered / words.length) * 100) : 0;

            return (
              <button
                key={topic.id}
                onClick={() => {
                  sound.playTap();
                  onSelectTopic(topic);
                  onNavigateToFlashcards();
                }}
                className="p-3 rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                      {topic.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 group-hover:text-amber-900">
                        {topic.nameVi}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">{topic.nameEn}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-black ${pct === 100 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {mastered}/{words.length}
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct === 100 ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TEST HISTORY ================= */}
      {progress.testHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <h3 className="font-black text-base sm:text-lg text-slate-800 font-heading mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <span>Lịch Sử Bài Kiểm Tra Gần Đây</span>
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {progress.testHistory.map(test => (
              <div
                key={test.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-extrabold text-slate-800 block">{test.topicName}</span>
                  <span className="text-[10px] text-slate-400">{test.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-600">
                    {test.score}/{test.totalQuestions} đúng
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                      test.percentage >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : test.percentage >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {test.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Certificate Modal for Child */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        progress={progress}
        totalWords={totalWords}
      />
    </div>
  );
};
