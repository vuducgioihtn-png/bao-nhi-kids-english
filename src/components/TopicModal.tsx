import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Topic, UserProgress } from '../types';
import { TOPICS } from '../data/topics';
import { getWordsByTopic } from '../data/vocabulary';
import { sound } from '../utils/audio';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopicId: string;
  onSelectTopic: (topic: Topic) => void;
  progress: UserProgress;
}

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onClose,
  currentTopicId,
  onSelectTopic,
  progress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-linear-to-r from-amber-400 to-orange-400 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight">Chọn Chủ Đề Học Cho Bé</h2>
              <p className="text-xs text-amber-100 font-medium">Tổng hợp 35 chủ đề BMyC mở rộng (1000+ từ vựng)</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Topics Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {TOPICS.map(topic => {
            const words = getWordsByTopic(topic.id);
            const totalWords = words.length;
            const masteredCount = words.filter(w => progress.masteredWordIds.includes(w.id)).length;
            const progressPercent = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;
            const isSelected = topic.id === currentTopicId;

            return (
              <button
                key={topic.id}
                id={`topic-item-${topic.id}`}
                onClick={() => {
                  sound.playTap();
                  onSelectTopic(topic);
                  onClose();
                }}
                className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/40 shadow-sm'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1.5 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">
                      {topic.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                        Chủ đề {topic.number}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">
                        {topic.nameVi}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">{topic.nameEn}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-100 shrink-0" />
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>{masteredCount}/{totalWords} từ đã thuộc</span>
                    <span className={progressPercent === 100 ? 'text-emerald-600' : 'text-amber-600'}>
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progressPercent === 100 ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          Mẹo: Chọn chủ đề bé thích nhất trước để tạo niềm hứng khởi học tập! ✨
        </div>
      </div>
    </div>
  );
};
