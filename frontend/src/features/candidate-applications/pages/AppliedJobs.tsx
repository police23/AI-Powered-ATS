import React, { useState } from 'react';
import { Search, MapPin, Building, DollarSign, Clock, CheckCircle2, XCircle, Calendar, AlertCircle, X, FileText, UserCheck, Mail, Phone, ExternalLink, Download, AlertTriangle } from 'lucide-react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import Footer from '../../../layouts/Footer';

const mockAppliedJobs = [
  {
    id: 1,
    title: 'Senior React Native Developer',
    company: 'TechBase VN',
    location: 'Quận 1, TP. HCM',
    salary: '2,500 - 3,500 USD',
    appliedDate: '20/07/2026',
    status: 'interview', // applied, viewed, interview, rejected, offered, declined_offer
    logo: 'T',
    matchScore: 92,
    cvName: 'CV_NguyenVanA_ReactNative.pdf',
    coverLetter: 'Kính gửi HR TechBase VN, tôi có 4 năm kinh nghiệm phát triển ứng dụng di động với React Native và TypeScript. Rất mong có cơ hội trao đổi chi tiết hơn.',
    hrContact: { name: 'Nguyễn Thu Hà', email: 'hr@techbase.vn', phone: '0901 234 567' },
    interviewInfo: { time: '14:00 - 24/07/2026', type: 'Online qua Google Meet', link: 'https://meet.google.com/abc-defg-hij', interviewer: 'Trần Văn B (Tech Lead)' },
    timeline: [
      { step: 'Nộp hồ sơ thành công', date: '20/07/2026', done: true },
      { step: 'HR đã tiếp nhận & xem hồ sơ', date: '21/07/2026', done: true },
      { step: 'Mời phỏng vấn Vòng 1', date: '22/07/2026', done: true, active: true },
      { step: 'Kết quả tuyển dụng / Offer', date: 'Dự kiến 26/07/2026', done: false }
    ]
  },
  {
    id: 2,
    title: 'Frontend Engineer (React/Vue)',
    company: 'NexusHR Solutions',
    location: 'Quận 3, TP. HCM',
    salary: 'Up to $2000',
    appliedDate: '15/07/2026',
    status: 'viewed',
    logo: 'N',
    matchScore: 88,
    cvName: 'CV_NguyenVanA_Frontend.pdf',
    coverLetter: 'Mong muốn cống hiến năng lực thiết kế UI và tối ưu hiệu năng web cho NexusHR.',
    hrContact: { name: 'Lê Minh Anh', email: 'recruitment@nexushr.vn', phone: '0912 345 678' },
    timeline: [
      { step: 'Nộp hồ sơ thành công', date: '15/07/2026', done: true },
      { step: 'HR đã xem hồ sơ', date: '16/07/2026', done: true, active: true },
      { step: 'Đánh giá chuyên môn', date: 'Đang xử lý', done: false }
    ]
  },
  {
    id: 3,
    title: 'Fullstack Developer (Node.js/React)',
    company: 'Fintech Startup',
    location: 'Quận Cầu Giấy, Hà Nội',
    salary: '1,500 - 2,500 USD',
    appliedDate: '10/07/2026',
    status: 'rejected',
    logo: 'F',
    matchScore: 75,
    cvName: 'CV_NguyenVanA_Fullstack.pdf',
    coverLetter: 'Rất hào hứng với lĩnh vực Fintech và mong muốn được thử sức.',
    hrContact: { name: 'Phạm Bảo Ngọc', email: 'hr@fintech.io', phone: '0988 777 666' },
    rejectionReason: 'Cảm ơn bạn đã quan tâm. Dù ấn tượng với hồ sơ của bạn, hiện tại chúng tôi đang ưu tiên ứng viên có kinh nghiệm sâu hơn về Microservices.',
    timeline: [
      { step: 'Nộp hồ sơ thành công', date: '10/07/2026', done: true },
      { step: 'HR đã xem hồ sơ', date: '11/07/2026', done: true },
      { step: 'Thông báo chưa phù hợp', date: '13/07/2026', done: true, rejected: true }
    ]
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Quận Phú Nhuận, TP. HCM',
    salary: '1,000 - 1,800 USD',
    appliedDate: '05/07/2026',
    status: 'offered',
    logo: 'C',
    matchScore: 95,
    cvName: 'Portfolio_CV_NguyenVanA.pdf',
    coverLetter: 'Gửi kèm Portfolio gồm 12 dự án thiết kế ứng dụng di động và hệ thống Design System.',
    hrContact: { name: 'Trần Hoàng Nam', email: 'careers@creativestudio.com', phone: '0903 888 999' },
    offerInfo: { salary: '1,700 USD/tháng', startDate: '01/08/2026', expireDate: '28/07/2026', note: 'Thử việc 85% lương trong 2 tháng, hưởng đầy đủ phúc lợi BHXH và bảo hiểm bảo việt.' },
    timeline: [
      { step: 'Nộp hồ sơ thành công', date: '05/07/2026', done: true },
      { step: 'HR đã xem hồ sơ', date: '06/07/2026', done: true },
      { step: 'Phỏng vấn chuyên môn', date: '09/07/2026', done: true },
      { step: 'Nhận thư mời làm việc (Offer)', date: '15/07/2026', done: true, active: true }
    ]
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Cloud Native Corp',
    location: 'Quận Tân Bình, TP. HCM',
    salary: '2,000 - 3,000 USD',
    appliedDate: '01/07/2026',
    status: 'declined_offer',
    logo: 'C',
    matchScore: 85,
    cvName: 'CV_NguyenVanA_DevOps.pdf',
    coverLetter: 'Kinh nghiệm triển khai Kubernetes và CI/CD pipeline trên AWS.',
    hrContact: { name: 'Đỗ Hải Đăng', email: 'hr@cloudnative.vn', phone: '0933 111 222' },
    timeline: [
      { step: 'Nộp hồ sơ thành công', date: '01/07/2026', done: true },
      { step: 'HR đã xem hồ sơ', date: '02/07/2026', done: true },
      { step: 'Phỏng vấn', date: '05/07/2026', done: true },
      { step: 'Offer Letter', date: '08/07/2026', done: true },
      { step: 'Ứng viên từ chối Offer', date: '10/07/2026', done: true, declined: true }
    ]
  },
  {
    id: 6,
    title: 'Backend Developer (Java)',
    company: 'Global Software',
    location: 'Quận Nam Từ Liêm, Hà Nội',
    salary: '1,200 - 2,000 USD',
    appliedDate: '28/06/2026',
    status: 'applied',
    logo: 'G',
    matchScore: 90,
    cvName: 'CV_NguyenVanA_Java.pdf',
    coverLetter: 'Kinh nghiệm 3 năm phát triển Spring Boot RESTful API.',
    hrContact: { name: 'Vũ Thanh Thảo', email: 'hr@globalsoft.com', phone: '0977 444 555' },
    timeline: [
      { step: 'Nộp hồ sơ thành công', date: '28/06/2026', done: true, active: true },
      { step: 'HR chờ xử lý', date: 'Chưa xem', done: false }
    ]
  }
];

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
  const [selectedJob, setSelectedJob] = useState<typeof mockAppliedJobs[0] | null>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const filteredJobs = filter === 'all' 
    ? mockAppliedJobs 
    : mockAppliedJobs.filter(job => job.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden">
      <CandidateSidebar activeItem="applied" onNavigate={onNavigate} />
      
      <div className={`flex-1 flex flex-col min-w-0 ${selectedJob ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <CandidateHeader title="Lịch sử ứng tuyển" onNavigate={onNavigate} />

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-xl font-bold text-slate-800">Lịch sử ứng tuyển</h1>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm công việc..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Tổng CV đã nộp</p>
              <div className="text-xl font-bold text-indigo-700">15</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Đã ứng tuyển</p>
              <div className="text-xl font-bold text-slate-700">2</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">HR đã xem</p>
              <div className="text-xl font-bold text-amber-700">4</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Phỏng vấn</p>
              <div className="text-xl font-bold text-blue-700">3</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Chưa phù hợp</p>
              <div className="text-xl font-bold text-rose-700">4</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm text-center">
              <p className="text-xs text-slate-500 mb-1 font-medium">Offer Letter</p>
              <div className="text-xl font-bold text-emerald-700">1</div>
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
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
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
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          Xem chi tiết
                        </button>
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
                  {selectedJob.status === 'applied' && (
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
                          onClick={() => { setSelectedJob(null); setShowWithdrawConfirm(false); }}
                          className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          Đồng ý
                        </button>
                        <button 
                          onClick={() => setShowWithdrawConfirm(false)}
                          className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 cursor-pointer"
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
