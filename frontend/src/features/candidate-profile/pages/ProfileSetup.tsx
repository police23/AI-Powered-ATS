import React, { useState } from 'react';
import { Upload, CheckCircle2, ChevronRight, User, FileText, Briefcase, Award } from 'lucide-react';
import Footer from '../../../layouts/Footer';

export default function ProfileSetup({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Thông tin cơ bản', icon: User },
    { id: 2, title: 'Upload CV', icon: FileText },
    { id: 3, title: 'Kinh nghiệm & Kỹ năng', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white">
              <Briefcase size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Nexus<span className="text-indigo-600">ATS</span>
            </span>
          </div>
          <div className="text-sm text-slate-500 font-medium">Thiết lập hồ sơ</div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
        
        {/* Sidebar Steps */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Tiến trình</h3>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="relative flex items-center gap-4">
                    {index !== steps.length - 1 && (
                      <div className={`absolute left-[1.125rem] top-10 h-full w-[2px] -translate-x-1/2 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    )}
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white z-10 transition-colors ${
                      isCompleted ? 'border-indigo-600 bg-indigo-600 text-white' : 
                      isActive ? 'border-indigo-600 text-indigo-600' : 'border-slate-300 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : <StepIcon size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                        {step.title}
                      </span>
                      <span className="text-xs text-slate-400">Bước {step.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px] flex flex-col">
            
            {currentStep === 1 && (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Cập nhật ảnh đại diện & Chức danh</h2>
                <p className="text-slate-500 mb-8">Hãy để nhà tuyển dụng nhận diện bạn dễ dàng hơn.</p>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-24 w-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer relative overflow-hidden group">
                    <User size={32} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer">
                      Tải ảnh lên
                    </button>
                    <p className="text-xs text-slate-400 mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chức danh hiện tại</label>
                    <input type="text" placeholder="VD: Senior Frontend Developer" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giới thiệu bản thân (Bio)</label>
                    <textarea rows={4} placeholder="Viết một đoạn ngắn giới thiệu về kinh nghiệm và mục tiêu nghề nghiệp của bạn..." className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Tải lên CV của bạn</h2>
                <p className="text-slate-500 mb-8">CV ấn tượng sẽ giúp bạn nổi bật trong mắt nhà tuyển dụng.</p>

                <div className="border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="h-16 w-16 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={28} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Kéo thả CV vào đây</h4>
                  <p className="text-sm text-slate-500 mb-6">hoặc</p>
                  <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer">
                    Chọn tệp từ máy tính
                  </button>
                  <p className="text-xs text-slate-400 mt-4">Hỗ trợ định dạng .PDF, .DOC, .DOCX (Tối đa 5MB)</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Kỹ năng & Chuyên môn</h2>
                <p className="text-slate-500 mb-8">Thêm các kỹ năng để hệ thống AI có thể gợi ý việc làm chính xác nhất.</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kỹ năng chính</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['ReactJS', 'TypeScript', 'Tailwind CSS'].map(skill => (
                        <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 flex items-center gap-1 cursor-pointer hover:bg-indigo-100">
                          {skill} <span className="text-indigo-400 hover:text-indigo-600 ml-1">&times;</span>
                        </span>
                      ))}
                    </div>
                    <input type="text" placeholder="Nhập thêm kỹ năng và ấn Enter (VD: Node.js, Figma...)" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Số năm kinh nghiệm</label>
                    <select className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">Chọn số năm</option>
                      <option value="0">Chưa có kinh nghiệm (Fresher/Intern)</option>
                      <option value="1-3">1 - 3 năm (Junior)</option>
                      <option value="3-5">3 - 5 năm (Middle)</option>
                      <option value="5+">Trên 5 năm (Senior)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Quay lại
              </button>
              
              <button 
                onClick={() => {
                  if (currentStep < 3) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    onComplete();
                  }
                }}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {currentStep === 3 ? 'Hoàn tất hồ sơ' : 'Tiếp tục'}
                {currentStep !== 3 && <ChevronRight size={16} />}
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
