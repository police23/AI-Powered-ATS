import React, { useState } from 'react';
import { Briefcase, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/httpClient';

export default function Register({ onBack, onLoginClick, onRegisterSuccess }: { onBack: () => void; onLoginClick: () => void; onRegisterSuccess?: (role: string) => void }) {
  const role = 'candidate';
  const { register, login } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    phone: '',
    gender: '',
    occupation: '',
    experience: '',
    company: '',
    city: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverError) setServerError(null);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, required } = e.target;
    if (required && !value.trim()) {
      let fieldName = 'thông tin này';
      if (name === 'email') fieldName = 'địa chỉ email';
      else if (name === 'name') fieldName = 'họ và tên';
      else if (name === 'password') fieldName = 'mật khẩu';
      else if (name === 'confirmPassword') fieldName = 'mật khẩu nhập lại';
      else if (name === 'dob') fieldName = 'ngày sinh';
      else if (name === 'phone') fieldName = 'số điện thoại';
      else if (name === 'gender') fieldName = 'giới tính';
      else if (name === 'occupation') fieldName = 'ngành nghề';
      else if (name === 'experience') fieldName = 'kinh nghiệm làm việc';
      else if (name === 'company') fieldName = 'tên công ty';
      else if (name === 'city') fieldName = 'tỉnh/thành phố';
      
      setErrors((prev) => ({ ...prev, [name]: `Chưa nhập ${fieldName}` }));
    } else if (name === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: 'Email không hợp lệ' }));
      }
    } else if (name === 'password' && value.trim()) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: 'Mật khẩu phải từ 8 ký tự, gồm chữ hoa, chữ số và ký tự đặc biệt (@$!%*?&)' }));
      }
    } else if (name === 'confirmPassword' && value.trim()) {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, [name]: 'Mật khẩu nhập lại không khớp' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    const requiredFields = ['name', 'email', 'password', 'confirmPassword', 'dob', 'phone', 'gender', 'city', 'occupation', 'experience'];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        let fieldName = 'thông tin này';
        if (field === 'email') fieldName = 'địa chỉ email';
        else if (field === 'name') fieldName = 'họ và tên';
        else if (field === 'password') fieldName = 'mật khẩu';
        else if (field === 'confirmPassword') fieldName = 'mật khẩu nhập lại';
        else if (field === 'dob') fieldName = 'ngày sinh';
        else if (field === 'phone') fieldName = 'số điện thoại';
        else if (field === 'gender') fieldName = 'giới tính';
        else if (field === 'occupation') fieldName = 'ngành nghề';
        else if (field === 'experience') fieldName = 'kinh nghiệm làm việc';
        else if (field === 'company') fieldName = 'tên công ty';
        else if (field === 'city') fieldName = 'tỉnh/thành phố';
        
        newErrors[field] = `Chưa nhập ${fieldName}`;
      } else if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Email không hợp lệ';
        }
      } else if (field === 'password') {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          newErrors.password = 'Mật khẩu phải từ 8 ký tự, gồm chữ hoa, chữ số và ký tự đặc biệt (@$!%*?&)';
        }
      } else if (field === 'confirmPassword') {
        if (formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Call Backend Register API
      await register({
        email: formData.email.trim(),
        password: formData.password,
        role: 'CANDIDATE',
      });

      // 2. Automatically log in after registration
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (onRegisterSuccess) {
        onRegisterSuccess(role);
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError('Không thể hoàn tất đăng ký. Vui lòng thử lại sau.');
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
            Gia nhập cộng đồng <br /> tuyển dụng thông minh.
          </h2>
          <p className="mt-4 text-indigo-200 text-lg max-w-md">
            Tạo tài khoản ngay hôm nay để bắt đầu hành trình tìm kiếm cơ hội mới hoặc những ứng viên xuất sắc nhất.
          </p>
        </div>
        <div className="text-sm text-indigo-300">
          © 2026 NexusATS. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 overflow-y-auto">
        <div className="mx-auto w-full max-w-md lg:w-[28rem]">
          <div className="lg:hidden mb-8 flex items-center gap-2 cursor-pointer w-fit" onClick={onBack}>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
              <Briefcase size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Nexus<span className="text-indigo-600">ATS</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Tạo tài khoản ứng viên
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Tham gia cùng hàng ngàn ứng viên tìm kiếm cơ hội việc làm mơ ước
          </p>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700 animate-in fade-in duration-200">
              <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">{serverError}</div>
            </div>
          )}

          <div className="mt-8">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Họ và tên <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="mt-1.5">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Mật khẩu <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="mt-1.5">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Nhập lại mật khẩu <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="mt-1.5">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-slate-700">
                    Ngày sinh <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-1.5">
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.dob ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
                    Giới tính <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-1.5">
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.gender ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    >
                      <option value="" disabled>Chọn</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Số điện thoại <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-1.5">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                      placeholder="09xx xxx xxx"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                    Tỉnh/Thành phố <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-1.5">
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    >
                      <option value="" disabled>Chọn tỉnh/thành phố</option>
                      <option value="HN">Hà Nội</option>
                      <option value="HCM">Hồ Chí Minh</option>
                      <option value="DN">Đà Nẵng</option>
                      <option value="CT">Cần Thơ</option>
                      <option value="HP">Hải Phòng</option>
                      <option value="other">Tỉnh/Thành phố khác</option>
                    </select>
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-slate-700">
                    Nghề nghiệp chuyên môn <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-1.5">
                    <select
                      id="occupation"
                      name="occupation"
                      required
                      value={formData.occupation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.occupation ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    >
                      <option value="" disabled>Chọn ngành nghề</option>
                      <option value="frontend">Frontend Developer</option>
                      <option value="backend">Backend Developer</option>
                      <option value="fullstack">Fullstack Developer</option>
                      <option value="mobile">Mobile Developer</option>
                      <option value="data">Data Scientist / Engineer</option>
                      <option value="devops">DevOps / Cloud Engineer</option>
                      <option value="qa">QA / QC Tester</option>
                      <option value="uiux">UI/UX Designer</option>
                      <option value="pm">Product / Project Manager</option>
                    </select>
                    {errors.occupation && <p className="mt-1 text-xs text-red-500">{errors.occupation}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-slate-700">
                    Số năm kinh nghiệm <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="mt-1.5">
                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-1 sm:text-sm ${
                        errors.experience ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    >
                      <option value="" disabled>Chọn kinh nghiệm</option>
                      <option value="fresher">Chưa có kinh nghiệm / Mới tốt nghiệp</option>
                      <option value="under1">Dưới 1 năm</option>
                      <option value="1-2">1 - 2 năm</option>
                      <option value="2-3">2 - 3 năm</option>
                      <option value="3-5">3 - 5 năm</option>
                      <option value="over5">Trên 5 năm</option>
                    </select>
                    {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience}</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="ml-2 text-sm flex flex-col">
                  <label htmlFor="terms" className="text-slate-600">
                    Tôi đồng ý với{' '}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                      Điều khoản dịch vụ
                    </a>{' '}
                    và{' '}
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                      Chính sách bảo mật
                    </a>
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!agreed || isSubmitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${agreed && !isSubmitting ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' : 'bg-indigo-300 cursor-not-allowed'}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    'Đăng ký ngay'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-slate-50 px-2 text-slate-500">Hoặc</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Đăng ký bằng Google
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-sm text-slate-600">
              Đã có tài khoản?{' '}
              <button onClick={onLoginClick} className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline cursor-pointer">
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
