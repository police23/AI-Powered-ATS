import React, { useState, useRef, useEffect } from 'react';
import { Bell, Bookmark, Briefcase, FileText, Settings, Sparkles, User, Search, MapPin, ChevronRight, CheckCircle2, TrendingUp, LogOut, Target, Calendar, Clock } from 'lucide-react';
import { mockJobs } from '../../../utils/data';

import CandidateSidebar from '../../../layouts/CandidateSidebar';
import Footer from '../../../layouts/Footer';
import CandidateHeader from '../../../layouts/CandidateHeader';

export default function CandidateDashboard({ onNavigate, onJobClick }: { onNavigate?: (item: string) => void, onJobClick?: (jobId?: string) => void }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row">
      <CandidateSidebar activeItem="discover" onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <CandidateHeader title="Khám phá & Gợi ý" onNavigate={onNavigate} />

        {/* Dashboard Content */}
        <div className="p-6 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Top Application Stats - Full Width */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Thống kê ứng tuyển</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
                <span className="text-xl font-bold text-indigo-700">15</span>
                <span className="text-xs font-medium text-indigo-700 mt-1">Tổng CV đã nộp</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <span className="text-xl font-bold text-slate-700">2</span>
                <span className="text-xs font-medium text-slate-700 mt-1">Đã ứng tuyển</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg border border-amber-100 text-center">
                <span className="text-xl font-bold text-amber-700">4</span>
                <span className="text-xs font-medium text-amber-700 mt-1">HR đã xem</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                <span className="text-xl font-bold text-blue-700">3</span>
                <span className="text-xs font-medium text-blue-700 mt-1">Phỏng vấn</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-rose-50 rounded-lg border border-rose-100 text-center">
                <span className="text-xl font-bold text-rose-700">4</span>
                <span className="text-xs font-medium text-rose-700 mt-1">Chưa phù hợp</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                <span className="text-xl font-bold text-emerald-700">1</span>
                <span className="text-xs font-medium text-emerald-700 mt-1">Offer Letter</span>
              </div>
            </div>
          </div>

          {/* Upcoming Interviews Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="text-indigo-600" size={18} />
                Lịch phỏng vấn sắp tới
              </h3>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                2 buổi sắp tới
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">Senior Frontend Engineer</h4>
                    <p className="text-xs text-slate-500 font-medium">TechCorp Vietnam</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded shrink-0">
                    Online Meet
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 border-t border-indigo-100 pt-2">
                  <Clock size={14} className="text-indigo-600 shrink-0" />
                  <span>10:00 - Thứ Hai, 10/08/2026</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">Marketing Lead</h4>
                    <p className="text-xs text-slate-500 font-medium">VNG Corporation</p>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded shrink-0">
                    Vòng HR
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 border-t border-slate-200/80 pt-2">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  <span>14:30 - Thứ Tư, 12/08/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Suitable Jobs Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="text-indigo-600" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Top Việc Làm Phù Hợp</h3>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('search')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockJobs.slice(0, 3).map((job) => (
                <div key={job.id} onClick={() => onJobClick && onJobClick(String(job.id))} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-400 text-xl">
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        Phù hợp : 98%
                      </div>
                    </div>
                    
                    <h4 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate mb-1">
                      {job.title}
                    </h4>
                    <p className="text-sm font-medium text-slate-500 mb-3">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin size={14} className="text-slate-400" /> {job.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                    {job.tags.map(tag => (
                      <span key={tag} className="rounded border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
