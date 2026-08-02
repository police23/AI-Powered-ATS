import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, LogOut, Check, UserPlus, CalendarClock, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface EmployerHeaderProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  onNavigate?: (item: string) => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'applicant', title: 'Ứng viên mới', message: 'Nguyễn Văn A vừa ứng tuyển vào vị trí Senior React Developer.', time: '10 phút trước', read: false },
  { id: 2, type: 'interview', title: 'Lịch phỏng vấn sắp tới', message: 'Phỏng vấn với Lê Văn C lúc 14:00 hôm nay.', time: '2 giờ trước', read: false },
  { id: 3, type: 'resume', title: 'Đánh giá hồ sơ', message: 'Trần Thị B đã cập nhật CV mới.', time: '1 ngày trước', read: true },
];

export default function EmployerHeader({ title, children, onNavigate }: EmployerHeaderProps) {
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
      case 'applicant': return <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0"><UserPlus size={16} /></div>;
      case 'interview': return <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full shrink-0"><CalendarClock size={16} /></div>;
      case 'resume': return <div className="p-2 bg-amber-50 text-amber-600 rounded-full shrink-0"><FileText size={16} /></div>;
      default: return <div className="p-2 bg-slate-50 text-slate-600 rounded-full shrink-0"><Bell size={16} /></div>;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-3">
        {typeof title === 'string' ? (
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        ) : (
          title
        )}
      </div>

      <div className="flex items-center gap-4">
        {children}
        
        <div className="relative" ref={notificationsRef}>
          <button 
            className={`relative p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-50 ${isNotificationsOpen ? 'bg-slate-100 text-indigo-600' : ''}`}
            title="Thông báo"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Thông báo</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Check size={14} />
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                      onClick={() => {
                        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-1.5">
                          {notification.message}
                        </p>
                        <span className="text-xs text-slate-400 font-medium">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Không có thông báo nào.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{user?.email?.split('@')[0] || 'Tuyển dụng'}</p>
              <p className="text-xs text-slate-500">{user?.role === 'HR_MANAGER' ? 'Quản trị viên Tuyển dụng' : (user?.email || 'HR Recruiter')}</p>
            </div>
            <div className="h-9 w-9 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {user?.email?.charAt(0).toUpperCase() || 'H'}
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-sm font-semibold text-slate-800">{user?.email?.split('@')[0] || 'Tuyển dụng'}</p>
                <p className="text-xs text-slate-500">{user?.email || 'HR Recruiter'}</p>
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
