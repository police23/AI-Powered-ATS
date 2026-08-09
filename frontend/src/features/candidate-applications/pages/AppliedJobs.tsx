import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, DollarSign, Clock, CheckCircle2, XCircle, Calendar, AlertCircle, X, FileText, UserCheck, Mail, Phone, ExternalLink, Download, AlertTriangle, Loader2 } from 'lucide-react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import Footer from '../../../layouts/Footer';
import { candidateApplicationApi } from '../api/candidateApplication.api';
import { Pagination } from '../../../components';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'applied':
    case 'pending':
      return { label: 'Đã ứng tuyển', color: 'bg-indigo-100 text-indigo-700', icon: Clock, border: 'border-indigo-200' };
    case 'viewed':
    case 'review':
      return { label: 'HR đã xem', color: 'bg-amber-100 text-amber-700', icon: AlertCircle, border: 'border-amber-200' };
    case 'interview':
      return { label: 'Phỏng vấn', color: 'bg-blue-100 text-blue-700', icon: Calendar, border: 'border-blue-200' };
    case 'rejected':
      return { label: 'Chưa phù hợp', color: 'bg-rose-100 text-rose-700', icon: XCircle, border: 'border-rose-200' };
    case 'offered':
      return { label: 'Offer Letter', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, border: 'border-emerald-200' };
    case 'declined_offer':
      return { label: 'Từ chối Offer', color: 'bg-purple-100 text-purple-700', icon: XCircle, border: 'border-purple-200' };
    default:
      return { label: 'Không xác định', color: 'bg-slate-100 text-slate-700', icon: Clock, border: 'border-slate-200' };
  }
};

export default function AppliedJobs({ onNavigate }: { onNavigate: (item: string) => void }) {
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await candidateApplicationApi.getMyApplications(0, 100);
      const mapped = res.content.map(app => ({
        id: app.id,
        title: app.jobTitle,
        company: app.companyName,
        location: app.city,
        salary: 'Thỏa thuận', // API does not return salary directly here
        appliedDate: new Date(app.appliedAt).toLocaleDateString('vi-VN'),
        status: app.status.toLowerCase(), // Maps to ui tags
        logo: app.companyLogo ? <img src={app.companyLogo} className="w-full h-full object-cover rounded-lg" alt={app.companyName} /> : app.companyName.charAt(0),
        matchScore: 0,
        cvName: app.resumeName,
        coverLetter: '',
        hrContact: null,
        timeline: [
          { step: 'Nộp hồ sơ thành công', date: new Date(app.appliedAt).toLocaleDateString('vi-VN'), done: true, active: app.status === 'APPLIED' },
          { step: 'HR đang xem xét', date: 'Đang xử lý', done: app.status !== 'APPLIED', active: app.status === 'VIEWED' },
          { step: 'Kết quả', date: '', done: ['INTERVIEW', 'REJECTED', 'OFFERED'].includes(app.status) }
        ]
      }));
      setApplications(mapped);
    } catch (err) {
      console.error(err);
      showToast('Không thể tải danh sách ứng tuyển', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId: string) => {
    try {
      setIsWithdrawing(true);
      await candidateApplicationApi.withdrawApplication(applicationId);
      showToast('Đã rút đơn ứng tuyển thành công', 'success');
      setSelectedJob(null);
      setShowWithdrawConfirm(false);
      fetchApplications();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'Lỗi khi rút đơn', 'info');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [filter, searchQuery]);

  const filteredJobs = applications.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden">
      <CandidateSidebar activeItem="applied" onNavigate={onNavigate} />
      
      <div className={`flex-1 flex flex-col min-w-0 ${selectedJob ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <CandidateHeader title="Lịch sử ứng tuyển" onNavigate={onNavigate} />

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

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-xl font-bold text-slate-800">Lịch sử ứng tuyển</h1>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm công việc..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Tổng CV đã nộp</p>
              <div className="text-xl font-bold text-indigo-700">{applications.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Đã ứng tuyển</p>
              <div className="text-xl font-bold text-slate-700">
                {applications.filter(app => app.status === 'applied').length}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">HR đã xem</p>
              <div className="text-xl font-bold text-amber-700">
                {applications.filter(app => app.status === 'viewed').length}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Phỏng vấn</p>
              <div className="text-xl font-bold text-blue-700">
                {applications.filter(app => app.status === 'interview').length}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Chưa phù hợp</p>
              <div className="text-xl font-bold text-rose-700">
                {applications.filter(app => app.status === 'rejected').length}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Offer Letter</p>
              <div className="text-xl font-bold text-emerald-700">
                {applications.filter(app => app.status === 'offered').length}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'applied', label: 'Đã ứng tuyển' },
              { id: 'viewed', label: 'HR đã xem' },
              { id: 'interview', label: 'Phỏng vấn' },
              { id: 'rejected', label: 'Chưa phù hợp' },
              { id: 'offered', label: 'Offer Letter' },
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

          {/* Job List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-20 text-slate-400">
                <Loader2 size={32} className="animate-spin" />
              </div>
            ) : filteredJobs.length > 0 ? (
              paginatedJobs.map((job) => {
                const statusConfig = getStatusConfig(job.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 shrink-0">
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="text-slate-600 mb-2 font-medium">{job.company}</div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-slate-400" /> {job.salary}</span>
                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> Ứng tuyển: {job.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start md:items-end gap-3 mt-2 md:mt-0">
                        <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border ${statusConfig.color} ${statusConfig.border}`}>
                          <StatusIcon size={16} />
                          {statusConfig.label}
                        </div>
                        <div className="flex items-center gap-4">
                          {['applied', 'viewed'].includes(job.status) && (
                            <button
                              onClick={() => { setSelectedJob(job); setShowWithdrawConfirm(true); }}
                              className="text-rose-600 hover:text-rose-700 text-sm font-semibold hover:underline cursor-pointer"
                            >
                              Rút đơn
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedJob(job)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy công việc nào</h3>
                <p className="text-slate-500 text-sm">Chưa có công việc nào trong trạng thái này.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          
        </main>

        {/* Application Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="p-6 bg-white border-b border-slate-200 flex items-start justify-between relative">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
                    {selectedJob.logo}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-indigo-700">{selectedJob.title}</h2>
                    <p className="text-indigo-600/80 font-medium text-sm mt-0.5">{selectedJob.company}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {selectedJob.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {selectedJob.salary}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedJob(null); setShowWithdrawConfirm(false); }}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Status Bar */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Trạng thái hiện tại</span>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const cfg = getStatusConfig(selectedJob.status);
                        const Icon = cfg.icon;
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color} ${cfg.border}`}>
                            <Icon size={14} />
                            {cfg.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-medium block">Ngày nộp hồ sơ</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 block">{selectedJob.appliedDate}</span>
                  </div>
                </div>

                {/* Phỏng vấn Alert if interview */}
                {selectedJob.status === 'interview' && selectedJob.interviewInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                      <Calendar size={18} className="text-blue-600" />
                      Lịch phỏng vấn sắp tới
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      <div><strong className="text-slate-900">Thời gian:</strong> {selectedJob.interviewInfo.time}</div>
                      <div><strong className="text-slate-900">Hình thức:</strong> {selectedJob.interviewInfo.type}</div>
                    </div>
                    {/* Google Meet Link Removed */}
                  </div>
                )}

                {/* Offer Alert if offered */}
                {selectedJob.status === 'offered' && selectedJob.offerInfo && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      Chúc mừng! Bạn đã nhận được Thư mời làm việc (Offer)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      <div><strong className="text-slate-900">Mức lương đề xuất:</strong> {selectedJob.offerInfo.salary}</div>
                      <div><strong className="text-slate-900">Ngày bắt đầu dự kiến:</strong> {selectedJob.offerInfo.startDate}</div>
                      <div><strong className="text-slate-900">Hạn phản hồi:</strong> {selectedJob.offerInfo.expireDate}</div>
                    </div>
                    <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-lg border border-emerald-100 italic">
                      "{selectedJob.offerInfo.note}"
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer">
                        Đồng ý nhận Offer
                      </button>
                      <button className="bg-white text-rose-600 border border-rose-200 text-xs font-bold px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
                        Từ chối Offer
                      </button>
                    </div>
                  </div>
                )}

                {/* Rejection Alert if rejected */}
                {selectedJob.status === 'rejected' && selectedJob.rejectionReason && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                      <XCircle size={18} className="text-rose-600" />
                      Phản hồi từ Nhà tuyển dụng
                    </div>
                    <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-rose-100">
                      "{selectedJob.rejectionReason}"
                    </p>
                  </div>
                )}

                {/* Timeline Progress */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tiến trình xử lý hồ sơ</h4>
                  <div className="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedJob.timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full shrink-0 relative z-10 ${
                            step.rejected || step.declined
                              ? 'bg-rose-500 ring-4 ring-rose-100'
                              : step.active 
                              ? 'bg-indigo-600 ring-4 ring-indigo-100' 
                              : step.done 
                              ? 'bg-emerald-500' 
                              : 'bg-slate-300'
                          }`} />
                          <span className={`font-semibold ${step.active ? 'text-indigo-600 font-bold' : step.done ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.step}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px] font-medium">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submitted Files */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hồ sơ đã nộp</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <FileText className="text-indigo-600" size={20} />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{selectedJob.cvName}</p>
                          <p className="text-[11px] text-slate-400">PDF • Nộp ngày {selectedJob.appliedDate}</p>
                        </div>
                      </div>
                      <button className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-colors cursor-pointer" title="Tải xuống">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* HR Contact */}
                {selectedJob.hrContact && (
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Người phụ trách tuyển dụng</h4>
                    <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{selectedJob.hrContact.name}</p>
                          <p className="text-[11px] text-slate-500">Chuyên viên tuyển dụng</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1"><Mail size={14} className="text-indigo-500" /> {selectedJob.hrContact.email}</span>
                        <span className="flex items-center gap-1"><Phone size={14} className="text-indigo-500" /> {selectedJob.hrContact.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div>
                  {['applied', 'viewed'].includes(selectedJob.status) && (
                    !showWithdrawConfirm ? (
                      <button 
                        onClick={() => setShowWithdrawConfirm(true)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
                      >
                        Rút đơn ứng tuyển
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                          <AlertTriangle size={14} /> Xác nhận rút đơn?
                        </span>
                        <button 
                          onClick={() => handleWithdraw(selectedJob.id)}
                          disabled={isWithdrawing}
                          className="flex items-center gap-1.5 text-xs bg-rose-600 text-white px-2.5 py-1 rounded font-bold hover:bg-rose-700 cursor-pointer disabled:opacity-50"
                        >
                          {isWithdrawing && <Loader2 size={12} className="animate-spin" />}
                          Đồng ý
                        </button>
                        <button 
                          onClick={() => setShowWithdrawConfirm(false)}
                          disabled={isWithdrawing}
                          className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 cursor-pointer disabled:opacity-50"
                        >
                          Hủy
                        </button>
                      </div>
                    )
                  )}
                </div>

                <button 
                  onClick={() => { setSelectedJob(null); setShowWithdrawConfirm(false); }}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    </div>
  );
}
