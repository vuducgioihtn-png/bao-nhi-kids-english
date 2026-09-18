import { StudentAccount, RegisterFormData } from '../types/account';
import { DEFAULT_ACCOUNTS } from '../data/defaultAccounts';

const ACCOUNTS_STORAGE_KEY = 'bmyc_accounts_v2';
const ACTIVE_USER_STORAGE_KEY = 'bmyc_active_user_v2';

/**
 * Lấy danh sách toàn bộ tài khoản từ bộ nhớ (localStorage kết hợp seed mặc định)
 */
export function getAllAccounts(): StudentAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;

  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      // Lưu lại bộ tài khoản mặc định vào localStorage nếu chưa có
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }

    const parsed: StudentAccount[] = JSON.parse(raw);

    // Đảm bảo các tài khoản cơ sở trong DEFAULT_ACCOUNTS luôn có mặt (không bị mất sau khi re-publish)
    const existingIds = new Set(parsed.map((a) => a.id));
    const merged = [...parsed];

    for (const defAcc of DEFAULT_ACCOUNTS) {
      if (!existingIds.has(defAcc.id)) {
        merged.push(defAcc);
      }
    }

    return merged;
  } catch (error) {
    console.error('Lỗi khi đọc danh sách tài khoản:', error);
    return DEFAULT_ACCOUNTS;
  }
}

/**
 * Lưu danh sách tài khoản vào localStorage
 */
export function saveAccounts(accounts: StudentAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Lỗi khi lưu tài khoản:', error);
  }
}

/**
 * Lấy tài khoản đang đăng nhập hiện tại
 */
export function getActiveUser(): StudentAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (!raw) {
      // Mặc định tự động đăng nhập tài khoản học sinh Bảo Nhi để trải nghiệm mượt mà nếu chưa đăng nhập
      const all = getAllAccounts();
      const defaultStudent = all.find((a) => a.username === 'baonhi' && a.status === 'approved') || all[1] || null;
      if (defaultStudent) {
        setActiveUser(defaultStudent);
      }
      return defaultStudent;
    }
    const user: StudentAccount = JSON.parse(raw);
    // Đồng bộ lại dữ liệu mới nhất từ database
    const all = getAllAccounts();
    const fresh = all.find((a) => a.id === user.id);
    return fresh || user;
  } catch (error) {
    console.error('Lỗi khi đọc tài khoản hiện tại:', error);
    return null;
  }
}

/**
 * Cập nhật tài khoản đang đăng nhập
 */
export function setActiveUser(account: StudentAccount | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (account) {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(account));
    } else {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Lỗi khi lưu tài khoản hiện tại:', error);
  }
}

/**
 * Đăng ký tài khoản học sinh mới
 */
export function registerStudent(data: RegisterFormData): {
  success: boolean;
  message: string;
  account?: StudentAccount;
} {
  const accounts = getAllAccounts();

  // Chuẩn hóa tên đăng nhập (chữ thường, không dấu cách)
  const cleanUsername = data.username.trim().toLowerCase().replace(/\s+/g, '');

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' };
  }

  if (data.password.length < 4) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 4 ký tự!' };
  }

  if (data.password !== data.confirmPassword) {
    return { success: false, message: 'Mật khẩu xác nhận không khớp!' };
  }

  if (!data.fullName.trim()) {
    return { success: false, message: 'Vui lòng nhập họ và tên của học sinh!' };
  }

  // Kiểm tra tên đăng nhập đã tồn tại chưa
  const existing = accounts.find((a) => a.username.toLowerCase() === cleanUsername);
  if (existing) {
    return {
      success: false,
      message: `Tên đăng nhập "${cleanUsername}" đã có người sử dụng. Vui lòng chọn tên khác!`,
    };
  }

  const newAccount: StudentAccount = {
    id: `acc_student_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    password: data.password,
    fullName: data.fullName.trim(),
    nickname: data.nickname.trim() || data.fullName.trim(),
    role: 'student',
    status: 'pending', // Luôn ở trạng thái chờ Admin duyệt
    grade: data.grade || 'Mầm non & Tiểu học',
    parentPhone: data.parentPhone.trim(),
    parentName: data.parentName?.trim() || '',
    avatar: data.avatar || '👧',
    registeredAt: new Date().toISOString(),
    stars: 10, // Tặng 10 sao chào mừng
    masteredWordsCount: 0,
    completedPassagesCount: 0,
    notes: 'Học sinh đăng ký trực tuyến',
  };

  const updated = [newAccount, ...accounts];
  saveAccounts(updated);

  return {
    success: true,
    message: 'Đăng ký thành công! Tài khoản đang chờ Ban Quản Trị phê duyệt.',
    account: newAccount,
  };
}

/**
 * Đăng nhập tài khoản (Admin hoặc Học sinh)
 */
export function loginUser(
  username: string,
  password: string
): {
  success: boolean;
  message: string;
  account?: StudentAccount;
} {
  const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
  const accounts = getAllAccounts();

  const matched = accounts.find(
    (a) => a.username.toLowerCase() === cleanUsername && a.password === password
  );

  if (!matched) {
    return {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.',
    };
  }

  // Nếu là Admin, luôn cho phép vào
  if (matched.role === 'admin') {
    setActiveUser(matched);
    return {
      success: true,
      message: `Chào mừng Quản trị viên ${matched.fullName}!`,
      account: matched,
    };
  }

  // Nếu là học sinh, kiểm tra trạng thái duyệt
  if (matched.status === 'locked') {
    return {
      success: false,
      message: 'Tài khoản này đã bị tạm khóa. Vui lòng liên hệ Thầy/Cô Quản trị viên để mở khóa!',
      account: matched,
    };
  }

  if (matched.status === 'rejected') {
    return {
      success: false,
      message: `Tài khoản chưa được duyệt: ${matched.rejectReason || 'Vui lòng liên hệ quản trị viên để biết lý do.'}`,
      account: matched,
    };
  }

  // Cho phép lưu user, dù là pending (để hiển thị màn hình Chờ Duyệt)
  setActiveUser(matched);

  if (matched.status === 'pending') {
    return {
      success: true,
      message: 'Tài khoản của em đang chờ Admin phê duyệt để vào học!',
      account: matched,
    };
  }

  return {
    success: true,
    message: `Chào mừng ${matched.nickname || matched.fullName} vào học!`,
    account: matched,
  };
}

/**
 * Admin duyệt tài khoản học sinh
 */
export function approveAccount(accountId: string, adminUsername: string = 'admin'): boolean {
  const accounts = getAllAccounts();
  const index = accounts.findIndex((a) => a.id === accountId);
  if (index === -1) return false;

  accounts[index] = {
    ...accounts[index],
    status: 'approved',
    approvedAt: new Date().toISOString(),
    approvedBy: adminUsername,
    rejectReason: undefined,
  };

  saveAccounts(accounts);

  // Nếu user đang đăng nhập chính là user này thì cập nhật luôn
  const current = getActiveUser();
  if (current && current.id === accountId) {
    setActiveUser(accounts[index]);
  }

  return true;
}

/**
 * Admin từ chối tài khoản học sinh
 */
export function rejectAccount(accountId: string, reason: string): boolean {
  const accounts = getAllAccounts();
  const index = accounts.findIndex((a) => a.id === accountId);
  if (index === -1) return false;

  accounts[index] = {
    ...accounts[index],
    status: 'rejected',
    rejectReason: reason || 'Thông tin đăng ký chưa hợp lệ',
  };

  saveAccounts(accounts);
  return true;
}

/**
 * Admin khóa tài khoản học sinh
 */
export function toggleLockAccount(accountId: string): boolean {
  const accounts = getAllAccounts();
  const index = accounts.findIndex((a) => a.id === accountId);
  if (index === -1) return false;

  const currentStatus = accounts[index].status;
  accounts[index] = {
    ...accounts[index],
    status: currentStatus === 'locked' ? 'approved' : 'locked',
  };

  saveAccounts(accounts);
  return true;
}

/**
 * Admin xóa tài khoản
 */
export function deleteAccount(accountId: string): boolean {
  const accounts = getAllAccounts();
  // Không cho xóa tài khoản admin gốc
  if (accountId === 'acc_admin_01') return false;

  const filtered = accounts.filter((a) => a.id !== accountId);
  saveAccounts(filtered);

  const current = getActiveUser();
  if (current && current.id === accountId) {
    setActiveUser(null);
  }

  return true;
}

/**
 * Cập nhật số sao hoặc tiến độ của học sinh
 */
export function syncStudentStars(accountId: string, newStars: number): void {
  const accounts = getAllAccounts();
  const index = accounts.findIndex((a) => a.id === accountId);
  if (index === -1) return;

  accounts[index] = {
    ...accounts[index],
    stars: newStars,
  };
  saveAccounts(accounts);

  const current = getActiveUser();
  if (current && current.id === accountId) {
    setActiveUser(accounts[index]);
  }
}

/**
 * Admin tạo trực tiếp tài khoản học sinh (được duyệt ngay)
 */
export function adminCreateStudent(data: Partial<StudentAccount>): StudentAccount {
  const accounts = getAllAccounts();
  const cleanUsername = (data.username || `hs_${Date.now()}`).trim().toLowerCase().replace(/\s+/g, '');

  const newAccount: StudentAccount = {
    id: `acc_direct_${Date.now()}`,
    username: cleanUsername,
    password: data.password || '123456',
    fullName: data.fullName || 'Học sinh BMyC',
    nickname: data.nickname || data.fullName || 'Bé Yêu',
    role: 'student',
    status: 'approved', // Duyệt ngay
    grade: data.grade || 'Lớp 1 (6 tuổi)',
    parentPhone: data.parentPhone || '',
    avatar: data.avatar || '👧',
    registeredAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
    approvedBy: 'admin',
    stars: data.stars || 20,
    masteredWordsCount: 0,
    completedPassagesCount: 0,
    notes: data.notes || 'Tạo trực tiếp bởi Admin',
  };

  const updated = [newAccount, ...accounts];
  saveAccounts(updated);
  return newAccount;
}

// =========================================================================
// TÍNH NĂNG ĐẢM BẢO DỮ LIỆU KHÔNG THAY ĐỔI & KHÔNG MẤT ACCOUNT KHI ĐẨY LÊN GITHUB
// =========================================================================

/**
 * 1. Xuất toàn bộ cơ sở dữ liệu học sinh ra file JSON để tải về máy
 */
export function exportDatabaseToJson(): string {
  const accounts = getAllAccounts();
  const payload = {
    exportDate: new Date().toISOString(),
    appName: 'BMyC Kids Vocab',
    version: '2.0',
    totalAccounts: accounts.length,
    accounts,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * 2. Nhập file JSON sao lưu vào ứng dụng (Khôi phục dữ liệu ở bất kỳ máy hay tên miền nào)
 */
export function importDatabaseFromJson(jsonString: string): {
  success: boolean;
  importedCount: number;
  message: string;
} {
  try {
    const data = JSON.parse(jsonString);
    const incoming: StudentAccount[] = Array.isArray(data) ? data : data.accounts;

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return { success: false, importedCount: 0, message: 'Tệp tin không đúng định dạng danh sách tài khoản!' };
    }

    const currentAccounts = getAllAccounts();
    const currentMap = new Map(currentAccounts.map((a) => [a.id, a]));

    let count = 0;
    for (const acc of incoming) {
      if (acc.id && acc.username) {
        currentMap.set(acc.id, acc);
        count++;
      }
    }

    const merged = Array.from(currentMap.values());
    saveAccounts(merged);

    return {
      success: true,
      importedCount: count,
      message: `Khôi phục thành công ${count} tài khoản học sinh vào hệ thống!`,
    };
  } catch (error) {
    return {
      success: false,
      importedCount: 0,
      message: `Lỗi đọc file dữ liệu: ${(error as Error).message}`,
    };
  }
}

/**
 * 3. Tạo đoạn mã nguồn TypeScript để copy paste vào `src/data/defaultAccounts.ts`
 * Điều này đảm bảo 100% khi commit lên GitHub, tất cả học sinh đã đăng ký sẽ trở thành
 * tài khoản vĩnh viễn trong mã nguồn repo, không bao giờ bị xóa kể cả khi xóa cache!
 */
export function generateGitHubSeedCode(): string {
  const accounts = getAllAccounts();
  return `import { StudentAccount } from '../types/account';

/**
 * CƠ SỞ DỮ LIỆU TÀI KHOẢN MẪU ĐÃ ĐỒNG BỘ VÀO MÃ NGUỒN GITHUB
 * Cập nhật ngày: ${new Date().toLocaleDateString('vi-VN')}
 */
export const DEFAULT_ACCOUNTS: StudentAccount[] = ${JSON.stringify(accounts, null, 2)};
`;
}
