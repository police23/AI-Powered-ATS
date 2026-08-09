import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, DollarSign, Bookmark, Trash2, ArrowRight, Clock, Loader2 } from 'lucide-react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import { jobSearchApi, JobSummary } from '../../job-search/api/jobSearch.api';
import { Pagination } from '../../../components';

export default function SavedJobs({ onNavigate, onJobClick }: { onNavigate: (item: string) => void, onJobClick?: (jobId?: string) => void }) {
  const [savedJobs, setSavedJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const data = await jobSearchApi.getSavedJobs();
      setSavedJobs(data);
    } catch (err) {
      console.error('Lỗi khi tải việc làm đã lưu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handleRemove = async (jobId: string) => {
    try {
      await jobSearchApi.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err) {
      console.error('Lỗi khi bỏ lưu việc làm:', err);
    }
  };

  const formatSalary = (j: JobSummary) => {
    if (j.isNegotiableSalary) return 'Lương thỏa thuận';
    if (j.salaryMin && j.salaryMax) {
      return `${(j.salaryMin / 1000000).toFixed(0)} - ${(j.salaryMax / 1000000).toFixed(0)} triệu ${j.currency || 'VND'}`;
    }
    return 'Lương thỏa thuận';
  };

  const filteredJobs = savedJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <CandidateSidebar activeItem="saved" onNavigate={onNavigate} />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <CandidateHeader title="Việc làm đã lưu" onNavigate={onNavigate} />
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Việc làm đã lưu</h1>
              <p className="text-sm text-slate-500 mt-1">Danh sách các cơ hội việc làm bạn đã đánh dấu quan tâm.</p>
            </div>
            
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm việc đã lưu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 size={32} className="animate-spin text-indigo-600" />
              <span className="text-sm">Đang tải danh sách việc làm đã lưu...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {filteredJobs.length > 0 ? (
                  paginatedJobs.map((job) => (
                    <div 
                      key={job.id} 
                      onClick={() => onJobClick && onJobClick(job.id)} 
                      className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all cursor-pointer hover:border-indigo-200 hover:shadow-md"
                    >
                      <div>
                        <div className="mb-2.5 flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 font-bold text-slate-500 text-base shrink-0 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors overflow-hidden">
                            {job.companyLogo ? (
                              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                            ) : (
                              job.companyName.charAt(0)
                            )}
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemove(job.id); }}
                            title="Bỏ lưu việc làm"
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <h3 className="mb-1 text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="mb-3 text-xs font-medium text-slate-500">{job.companyName}</p>
                        
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                            {job.employmentType}
                          </span>
                          <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
                            {job.experienceLevel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <span className="font-bold text-green-600 text-sm">{formatSalary(job)}</span>
                        <span className="flex items-center gap-1"><MapPin size={13} /> {job.city}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-slate-400">
                    <Bookmark size={40} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-slate-600">Chưa có việc làm nào được lưu</p>
                    <p className="text-xs text-slate-400 mt-1">Hãy bấm biểu tượng trái tim khi tìm việc để lưu các cơ hội tốt nhất.</p>
                  </div>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
