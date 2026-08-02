import React, { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminHeaderProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  onNavigate?: (item: string) => void;
}

export default function AdminHeader({ title, children, onNavigate }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {children}

        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer relative">
          <Bell size={20} />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 overflow-hidden shrink-0">
              <ShieldAlert size={16} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-none mb-1">{user?.email || 'Super Admin'}</p>
              <p className="text-xs text-slate-500 leading-none">System Administrator</p>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsLogoutModalOpen(true);
                }}
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="mb-2 text-lg font-bold text-slate-800">Xác nhận đăng xuất</h3>
            <p className="mb-6 text-sm text-slate-500">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Quản trị viên?</p>
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
