import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Building, Clock, DollarSign, Bookmark, CheckCircle2, Users, Box, ExternalLink, Briefcase, Image as ImageIcon, Loader2, Heart } from 'lucide-react';
import Footer from '../../../layouts/Footer';
import { jobSearchApi, JobDetail as JobDetailType } from '../../job-search/api/jobSearch.api';

export default function JobDetail({ 
  jobId,
  onBack, 
  onApply, 
  hideHeader = false, 
  onViewCompany, 
  isPublic = false, 
  onLoginClick, 
  onHomeClick 
}: { 
  jobId?: string;
  onBack: () => void; 
  onApply: () => void; 
  hideHeader?: boolean; 
  onViewCompany?: () => void; 
  isPublic?: boolean; 
  onLoginClick?: () => void; 
  onHomeClick?: () => void 
}) {
  const [job, setJob] = useState<JobDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await jobSearchApi.getJobDetail(jobId);
        setJob(data);
        setIsSaved(data.isSaved || false);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết bài tuyển dụng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [jobId]);

  const handleToggleSave = async () => {
    if (!jobId) return;
    if (isPublic && onLoginClick) {
      onLoginClick();
      return;
    }

    try {
      if (isSaved) {
        await jobSearchApi.unsaveJob(jobId);
        setIsSaved(false);
      } else {
        await jobSearchApi.saveJob(jobId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Lỗi khi lưu bài tuyển dụng:', err);
    }
  };

  const formatSalary = (j: JobDetailType) => {
    if (j.isNegotiableSalary) return 'Lương thỏa thuận';
    if (j.salaryMin && j.salaryMax) {
      return `${(j.salaryMin / 1000000).toFixed(0)} - ${(j.salaryMax / 1000000).toFixed(0)} triệu ${j.currency || 'VND'}`;
    }
    if (j.salaryMin) return `Từ ${(j.salaryMin / 1000000).toFixed(0)} triệu ${j.currency || 'VND'}`;
    if (j.salaryMax) return `Đến ${(j.salaryMax / 1000000).toFixed(0)} triệu ${j.currency || 'VND'}`;
    return 'Lương thỏa thuận';
  };

  const formatEmploymentType = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'Toàn thời gian';
      case 'PART_TIME': return 'Bán thời gian';
      case 'REMOTE': return 'Làm việc từ xa';
      case 'HYBRID': return 'Hybrid';
      case 'CONTRACT': return 'Hợp đồng ngắn hạn';
      default: return type || 'Toàn thời gian';
    }
  };

  const formatExperienceLevel = (level: string) => {
    switch (level) {
      case 'FRESHER': return 'Fresher';
      case 'UNDER_ONE_YEAR': return 'Dưới 1 năm kinh nghiệm';
      case 'ONE_TO_TWO': return '1 - 2 năm kinh nghiệm';
      case 'TWO_TO_THREE': return '2 - 3 năm kinh nghiệm';
      case 'THREE_TO_FIVE': return '3 - 5 năm kinh nghiệm';
      case 'OVER_FIVE': return 'Trên 5 năm kinh nghiệm';
      default: return level || 'Không yêu cầu';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 size={36} className="animate-spin text-indigo-600" />
          <span className="text-sm font-medium">Đang tải chi tiết việc làm...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Briefcase size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Không tìm thấy công việc yêu cầu</h2>
        <p className="text-sm text-slate-500 mb-6">Bài tuyển dụng này có thể đã hết hạn hoặc bị gỡ bỏ.</p>
        <button onClick={onBack} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Quay lại danh sách việc làm
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        {/* Main Public Header */}
        {isPublic && (
          <header className="w-full border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onHomeClick && onHomeClick()}>
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

        {/* Navigation Header */}
        {!hideHeader && (
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleToggleSave}
                  title={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
                  className={`flex items-center justify-center h-10 w-10 rounded-lg border transition-colors cursor-pointer ${isSaved ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={onApply}
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Ứng tuyển ngay
                </button>
              </div>
            </div>
          </header>
        )}

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Header Info */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-400 text-2xl overflow-hidden">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                    ) : (
                      job.companyName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">{job.title}</h1>
                    <p className="text-lg font-medium text-indigo-600 mb-4">{job.companyName}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.city} {job.addressDetail ? `- ${job.addressDetail}` : ''}</span>
                      <span className="flex items-center gap-1.5 font-bold text-green-600"><DollarSign size={16} /> {formatSalary(job)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} /> {job.viewsCount || 0} lượt xem</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-500">Thông tin:</span>
                  <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {formatEmploymentType(job.employmentType)}
                  </span>
                  <span className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                    {formatExperienceLevel(job.experienceLevel)}
                  </span>
                </div>
              </div>

              {/* Match Highlight */}
              <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
                <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                  <CheckCircle2 size={20} />
                  <span>Độ phù hợp công việc</span>
                </div>
                <p className="text-sm text-indigo-900/80 mb-4">
                  Dựa trên các kỹ năng được yêu cầu, đây là cơ hội tuyệt vời để phát triển sự nghiệp của bạn.
                </p>
                <div className="flex gap-4">
                  <div className="text-3xl font-extrabold text-indigo-600 leading-none -mt-1">95%</div>
                  <div className="flex-1 pt-2">
                    <div className="h-2 w-full bg-indigo-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <div className="text-xs font-medium text-indigo-600 mt-1 text-right">Rất phù hợp</div>
                  </div>
                </div>
              </div>

              {/* Job Description Sections */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Chi tiết công việc</h2>
                
                <div className="space-y-6 text-slate-600">
                  {job.description && (
                    <div>
                      <h3 className="text-base font-bold text-slate-800 mb-3">Mô tả công việc</h3>
                      <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {job.description}
                      </div>
                    </div>
                  )}

                  {job.requirements && (
                    <div>
                      <h3 className="text-base font-bold text-slate-800 mb-3">Yêu cầu ứng viên</h3>
                      <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {job.requirements}
                      </div>
                    </div>
                  )}

                  {job.benefits && (
                    <div>
                      <h3 className="text-base font-bold text-slate-800 mb-3">Quyền lợi</h3>
                      <div className="whitespace-pre-line text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {job.benefits}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white overflow-hidden p-2 shadow-sm">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="font-bold text-slate-400 text-2xl">
                        {job.companyName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">
                    {job.companyName}
                  </h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 text-sm">
                    <Building size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-500 w-20 shrink-0">Địa điểm:</span>
                    <span className="text-slate-800 font-medium leading-relaxed">{job.city} {job.addressDetail ? `- ${job.addressDetail}` : ''}</span>
                  </div>
                </div>

                {onViewCompany && (
                  <button onClick={(e) => { e.preventDefault(); onViewCompany(); }} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-indigo-500 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors cursor-pointer">
                    Xem trang công ty <ExternalLink size={16} />
                  </button>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Thông tin chung</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-0.5">Kinh nghiệm</p>
                      <p className="font-bold text-slate-800">{formatExperienceLevel(job.experienceLevel)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-0.5">Loại hình làm việc</p>
                      <p className="font-bold text-slate-800">{formatEmploymentType(job.employmentType)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
