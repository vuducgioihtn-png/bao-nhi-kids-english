export type UserRole = 'admin' | 'student';

export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'locked';

export interface StudentAccount {
  id: string;
  username: string; // Tên đăng nhập (chữ thường, viết liền)
  password: string; // Mật khẩu
  fullName: string; // Họ và tên đầy đủ
  nickname: string; // Tên thân mật
  role: UserRole;
  status: AccountStatus;
  grade: string; // Lớp hoặc độ tuổi
  parentPhone?: string; // SĐT phụ huynh
  parentName?: string; // Tên phụ huynh
  avatar: string; // Emoji đại diện
  registeredAt: string; // Ngày đăng ký ISO
  approvedAt?: string; // Ngày duyệt ISO
  approvedBy?: string; // Người duyệt
  rejectReason?: string; // Lý do từ chối nếu có
  stars: number; // Điểm sao tích lũy
  masteredWordsCount?: number;
  completedPassagesCount?: number;
  notes?: string; // Ghi chú của giáo viên
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  nickname: string;
  grade: string;
  parentPhone: string;
  parentName?: string;
  avatar: string;
}
