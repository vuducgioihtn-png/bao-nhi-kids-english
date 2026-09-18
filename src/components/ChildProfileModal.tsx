import React, { useState } from 'react';
import { X, Sparkles, Trophy, Star, Flame, Volume2, Check, Heart, Edit3 } from 'lucide-react';
import { ChildProfile, UserProgress } from '../types';
import { sound } from '../utils/audio';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProfile: (profile: Partial<ChildProfile>) => void;
}

const AVATAR_OPTIONS = [
  { emoji: '👧', label: 'Bé Gái Đáng Yêu' },
  { emoji: '👑', label: 'Công Chúa Nhí' },
  { emoji: '🌸', label: 'Bông Hoa Xinh' },
  { emoji: '🦄', label: 'Kỳ Lân Phép Thuật' },
  { emoji: '🐱', label: 'Mèo Con Dễ Thương' },
  { emoji: '🐰', label: 'Bé Thỏ Thông Minh' },
  { emoji: '🧚‍♀️', label: 'Nàng Tiên Tí Hon' },
  { emoji: '🎀', label: 'Nơ Hồng Xinh Xắn' },
  { emoji: '🐼', label: 'Gấu Trúc Dễ Thương' },
  { emoji: '🍓', label: 'Dâu Tây Ngọt Ngào' },
  { emoji: '🌈', label: 'Cầu Vồng Rực Rỡ' },
  { emoji: '⭐', label: 'Ngôi Sao Sáng' },
];

const TITLE_OPTIONS = [
  'Ngôi Sao Nhí BMyC ⭐',
  'Bé Ngoan Chăm Chỉ 🌸',
  'Bậc Thầy Phát Âm 🎤',
  'Nhà Thám Hiểm Từ Vựng 🧭',
  'Công Chúa Tiếng Anh 👑',
];

const GRADE_OPTIONS = [
  'Mầm Non (Chuẩn bị vào Lớp 1)',
  'Lớp 1 (Khởi động)',
  'Lớp 2 (Khám phá)',
  'Lớp 3 (Giao tiếp)',
  'Lớp 4 (Bứt phá)',
  'Lớp 5 (Chinh phục Master)',
  'Tiểu Học (Lớp 1 - 5)',
];

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProfile,
}) => {
  const profile = progress.childProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name || 'Bảo Nhi');
  const [nickname, setNickname] = useState(profile.nickname || 'Bé Bảo Nhi');
  const [avatar, setAvatar] = useState(profile.avatar || '👧');
  const [title, setTitle] = useState(profile.title || 'Ngôi Sao Nhí BMyC ⭐');
  const [grade, setGrade] = useState(profile.grade || 'Lớp 1 (Khởi động)');

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playCorrect();
    onUpdateProfile({
      name: name.trim() || 'Bảo Nhi',
      nickname: nickname.trim() || 'Bé Bảo Nhi',
      avatar,
      title,
      grade,
    });
    setIsEditing(false);
  };

  const handleCheer = () => {
    sound.playFanfare();
    // Speak custom cheer message
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Hello ${name}! You are doing fantastic! Chúc ${nickname} học tiếng Anh thật giỏi và luôn vui vẻ nhé!`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.9;
      utter.pitch = 1.15;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border-2 border-rose-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Card */}
        <div className="bg-linear-to-r from-rose-400 via-pink-400 to-amber-300 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-18 h-18 rounded-3xl bg-white/30 backdrop-blur-md flex items-center justify-center text-5xl shadow-inner border-2 border-white/50">
                {avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full text-xs shadow-2xs border border-white">
                👑
              </span>
            </div>

            <div className="min-w-0 pr-8">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-100 bg-black/15 px-2 py-0.5 rounded-full inline-block mb-1">
                Hồ Sơ Học Viên Nhí
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading truncate drop-shadow-xs">
                {nickname}
              </h2>
              <p className="text-xs text-rose-50 font-semibold truncate">
                {title} &bull; {grade}
              </p>
            </div>
          </div>

          {/* Quick Cheerful Encouragement Voice Button */}
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
            <button
              onClick={handleCheer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-black text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Nghe Lời Động Viên Tặng {name}!</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setIsEditing(prev => !prev);
              }}
              className="flex items-center gap-1 text-xs font-bold text-white bg-black/15 hover:bg-black/25 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Hủy Sửa' : 'Chỉnh Sửa'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Achievement Summary Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-center gap-1 text-amber-600 mb-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-xs font-black">Ngôi Sao</span>
              </div>
              <span className="text-xl font-black text-amber-900 font-heading">
                {progress.stars}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-xs font-black">Từ Đã Thuộc</span>
              </div>
              <span className="text-xl font-black text-emerald-900 font-heading">
                {progress.masteredWordIds.length}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200">
              <div className="flex items-center justify-center gap-1 text-orange-600 mb-0.5">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span className="text-xs font-black">Chuỗi Ngày</span>
              </div>
              <span className="text-xl font-black text-orange-900 font-heading">
                {progress.streakDays}d
              </span>
            </div>
          </div>

          {/* EDIT FORM */}
          {isEditing ? (
            <div className="space-y-4 pt-1">
              <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-200">
                <label className="text-xs font-black text-pink-900 block mb-1">
                  Chọn Hình Đại Diện Yêu Thích Của {name}:
                </label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {AVATAR_OPTIONS.map(opt => (
                    <button
                      key={opt.emoji}
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setAvatar(opt.emoji);
                      }}
                      title={opt.label}
                      className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
                        avatar === opt.emoji
                          ? 'bg-rose-500 text-white shadow-md scale-110 ring-2 ring-rose-300'
                          : 'bg-white hover:bg-rose-100/50 border border-slate-200'
                      }`}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Tên của bé:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Bảo Nhi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Cách gọi thân mật:
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="Bé Bảo Nhi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Danh hiệu vinh danh:
                </label>
                <select
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-rose-400"
                >
                  {TITLE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Khối Lớp Học Tập:
                </label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-rose-400"
                >
                  {GRADE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Hồ Sơ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            /* VIEW MODE */
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-linear-to-r from-rose-50 to-pink-50 border border-rose-100 text-center">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-400 mx-auto mb-1.5" />
                <h4 className="text-sm font-black text-rose-900">
                  Lời Nhắn Gửi Tới Bé {name}:
                </h4>
                <p className="text-xs text-rose-700 font-medium mt-1 leading-relaxed">
                  &ldquo;Mỗi ngày học cùng BMyC là một ngày {name} thêm tự tin và tỏa sáng! Hãy kiên trì luyện tập nhé công chúa nhỏ!&rdquo;
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Tên gọi thân thương:</span>
                  <span className="font-black text-slate-800">{nickname}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Danh hiệu thi đua:</span>
                  <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                    {title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Cấp độ học tập:</span>
                  <span className="font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                    {grade}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Tiếp Tục Học Nào! 🚀
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
