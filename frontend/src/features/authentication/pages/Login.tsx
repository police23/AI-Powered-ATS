import React, { useState } from 'react';
import { Briefcase, Building, User, Zap, ArrowRight, Shield } from 'lucide-react';
import { Button, Input } from '@/components';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) {
      // Determine role based on email or default to hr if email contains hr/tuyendung
      const isAdmin = email.toLowerCase().includes('admin');
      const isHR = email.toLowerCase().includes('hr') || email.toLowerCase().includes('tuyendung') || email.toLowerCase().includes('employer');
      
      if (isHR) {
        if (email.toLowerCase() === 'hr.new@techcorp.vn' || email.toLowerCase().includes('staff') || email.toLowerCase().includes('nhanvien')) {
          localStorage.setItem('isCompanyAdmin', 'false');
        } else {
          localStorage.setItem('isCompanyAdmin', 'true');
        }
      }

      onLoginSuccess(isAdmin ? 'admin' : (isHR ? 'hr' : 'candidate'));
    }
  };

  const handleDemoLogin = (role: 'candidate' | 'hr-admin' | 'hr-staff' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin.demo@nexusats.vn');
      setPassword('admin123');
      if (onLoginSuccess) onLoginSuccess('admin');
    } else if (role === 'hr-admin') {
      setEmail('hr.admin@techcorp.vn');
      setPassword('12345678');
      localStorage.setItem('isCompanyAdmin', 'true');
      if (onLoginSuccess) onLoginSuccess('hr');
    } else if (role === 'hr-staff') {
      setEmail('hr.staff@techcorp.vn');
      setPassword('12345678');
      localStorage.setItem('isCompanyAdmin', 'false');
      if (onLoginSuccess) onLoginSuccess('hr');
    } else {
      setEmail('candidate.demo@nexusats.vn');
      setPassword('12345678');
      if (onLoginSuccess) onLoginSuccess('candidate');
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

          {/* Quick Demo Login Box */}
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm">
            <div className="flex items-center gap-2 mb-2.5 font-bold text-xs uppercase tracking-wider text-amber-800">
              <Zap size={15} className="text-amber-600 fill-amber-500" />
              <span>Đăng nhập Demo Nhanh (1-Click)</span>
            </div>
            <p className="text-xs text-amber-700 mb-3 leading-relaxed">
              Chọn vai trò để đăng nhập tức thì không cần điền thông tin:
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('hr-admin')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Building size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Quản trị viên (HR)</p>
                    <p className="text-[10px] text-slate-500 group-hover:text-indigo-600 font-normal">Công ty Admin</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </button>
              
              <button
                type="button"
                onClick={() => handleDemoLogin('hr-staff')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <User size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Nhân viên HR</p>
                    <p className="text-[10px] text-slate-500 group-hover:text-indigo-600 font-normal">Chỉ tuyển dụng</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('candidate')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <User size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Ứng viên</p>
                    <p className="text-[10px] text-slate-500 group-hover:text-indigo-600 font-normal">Candidate</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </button>
              
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-amber-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Shield size={14} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Hệ thống Admin</p>
                    <p className="text-[10px] text-slate-500 group-hover:text-indigo-600 font-normal">Super Admin</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            
            {onAcceptInviteClick && (
              <div className="mt-3 pt-3 border-t border-amber-200/60">
                <button
                  type="button"
                  onClick={onAcceptInviteClick}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-indigo-200 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Zap size={14} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Mô phỏng click Link Mời (HR)</p>
                      <p className="text-[10px] text-indigo-600/80 font-normal">Thiết lập mật khẩu từ email</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-50 px-2 text-slate-400 uppercase tracking-wider font-medium">Hoặc đăng nhập thủ công</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleStandardSubmit}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                placeholder="you@example.com"
              />

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                label="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                placeholder="••••••••"
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

              <Button type="submit" fullWidth size="lg">
                Đăng nhập
              </Button>
            </form>

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
