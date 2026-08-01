import React, { useState, useRef, useEffect } from 'react';
import { User, Lock, Bell, Shield, LogOut, CheckCircle2, ChevronRight, Briefcase, Settings as SettingsIcon, Pencil, X, FileText, Upload, Trash2, Eye, FileCheck } from 'lucide-react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import CandidateHeader from '../../../layouts/CandidateHeader';

interface SettingsProps {
  role: 'candidate' | 'employer';
  onNavigate?: (item: string) => void;
}

export default function Settings({ role, onNavigate }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCandidateDropdownOpen, setIsCandidateDropdownOpen] = useState(false);
  const candidateDropdownRef = useRef<HTMLDivElement>(null);

  const [cvFile, setCvFile] = useState<{ name: string; size: string; updatedAt: string } | null>({
    name: 'CV_NguyenVanA_Frontend.pdf',
    size: '1.4 MB',
    updatedAt: '25/07/2026'
  });

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const dateStr = new Date().toLocaleDateString('vi-VN');
      setCvFile({
        name: file.name,
        size: `${sizeMB} MB`,
        updatedAt: dateStr
      });
    }
  };

  const handleRemoveCv = () => {
    setCvFile(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (candidateDropdownRef.current && !candidateDropdownRef.current.contains(event.target as Node)) {
        setIsCandidateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Sidebar */}
      {role === 'candidate' ? (
        <CandidateSidebar activeItem="settings" onNavigate={onNavigate} />
      ) : (
        <EmployerSidebar activeItem="settings" onNavigate={onNavigate} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        {role === 'employer' ? (
          <EmployerHeader title="Cài đặt tài khoản" onNavigate={onNavigate} />
        ) : (
          <CandidateHeader title="Cài đặt tài khoản" onNavigate={onNavigate} />
        )}

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          {/* Settings Nav */}
          <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User size={18} />
              Thông tin cá nhân
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lock size={18} />
              Mật khẩu & Bảo mật
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell size={18} />
              Thông báo
            </button>
          </div>

          {/* Settings Content */}
          <div className="w-full">
              {showSavedToast && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span className="text-sm font-medium">Đã lưu thay đổi thành công!</span>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 mb-1">Thông tin cá nhân</h2>
                      <p className="text-sm text-slate-500">Quản lý thông tin cá nhân và cách bạn hiển thị với người khác.</p>
                    </div>
                    {!isEditingProfile ? (
                      <button 
                        type="button" 
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        <Pencil size={16} />
                        <span>Chỉnh sửa</span>
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setIsEditingProfile(false)}
                        className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
                      >
                        <X size={16} />
                        <span>Hủy</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl border-2 border-indigo-200 shrink-0">
                          {role === 'candidate' ? 'A' : 'T'}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-800">{role === 'candidate' ? 'Nguyễn Văn A' : 'Trần Thị B'}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Định dạng JPG, GIF hoặc PNG. Tối đa 2MB.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button 
                          type="button" 
                          disabled={!isEditingProfile}
                          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Thay đổi ảnh
                        </button>
                        <button 
                          type="button" 
                          disabled={!isEditingProfile}
                          className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
                          <input 
                            type="text" 
                            disabled={!isEditingProfile}
                            defaultValue={role === 'candidate' ? 'Nguyễn Văn A' : 'Trần Thị B'}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Email</label>
                          <input 
                            type="email" 
                            disabled={!isEditingProfile}
                            defaultValue={role === 'candidate' ? 'nguyenvana@example.com' : 'hr.techcorp@example.com'}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Tỉnh / Thành phố</label>
                          <select 
                            disabled={!isEditingProfile}
                            defaultValue="HCM"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          >
                            <option value="HN">Hà Nội</option>
                            <option value="HCM">Hồ Chí Minh</option>
                            <option value="DN">Đà Nẵng</option>
                            <option value="CT">Cần Thơ</option>
                            <option value="HP">Hải Phòng</option>
                            <option value="other">Tỉnh/Thành phố khác</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Số điện thoại</label>
                          <input 
                            type="tel" 
                            disabled={!isEditingProfile}
                            defaultValue="0987654321"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Ngày sinh</label>
                          <input 
                            type="date" 
                            disabled={!isEditingProfile}
                            defaultValue="1998-05-15"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Giới tính</label>
                          <select 
                            disabled={!isEditingProfile}
                            defaultValue="male"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">
                            {role === 'candidate' ? 'Nghề nghiệp chuyên môn' : 'Chức danh'}
                          </label>
                          {role === 'candidate' ? (
                            <select 
                              disabled={!isEditingProfile}
                              defaultValue="frontend"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                            >
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
                          ) : (
                            <input 
                              type="text" 
                              disabled={!isEditingProfile}
                              defaultValue="HR Manager"
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                            />
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Kinh nghiệm làm việc</label>
                          <select 
                            disabled={!isEditingProfile}
                            defaultValue="2-3"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          >
                            <option value="fresher">Mới tốt nghiệp / Chưa có kinh nghiệm</option>
                            <option value="under1">Dưới 1 năm</option>
                            <option value="1-2">1 - 2 năm</option>
                            <option value="2-3">2 - 3 năm</option>
                            <option value="3-5">3 - 5 năm</option>
                            <option value="over5">Trên 5 năm</option>
                          </select>
                        </div>
                      </div>

                      {role === 'candidate' && (
                        <div className="space-y-2 pt-5 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold text-slate-800">
                              File CV ứng tuyển
                            </label>
                            {cvFile && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                <FileCheck size={13} />
                                Đã sẵn sàng
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mb-3">
                            Tải lên tập tin CV (định dạng PDF, DOC, DOCX, tối đa 5MB) để hệ thống tự động sử dụng khi ứng tuyển.
                          </p>

                          {cvFile ? (
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="h-11 w-11 bg-indigo-100 border border-indigo-200 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
                                  <FileText size={22} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-800 truncate">{cvFile.name}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">Dung lượng: {cvFile.size} • Cập nhật: {cvFile.updatedAt}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <label 
                                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                    !isEditingProfile 
                                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                      : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer shadow-xs'
                                  }`}
                                >
                                  <Upload size={14} />
                                  <span>Tải CV mới</span>
                                  <input 
                                    type="file" 
                                    disabled={!isEditingProfile}
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleCvUpload}
                                    className="hidden" 
                                  />
                                </label>
                                <button
                                  type="button"
                                  disabled={!isEditingProfile}
                                  onClick={handleRemoveCv}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                  title="Xóa CV"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className={`border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 transition-all ${
                              !isEditingProfile 
                                ? 'opacity-60 cursor-not-allowed' 
                                : 'hover:bg-indigo-50/50 hover:border-indigo-400 cursor-pointer group'
                            }`}>
                              <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                                <Upload size={22} />
                              </div>
                              <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Tải lên tập tin CV</span>
                              <span className="text-xs text-slate-400 mt-1">Hỗ trợ định dạng PDF, DOC, DOCX (Dung lượng tối đa 5MB)</span>
                              <input 
                                type="file" 
                                disabled={!isEditingProfile}
                                accept=".pdf,.doc,.docx"
                                onChange={handleCvUpload}
                                className="hidden" 
                              />
                            </label>
                          )}
                        </div>
                      )}

                      {role === 'employer' && (
                        <div className="space-y-1.5 pt-4 border-t border-slate-100">
                          <label className="block text-sm font-medium text-slate-700">Công ty</label>
                          <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-md flex items-center justify-center">
                              <Briefcase size={20} className="text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800">TechCorp Vietnam</p>
                              <p className="text-xs text-slate-500">Công ty công nghệ</p>
                            </div>
                            <button type="button" disabled={!isEditingProfile} className="text-sm text-indigo-600 font-medium hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                              Chỉnh sửa
                            </button>
                          </div>
                        </div>
                      )}

                      {isEditingProfile && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          <button 
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button 
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                          >
                            Lưu thay đổi
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Mật khẩu & Bảo mật</h2>
                    <p className="text-sm text-slate-500">Cập nhật mật khẩu và bảo mật tài khoản của bạn.</p>
                  </div>
                  
                  <div className="p-6">
                    <form onSubmit={handleSave} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                        <input 
                          type="password" 
                          placeholder="Nhập mật khẩu hiện tại"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                          <input 
                            type="password" 
                            placeholder="Nhập mật khẩu mới"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Nhập lại mật khẩu mới</label>
                          <input 
                            type="password" 
                            placeholder="Nhập lại mật khẩu mới"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 mb-3">Xác thực hai yếu tố (2FA)</h3>
                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                              <Shield size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">Chưa bật xác thực</p>
                              <p className="text-xs text-slate-500">Tăng cường bảo mật bằng mã xác nhận qua điện thoại.</p>
                            </div>
                          </div>
                          <button type="button" className="text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors cursor-pointer">
                            Thiết lập
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                        <button 
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                        >
                          Cập nhật mật khẩu
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Cài đặt thông báo</h2>
                    <p className="text-sm text-slate-500">
                      {role === 'employer'
                        ? 'Tùy chỉnh các thông báo tuyển dụng và tương tác với ứng viên.'
                        : 'Chọn loại thông báo bạn muốn nhận.'}
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="space-y-4">
                        {role === 'employer' ? (
                          <>
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">Ứng viên mới nộp hồ sơ</p>
                                <p className="text-xs text-slate-500 mt-0.5">Thông báo ngay khi có ứng viên mới ứng tuyển vào công việc của bạn.</p>
                              </div>
                            </label>
                            
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">Lịch phỏng vấn & Nhắc nhở</p>
                                <p className="text-xs text-slate-500 mt-0.5">Nhận thông báo nhắc lịch phỏng vấn sắp diễn ra và xác nhận từ ứng viên.</p>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">Báo cáo tuyển dụng định kỳ</p>
                                <p className="text-xs text-slate-500 mt-0.5">Gửi email tổng hợp hiệu quả và lượt ứng tuyển hàng tuần.</p>
                              </div>
                            </label>
                          </>
                        ) : (
                          <>
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">Cập nhật ứng tuyển</p>
                                <p className="text-xs text-slate-500 mt-0.5">Thông báo khi trạng thái hồ sơ của bạn thay đổi.</p>
                              </div>
                            </label>
                            
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">Tin nhắn mới</p>
                                <p className="text-xs text-slate-500 mt-0.5">Khi nhà tuyển dụng gửi tin nhắn cho bạn.</p>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">Gợi ý việc làm</p>
                                <p className="text-xs text-slate-500 mt-0.5">Nhận email định kỳ về các công việc phù hợp.</p>
                              </div>
                            </label>
                          </>
                        )}
                      </div>
                    </div>



                    <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                      <button 
                        onClick={() => setShowSavedToast(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
                      >
                        Lưu cài đặt
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  );
}
