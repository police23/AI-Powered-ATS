import React from 'react';
import { Briefcase, Sparkles, Search, Bookmark, FileText, User, Settings, LayoutDashboard } from 'lucide-react';

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); if (onClick) onClick(); }} className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

interface CandidateSidebarProps {
  activeItem?: 'discover' | 'search' | 'applied' | 'saved' | 'profile' | 'settings';
  onNavigate?: (item: string) => void;
}

export default function CandidateSidebar({ activeItem = 'discover', onNavigate }: CandidateSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto shrink-0">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
            <Briefcase size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">
            Nexus<span className="text-indigo-600">ATS</span>
          </span>
        </div>
      </div>

      <div className="p-3 flex-1">
        <nav className="space-y-1.5">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeItem === 'discover'}
            onClick={() => onNavigate && onNavigate('discover')}
          />
          <NavItem
            icon={Search}
            label="Tìm việc làm"
            active={activeItem === 'search'}
            onClick={() => onNavigate && onNavigate('search')}
          />
          <NavItem
            icon={Briefcase}
            label="Lịch sử ứng tuyển"
            active={activeItem === 'applied'}
            onClick={() => onNavigate && onNavigate('applied')}
          />
          <NavItem
            icon={Bookmark}
            label="Việc đã lưu"
            active={activeItem === 'saved'}
            onClick={() => onNavigate && onNavigate('saved')}
          />
          <NavItem
            icon={FileText}
            label="Quản lý CV"
            active={activeItem === 'profile'}
            onClick={() => onNavigate && onNavigate('candidate-profile')}
          />
        </nav>
      </div>

    </aside>
  );
}
