import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, MapPin, DollarSign, Clock, Users, Eye, Edit, Trash2 } from 'lucide-react';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import Footer from '../../../layouts/Footer';

const mockJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    location: 'TP. Hồ Chí Minh',
    salary: '2000 - 3500 USD',
    postedDate: '20/07/2026',
    expiresIn: '04/08/2026',
    status: 'active',
    views: 1240,
    applications: 45,
    newApplications: 12
  },
  {
    id: 2,
    title: 'UI/UX Designer Lead',
    location: 'Hà Nội',
    salary: 'Thỏa thuận',
    postedDate: '15/07/2026',
    expiresIn: '25/07/2026',
    status: 'active',
    views: 856,
    applications: 28,
    newApplications: 5
  },
  {
    id: 3,
    title: 'Product Manager (B2B SaaS)',
    location: 'Đà Nẵng',
    salary: 'Up to $3000',
    postedDate: '01/07/2026',
    expiresIn: '15/07/2026',
    status: 'expired',
    views: 2100,
    applications: 112,
    newApplications: 0
  }
];

export default function EmployerJobs({ onNavigate }: { onNavigate?: (item: string) => void }) {
  const [filter, setFilter] = useState('all');

  const filteredJobs = filter === 'all' 
    ? mockJobs 
    : mockJobs.filter(job => job.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden">
      <EmployerSidebar activeItem="jobs" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <EmployerHeader 
          onNavigate={onNavigate}
          title={
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">Quản lý tin tuyển dụng</h1>
              <span className="bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs font-bold border border-slate-200">
                {mockJobs.length}
              </span>
            </div>
          }
        />

        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          
          {/* Actions & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Đang tuyển' },
                { id: 'expired', label: 'Hết hạn' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === f.id 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm công việc..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors shadow-sm"
                />
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('post-job')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shrink-0 whitespace-nowrap"
              >
                <Plus size={16} /> Đăng tin mới
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-full">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        {job.status === 'active' && <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">Đang tuyển</span>}
                        {job.status === 'expired' && <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">Hết hạn</span>}
                      </div>
                      <div className="flex items-center gap-1.5 sm:ml-1 sm:border-l sm:border-slate-200 sm:pl-3">
                        <button 
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center" 
                          title="Chỉnh sửa"
                          onClick={() => onNavigate && onNavigate('post-job')}
                        >
                          <Edit size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center" title="Xóa tin">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-slate-400" /> {job.salary}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> Ngày đăng: {job.postedDate}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500">
                          <Eye size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{job.views}</div>
                          <div className="text-xs text-slate-500">Lượt xem</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 -ml-1.5 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Users size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {job.applications}
                            {job.newApplications > 0 && (
                              <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-full">+{job.newApplications} mới</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">Hồ sơ ứng tuyển</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-medium text-amber-600 flex items-center gap-1.5 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-100/80 shrink-0">
                      <Clock size={14} />
                      <span>Hạn ứng tuyển: {job.expiresIn}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
