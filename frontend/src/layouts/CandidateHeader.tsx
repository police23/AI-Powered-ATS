import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, LogOut, Check, Eye, Calendar, ClipboardCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'view', title: 'Nhà tuyển dụng đã xem CV', message: 'TechCorp Vietnam vừa xem hồ sơ ứng tuyển vị trí Senior React Developer của bạn.', time: '15 phút trước', read: false },
  { id: 2, type: 'interview', title: 'Lời mời phỏng vấn mới', message: 'Bạn nhận được lời mời phỏng vấn từ Công ty Cổ phần Công nghệ FPT cho vị trí Frontend Developer.', time: '1 giờ trước', read: false },
  { id: 3, type: 'status', title: 'Cập nhật trạng thái ứng tuyển', message: 'Đơn ứng tuyển vị trí UI/UX Designer tại Viettel đã được duyệt vào vòng Phỏng vấn.', time: '1 ngày trước', read: true },
];

export default function CandidateHeader({ title = "Khám phá & Gợi ý", onNavigate, children }: { title?: string, onNavigate?: (item: string) => void, children?: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
    if (onNavigate) {
      onNavigate('login');
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'view': return <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0"><Eye size={16} /></div>;
      case 'interview': return <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full shrink-0"><Calendar size={16} /></div>;
      case 'status': return <div className="p-2 bg-purple-50 text-purple-600 rounded-full shrink-0"><ClipboardCheck size={16} /></div>;
      default: return <div className="p-2 bg-slate-50 text-slate-600 rounded-full shrink-0"><Bell size={16} /></div>;
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 relative z-20">
      <div className="flex items-center gap-4">
        {children}
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800">Thông báo</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1"
                  >
                    <Check size={14} />
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`flex gap-3 p-3 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-indigo-50/30' : ''
                      }`}
                      onClick={() => setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item))}
                    >
                      {getNotificationIcon(n.type)}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-sm tracking-tight ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-700'}`}>
                            {n.title}
                          </p>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-slate-400">
                    Không có thông báo nào
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-700 leading-none">{user?.email?.split('@')[0] || 'Ứng viên'}</p>
              <p className="text-xs text-slate-400 mt-1 leading-none">{user?.email || 'Candidate'}</p>
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-sm font-semibold text-slate-800">{user?.email?.split('@')[0] || 'Ứng viên'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'Candidate'}</p>
              </div>
              <button 
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer"
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (onNavigate) onNavigate('settings');
                }}
              >
                <Settings size={16} />
                Cài đặt tài khoản
              </button>
              <button 
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsLogoutModalOpen(true);
                }}
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="mb-2 text-lg font-bold text-slate-800">Xác nhận đăng xuất</h3>
            <p className="mb-6 text-sm text-slate-500">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 cursor-pointer"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
