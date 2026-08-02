import React, { useState } from 'react';
import { Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/httpClient';

export default function Login({ 
  onBack, 
  onRegisterClick,
  onAcceptInviteClick,
  onLoginSuccess 
}: { 
  onBack: () => void; 
  onRegisterClick: () => void;
  onAcceptInviteClick?: () => void;
  onLoginSuccess?: (role: 'candidate' | 'hr' | 'admin') => void;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({
        email: email.trim(),
        password: password,
      });

      if (onLoginSuccess) {
        const role = response.user.role;
        const mappedRole: 'candidate' | 'hr' | 'admin' = 
          role === 'ADMIN' ? 'admin' : (role === 'HR' || role === 'HR_MANAGER' ? 'hr' : 'candidate');
        onLoginSuccess(mappedRole);
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Đã xảy ra lỗi không xác định khi đăng nhập');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="flex flex-1 min-h-screen">
        {/* Left Panel - Branding/Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-indigo-600 p-12 text-white">
          <div>
            <div className="flex items-center gap-2 cursor-pointer w-fit" onClick={onBack}>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-indigo-600">
                <Briefcase size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                NexusATS
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Tuyển dụng thông minh <br /> với sức mạnh của AI.
            </h2>
            <p className="mt-4 text-indigo-200 text-lg max-w-md">
              Tìm kiếm, đánh giá và kết nối với ứng viên tài năng nhanh chóng và chính xác hơn bao giờ hết.
            </p>
          </div>
          <div className="text-sm text-indigo-300">
            © 2026 NexusATS. All rights reserved.
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-md lg:w-96">
            <div className="lg:hidden mb-8 flex items-center gap-2 cursor-pointer w-fit" onClick={onBack}>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
                <Briefcase size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Nexus<span className="text-indigo-600">ATS</span>
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Đăng nhập vào tài khoản
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Chào mừng bạn quay trở lại với NexusATS
            </p>

            {/* Error message banner */}
            {errorMessage && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700 animate-in fade-in duration-200">
                <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <div className="mt-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  label="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  fullWidth
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  label="Mật khẩu"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  fullWidth
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                      Ghi nhớ mật khẩu
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>

              {onAcceptInviteClick && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={onAcceptInviteClick}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline cursor-pointer"
                  >
                    Nhận được lời mời tham gia công ty? Thiết lập mật khẩu tại đây
                  </button>
                </div>
              )}

              <p className="mt-6 text-center text-sm text-slate-600">
                Chưa có tài khoản?{' '}
                <button onClick={onRegisterClick} className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline cursor-pointer">
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
