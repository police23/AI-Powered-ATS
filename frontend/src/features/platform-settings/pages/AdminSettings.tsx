import React, { useState } from 'react';
import AdminHeader from '../../../layouts/AdminHeader';
import AdminSidebar from '../../../layouts/AdminSidebar';
import { Settings, Save, Shield, Bell, ShieldCheck, Mail, Globe, Lock, Key } from 'lucide-react';

interface AdminSettingsProps {
  onNavigate?: (item: string) => void;
}

export default function AdminSettings({ onNavigate }: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <AdminSidebar activeItem="settings" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <AdminHeader title="Cài đặt hệ thống" onNavigate={onNavigate} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-6">
              
              {/* Settings Navigation */}
              <div className="w-full">
                <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
                  <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <button
                      onClick={() => setActiveTab('general')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Globe size={18} className={activeTab === 'general' ? 'text-indigo-600' : 'text-slate-400'} />
                      Cài đặt chung
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Shield size={18} className={activeTab === 'security' ? 'text-indigo-600' : 'text-slate-400'} />
                      Bảo mật
                    </button>
                    <button
                      onClick={() => setActiveTab('email')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'email' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Mail size={18} className={activeTab === 'email' ? 'text-indigo-600' : 'text-slate-400'} />
                      Email & Thông báo
                    </button>
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1 space-y-6">
                {activeTab === 'general' && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-lg font-bold text-slate-800">Cài đặt chung</h2>
                      <p className="text-sm text-slate-500 mt-1">Quản lý các thông tin cơ bản của hệ thống Nexus.</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Tên hệ thống</label>
                          <input type="text" defaultValue="Nexus" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả hệ thống</label>
                          <textarea rows={3} defaultValue="Nền tảng tuyển dụng thông minh" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"></textarea>
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-slate-100">
                          <div>
                            <h4 className="text-sm font-medium text-slate-800">Chế độ bảo trì</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Tạm dừng truy cập từ người dùng để bảo trì hệ thống.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                          <Save size={18} />
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-lg font-bold text-slate-800">Bảo mật</h2>
                      <p className="text-sm text-slate-500 mt-1">Cấu hình các chính sách bảo mật cho hệ thống.</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="text-sm font-medium text-slate-800 flex items-center gap-2">
                              <Lock size={16} className="text-slate-400" /> Yêu cầu mật khẩu mạnh
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">Người dùng phải sử dụng mật khẩu có chữ hoa, số và ký tự đặc biệt.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-t border-slate-100">
                          <div>
                            <h4 className="text-sm font-medium text-slate-800 flex items-center gap-2">
                              <Key size={16} className="text-slate-400" /> Xác thực hai yếu tố (2FA)
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">Bắt buộc tất cả quản trị viên phải bật 2FA.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        <div className="py-3 border-t border-slate-100">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Thời gian hết hạn phiên làm việc (phút)</label>
                          <input type="number" defaultValue="120" className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                          <Save size={18} />
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'email' && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-lg font-bold text-slate-800">Email & Thông báo</h2>
                      <p className="text-sm text-slate-500 mt-1">Cấu hình máy chủ gửi email và các mẫu thông báo tự động.</p>
                    </div>
                    <div className="p-6 space-y-8">
                      {/* SMTP Configuration */}
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Cấu hình SMTP</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Máy chủ SMTP (Host)</label>
                            <input type="text" defaultValue="smtp.example.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cổng (Port)</label>
                            <input type="number" defaultValue="587" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
                            <input type="text" defaultValue="noreply@nexus.vn" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                            <input type="password" defaultValue="********" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Tuỳ chọn thông báo</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-slate-800">Email chào mừng</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Tự động gửi email khi người dùng đăng ký tài khoản mới.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-slate-800">Cảnh báo hệ thống</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Gửi email cho quản trị viên khi có lỗi nghiêm trọng xảy ra.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                          <Save size={18} />
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
