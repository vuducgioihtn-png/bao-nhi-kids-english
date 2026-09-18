import React, { useState } from 'react';
import { X, LogIn, KeyRound, ShieldAlert, Sparkles, User, UserPlus } from 'lucide-react';
import { loginUser } from '../../utils/accountStorage';
import { StudentAccount } from '../../types/account';
import { sound } from '../../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (account: StudentAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginUser(username, password);
    if (!res.success) {
      sound.playWrong();
      setErrorMessage(res.message);
      return;
    }

    sound.playCorrect();
    if (res.account) {
      onLoginSuccess(res.account);
    }
    onClose();
  };

  const handleQuickLogin = (uname: string, pword: string) => {
    setUsername(uname);
    setPassword(pword);
    const res = loginUser(uname, pword);
    if (res.success && res.account) {
      sound.playCorrect();
      onLoginSuccess(res.account);
      onClose();
    } else {
      sound.playWrong();
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-300 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close button */}
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

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl shadow-sm">
            🔑
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
              Đăng Nhập Học Tập
            </h3>
            <p className="text-xs text-slate-500">
              Dành cho Học sinh & Ban Quản Trị Hệ thống
            </p>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2 animate-in shake">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ví dụ: baonhi hoặc admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập Ngay</span>
          </button>
        </form>

        {/* Quick Demo Logins for Teachers and Parents */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Đăng nhập nhanh mẫu:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 font-bold flex flex-col items-start transition-colors text-left cursor-pointer"
            >
              <span className="text-xs flex items-center gap-1">
                <span>👑</span> <strong>Admin (Quản trị)</strong>
              </span>
              <span className="text-[10px] text-amber-700">admin / admin123</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('baonhi', '123456')}
              className="p-2.5 rounded-xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100/80 text-rose-950 font-bold flex flex-col items-start transition-colors text-left cursor-pointer"
            >
              <span className="text-xs flex items-center gap-1">
                <span>👧</span> <strong>Bé Bảo Nhi (Đã duyệt)</strong>
              </span>
              <span className="text-[10px] text-rose-700">baonhi / 123456</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleQuickLogin('minhanh', '123456')}
            className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <span>⏳</span> <strong>Bé Minh Anh (Chờ Admin duyệt)</strong>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">minhanh / 123456</span>
          </button>
        </div>

        {/* Switch to Register */}
        <div className="mt-4 text-center text-xs text-slate-600">
          Chưa có tài khoản học sinh?{' '}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onSwitchToRegister();
            }}
            className="font-bold text-amber-700 hover:text-amber-900 underline inline-flex items-center gap-1 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng ký tài khoản mới</span>
          </button>
        </div>
      </div>
    </div>
  );
};
