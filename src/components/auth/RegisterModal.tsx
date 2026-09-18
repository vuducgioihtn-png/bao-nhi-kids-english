import React, { useState } from 'react';
import {
  X, UserPlus, Sparkles, CheckCircle2, ShieldAlert,
  Phone, User, Lock, Heart, GraduationCap, ArrowRight
} from 'lucide-react';
import { RegisterFormData } from '../../types/account';
import { registerStudent } from '../../utils/accountStorage';
import { sound } from '../../utils/audio';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess?: (username: string) => void;
}

const AVATAR_OPTIONS = ['👧', '👦', '🐱', '🐰', '🦊', '🐻', '🐼', '🦁', '🦄', '🦖', '⭐', '🌈'];

const GRADE_OPTIONS = [
  'Mầm non (3 - 5 tuổi)',
  'Tiền tiểu học (5 - 6 tuổi)',
  'Lớp 1 (6 - 7 tuổi)',
  'Lớp 2 (7 - 8 tuổi)',
  'Lớp 3 (8 - 9 tuổi)',
  'Lớp 4 (9 - 10 tuổi)',
  'Lớp 5 (10 - 11 tuổi)',
];

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegisterSuccess,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    nickname: '',
    grade: GRADE_OPTIONS[1],
    parentPhone: '',
    parentName: '',
    avatar: '👧',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = registerStudent(formData);
    if (!res.success) {
      sound.playWrong();
      setErrorMessage(res.message);
      return;
    }

    sound.playCorrect();
    setIsSuccess(true);
    setRegisteredUsername(res.account?.username || formData.username);

    if (onRegisterSuccess) {
      onRegisterSuccess(res.account?.username || formData.username);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-300 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-2xl shadow-sm">
                📝
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  Đăng Ký Tài Khoản Học Sinh
                </h3>
                <p className="text-xs text-slate-500">
                  Tài khoản mới sẽ được Ban Quản Trị duyệt trước khi vào học
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2 animate-in shake">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Avatar Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Chọn biểu tượng avatar yêu thích cho bé:
                </label>
                <div className="flex flex-wrap gap-2 py-1">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setFormData({ ...formData, avatar: emoji });
                      }}
                      className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                        formData.avatar === emoji
                          ? 'bg-amber-100 border-2 border-amber-500 scale-110 shadow-xs'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Nickname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Họ và tên học sinh <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Bảo Nhi"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tên gọi ở nhà (Nickname)
                  </label>
                  <div className="relative">
                    <Heart className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Bé Bảo Nhi, Bông..."
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tên đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="baonhi2026"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Viết liền, không dấu (ví dụ: baonhi)</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Độ tuổi / Lớp học
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium bg-white"
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Ít nhất 4 ký tự"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nhập lại mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Parent Phone & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Số điện thoại phụ huynh <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="0987654321"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Dùng để Admin xác nhận phê duyệt</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tên phụ huynh (Bố/Mẹ)
                  </label>
                  <input
                    type="text"
                    placeholder="Mẹ Lan, Bố Tuấn..."
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Gửi Đăng Ký Vào Lớp Học</span>
                </button>
              </div>

              {/* Switch to Login */}
              <div className="text-center pt-1 text-xs text-slate-500">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onSwitchToLogin();
                  }}
                  className="font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                >
                  Đăng nhập tại đây
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto shadow-xs border-2 border-amber-300">
              ⏳
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Đăng Ký Thành Công!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                Tài khoản <strong>&ldquo;{registeredUsername}&rdquo;</strong> đã được gửi lên hệ thống và đang ở trạng thái <strong>&ldquo;Chờ Admin Duyệt&rdquo;</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-1.5 text-amber-950">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Quy trình vào học:</span>
              </div>
              <p>1. Ban Quản Trị / Thầy Cô sẽ kiểm tra và bấm <strong>&ldquo;Duyệt Vào Học&rdquo;</strong>.</p>
              <p>2. Phụ huynh có thể báo thầy cô duyệt qua SĐT đăng ký <strong>{formData.parentPhone}</strong>.</p>
              <p>3. Sau khi được duyệt, bé chỉ cần đăng nhập là có thể học và lưu sao bình thường!</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onSwitchToLogin();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Chuyển Sang Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
