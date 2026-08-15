import React, { useState } from 'react';
import { 
  Briefcase, ArrowLeft, Plus, Trash2, CheckCircle2, ChevronRight, ChevronLeft, X, 
  Sparkles, DollarSign, MapPin, Clock, Building2, Users, Award, ShieldCheck, 
  Eye, Save, Calendar, Zap, Check, Tag, FileText, Gift, HelpCircle, Layers, Loader2
} from 'lucide-react';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import Footer from '../../../layouts/Footer';
import { employerJobApi } from '../api/job.api';

interface PostJobProps {
  onBack: () => void;
  onComplete: () => void;
  onNavigate?: (item: string) => void;
}

const POPULAR_TITLES = [
  'Senior React Developer',
  'Fullstack Node.js Engineer',
  'UI/UX Product Designer',
  'Product Manager',
  'Data Analyst / Scientist',
  'Digital Marketing Manager'
];

const POPULAR_SKILLS = [
  'React.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Figma', 'Python', 
  'PostgreSQL', 'Docker', 'REST API', 'UI/UX Design', 'English Advanced', 'Agile/Scrum'
];

const BENEFIT_OPTIONS = [
  { id: 'macbook', icon: '💻', title: 'Thiết bị cao cấp', desc: 'Cấp Macbook Pro & màn hình 4K' },
  { id: 'insurance', icon: '🏥', title: 'Bảo hiểm PVI', desc: 'Bảo hiểm sức khỏe toàn diện' },
  { id: 'leave', icon: '🌴', title: 'Phép năm 15+', desc: '15-18 ngày phép + Sick leave' },
  { id: 'bonus', icon: '🎁', title: 'Thưởng tháng 13', desc: 'Thưởng hiệu suất & Lễ tết' },
  { id: 'hybrid', icon: '⏰', title: 'Làm việc Hybrid', desc: 'Linh hoạt 2 ngày WFH/tuần' },
  { id: 'travel', icon: '✈️', title: 'Du lịch hàng năm', desc: 'Company trip & Teambuilding' },
  { id: 'course', icon: '📚', title: 'Học tập & Chứng chỉ', desc: 'Trợ cấp $500 - $1,000/năm' },
  { id: 'snack', icon: '☕', title: 'Pantry miễn phí', desc: 'Trà, cà phê, bánh ngọt tự do' }
];

export default function PostJob({ onBack, onComplete, onNavigate }: PostJobProps) {
  const [step, setStep] = useState(1);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [level, setLevel] = useState('Senior');
  const [jobType, setJobType] = useState('full-time');
  const [location, setLocation] = useState('Quận 1, TP. Hồ Chí Minh (Hoặc Hybrid)');
  const [headcount, setHeadcount] = useState('2');
  const [expiryDate, setExpiryDate] = useState('2026-08-30');
  const [interviewRoundsCount, setInterviewRoundsCount] = useState(3);
  const [interviewRounds, setInterviewRounds] = useState<string[]>(['HR Interview', 'Technical Interview', 'General Manager Interview']);
  const [contactEmail, setContactEmail] = useState('hr@techcorp.vn');
  const [contactPhone, setContactPhone] = useState('0987654321');

  const handleRoundsCountChange = (count: number) => {
    setInterviewRoundsCount(count);
    const newRounds = [...interviewRounds];
    if (count > newRounds.length) {
      for (let i = newRounds.length; i < count; i++) {
        newRounds.push('Technical Interview');
      }
    } else {
      newRounds.splice(count);
    }
    setInterviewRounds(newRounds);
  };

  const handleRoundChange = (index: number, value: string) => {
    const newRounds = [...interviewRounds];
    newRounds[index] = value;
    setInterviewRounds(newRounds);
  };

  const hasDuplicateRounds = new Set(interviewRounds).size !== interviewRounds.length;

  // Salary
  const [salaryType, setSalaryType] = useState<'range' | 'upto' | 'negotiable'>('range');
  const [minSalary, setMinSalary] = useState('25.000.000');
  const [maxSalary, setMaxSalary] = useState('40.000.000');
  const [currency, setCurrency] = useState('VND');

  // Details
  const [description, setDescription] = useState(
    'Chúng tôi đang tìm kiếm Senior React Developer xuất sắc để tham gia vào đội ngũ phát triển sản phẩm NexusHR platform. Bạn sẽ tham gia trực tiếp xây dựng các tính năng cốt lõi, tối ưu trải nghiệm người dùng và thiết kế kiến trúc Frontend mở rộng.'
  );
  const [requirements, setRequirements] = useState(
    '• Tối thiểu 3+ năm kinh nghiệm làm việc thực tế với React.js, TypeScript\n' +
    '• Thành thạo Tailwind CSS, State Management (Zustand/Redux), RESTful API\n' +
    '• Có kinh nghiệm tối ưu hóa hiệu năng web (Core Web Vitals, Bundle size)\n' +
    '• Khả năng đọc hiểu tài liệu tiếng Anh tốt, tư duy sản phẩm chủ động'
  );
  const [skills, setSkills] = useState<string[]>(['React.js', 'TypeScript', 'Tailwind CSS', 'REST API']);
  const [customSkill, setCustomSkill] = useState('');
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(['macbook', 'insurance', 'bonus', 'hybrid']);

  // Skill management
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCustomSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Benefit toggle
  const toggleBenefit = (id: string) => {
    if (selectedBenefits.includes(id)) {
      setSelectedBenefits(selectedBenefits.filter(b => b !== id));
    } else {
      setSelectedBenefits([...selectedBenefits, id]);
    }
  };

  // AI Generator mock
  const handleGenerateAI = () => {
    if (!jobTitle) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      setDescription(
        `Vị trí ${jobTitle} đóng vai trò then chốt trong việc xây dựng và phát triển các hệ thống cốt lõi tại TechCorp.\n` +
        `• Chịu trách nhiệm phân tích yêu cầu, thiết kế và triển khai các mô-đun phần mềm chất lượng cao.\n` +
        `• Hợp tác chặt chẽ với Product Manager, UI/UX Designer và QA để đảm bảo tiến độ và chất lượng sản phẩm.\n` +
        `• Đề xuất cải tiến công nghệ, refactor code và hướng dẫn các thành viên Junior trong team.`
      );
      setRequirements(
        `• Có từ 2-4 năm kinh nghiệm làm việc ở vị trí tương đương (${jobTitle})\n` +
        '• Thành thạo các công nghệ cốt lõi và có tư duy logic, lập trình sạch (Clean Code)\n' +
        '• Kỹ năng giải quyết vấn đề tốt, chịu được áp lực cao và có tinh thần trách nhiệm\n' +
        '• Giao tiếp hiệu quả, làm việc nhóm chủ động'
      );
      setIsGeneratingAI(false);
    }, 1000);
  };

  const handlePublish = async (statusOverride = 'PUBLISHED') => {
    try {
      setIsSubmitting(true);

      const parsedMin = (salaryType === 'negotiable' || !minSalary) ? undefined : Number(minSalary.toString().replace(/\./g, '').replace(/,/g, ''));
      const parsedMax = (salaryType === 'negotiable' || !maxSalary) ? undefined : Number(maxSalary.toString().replace(/\./g, '').replace(/,/g, ''));

      let mappedCity = 'HCM';
      if (location.includes('Hà Nội')) mappedCity = 'HN';
      else if (location.includes('Đà Nẵng')) mappedCity = 'DN';
      else if (location.includes('Cần Thơ')) mappedCity = 'CT';
      else if (location.includes('Hải Phòng')) mappedCity = 'HP';

      let mappedEmploymentType = 'FULL_TIME';
      if (jobType === 'part-time') mappedEmploymentType = 'PART_TIME';
      else if (jobType === 'remote') mappedEmploymentType = 'REMOTE';
      else if (jobType === 'hybrid') mappedEmploymentType = 'HYBRID';
      else if (jobType === 'contract') mappedEmploymentType = 'CONTRACT';

      let mappedExp = 'THREE_TO_FIVE';
      if (level === 'Fresher') mappedExp = 'FRESHER';
      else if (level === 'Junior') mappedExp = 'ONE_TO_TWO';
      else if (level === 'Mid-Level') mappedExp = 'TWO_TO_THREE';
      else if (level === 'Senior') mappedExp = 'THREE_TO_FIVE';
      else if (level === 'Lead') mappedExp = 'OVER_FIVE';

      let formattedExpiredAt: string | undefined = undefined;
      if (expiryDate && !isNaN(new Date(expiryDate).getTime())) {
        formattedExpiredAt = new Date(expiryDate).toISOString();
      } else {
        formattedExpiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      const payload = {
        title: jobTitle || 'Bài tuyển dụng mới',
        companyName: 'TechCorp Vietnam',
        companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
        city: mappedCity,
        addressDetail: location,
        employmentType: mappedEmploymentType,
        experienceLevel: mappedExp,
        salaryMin: parsedMin,
        salaryMax: parsedMax,
        isNegotiableSalary: salaryType === 'negotiable',
        currency: currency || 'VND',
        description: description || 'Chi tiết bài tuyển dụng',
        requirements: requirements,
        benefits: selectedBenefits.join(', '),
        status: statusOverride,
        expiredAt: formattedExpiredAt
      };

      await employerJobApi.createJob(payload);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Lỗi khi đăng bài tuyển dụng:', err);
      alert('Không thể tạo bài tuyển dụng. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Employer Sidebar */}
      <EmployerSidebar activeItem="jobs" onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Universal Employer Header */}
        <EmployerHeader 
          onNavigate={onNavigate}
          title={
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack} 
                className="text-slate-500 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 -ml-1"
                title="Quay lại"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="h-5 w-px bg-slate-200"></div>
              <h1 className="text-xl font-bold text-slate-800">Đăng tin tuyển dụng mới</h1>
              <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Bản nháp
              </span>
            </div>
          }
        />

        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {/* Multi-step Stepper Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 relative">
              {[
                { id: 1, name: '1. Thông tin' },
                { id: 2, name: '2. Yêu cầu' },
                { id: 3, name: '3. Quy trình' },
                { id: 4, name: '4. Đãi ngộ' },
                { id: 5, name: '5. Xem & Đăng' }
              ].map((s) => {
                const isActive = step === s.id;
                const isDone = step > s.id;
                return (
                  <div 
                    key={s.id}
                    onClick={() => s.id < step && setStep(s.id)}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      s.id < step ? 'cursor-pointer hover:bg-slate-50' : ''
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isDone 
                        ? 'bg-emerald-600 text-white' 
                        : isActive 
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {isDone ? <Check size={16} strokeWidth={3} /> : s.id}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-indigo-600' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                        {s.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Bar Line */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1: THÔNG TIN CHUNG */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="text-indigo-600" size={22} /> Thông tin vị trí tuyển dụng
                </h2>
                <p className="text-sm text-slate-500 mt-1">Điền các thông tin tổng quan giúp ứng viên dễ dàng nhận diện cơ hội việc làm.</p>
              </div>

              <div className="space-y-5">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Chức danh công việc <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="VD: Senior React Developer / Product Designer" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm font-medium"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  
                  {/* Popular Job Title Chips */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Gợi ý nhanh:</span>
                    {POPULAR_TITLES.map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => setJobTitle(title)}
                        className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
                      >
                        + {title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department & Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phòng ban / Khối</label>
                    <select 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm bg-white"
                    >
                      <option value="Engineering">Phát triển Phần mềm (Engineering)</option>
                      <option value="Product">Quản lý Sản phẩm (Product)</option>
                      <option value="Design">Thiết kế (UI/UX - Creative)</option>
                      <option value="Marketing">Marketing & Truyền thông</option>
                      <option value="Sales">Kinh doanh & Bán hàng</option>
                      <option value="HR">Nhân sự & Tuyển dụng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cấp bậc vị trí</label>
                    <select 
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm bg-white"
                    >
                      <option value="Intern / Fresher">Intern / Fresher</option>
                      <option value="Junior">Junior (1 - 2 năm)</option>
                      <option value="Middle">Middle (2 - 4 năm)</option>
                      <option value="Senior">Senior (4+ năm)</option>
                      <option value="Lead / Manager">Lead / Manager</option>
                      <option value="Director">Director / C-Level</option>
                    </select>
                  </div>
                </div>

                {/* Job Type & Headcount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hình thức làm việc</label>
                    <select 
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm bg-white"
                    >
                      <option value="full-time">Full-time (Toàn thời gian)</option>
                      <option value="part-time">Part-time (Bán thời gian)</option>
                      <option value="hybrid">Hybrid (Linh hoạt Office & Remote)</option>
                      <option value="remote">Remote (Từ xa 100%)</option>
                      <option value="freelance">Freelance / Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số lượng tuyển dụng</label>
                    <input 
                      type="number" 
                      min="1"
                      placeholder="VD: 2" 
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa điểm làm việc</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="VD: Tòa nhà TechCorp, 123 Nguyễn Huệ, Quận 1, TP.HCM" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm"
                    />
                  </div>
                </div>



                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email nhận hồ sơ</label>
                    <input 
                      type="email" 
                      placeholder="VD: hr@congty.com" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại liên hệ</label>
                    <input 
                      type="tel" 
                      placeholder="VD: 0987654321" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={onBack}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  disabled={!jobTitle.trim()}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  Tiếp theo: Mô tả & Yêu cầu <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MÔ TẢ & YÊU CẦU */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-indigo-600" size={22} /> Chi tiết mô tả & Yêu cầu
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Cung cấp mô tả sinh động, hấp dẫn để thu hút đúng ứng viên phù hợp.</p>
                </div>

                {/* AI Assistant Button */}
                <button 
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || !jobTitle}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shrink-0 self-start sm:self-auto"
                >
                  <Sparkles size={16} className={isGeneratingAI ? 'animate-spin' : 'text-indigo-600'} />
                  {isGeneratingAI ? 'Đang tạo nội dung AI...' : 'AI Gợi ý nội dung JD'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mô tả công việc (Job Description)</label>
                  <textarea 
                    rows={5}
                    placeholder="Nhập chi tiết nhiệm vụ hàng ngày, định hướng công việc..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm leading-relaxed"
                  ></textarea>
                </div>

                {/* Key Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Yêu cầu công việc (Job Requirements)</label>
                  <textarea 
                    rows={5}
                    placeholder="Nhập chi tiết các yêu cầu công việc, bằng cấp, kỹ năng, kinh nghiệm cần có..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full p-4 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm leading-relaxed"
                  ></textarea>
                </div>

                {/* Tech Skills & Tags */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Từ khóa kỹ năng / Công nghệ bắt buộc</label>
                  
                  {/* Selected Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[48px]">
                    {skills.map((skill) => (
                      <span 
                        key={skill}
                        className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs"
                      >
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-200">
                          <X size={12} />
                        </button>
                      </span>
                    ))}

                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Thêm kỹ năng khác..."
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(customSkill);
                          }
                        }}
                        className="bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 min-w-[120px]"
                      />
                    </div>
                  </div>

                  {/* Popular skills click-to-add */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Chọn nhanh:</span>
                    {POPULAR_SKILLS.filter(s => !skills.includes(s)).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        className="text-xs bg-white hover:bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={18} /> Quay lại
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  Tiếp theo: Quy trình phỏng vấn <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: QUY TRÌNH PHỎNG VẤN */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="text-indigo-600" size={22} /> Thiết lập Quy trình phỏng vấn
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Định nghĩa các vòng phỏng vấn cho vị trí này. Mỗi vòng sẽ tương ứng với một cột trong bảng quản lý ứng viên (Kanban).
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số lượng vòng phỏng vấn</label>
                  <select 
                    value={interviewRoundsCount}
                    onChange={(e) => handleRoundsCountChange(parseInt(e.target.value))}
                    className="w-full sm:w-64 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-sm bg-white"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} vòng</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-semibold text-slate-800">Chi tiết các vòng phỏng vấn</h3>
                    {hasDuplicateRounds && (
                      <span className="text-xs font-medium text-rose-500">
                        Lỗi: Các vòng phỏng vấn không được trùng nhau
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {interviewRounds.map((round, index) => {
                      const isDuplicate = interviewRounds.indexOf(round) !== index && interviewRounds.lastIndexOf(round) !== index;
                      const hasDuplicateError = interviewRounds.filter(r => r === round).length > 1;

                      return (
                      <div key={index} className={`p-4 rounded-xl border ${hasDuplicateError ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${hasDuplicateError ? 'text-rose-600' : 'text-slate-500'}`}>Vòng {index + 1}</label>
                        <select 
                          value={round}
                          onChange={(e) => handleRoundChange(index, e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border outline-none transition-all text-sm bg-white ${hasDuplicateError ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-rose-700' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-700'}`}
                        >
                          <option value="HR Interview">HR Interview (Phỏng vấn nhân sự)</option>
                          <option value="Technical Interview">Technical Interview (Phỏng vấn kỹ thuật)</option>
                          <option value="General Manager Interview">General Manager Interview (Phỏng vấn quản lý)</option>
                          <option value="Culture Fit Interview">Culture Fit (Phù hợp văn hóa)</option>
                          <option value="Portfolio Review">Portfolio Review (Đánh giá năng lực)</option>
                          <option value="Bài Test Kỹ Thuật">Bài Test Kỹ Thuật</option>
                          <option value="Final Interview">Final Interview (Vòng cuối)</option>
                        </select>
                      </div>
                    )})}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={18} /> Quay lại
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(4)}
                  disabled={hasDuplicateRounds}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  Tiếp theo: Lương & Đãi ngộ <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: MỨC LƯƠNG & ĐÃI NGỘ */}
          {step === 4 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <DollarSign className="text-emerald-600" size={22} /> Mức lương & Chế độ đãi ngộ
                </h2>
                <p className="text-sm text-slate-500 mt-1">Chế độ đãi ngộ minh bạch là yếu tố quan trọng hàng đầu thu hút nhân tài.</p>
              </div>

              <div className="space-y-6">
                {/* Salary Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Chế độ lương</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'range', label: 'Khoảng lương (Min - Max)', desc: 'VD: 25 - 40 triệu' },
                      { id: 'upto', label: 'Up to (Tối đa)', desc: 'VD: Lên tới $2,500' },
                      { id: 'negotiable', label: 'Cạnh tranh / Thỏa thuận', desc: 'Thỏa thuận theo năng lực' }
                    ].map((st) => (
                      <div 
                        key={st.id}
                        onClick={() => setSalaryType(st.id as any)}
                        className={`p-3.5 border rounded-xl cursor-pointer transition-all ${
                          salaryType === st.id 
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-100' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <p className="text-sm font-bold">{st.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Input details */}
                {salaryType !== 'negotiable' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Đơn vị tiền tệ</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                        <button 
                          type="button" 
                          onClick={() => setCurrency('VND')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${currency === 'VND' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                        >
                          VNĐ
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setCurrency('USD')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${currency === 'USD' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                        >
                          USD ($)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {salaryType === 'range' && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Mức lương tối thiểu ({currency})</label>
                          <input 
                            type="text" 
                            value={minSalary}
                            onChange={(e) => setMinSalary(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white rounded-lg border border-slate-300 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          {salaryType === 'upto' ? `Mức lương tối đa (${currency})` : `Mức lương tối đa (${currency})`}
                        </label>
                        <input 
                          type="text" 
                          value={maxSalary}
                          onChange={(e) => setMaxSalary(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white rounded-lg border border-slate-300 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits Selector Grid */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center justify-between">
                    <span>Phúc lợi & Chế độ đãi ngộ</span>
                    <span className="text-xs text-slate-500 font-normal">Đã chọn ({selectedBenefits.length})</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BENEFIT_OPTIONS.map((benefit) => {
                      const isSelected = selectedBenefits.includes(benefit.id);
                      return (
                        <div 
                          key={benefit.id}
                          onClick={() => toggleBenefit(benefit.id)}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-200' 
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="text-2xl">{benefit.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800">{benefit.title}</p>
                            <p className="text-xs text-slate-500">{benefit.desc}</p>
                          </div>
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hạn chót nhận hồ sơ</label>
                  <div className="relative max-w-xs">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={18} /> Quay lại
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  Tiếp theo: Xem trước & Đăng <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: XEM TRƯỚC & ĐĂNG TIN */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Eye className="text-indigo-400" size={22} /> Xem trước tin đăng trên hệ thống
                  </h2>
                  <p className="text-xs text-indigo-200 mt-1">
                    Đây là hình ảnh thẻ việc làm hiển thị thực tế cho ứng viên trên NexusHR Job Board.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-indigo-300">Trạng thái sẵn sàng:</span>
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <CheckCircle2 size={16} /> Hoàn tất 100%
                  </p>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 md:p-8 shadow-lg space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-bl-xl">
                  Mô phỏng hiển thị
                </div>

                {/* Company & Title Header */}
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl border border-indigo-200 shrink-0">
                    T
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{jobTitle || 'Chưa nhập chức danh'}</h3>
                    <p className="text-sm text-slate-600 font-medium">TechCorp Vietnam • <span className="text-indigo-600">{department}</span></p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <DollarSign size={14} /> 
                        {salaryType === 'negotiable' 
                          ? 'Thỏa thuận' 
                          : salaryType === 'upto' 
                            ? `Up to ${maxSalary} ${currency}` 
                            : `${minSalary} - ${maxSalary} ${currency}`}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                        <MapPin size={14} /> {location}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Briefcase size={14} /> {jobType.toUpperCase()} ({level})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills Badges */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    {skills.map((skill) => (
                      <span key={skill} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description Preview */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Mô tả công việc:</h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {description}
                  </p>
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Yêu cầu ứng viên:</h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {requirements}
                  </p>
                </div>

                {/* Pipeline Preview */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quy trình phỏng vấn:</h4>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Layers size={18} className="text-indigo-500" />
                    <div className="flex flex-wrap items-center gap-2">
                      {interviewRounds.map((round, index) => (
                        <React.Fragment key={index}>
                          <span className="font-medium">{round}</span>
                          {index < interviewRounds.length - 1 && <ChevronRight size={14} className="text-slate-400" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Benefits Preview */}
                {selectedBenefits.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Quyền lợi dành cho bạn:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {selectedBenefits.map((bId) => {
                        const bObj = BENEFIT_OPTIONS.find(b => b.id === bId);
                        if (!bObj) return null;
                        return (
                          <div key={bId} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
                            <span>{bObj.icon}</span>
                            <span className="truncate">{bObj.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  type="button" 
                  onClick={() => setStep(4)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                >
                  <ChevronLeft size={18} /> Chỉnh sửa thông tin
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => handlePublish('DRAFT')}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu bản nháp
                  </button>
                  <button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => handlePublish('PUBLISHED')}
                    className="flex-1 sm:flex-none px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />} Đăng tuyển ngay
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Đăng tin tuyển dụng thành công!</h3>
              <p className="text-sm text-slate-500 mt-2">
                Tin đăng <span className="font-bold text-slate-800">"{jobTitle}"</span> đã được xuất bản chính thức trên hệ thống NexusHR.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 text-left">
              <p>• Mã công việc: <strong className="text-slate-800">JOB-2026-992</strong></p>
              <p>• Thời gian tạo: <strong className="text-slate-800">Hôm nay, 20:52</strong></p>
              <p>• Trạng thái: <span className="text-emerald-600 font-bold">Đang hiển thị công khai</span></p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={onComplete}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                Trở về Quản lý tin tuyển dụng
              </button>
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setStep(1);
                  setJobTitle('');
                }}
                className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Đăng thêm tin khác
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
