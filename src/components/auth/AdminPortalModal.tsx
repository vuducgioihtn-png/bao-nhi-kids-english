import React, { useState, useId } from 'react';
import {
  X, CheckCircle, XCircle, ShieldCheck, Lock, Unlock, Trash2,
  Download, Upload, Copy, Check, Search, Plus, Sparkles,
  Phone, UserCheck, AlertTriangle, GitFork, RefreshCw, FileText
} from 'lucide-react';
import { StudentAccount } from '../../types/account';
import {
  getAllAccounts,
  approveAccount,
  rejectAccount,
  toggleLockAccount,
  deleteAccount,
  adminCreateStudent,
  exportDatabaseToJson,
  importDatabaseFromJson,
  generateGitHubSeedCode,
  setActiveUser,
} from '../../utils/accountStorage';
import { sound } from '../../utils/audio';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentAccount;
  onStudentSelected?: (account: StudentAccount) => void;
  onRefreshData?: () => void;
}

type TabType = 'pending' | 'all' | 'create' | 'github_sync';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onStudentSelected,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [accounts, setAccounts] = useState<StudentAccount[]>(getAllAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'locked'>('all');

  const fileInputId = useId();

  // Create new student state
  const [newFullName, setNewFullName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newPhone, setNewPhone] = useState('');
  const [newGrade, setNewGrade] = useState('Tiền tiểu học (5 - 6 tuổi)');
  const [newAvatar, setNewAvatar] = useState('👧');

  // Copy code feedback state
  const [copiedCode, setCopiedCode] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const refreshList = () => {
    const updated = getAllAccounts();
    setAccounts(updated);
    if (onRefreshData) onRefreshData();
  };

  const pendingAccounts = accounts.filter((a) => a.status === 'pending');

  const handleApprove = (accountId: string, studentName: string) => {
    sound.playFanfare();
    approveAccount(accountId, currentUser.username);
    refreshList();
  };

  const handleReject = (accountId: string) => {
    sound.playWrong();
    const reason = prompt('Nhập lý do từ chối (hoặc để trống):', 'Thông tin đăng ký chưa đầy đủ');
    if (reason !== null) {
      rejectAccount(accountId, reason);
      refreshList();
    }
  };

  const handleToggleLock = (accountId: string) => {
    sound.playTap();
    toggleLockAccount(accountId);
    refreshList();
  };

  const handleDelete = (accountId: string, username: string) => {
    if (accountId === 'acc_admin_01') {
      alert('Không thể xóa tài khoản Quản trị viên gốc!');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}" không? Hành động này không thể hoàn tác.`)) {
      sound.playTap();
      deleteAccount(accountId);
      refreshList();
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newUsername.trim()) {
      alert('Vui lòng nhập họ tên và tên đăng nhập!');
      return;
    }

    sound.playCorrect();
    adminCreateStudent({
      fullName: newFullName,
      nickname: newNickname || newFullName,
      username: newUsername,
      password: newPassword,
      parentPhone: newPhone,
      grade: newGrade,
      avatar: newAvatar,
      stars: 20,
    });

    // Reset
    setNewFullName('');
    setNewNickname('');
    setNewUsername('');
    setNewPhone('');
    refreshList();
    setActiveTab('all');
  };

  // Export JSON backup
  const handleExportJson = () => {
    sound.playTap();
    const jsonStr = exportDatabaseToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bmyc_students_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importDatabaseFromJson(content);
        if (res.success) {
          sound.playFanfare();
          setImportStatus(`✅ ${res.message}`);
          refreshList();
        } else {
          sound.playWrong();
          setImportStatus(`❌ ${res.message}`);
        }
      }
    };
    reader.readAsText(file);
  };

  // Copy seed code for GitHub
  const handleCopyGitHubCode = () => {
    sound.playTap();
    const code = generateGitHubSeedCode();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    });
  };

  // Switch to view as this student
  const handleLoginAsStudent = (acc: StudentAccount) => {
    sound.playCorrect();
    setActiveUser(acc);
    if (onStudentSelected) {
      onStudentSelected(acc);
    }
    onClose();
  };

  // Filtered accounts list
  const filteredAccounts = accounts.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.fullName.toLowerCase().includes(q) ||
      a.username.toLowerCase().includes(q) ||
      (a.parentPhone && a.parentPhone.includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border-2 border-amber-300 relative max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-xs">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Ban Quản Trị &bull; Quản Lý Học Sinh
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Admin: {currentUser.username}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Phê duyệt đăng ký, quản lý học sinh và bảo lưu dữ liệu đồng bộ GitHub vĩnh viễn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 py-3 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('pending');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>⏳ Duyệt Đăng Ký</span>
            {pendingAccounts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[11px] font-black animate-pulse">
                {pendingAccounts.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>👥 Danh Sách ({accounts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('create');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'create'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Học Sinh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('github_sync');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'github_sync'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>💾 Sao Lưu & GitHub Sync</span>
          </button>
        </div>

        {/* Tab Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 no-scrollbar">
          {/* TAB 1: PENDING APPROVALS */}
          {activeTab === 'pending' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Có {pendingAccounts.length} học sinh đang chờ Admin duyệt vào học
                </span>
                <span className="text-[11px] text-slate-500">
                  Duyệt xong học sinh có thể đăng nhập ngay
                </span>
              </div>

              {pendingAccounts.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                    🎉
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">
                    Không có học sinh nào đang chờ duyệt!
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tất cả tài khoản học sinh đăng ký đều đã được phê duyệt.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingAccounts.map((student) => (
                    <div
                      key={student.id}
                      className="p-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50/40 hover:bg-amber-50/80 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                          {student.avatar || '👧'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-extrabold text-sm text-slate-900 truncate">
                              {student.fullName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-200 text-amber-900">
                              Chờ duyệt
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Nickname: <strong>{student.nickname}</strong> &bull; Lớp:{' '}
                            <span className="text-slate-700 font-medium">{student.grade}</span>
                          </p>
                          <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                            Username: <strong>{student.username}</strong> | Pass: <strong>{student.password}</strong>
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            SĐT: <strong className="text-slate-800">{student.parentPhone || 'Chưa có'}</strong>
                            {student.parentName && <span>({student.parentName})</span>}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
                        <button
                          type="button"
                          onClick={() => handleApprove(student.id, student.fullName)}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Duyệt Vào Học ✅</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReject(student.id)}
                          className="py-2 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Từ Chối</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL STUDENTS LIST */}
          {activeTab === 'all' && (
            <div className="space-y-3">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên học sinh, username, số điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs self-start sm:self-auto">
                  {(['all', 'approved', 'pending', 'locked'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStatus(st)}
                      className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                        filterStatus === st
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'all' ? 'Tất cả' : st === 'approved' ? 'Đã duyệt' : st === 'pending' ? 'Chờ duyệt' : 'Bị khóa'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table or Cards */}
              <div className="space-y-2">
                {filteredAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0">
                        {acc.avatar || '👧'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {acc.fullName}
                          </h4>
                          {acc.role === 'admin' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">
                              Admin
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                              acc.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : acc.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : acc.status === 'locked'
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {acc.status === 'approved'
                              ? 'Đã duyệt ✓'
                              : acc.status === 'pending'
                              ? 'Chờ duyệt ⏳'
                              : acc.status === 'locked'
                              ? 'Bị khóa 🔒'
                              : 'Từ chối ❌'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          Username: <strong className="font-mono text-slate-700">{acc.username}</strong> | Pass: <strong className="font-mono text-slate-700">{acc.password}</strong> | Lớp: {acc.grade}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          SĐT: {acc.parentPhone || 'Chưa có'} &bull; Sao: ⭐ {acc.stars || 0}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      {acc.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(acc.id, acc.fullName)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                          title="Duyệt tài khoản này"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Duyệt</span>
                        </button>
                      )}

                      {acc.role !== 'admin' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleLoginAsStudent(acc)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                            title="Đăng nhập thử với tư cách học sinh này"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Vào Học Thử</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleLock(acc.id)}
                            className={`p-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                              acc.status === 'locked'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title={acc.status === 'locked' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            {acc.status === 'locked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>

                          {acc.id !== 'acc_student_baonhi' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(acc.id, acc.username)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE STUDENT DIRECTLY */}
          {activeTab === 'create' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-600" />
                Thêm Nhanh Học Sinh Trực Tiếp (Duyệt Sẵn)
              </h4>

              <form onSubmit={handleCreateStudent} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Họ và tên học sinh *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Gia Bảo"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Tên gọi ở nhà (Nickname)
                    </label>
                    <input
                      type="text"
                      placeholder="Bé Bắp, Bé Sóc..."
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Tên đăng nhập *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="giabao"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mật khẩu khởi tạo
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      SĐT Phụ huynh
                    </label>
                    <input
                      type="tel"
                      placeholder="0987..."
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Tạo & Kích Hoạt Tài Khoản Học Sinh Ngay</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: GITHUB SYNC & PERMANENT PERSISTENCE */}
          {activeTab === 'github_sync' && (
            <div className="space-y-4">
              {/* Highlight Explanatory Box */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
                  <GitFork className="w-4 h-4 text-indigo-600" />
                  <span>Cơ Chế Bảo Lưu Tài Khoản Không Bị Mất Khi Chuyển Sang GitHub</span>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Để đảm bảo <strong>100% tài khoản học sinh không bao giờ bị mất</strong> khi chuyển sang GitHub, đổi tên miền, xuất bản lại (re-publish) hoặc triển khai lên Vercel/GitHub Pages:
                </p>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
                  <li>
                    <strong>Cách 1 (Sao Lưu & Khôi Phục Nhanh):</strong> Tải file <code>bmyc_students_database.json</code> về máy. Bất cứ khi nào xuất bản web mới, chỉ cần bấm &ldquo;Khôi Phục Từ File&rdquo; là toàn bộ tài khoản lập tức xuất hiện trở lại.
                  </li>
                  <li>
                    <strong>Cách 2 (Đồng Bộ Vĩnh Viễn Vào Mã Nguồn GitHub):</strong> Bấm nút <em>&ldquo;Sao Chép Mã Nguồn Seed&rdquo;</em> dưới đây rồi dán vào file <code>src/data/defaultAccounts.ts</code> trước khi git commit. Lúc này dữ liệu học sinh sẽ nằm trực tiếp trong kho mã nguồn GitHub vĩnh viễn!
                  </li>
                </ul>
              </div>

              {/* Status Message */}
              {importStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-in fade-in">
                  {importStatus}
                </div>
              )}

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Export JSON */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-900">
                      <Download className="w-4 h-4 text-amber-600" />
                      <span>1. Tải File Dữ Liệu Học Sinh (JSON)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Tải về máy file sao lưu gồm toàn bộ {accounts.length} tài khoản, số sao và mật khẩu.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải File Sao Lưu (.json)</span>
                  </button>
                </div>

                {/* 2. Import JSON */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-900">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>2. Khôi Phục Dữ Liệu Từ File JSON</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Nạp file sao lưu đã tải trước đó để phục hồi danh sách học sinh trên trang web mới.
                    </p>
                  </div>
                  <label
                    htmlFor={fileInputId}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 text-center"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Chọn File Để Khôi Phục</span>
                  </label>
                  <input
                    id={fileInputId}
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </div>
              </div>

              {/* 3. GitHub Source Code Generator */}
              <div className="p-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-extrabold text-indigo-950 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Đồng Bộ Vĩnh Viễn Vào File <code>src/data/defaultAccounts.ts</code>
                    </h5>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Sao chép đoạn mã TypeScript chứa {accounts.length} tài khoản này để lưu thẳng vào GitHub repo:
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyGitHubCode}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Đã Sao Chép Code! ✓' : 'Sao Chép Mã Seed'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] max-h-36 overflow-y-auto no-scrollbar border border-slate-800">
                  <pre>{generateGitHubSeedCode()}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Hệ thống Quản trị BMyC Kids &bull; Phiên bản 2.0</span>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
