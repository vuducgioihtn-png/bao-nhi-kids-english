import React from 'react';
import { X, Printer, Sparkles, Award, Star, Heart } from 'lucide-react';
import { UserProgress } from '../types';
import { sound } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  totalWords: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  totalWords,
}) => {
  if (!isOpen) return null;

  const profile = progress.childProfile;
  const name = profile?.name || 'Bảo Nhi';
  const nickname = profile?.nickname || 'Bé Bảo Nhi';
  const avatar = profile?.avatar || '👧';
  const title = profile?.title || 'Ngôi Sao Nhí BMyC ⭐';
  const masteredCount = progress.masteredWordIds.length;
  const dateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Action Header */}
        <div className="bg-slate-900 text-white p-3.5 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm font-heading">
              Bằng Khen Danh Dự &bull; {nickname}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Bằng Khen</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-amber-50/40 print:p-0 print:bg-white print:m-0">
          <div className="bg-linear-to-b from-amber-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border-8 border-double border-amber-300 shadow-lg text-center relative overflow-hidden print:border-amber-400 print:shadow-none">
            {/* Top Ribbon & Icon */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">✨</span>
              <span className="text-xs font-black tracking-widest uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                BMyC Kids English Award
              </span>
              <span className="text-2xl">✨</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight font-heading mt-2">
              GIẤY CHỨNG NHẬN DANH DỰ
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-amber-600 font-bold mt-0.5">
              Certificate of Academic Excellence
            </p>

            <p className="text-xs text-slate-500 font-medium mt-4">
              Hệ thống Anh ngữ Thiếu Nhi BMyC trân trọng trao tặng chứng chỉ cho:
            </p>

            {/* Recipient Name Highlight */}
            <div className="my-4 py-2">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-linear-to-r from-rose-50 via-amber-50 to-pink-50 border-2 border-rose-300 shadow-xs">
                <span className="text-3xl">{avatar}</span>
                <span className="text-2xl sm:text-3xl font-black font-heading text-rose-600 tracking-wide">
                  {name.toUpperCase()}
                </span>
                <span className="text-2xl">👑</span>
              </div>
              <p className="text-xs font-bold text-amber-800 mt-1">
                {title} &bull; {profile?.grade || 'Tiểu Học'}
              </p>
            </div>

            {/* Praise Description */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed italic">
              &ldquo;Đã có thành tích học tập vượt trội, luôn chăm chỉ rèn luyện kỹ năng nghe, phát âm chuẩn và tự tin chinh phục kho từ vựng tiếng Anh theo chuẩn BMyC.&rdquo;
            </p>

            {/* Metrics Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto my-5">
              <div className="p-2.5 rounded-2xl bg-white border border-amber-200 shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-[11px] font-black">Ngôi Sao</span>
                </div>
                <span className="text-lg font-black text-amber-900 font-heading">
                  {progress.stars} ⭐
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black">Từ Đã Thuộc</span>
                </div>
                <span className="text-lg font-black text-emerald-900 font-heading">
                  {masteredCount}/{totalWords}
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-orange-200 shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-orange-600 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-black">Bền Bỉ</span>
                </div>
                <span className="text-lg font-black text-orange-900 font-heading">
                  {progress.streakDays} Ngày
                </span>
              </div>
            </div>

            {/* Bottom Footer with Date and Seal */}
            <div className="mt-6 pt-4 border-t border-amber-200/80 flex items-center justify-between px-4 sm:px-8 text-left">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Ngày Cấp Chứng Nhận:</span>
                <span className="text-xs font-black text-slate-700">{dateStr}</span>
              </div>

              {/* Gold Seal Graphic */}
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 flex flex-col items-center justify-center shadow-md text-amber-950">
                <span className="text-xs">⭐</span>
                <span className="text-[8px] font-black uppercase tracking-tighter text-center leading-none">
                  BMyC Kids<br />Official
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">Chương Trình Đào Tạo:</span>
                <span className="text-xs font-black text-amber-900">BMyC English Kids</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
