import React, { useState } from 'react';
import { Briefcase, ArrowLeft, Building2, User, Shield, CheckCircle2 } from 'lucide-react';

export default function AcceptInvite({ 
  onComplete,
  onBack 
}: { 
  onComplete: () => void;
  onBack: () => void;
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    
    setIsSubmitting(true);
    // Giả lập API call
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.setItem('isCompanyAdmin', 'false');
      onComplete(); // Hoàn tất và chuyển thẳng vào dashboard HR
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans sm:flex-row">
      {/* Left side - Welcome text */}
      <div className="flex flex-1 flex-col justify-center bg-indigo-900 px-8 py-12 text-white sm:px-16 lg:px-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-800/50 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-indigo-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors mb-12 w-fit text-sm font-medium cursor-pointer"
          >
            <ArrowLeft size={16} />
            Về trang chủ
          </button>
          
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Chào mừng bạn đến với đội ngũ!
          </h1>
          <p className="mt-6 text-lg text-indigo-100 leading-relaxed">
            Thiết lập mật khẩu để hoàn tất việc tạo tài khoản và bắt đầu tham gia tuyển dụng cùng công ty của bạn trên nền tảng NexusATS.
          </p>
          
          <div className="mt-12 space-y-6 text-indigo-100">
            <div className="flex items-center gap-4 bg-indigo-800/40 p-4 rounded-xl border border-indigo-700/50 backdrop-blur-sm">
              <div className="bg-indigo-600 p-2.5 rounded-lg text-white">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-sm text-indigo-300">Công ty</p>
                <p className="font-semibold text-white">TechCorp Vietnam</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-indigo-800/40 p-4 rounded-xl border border-indigo-700/50 backdrop-blur-sm">
              <div className="bg-emerald-600 p-2.5 rounded-lg text-white">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm text-indigo-300">Vai trò của bạn</p>
                <p className="font-semibold text-white">Nhân sự (HR)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-12 sm:px-16 lg:px-24">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Nexus<span className="text-indigo-600">ATS</span>
            </span>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Thiết lập mật khẩu
          </h2>
          <p className="mt-1 text-sm text-slate-500 mb-8">
            Tài khoản cho email <strong>hr.new@techcorp.vn</strong> đã được khởi tạo. Vui lòng đặt mật khẩu.
          </p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Mật khẩu mới
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-shadow"
                placeholder="Ít nhất 8 ký tự"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-shadow"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Hoàn tất & Đăng nhập
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
            <Shield size={20} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Bằng việc hoàn tất thiết lập, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của hệ thống NexusATS và TechCorp Vietnam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
