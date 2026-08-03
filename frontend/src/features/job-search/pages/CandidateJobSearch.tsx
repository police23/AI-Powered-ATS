import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowDownUp, Loader2, Heart } from 'lucide-react';

import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import { jobSearchApi, JobSummary } from '../api/jobSearch.api';

export default function CandidateJobSearch({ onNavigate, onJobClick, isPublic = false, onLoginClick }: { onNavigate?: (item: string) => void, onJobClick?: (jobId: string) => void, isPublic?: boolean, onLoginClick?: () => void }) {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Filters state
  const [keyword, setKeyword] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  const fetchSavedJobs = async () => {
    if (isPublic) return;
    try {
      const saved = await jobSearchApi.getSavedJobs();
      setSavedJobIds(new Set(saved.map(j => j.id)));
    } catch {
      // Ignore if unauthenticated
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobSearchApi.searchJobs({
        keyword: keyword || undefined,
        city: city || undefined,
        experienceLevel: experienceLevel || undefined,
        employmentType: employmentType || undefined,
        page,
        size: 10,
        sortBy,
        sortOrder: 'desc',
      });
      setJobs(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Lỗi khi tải danh sách việc làm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [page, sortBy]);

  const handleToggleSave = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (isPublic) {
      if (onLoginClick) onLoginClick();
      return;
    }

    const isCurrentlySaved = savedJobIds.has(jobId);
    try {
      if (isCurrentlySaved) {
        await jobSearchApi.unsaveJob(jobId);
        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await jobSearchApi.saveJob(jobId);
        setSavedJobIds(prev => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error('Lỗi khi thao tác lưu việc làm:', err);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  const handleResetFilter = () => {
    setKeyword('');
    setCity('');
    setExperienceLevel('');
    setEmploymentType('');
    setPage(0);
    setTimeout(() => {
      fetchJobs();
    }, 0);
  };

  const formatSalary = (job: JobSummary) => {
    if (job.isNegotiableSalary) return 'Lương thỏa thuận';
    if (job.salaryMin && job.salaryMax) {
      return `${(job.salaryMin / 1000000).toFixed(0)} - ${(job.salaryMax / 1000000).toFixed(0)} triệu ${job.currency || 'VND'}`;
    }
    if (job.salaryMin) return `Từ ${(job.salaryMin / 1000000).toFixed(0)} triệu ${job.currency || 'VND'}`;
    if (job.salaryMax) return `Đến ${(job.salaryMax / 1000000).toFixed(0)} triệu ${job.currency || 'VND'}`;
    return 'Lương thỏa thuận';
  };

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
            
            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 rounded-xl bg-white p-2 shadow-sm border border-slate-200 md:flex-row md:items-center mb-4">
              <div className="flex flex-[2] items-center gap-3 px-3 py-2 md:border-r md:border-slate-200">
                <Search size={20} className="text-slate-400" />
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm theo tên việc làm hoặc công ty" 
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <MapPin size={20} className="text-slate-400 shrink-0" />
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="">Tất cả địa điểm</option>
                  <option value="HCM">Hồ Chí Minh</option>
                  <option value="HN">Hà Nội</option>
                  <option value="DN">Đà Nẵng</option>
                  <option value="CT">Cần Thơ</option>
                  <option value="HP">Hải Phòng</option>
                </select>
              </div>
              <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md cursor-pointer">
                Tìm kiếm
              </button>
            </form>
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
            
            {/* Experience Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-700 mb-3">Kinh nghiệm</h3>
              <select 
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Tất cả kinh nghiệm</option>
                <option value="FRESHER">Mới tốt nghiệp / Fresher</option>
                <option value="UNDER_ONE_YEAR">Dưới 1 năm</option>
                <option value="ONE_TO_TWO">1 - 2 năm</option>
                <option value="TWO_TO_THREE">2 - 3 năm</option>
                <option value="THREE_TO_FIVE">3 - 5 năm</option>
                <option value="OVER_FIVE">Trên 5 năm</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-700 mb-3">Loại hình làm việc</h3>
              <select 
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Tất cả hình thức</option>
                <option value="FULL_TIME">Toàn thời gian (Full-time)</option>
                <option value="PART_TIME">Bán thời gian (Part-time)</option>
                <option value="REMOTE">Làm việc từ xa (Remote)</option>
                <option value="HYBRID">Làm việc linh hoạt (Hybrid)</option>
                <option value="CONTRACT">Hợp đồng ngắn hạn</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-4 border-t border-slate-100">
              <button 
                onClick={handleResetFilter}
                className="flex-[2] px-3 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors text-center whitespace-nowrap cursor-pointer"
              >
                Xóa lọc
              </button>
              <button 
                onClick={() => handleSearchSubmit()}
                className="flex-[3] px-3 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full border border-indigo-500 hover:bg-indigo-100 transition-colors text-center whitespace-nowrap cursor-pointer"
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Main Results */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4">
              <span className="text-sm font-medium text-slate-500">
                Tìm thấy <strong className="text-slate-800">{totalElements}</strong> cơ hội việc làm phù hợp
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="shrink-0 font-medium flex items-center gap-1"><ArrowDownUp size={14} /> Sắp xếp theo:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm"
                >
                  <option value="createdAt">Đăng tuyển gần đây</option>
                  <option value="salaryMax">Lương cao nhất</option>
                  <option value="viewsCount">Lượt xem nhiều nhất</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <Loader2 size={32} className="animate-spin text-indigo-600" />
                <span className="text-sm">Đang tìm kiếm bài tuyển dụng...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-slate-300 bg-white text-center p-8">
                <Briefcase size={40} className="text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700">Không tìm thấy việc làm phù hợp</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn một số tiêu chí lọc để xem thêm kết quả.</p>
                <button onClick={handleResetFilter} className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {jobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    salaryText={formatSalary(job)} 
                    isSaved={savedJobIds.has(job.id)}
                    onToggleSave={(e) => handleToggleSave(e, job.id)}
                    onClick={() => onJobClick && onJobClick(job.id)} 
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
                >
                  Trang trước
                </button>
                <span className="text-xs text-slate-500 font-medium px-2">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const JobCard: React.FC<{ 
  job: JobSummary;
  salaryText: string;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onClick: () => void;
}> = ({ job, salaryText, isSaved, onToggleSave, onClick }) => {
  return (
    <div onClick={onClick} className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-md cursor-pointer">
      <div>
        <div className="mb-2.5 flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 font-bold text-slate-500 text-base shrink-0 overflow-hidden">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
            ) : (
              job.companyName.charAt(0)
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">{job.viewsCount || 0} lượt xem</span>
            <button 
              onClick={onToggleSave}
              title={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
              className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'}`}
            >
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        
        <h3 className="mb-1 text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <p className="mb-2 text-xs font-medium text-slate-500">{job.companyName}</p>
        
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {job.employmentType}
          </span>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">
            {job.experienceLevel}
          </span>
        </div>
      </div>
      
      <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between border-t border-slate-100 pt-2.5 gap-2">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-green-600">{salaryText}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin size={12} /> {job.city} {job.addressDetail ? `- ${job.addressDetail}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
