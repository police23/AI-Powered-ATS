import React from 'react';
import { Search, MapPin, Sparkles, Briefcase, Filter, Check, ArrowDownUp, ChevronDown, Heart } from 'lucide-react';

import { mockJobs } from '../../../utils/data';
import { Job } from '../../../types';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';

export default function CandidateJobSearch({ onNavigate, onJobClick, isPublic = false, onLoginClick }: { onNavigate?: (item: string) => void, onJobClick?: () => void, isPublic?: boolean, onLoginClick?: () => void }) {
  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-800 flex ${isPublic ? 'flex-col' : 'flex-col md:flex-row'}`}>
      {!isPublic && <CandidateSidebar activeItem="search" onNavigate={onNavigate} />}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {!isPublic && <CandidateHeader title="Tìm kiếm việc làm" onNavigate={onNavigate} />}
        {isPublic && (
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
                <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
                  <Briefcase size={18} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-800">
                  Nexus<span className="text-indigo-600">ATS</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={onLoginClick} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-all hover:shadow-md cursor-pointer">
                  Đăng nhập
                </button>
              </div>
            </div>
          </header>
        )}
        {/* Search Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Tìm kiếm việc làm</h1>
            <p className="text-slate-500 mb-8">Khám phá hàng ngàn cơ hội việc làm IT chất lượng cao.</p>
            
            {/* Search Bar */}
            <div className="flex flex-col gap-3 rounded-xl bg-white p-2 shadow-sm border border-slate-200 md:flex-row md:items-center mb-4">
              <div className="flex flex-[2] items-center gap-3 px-3 py-2 md:border-r md:border-slate-200">
                <Search size={20} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tìm theo tên việc làm" 
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <MapPin size={20} className="text-slate-400 shrink-0" />
                <select className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer">
                  <option value="">Tất cả địa điểm</option>
                  <option value="HCM">Hồ Chí Minh</option>
                  <option value="HN">Hà Nội</option>
                  <option value="DN">Đà Nẵng</option>
                  <option value="CT">Cần Thơ</option>
                  <option value="HP">Hải Phòng</option>
                  <option value="Khac">Khác</option>
                </select>
              </div>
              <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md">
                Tìm kiếm
              </button>
            </div>


          </div>
        </div>

        {/* Job List Section */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
          {/* Advanced Filter Sidebar */}
          <div className="w-full md:w-[250px] shrink-0">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
              <Filter size={20} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">Lọc nâng cao</h2>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-700 mb-3">Theo danh mục nghề</h3>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                <option value="">Tất cả danh mục</option>
                <option value="1">Marketing</option>
                <option value="2">Marketing/PR/Quảng cáo khác</option>
                <option value="3">Quan hệ Công chúng (PR)</option>
                <option value="4">Sales Thương mại điện tử</option>
                <option value="5">Quản lý kinh doanh</option>
                <option value="6">Công nghệ thông tin</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-700 mb-4">Kinh nghiệm</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                {[
                  'Không yêu cầu', 'Dưới 1 năm',
                  '1 năm', '2 năm',
                  '3 năm', '4 năm',
                  '5 năm', 'Trên 5 năm'
                ].map((exp, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-800 truncate" title={exp}>{exp}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-700 mb-3">Mức lương</h3>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                <option value="">Tất cả mức lương</option>
                <option value="1">Dưới 10 triệu</option>
                <option value="2">10 - 15 triệu</option>
                <option value="3">15 - 20 triệu</option>
                <option value="4">20 - 30 triệu</option>
                <option value="5">Trên 30 triệu</option>
                <option value="6">Thỏa thuận</option>
              </select>
            </div>

            {/* Level Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-700 mb-3">Cấp bậc</h3>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                <option value="">Tất cả cấp bậc</option>
                <option value="1">Thực tập sinh</option>
                <option value="2">Nhân viên</option>
                <option value="3">Trưởng nhóm</option>
                <option value="4">Trưởng phòng</option>
                <option value="5">Phó giám đốc</option>
                <option value="6">Giám đốc</option>
                <option value="7">Quản lý cấp cao</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-700 mb-3">Loại hình làm việc</h3>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                <option value="">Tất cả</option>
                <option value="1">Toàn thời gian</option>
                <option value="2">Bán thời gian</option>
                <option value="4">Remote</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-4 border-t border-slate-100">
              <button className="flex-[2] px-3 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors text-center whitespace-nowrap">
                Xóa bộ lọc
              </button>
              <button className="flex-[3] px-3 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full border border-indigo-500 hover:bg-indigo-100 transition-colors text-center whitespace-nowrap">
                Áp dụng bộ lọc
              </button>
            </div>
          </div>

          {/* Main Results */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xl:flex-row xl:items-center justify-end mb-6 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="shrink-0 font-medium flex items-center gap-1"><ArrowDownUp size={14} /> Sắp xếp theo:</span>
                <select className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm">
                  <option value="relevance">Độ phù hợp</option>
                  <option value="newest">Đăng tuyển gần đây</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {mockJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => onJobClick && onJobClick()} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const JobCard: React.FC<{ job: Job, onClick: () => void }> = ({ job, onClick }) => {
  return (
    <div onClick={onClick} className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-md cursor-pointer">
      <div>
        <div className="mb-2.5 flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 font-bold text-slate-500 text-base shrink-0">
            {job.company.charAt(0)}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700 border border-green-200">
              Phù hợp : 98%
            </span>
            <span className="text-[11px] text-slate-400">Đăng tuyển {job.postedAt}</span>
          </div>
        </div>
        
        <h3 className="mb-1 text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <p className="mb-2 text-xs font-medium text-slate-500">{job.company}</p>
        
        <div className="mb-2 flex flex-wrap gap-1.5">
          {job.tags.map(tag => (
            <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between border-t border-slate-100 pt-2.5 gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-green-600">{job.salary}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin size={12} /> {job.location}
          </span>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-[11px] font-medium text-rose-500 mt-0.5 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
            Hạn ứng tuyển: 30/12/2026
          </span>
        </div>
      </div>
    </div>
  );
}
