import { ArrowLeft, MapPin, Building, Clock, DollarSign, Bookmark, CheckCircle2, Users, Box, ExternalLink, BarChart, Briefcase, Image as ImageIcon } from 'lucide-react';
import { mockJobs } from '../../../utils/data';
import Footer from '../../../layouts/Footer';

export default function JobDetail({ onBack, onApply, hideHeader = false, onViewCompany, isPublic = false, onLoginClick, onHomeClick }: { onBack: () => void; onApply: () => void; hideHeader?: boolean; onViewCompany?: () => void; isPublic?: boolean; onLoginClick?: () => void; onHomeClick?: () => void }) {
  const job = mockJobs[1]; // using one of the mock jobs for display

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
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
              <Bookmark size={18} />
            </button>
            <button 
              onClick={onApply}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
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
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-400 text-2xl">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">{job.title}</h1>
                  <p className="text-lg font-medium text-indigo-600 mb-4">{job.company}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salary}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} /> Đăng tuyển {job.postedAt}</span>
                    <span className="flex items-center gap-1.5 font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100"><Clock size={14} className="text-rose-500" /> Hạn ứng tuyển: 30/12/2026</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Kĩ năng:</span>
                {job.tags.map(tag => (
                  <span key={tag} className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>


            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6">
              <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                <CheckCircle2 size={20} />
                <span>Độ phù hợp</span>
              </div>
              <p className="text-sm text-indigo-900/80 mb-4">
                Dựa trên hồ sơ của bạn, công việc này cực kỳ phù hợp với kỹ năng và định hướng phát triển.
              </p>
              <div className="flex gap-4">
                <div className="text-3xl font-extrabold text-indigo-600 leading-none -mt-1">92%</div>
                <div className="flex-1 pt-2">
                  <div className="h-2 w-full bg-indigo-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <div className="text-xs font-medium text-indigo-600 mt-1 text-right">Rất phù hợp</div>
                </div>
              </div>
            </div>
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Chi tiết công việc</h2>
              
              <div className="prose prose-slate max-w-none text-slate-600">
                <h3 className="text-base font-bold text-slate-800">Mô tả công việc</h3>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Phát triển các tính năng mới cho ứng dụng web sử dụng ReactJS và TypeScript.</li>
                  <li>Tối ưu hóa hiệu năng và trải nghiệm người dùng trên đa nền tảng.</li>
                  <li>Làm việc chặt chẽ với đội ngũ UI/UX Designer để hiện thực hóa các thiết kế giao diện.</li>
                  <li>Tham gia review code, đóng góp ý kiến cải thiện kiến trúc hệ thống.</li>
                </ul>

                <h3 className="text-base font-bold text-slate-800">Yêu cầu ứng viên</h3>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Ít nhất 2 năm kinh nghiệm làm việc với ReactJS.</li>
                  <li>Thành thạo JavaScript/TypeScript, HTML5, CSS3.</li>
                  <li>Có kinh nghiệm sử dụng Tailwind CSS hoặc các CSS framework tương đương.</li>
                  <li>Hiểu biết về RESTful APIs và state management (Redux, Zustand, Context API...).</li>
                  <li>Kỹ năng giải quyết vấn đề tốt, có khả năng làm việc độc lập và làm việc nhóm.</li>
                </ul>

                <h3 className="text-base font-bold text-slate-800">Quyền lợi</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Mức lương cạnh tranh, review lương 2 lần/năm.</li>
                  <li>Lương tháng 13, thưởng dự án, thưởng performance.</li>
                  <li>Trang bị MacBook Pro và màn hình phụ khi làm việc.</li>
                  <li>Bảo hiểm sức khỏe cao cấp (Bảo Việt/PVI).</li>
                  <li>Môi trường làm việc trẻ trung, năng động, nhiều cơ hội phát triển.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white overflow-hidden p-2">
                  <div className="flex h-full w-full items-center justify-center font-bold text-slate-400 text-3xl">
                    {job.company.charAt(0)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">
                  {job.company}
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-sm">
                  <Users size={18} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-500 w-20 shrink-0">Quy mô:</span>
                  <span className="text-slate-800 font-medium">10000+ nhân viên</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Box size={18} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-500 w-20 shrink-0">Lĩnh vực:</span>
                  <span className="text-slate-800 font-medium">Tài chính</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Building size={18} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-500 w-20 shrink-0">Địa điểm:</span>
                  <span className="text-slate-800 font-medium leading-relaxed">Tòa nhà FPT Building, số 17 Duy Tân, Cầu Giấy, Hà Nội</span>
                </div>
              </div>

              <button onClick={(e) => { e.preventDefault(); onViewCompany?.(); }} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-indigo-500 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                Xem trang công ty <ExternalLink size={16} />
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Thông tin chung</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">Cấp bậc</p>
                    <p className="font-bold text-slate-800">Nhân viên</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">Số lượng tuyển</p>
                    <p className="font-bold text-slate-800">10 người</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-0.5">Loại hình làm việc</p>
                    <p className="font-bold text-slate-800">Toàn thời gian</p>
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
