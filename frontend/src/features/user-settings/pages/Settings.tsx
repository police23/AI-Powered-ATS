import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Pencil,
  X,
  FileText,
  Upload,
  Trash2,
  Download,
  FileCheck,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import CandidateHeader from '../../../layouts/CandidateHeader';
import { useAuth } from '@/hooks/useAuth';
import { profileApi, UserProfileResponse, Gender, ExperienceLevel } from '../api/profile.api';
import { changePasswordApi } from '../../authentication/api/auth.api';
import { ApiError } from '@/services/httpClient';

interface SettingsProps {
  role: 'candidate' | 'employer';
  onNavigate?: (item: string) => void;
}

export default function Settings({ role, onNavigate }: SettingsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  // Profile state
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('HCM');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender>('OTHER');
  const [jobTitle, setJobTitle] = useState('frontend');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('TWO_TO_THREE');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const evaluatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&#^()_+\-=\[\]{}|;:,.<>]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Yếu', color: 'text-rose-600' };
    if (score <= 3) return { score: 2, label: 'Trung bình', color: 'text-amber-600' };
    return { score: 3, label: 'Mạnh', color: 'text-emerald-600' };
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{}|;:,.<>]{8,64}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage('Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage('Mật khẩu mới không được giống mật khẩu hiện tại.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp với mật khẩu mới.');
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await changePasswordApi({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast(res.message || 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại với mật khẩu mới.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const isCandidate = profile?.role?.toUpperCase() === 'CANDIDATE' || role === 'candidate';
  const isAdmin = profile?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'ADMIN';

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (isAdmin) {
      setIsLoadingProfile(false);
      return;
    }

    try {
      setIsLoadingProfile(true);
      setErrorMessage(null);
      const data = await profileApi.getProfile();
      setProfile(data);
      populateForm(data);
    } catch (err: any) {
      if (err?.status !== 403 && err?.code !== 'ACCESS_DENIED') {
        setErrorMessage(err.message || 'Không thể tải thông tin hồ sơ.');
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const populateForm = (data: UserProfileResponse) => {
    setFullName(data.fullName || '');
    setPhoneNumber(data.phoneNumber || '');
    setCity(data.city || 'HCM');
    setDateOfBirth(data.dateOfBirth || '');
    setGender(data.gender || 'OTHER');
    setJobTitle(data.jobTitle || 'frontend');
    setExperienceLevel(data.experienceLevel || 'TWO_TO_THREE');
  };

  const handleCancelEdit = () => {
    if (profile) {
      populateForm(profile);
    }
    setIsEditingProfile(false);
    setErrorMessage(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      setErrorMessage('Tài khoản Quản trị viên không áp dụng mục Hồ sơ cá nhân.');
      return;
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Họ và tên phải có ít nhất 2 ký tự.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      const updated = await profileApi.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        city: city || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender,
        jobTitle: isCandidate ? jobTitle : undefined,
        experienceLevel: isCandidate ? experienceLevel : undefined,
      });

      setProfile(updated);
      setIsEditingProfile(false);
      showToast('Đã lưu thay đổi thông tin cá nhân thành công!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể cập nhật thông tin cá nhân.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Dung lượng ảnh đại diện không được vượt quá 2MB.');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setErrorMessage(null);
      const res = await profileApi.uploadAvatar(file);
      setProfile((prev) => prev ? { ...prev, avatarUrl: res.avatarUrl } : prev);
      showToast('Đã cập nhật ảnh đại diện thành công!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải lên ảnh đại diện.');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.avatarUrl) return;
    try {
      setIsUploadingAvatar(true);
      setErrorMessage(null);
      await profileApi.deleteAvatar();
      setProfile((prev) => prev ? { ...prev, avatarUrl: undefined } : prev);
      showToast('Đã xóa ảnh đại diện thành công!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể xóa ảnh đại diện.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCvFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Chỉ hỗ trợ tệp định dạng PDF (.pdf).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Dung lượng file CV không được vượt quá 5MB.');
      return;
    }

    try {
      setIsUploadingCv(true);
      setErrorMessage(null);
      const resumeRes = await profileApi.uploadResume(file);
      setProfile((prev) => prev ? { ...prev, resume: resumeRes } : prev);
      showToast('Tải lên CV ứng tuyển thành công!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải lên file CV.');
    } finally {
      setIsUploadingCv(false);
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  const handleDeleteCv = async () => {
    try {
      setIsUploadingCv(true);
      setErrorMessage(null);
      await profileApi.deleteResume();
      setProfile((prev) => prev ? { ...prev, resume: null } : prev);
      showToast('Đã xóa file CV thành công!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể xóa file CV.');
    } finally {
      setIsUploadingCv(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <User size={18} />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Lock size={18} />
              Mật khẩu & Bảo mật
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <Bell size={18} />
              Thông báo
            </button>
          </div>

          {/* Settings Content */}
          <div className="w-full">
            {toastMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-xs">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <span className="text-sm font-medium">{toastMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-xs">
                <AlertCircle className="text-rose-500 shrink-0" size={20} />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Thông tin cá nhân</h2>
                    <p className="text-sm text-slate-500">
                      {isCandidate
                        ? 'Quản lý thông tin cá nhân, chức danh'
                        : 'Quản lý thông tin tài khoản và thông tin công ty liên kết.'}
                    </p>
                  </div>
                  {!isAdmin && !isLoadingProfile && (
                    <div>
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
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
                        >
                          <X size={16} />
                          <span>Hủy</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {isLoadingProfile ? (
                  <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                    <p className="text-sm font-medium">Đang tải thông tin hồ sơ...</p>
                  </div>
                ) : isAdmin ? (
                  <div className="p-12 text-center text-slate-500">
                    <Shield className="mx-auto text-slate-400 mb-3" size={40} />
                    <h3 className="text-base font-bold text-slate-700 mb-1">Tài khoản Quản trị viên</h3>
                    <p className="text-sm">Tài khoản Quản trị viên không áp dụng mục Hồ sơ cá nhân người dùng.</p>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {profile?.avatarUrl ? (
                            <img
                              src={profile.avatarUrl}
                              alt={profile.fullName}
                              className="h-16 w-16 rounded-full object-cover border-2 border-indigo-200 shrink-0"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl border-2 border-indigo-200 shrink-0">
                              {getInitials(profile?.fullName || user?.email)}
                            </div>
                          )}
                          {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                              <Loader2 className="animate-spin text-white" size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-800">{profile?.fullName || 'Chưa cập nhật tên'}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Định dạng JPG, PNG, GIF hoặc WEBP. Tối đa 2MB.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <input
                          type="file"
                          ref={avatarInputRef}
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={handleAvatarFileSelect}
                        />
                        <button
                          type="button"
                          disabled={isUploadingAvatar}
                          onClick={() => avatarInputRef.current?.click()}
                          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-2xs"
                        >
                          {isUploadingAvatar ? 'Đang tải...' : 'Thay đổi ảnh'}
                        </button>
                        {profile?.avatarUrl && (
                          <button
                            type="button"
                            disabled={isUploadingAvatar}
                            onClick={handleDeleteAvatar}
                            className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                          >
                            Xóa ảnh
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
                          <input
                            type="text"
                            required
                            disabled={!isEditingProfile}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nhập họ và tên"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700 flex items-center justify-between">
                            <span>Email</span>
                            <span className="text-xs font-normal text-slate-400">Cố định (tài khoản đăng nhập)</span>
                          </label>
                          <input
                            type="email"
                            disabled
                            value={profile?.email || ''}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Tỉnh / Thành phố</label>
                          <select
                            disabled={!isEditingProfile}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
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
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="0987654321"
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
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-slate-700">Giới tính</label>
                          <select
                            disabled={!isEditingProfile}
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                          >
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                          </select>
                        </div>
                      </div>

                      {/* Candidate Only Fields */}
                      {isCandidate && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="block text-sm font-medium text-slate-700">
                                Nghề nghiệp chuyên môn
                              </label>
                              <select
                                disabled={!isEditingProfile}
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
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
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-sm font-medium text-slate-700">Kinh nghiệm làm việc</label>
                              <select
                                disabled={!isEditingProfile}
                                value={experienceLevel}
                                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm bg-white disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                              >
                                <option value="FRESHER">Mới tốt nghiệp / Chưa có kinh nghiệm</option>
                                <option value="UNDER_ONE_YEAR">Dưới 1 năm</option>
                                <option value="ONE_TO_TWO">1 - 2 năm</option>
                                <option value="TWO_TO_THREE">2 - 3 năm</option>
                                <option value="THREE_TO_FIVE">3 - 5 năm</option>
                                <option value="OVER_FIVE">Trên 5 năm</option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Employer Company Info */}
                      {!isCandidate && (
                        <div className="space-y-1.5 pt-4 border-t border-slate-100">
                          <label className="block text-sm font-medium text-slate-700">Công ty liên kết</label>
                          <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-md flex items-center justify-center">
                              <Briefcase size={20} className="text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800">{profile?.company?.name || 'ATS Partner Company'}</p>
                              <p className="text-xs text-slate-500">Tổ chức tuyển dụng đối tác</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {isEditingProfile && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
                          >
                            {isSaving && <Loader2 className="animate-spin" size={16} />}
                            <span>Lưu thay đổi</span>
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-1">Mật khẩu & Bảo mật</h2>
                  <p className="text-sm text-slate-500">Cập nhật mật khẩu và quản lý bảo mật tài khoản của bạn.</p>
                </div>

                <div className="p-6">
                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {newPassword && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                              <span className={`font-bold ${evaluatePasswordStrength(newPassword).color}`}>
                                {evaluatePasswordStrength(newPassword).label}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                              <div className={`h-full flex-1 transition-all ${evaluatePasswordStrength(newPassword).score >= 1 ? (evaluatePasswordStrength(newPassword).score === 1 ? 'bg-rose-500' : evaluatePasswordStrength(newPassword).score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`}></div>
                              <div className={`h-full flex-1 transition-all ${evaluatePasswordStrength(newPassword).score >= 2 ? (evaluatePasswordStrength(newPassword).score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-200'}`}></div>
                              <div className={`h-full flex-1 transition-all ${evaluatePasswordStrength(newPassword).score >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-xs text-rose-500 mt-1 font-medium">Mật khẩu xác nhận không trùng khớp.</p>
                        )}
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
                            <p className="text-sm font-bold text-slate-800">Chưa bật xác thực 2FA</p>
                            <p className="text-xs text-slate-500">Tăng cường bảo mật bằng ứng dụng TOTP Authenticator hoặc SMS.</p>
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
                        disabled={isChangingPassword}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-2xs cursor-pointer flex items-center gap-2 disabled:opacity-60"
                      >
                        {isChangingPassword && <Loader2 className="animate-spin" size={16} />}
                        <span>Cập nhật mật khẩu</span>
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
                      type="button"
                      onClick={() => showToast('Đã lưu cài đặt thông báo!')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-2xs cursor-pointer"
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
