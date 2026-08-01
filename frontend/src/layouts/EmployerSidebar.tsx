import React from 'react';
import { Briefcase, Users, FileText, Settings, BarChart2, Calendar, Mail } from 'lucide-react';

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}


function NavItem({ icon: Icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); if (onClick) onClick(); }} className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}>
      <div className="flex items-center gap-3">
        <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
        {label}
      </div>
      {badge && (
        <span className="bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs font-bold">
          {badge}
        </span>
      )}
    </a>
  );
}

interface EmployerSidebarProps {
  activeItem?: 'dashboard' | 'jobs' | 'candidates' | 'calendar' | 'cv-search' | 'settings' | 'email-templates' | 'company-profile' | 'company-users';
  onNavigate?: (item: string) => void;
}

export default function EmployerSidebar({ activeItem = 'dashboard', onNavigate }: EmployerSidebarProps) {
  const isCompanyAdmin = localStorage.getItem('isCompanyAdmin') !== 'false';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
            <Briefcase size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Nexus<span className="text-indigo-600">HR</span>
          </span>
        </div>
      </div>

      <div className="p-4 flex-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Quản lý</div>
        <nav className="space-y-1">
          <NavItem 
            icon={BarChart2} 
            label="Tổng quan" 
            active={activeItem === 'dashboard'} 
            onClick={() => onNavigate && onNavigate('dashboard')} 
          />
          <NavItem 
            icon={Briefcase} 
            label="Tin tuyển dụng" 
            active={activeItem === 'jobs'} 
            onClick={() => onNavigate && onNavigate('jobs')} 
          />
          <NavItem 
            icon={Users} 
            label="Quản lý ứng viên" 
            active={activeItem === 'candidates'} 
            onClick={() => onNavigate && onNavigate('candidates')} 
          />
          <NavItem 
            icon={Calendar} 
            label="Lịch phỏng vấn" 
            active={activeItem === 'calendar'} 
            onClick={() => onNavigate && onNavigate('calendar')} 
          />
        </nav>
        
        {isCompanyAdmin && (
          <>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-8 px-3">Công ty</div>
            <nav className="space-y-1">
              <NavItem 
                icon={Settings} 
                label="Hồ sơ công ty" 
                active={activeItem === 'company-profile'} 
                onClick={() => onNavigate && onNavigate('company-profile')} 
              />
              <NavItem 
                icon={Users} 
                label="Tài khoản nhân sự" 
                active={activeItem === 'company-users'} 
                onClick={() => onNavigate && onNavigate('company-users')} 
              />
              <NavItem 
                icon={Mail} 
                label="Mẫu Email" 
                active={activeItem === 'email-templates'} 
                onClick={() => onNavigate && onNavigate('email-templates')} 
              />
            </nav>
          </>
        )}
      </div>
    </aside>
  );
}
