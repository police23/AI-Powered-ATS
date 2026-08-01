import React from 'react';
import { LayoutDashboard, Users, Building, Shield, Settings } from 'lucide-react';

interface AdminSidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

const NavItem = ({ icon: Icon, label, badge, active, onClick }: { icon: any, label: string, badge?: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-colors cursor-pointer ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
      <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
    </div>
    {badge && (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
        {badge}
      </span>
    )}
  </button>
);

export default function AdminSidebar({ activeItem = 'dashboard', onNavigate }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-30 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-indigo-600">
          <Shield size={24} strokeWidth={2.5} className="text-rose-600" />
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Nexus<span className="text-rose-600">Admin</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col">
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Quản trị hệ thống</p>
          <nav>
            <NavItem 
              icon={LayoutDashboard} 
              label="Bảng điều khiển" 
              active={activeItem === 'dashboard'} 
              onClick={() => onNavigate && onNavigate('dashboard')} 
            />
            <NavItem 
              icon={Users} 
              label="Quản lý người dùng" 
              active={activeItem === 'users'} 
              onClick={() => onNavigate && onNavigate('users')} 
            />
            <NavItem 
              icon={Building} 
              label="Quản lý công ty" 
              active={activeItem === 'companies'} 
              onClick={() => onNavigate && onNavigate('companies')} 
            />
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <NavItem 
            icon={Settings} 
            label="Cài đặt hệ thống" 
            active={activeItem === 'settings'} 
            onClick={() => onNavigate && onNavigate('settings')} 
          />
        </div>
      </div>
    </aside>
  );
}
