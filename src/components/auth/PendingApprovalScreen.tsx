import React from 'react';
import { Clock, RefreshCw, LogOut, ShieldCheck, Phone, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { StudentAccount } from '../../types/account';
import { getAllAccounts, setActiveUser } from '../../utils/accountStorage';
import { sound } from '../../utils/audio';

interface PendingApprovalScreenProps {
  account: StudentAccount;
  onRefreshUser: (updatedAccount: StudentAccount | null) => void;
  onOpenAdminLogin: () => void;
  onLogout: () => void;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  account,
  onRefreshUser,
  onOpenAdminLogin,
  onLogout,
}) => {
  const handleCheckStatus = () => {
    sound.playTap();
    const all = getAllAccounts();
    const fresh = all.find((a) => a.id === account.id);
    if (fresh) {
      setActiveUser(fresh);
      onRefreshUser(fresh);
      if (fresh.status === 'approved') {
        sound.playFanfare();
      }
    }
  };

  const isPending = account.status === 'pending';
  const isRejected = account.status === 'rejected';
  const isLocked = account.status === 'locked';

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-amber-300 text-center space-y-6">
        {/* Avatar & Icon */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-5xl shadow-md border-4 border-white">
            {account.avatar || '👧'}
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
            {isPending && <Clock className="w-5 h-5 animate-pulse" />}
            {isRejected && <AlertCircle className="w-5 h-5 text-white" />}
            {isLocked && <AlertCircle className="w-5 h-5 text-white" />}
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            Xin chào {account.nickname || account.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tên đăng nhập: <strong className="font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">{account.username}</strong>
          </p>

          <div className="pt-2">
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Trạng Thái: Đang Chờ Ban Quản Trị Duyệt</span>
              </span>
            )}

            {isRejected && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Trạng Thái: Chưa Được Duyệt ({account.rejectReason || 'Thông tin cần xác minh lại'})</span>
              </span>
            )}

            {isLocked && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Trạng Thái: Tài Khoản Đang Bị Tạm Khóa</span>
              </span>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200/80 text-left text-xs sm:text-sm space-y-2.5 text-slate-700">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm pb-1 border-b border-amber-200/60">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Thông tin đăng ký vào học:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block">Học sinh:</span>
              <span className="font-bold text-slate-900">{account.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Độ tuổi / Lớp:</span>
              <span className="font-bold text-slate-900">{account.grade}</span>
            </div>
            <div>
              <span className="text-slate-400 block">SĐT Phụ huynh:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-600" />
                {account.parentPhone || 'Chưa cập nhật'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Thời gian đăng ký:</span>
              <span className="font-bold text-slate-900">
                {new Date(account.registeredAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-amber-950 pt-2 bg-amber-100/60 p-2.5 rounded-xl">
            💡 <strong>Dành cho phụ huynh:</strong> Thầy cô quản trị viên sẽ xem xét danh sách và bấm nút <em>&ldquo;Duyệt Vào Học&rdquo;</em> trong bảng điều khiển Admin. Sau khi được duyệt, bé sẽ được mở khóa toàn bộ 1000+ từ vựng, 500 bài đọc và game vui nhộn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={handleCheckStatus}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Kiểm Tra Lại Trạng Thái Duyệt</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onOpenAdminLogin();
              }}
              className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs border border-indigo-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              title="Đăng nhập tài khoản Quản trị viên để duyệt tài khoản này ngay lập tức"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Dành Cho Admin: Vào Duyệt Ngay 👑</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onLogout();
              }}
              className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất / Tài Khoản Khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
