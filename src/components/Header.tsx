import React, { useState } from 'react';
import {
  Volume2, VolumeX, Sparkles, Flame, BookOpen, PenTool, Gamepad2,
  Award, BarChart3, ChevronDown, MessageSquare, ShieldCheck, LogIn,
  UserPlus, User, LogOut, ChevronRight
} from 'lucide-react';
import { LearningMode, Topic, UserProgress } from '../types';
import { StudentAccount } from '../types/account';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  currentTopic: Topic;
  onOpenTopicModal: () => void;
  onOpenProfileModal: () => void;
  progress: UserProgress;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentUser: StudentAccount | null;
  pendingApprovalsCount: number;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdminPortal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  currentTopic,
  onOpenTopicModal,
  onOpenProfileModal,
  progress,
  soundEnabled,
  onToggleSound,
  currentUser,
  pendingApprovalsCount,
  onOpenLogin,
  onOpenRegister,
  onOpenAdminPortal,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'flashcards' as LearningMode, label: 'Thẻ Flashcard', icon: BookOpen, color: 'text-amber-600' },
    { id: 'listen-spell' as LearningMode, label: 'Nghe & Viết', icon: PenTool, color: 'text-blue-600' },
    { id: 'speaking' as LearningMode, label: 'Nói Giao Tiếp', icon: MessageSquare, color: 'text-indigo-600' },
    { id: 'games' as LearningMode, label: 'Trò Chơi Vui', icon: Gamepad2, color: 'text-emerald-600' },
    { id: 'test' as LearningMode, label: 'Bài Kiểm Tra', icon: Award, color: 'text-purple-600' },
    { id: 'progress' as LearningMode, label: 'Tiến Độ & Thưởng', icon: BarChart3, color: 'text-rose-600' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        {/* Top bar with Logo, Topic Picker, and Stats */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Logo & Child Greeting */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectMode('flashcards')}>
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-400 to-rose-400 flex items-center justify-center shadow-sm text-2xl">
              {progress.childProfile?.avatar || '👧'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-amber-900 tracking-tight font-heading">BMyC Kids</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playTap();
                    onOpenProfileModal();
                  }}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-black border border-rose-200 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Bấm để xem hồ sơ và tùy chỉnh của bé"
                >
                  <span>{progress.childProfile?.nickname || 'Bé Bảo Nhi'}</span>
                  <span className="text-[10px]">✨</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Góc học tiếng Anh của Bé {progress.childProfile?.name || 'Bảo Nhi'} &bull; 600+ từ vựng
              </p>
            </div>
          </div>

          {/* Current Topic Quick Selector */}
          <button
            id="topic-selector-btn"
            onClick={() => {
              sound.playTap();
              onOpenTopicModal();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-amber-50/60 hover:bg-amber-100/50 transition-colors group cursor-pointer"
          >
            <span className="text-xl">{currentTopic.icon}</span>
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Chủ đề {currentTopic.number}/20</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900 line-clamp-1">
                {currentTopic.nameVi}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-transform" />
          </button>

          {/* Gamification Stats, Admin Portal, User & Sound toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* ADMIN QUICK ACCESS BUTTON */}
            <button
              id="admin-portal-btn"
              type="button"
              onClick={() => {
                sound.playTap();
                onOpenAdminPortal();
              }}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Mở Bảng Điều Khiển Admin & Duyệt Học Sinh"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Quản Trị</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse shadow-xs">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* Stars */}
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-amber-100/80 text-amber-900 font-extrabold text-xs sm:text-sm border border-amber-200 shadow-2xs">
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-500 fill-amber-400" />
              <span>{progress.stars}</span>
            </div>

            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-100/80 text-orange-900 font-extrabold text-xs sm:text-sm border border-orange-200 shadow-2xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
              <span>{progress.streakDays}d</span>
            </div>

            {/* Audio Toggle */}
            <button
              id="toggle-sound-btn"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title={soundEnabled ? 'Âm thanh đang Bật' : 'Âm thanh đang Tắt'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* USER ACCOUNT DROPDOWN / BUTTON */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-linear-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-rose-200 text-rose-900 font-extrabold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span className="text-sm">
                  {currentUser ? currentUser.avatar : progress.childProfile?.avatar || '👧'}
                </span>
                <span className="max-w-[70px] sm:max-w-[100px] truncate text-[11px] sm:text-xs">
                  {currentUser ? currentUser.nickname || currentUser.fullName : progress.childProfile?.name || 'Bảo Nhi'}
                </span>
                <ChevronDown className="w-3 h-3 text-rose-400" />
              </button>

              {/* Account Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-slate-100 bg-amber-50/50 rounded-xl mb-1">
                    <div className="font-extrabold text-slate-900 truncate">
                      {currentUser ? currentUser.fullName : 'Bé Bảo Nhi'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      @{currentUser ? currentUser.username : 'baonhi'} &bull;{' '}
                      <span className="font-bold text-amber-800">
                        {currentUser?.role === 'admin' ? 'Quản Trị Viên 👑' : 'Học Sinh ⭐'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hồ Sơ Của Bé</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đăng Ký Học Sinh Mới</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đổi Tài Khoản / Đăng Nhập</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenAdminPortal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Bảng Quản Trị Admin</span>
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center justify-between sm:justify-center gap-1 sm:gap-2 mt-2 pt-1 border-t border-slate-100 overflow-x-auto scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  sound.playTap();
                  onSelectMode(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs scale-102'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
