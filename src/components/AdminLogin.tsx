import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import {
  loginAdminWithEmail,
  registerStaffAccount,
  loginWithGoogle,
  resetAdminPassword,
  FIREBASE_CONSOLE_AUTH_URL,
  AdminProfile
} from '../firebase/authService';

interface AdminLoginProps {
  onSuccess: (profile: AdminProfile) => void;
  onBackToVisitor: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToVisitor }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConsoleGuide, setShowConsoleGuide] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.isAdmin) {
        setError(`Tài khoản "${res.user?.email}" chưa được cấp quyền Quản trị viên.`);
        setGoogleLoading(false);
        return;
      }
      if (res.profile) {
        onSuccess(res.profile);
      }
    } catch (err: any) {
      console.error('Google Auth error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Đã hủy cửa sổ đăng nhập Google.');
      } else {
        setError(err?.message || 'Không thể đăng nhập Google lúc này.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email để nhận liên kết khôi phục.');
      return;
    }

    setLoading(true);
    try {
      await resetAdminPassword(email);
      setSuccessMsg(`Đã gửi liên kết khôi phục mật khẩu tới email "${email}". Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam/Quảng cáo).`);
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err?.code === 'auth/user-not-found') {
        setError('Không tìm thấy tài khoản quản trị nào đăng ký với email này.');
      } else if (err?.code === 'auth/invalid-email') {
        setError('Định dạng email không hợp lệ.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setShowConsoleGuide(true);
        setError('Phương thức xác thực Email/Mật khẩu chưa được kích hoạt trong Firebase Console.');
      } else {
        setError(err?.message || 'Không thể gửi email khôi phục lúc này. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setShowConsoleGuide(false);

    if (mode === 'forgot') {
      return handleForgotPassword(e);
    }

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginAdminWithEmail(email, password);
        if (!res.isAdmin) {
          setError('Tài khoản này chưa được cấp quyền Quản trị viên.');
          setLoading(false);
          return;
        }
        if (res.profile) {
          onSuccess(res.profile);
        }
      } else {
        const res = await registerStaffAccount(email, password, displayName || undefined);
        if (!res.isAdmin) {
          setError('Tài khoản đã đăng ký nhưng cần Quản trị viên duyệt và phân quyền trước khi đăng nhập.');
          setLoading(false);
          return;
        }
        if (res.profile) {
          onSuccess(res.profile);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const isOpNotAllowed =
        err?.code === 'auth/operation-not-allowed' ||
        err?.message?.includes('operation-not-allowed');

      if (isOpNotAllowed) {
        setShowConsoleGuide(true);
        setError('Phương thức xác thực Email/Mật khẩu chưa được kích hoạt trong Firebase Console.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã tồn tại trên hệ thống. Vui lòng chuyển sang tab "Đăng nhập".');
      } else if (err.code === 'auth/invalid-email') {
        setError('Định dạng email không hợp lệ.');
      } else {
        setError(err.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F7F4EE]">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xl">
        
        {/* Back button */}
        <div className="flex justify-between items-center pb-2">
          <button
            onClick={onBackToVisitor}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang xem</span>
          </button>
          
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Shield className="w-3 h-3 text-amber-700" />
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-lg mb-4">
            {mode === 'forgot' ? <KeyRound className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {mode === 'forgot'
              ? 'Khôi Phục Mật Khẩu'
              : mode === 'register'
              ? 'Đăng Ký Tài Khoản'
              : 'Xác Thực Quản Trị Viên'}
          </h2>
          <p className="mt-2 text-xs text-stone-600">
            {mode === 'forgot'
              ? 'Nhập email quản trị để nhận thư đặt lại mật khẩu.'
              : 'Đăng nhập để vào Bảng điều khiển quản lý danh lam thắng cảnh.'}
          </p>
        </div>

        {/* Only show Google Sign In in login/register mode */}
        {mode !== 'forgot' && (
          <>
            <div>
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl font-medium text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? 'Đang kết nối...' : 'Đăng nhập với Google'}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                hoặc Email & Mật khẩu
              </span>
              <div className="border-t border-stone-200 w-full" />
            </div>

            {/* Mode switcher tabs */}
            <div className="flex rounded-lg bg-stone-100 p-1 text-xs font-medium text-stone-600">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-center rounded-md transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 text-center rounded-md transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'hover:text-stone-900'
                }`}
              >
                Đăng ký cấp quyền
              </button>
            </div>
          </>
        )}

        {/* Success notification */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span className="font-semibold block leading-relaxed">{error}</span>
          </div>
        )}

        {/* Firebase Console guide */}
        {showConsoleGuide && (
          <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Bật phương thức Email/Password:</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Để đăng nhập bằng tài khoản email mật khẩu, vui lòng bật tùy chọn <strong>Email/Password</strong> trong Firebase Console:
            </p>
            <div className="pt-1">
              <a
                href={FIREBASE_CONSOLE_AUTH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Mở Firebase Console để Bật Email/Password</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Mode FORGOT PASSWORD Form */}
        {mode === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email tài khoản quản trị
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten@congty.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Đang gửi email...</span>
              ) : (
                <>
                  <span>Gửi liên kết đặt lại mật khẩu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Quay lại trang Đăng nhập</span>
              </button>
            </div>
          </form>
        ) : (
          /* Mode LOGIN / REGISTER Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Họ tên hiển thị
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Họ và tên"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email đăng nhập
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ten@congty.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Mật khẩu truy cập
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-amber-700 hover:text-amber-900 font-medium cursor-pointer hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Đang kiểm tra...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Đăng nhập vào Quản trị' : 'Tạo tài khoản'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
