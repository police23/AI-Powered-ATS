import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, DollarSign, Clock, Users, Eye, Edit, Trash2, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import Footer from '../../../layouts/Footer';
import { employerJobApi, EmployerJobSummary } from '../api/job.api';

export default function EmployerJobs({ onNavigate }: { onNavigate?: (item: string) => void }) {
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [jobs, setJobs] = useState<EmployerJobSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await employerJobApi.getEmployerJobs(filter, keyword);
      setJobs(res.content);
      setTotalCount(res.totalElements);
    } catch (err: any) {
      console.error('Lỗi khi tải danh sách tin tuyển dụng:', err);
      showToast('Không thể tải danh sách bài đăng', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng tuyển dụng này?")) return;
    try {
      setDeletingId(jobId);
      await employerJobApi.deleteJob(jobId);
      showToast("Đã xóa bài tuyển dụng thành công", "success");
      fetchJobs();
    } catch (err: any) {
      console.error('Lỗi khi xóa bài tuyển dụng:', err);
      showToast(err?.message || "Lỗi khi xóa bài tuyển dụng", "info");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'CLOSED' : 'PUBLISHED';
    try {
      await employerJobApi.updateJobStatus(jobId, nextStatus);
      showToast(`Đã chuyển trạng thái bài viết thành ${nextStatus === 'PUBLISHED' ? 'Đang tuyển' : 'Đóng tin'}`, "success");
      fetchJobs();
    } catch (err: any) {
      console.error('Lỗi khi đổi trạng thái:', err);
      showToast("Không thể thay đổi trạng thái bài tuyển dụng", "info");
    }
  };

  const formatSalary = (j: EmployerJobSummary) => {
    if (j.isNegotiableSalary) return 'Lương thỏa thuận';
    if (j.salaryMin && j.salaryMax) {
      return `${(j.salaryMin / 1000000).toFixed(0)} - ${(j.salaryMax / 1000000).toFixed(0)} triệu ${j.currency || 'VND'}`;
    }
    if (j.salaryMin) return `Từ ${(j.salaryMin / 1000000).toFixed(0)} triệu ${j.currency || 'VND'}`;
    if (j.salaryMax) return `Đến ${(j.salaryMax / 1000000).toFixed(0)} triệu ${j.currency || 'VND'}`;
    return 'Lương thỏa thuận';
  };

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
                {totalCount}
              </span>
            </div>
          }
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold ${
              toastMessage.type === 'success' 
                ? 'bg-slate-900 text-white border-slate-700' 
                : 'bg-slate-800 text-slate-200 border-slate-600'
            }`}>
              {toastMessage.type === 'success' ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 shrink-0">
                  <AlertCircle size={18} />
                </div>
              )}
              <span className="text-sm font-semibold">{toastMessage.text}</span>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          
          {/* Actions & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'published', label: 'Đang tuyển' },
                { id: 'draft', label: 'Bản nháp' },
                { id: 'closed', label: 'Đã đóng' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
              <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm kiếm công việc..." 
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-colors shadow-sm"
                />
              </form>
              <button 
                onClick={() => onNavigate && onNavigate('post-job')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shrink-0 whitespace-nowrap cursor-pointer shadow-sm"
              >
                <Plus size={16} /> Đăng tin mới
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-20 text-slate-400">
                <Loader2 size={36} className="animate-spin text-indigo-600" />
              </div>
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-full">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 shrink-0">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleToggleStatus(job.id, job.status)}>
                          {job.status === 'PUBLISHED' && <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-emerald-100 transition-colors">Đang tuyển</span>}
                          {job.status === 'DRAFT' && <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-amber-100 transition-colors">Bản nháp</span>}
                          {job.status === 'CLOSED' && <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-slate-200 transition-colors">Đã đóng</span>}
                          {job.status === 'ARCHIVED' && <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">Lưu trữ</span>}
                        </div>
                        <div className="flex items-center gap-1.5 sm:ml-1 sm:border-l sm:border-slate-200 sm:pl-3">
                          <button 
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer" 
                            title="Chỉnh sửa"
                            onClick={() => onNavigate && onNavigate('post-job')}
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={deletingId === job.id}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50" 
                            title="Xóa tin"
                          >
                            {deletingId === job.id ? <Loader2 size={18} className="animate-spin text-rose-600" /> : <Trash2 size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.city}</span>
                      <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-slate-400" /> {formatSalary(job)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> Ngày đăng: {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500">
                            <Eye size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{job.viewsCount}</div>
                            <div className="text-xs text-slate-500">Lượt xem</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 -ml-1.5 rounded-lg transition-colors">
                          <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Users size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                              {job.applicationsCount}
                              {job.newApplicationsCount > 0 && (
                                <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded-full">+{job.newApplicationsCount} mới</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">Hồ sơ ứng tuyển</div>
                          </div>
                        </div>
                      </div>

                      {job.expiredAt && (
                        <div className="text-xs font-medium text-amber-600 flex items-center gap-1.5 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-100/80 shrink-0">
                          <Clock size={14} />
                          <span>Hạn ứng tuyển: {new Date(job.expiredAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Chưa có bài đăng tuyển dụng nào</h3>
                <p className="text-slate-500 text-sm mb-4">Hãy tạo bài tuyển dụng mới để bắt đầu tiếp nhận hồ sơ từ các ứng viên tiềm năng.</p>
                <button 
                  onClick={() => onNavigate && onNavigate('post-job')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus size={18} /> Đăng tin tuyển dụng ngay
                </button>
              </div>
            )}
          </div>
          
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
