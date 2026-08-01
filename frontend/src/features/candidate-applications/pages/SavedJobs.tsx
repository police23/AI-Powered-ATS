import React, { useState } from 'react';
import { Search, MapPin, Building, DollarSign, Bookmark, Trash2, ArrowRight, Clock } from 'lucide-react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import Footer from '../../../layouts/Footer';

const initialSavedJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer (React/Next.js)',
    company: 'TechCorp Vietnam',
    location: 'Quận 1, TP. HCM',
    salary: '2,000 - 3,500 USD',
    type: 'Toàn thời gian',
    savedDate: '22/07/2026',
    postedAt: '2 giờ trước',
    deadline: '30/12/2026',
    isExpired: false,
    logo: 'T',
    tags: ['React', 'Next.js', 'TypeScript']
  },
  {
    id: 2,
    title: 'UX/UI Designer Lead',
    company: 'Creative Agency',
    location: 'Quận 3, TP. HCM',
    salary: 'Thoả thuận',
    type: 'Toàn thời gian',
    savedDate: '21/07/2026',
    postedAt: '1 ngày trước',
    deadline: '28/12/2026',
    isExpired: false,
    logo: 'C',
    tags: ['Figma', 'UI/UX', 'Design System']
  },
  {
    id: 3,
    title: 'Product Manager (B2B SaaS)',
    company: 'NexusHR Solutions',
    location: 'Quận Cầu Giấy, Hà Nội',
    salary: 'Up to $3000',
    type: 'Toàn thời gian',
    savedDate: '20/07/2026',
    postedAt: '20 ngày trước',
    deadline: '15/07/2026',
    isExpired: true,
    logo: 'N',
    tags: ['Product Management', 'SaaS', 'B2B']
  }
];

export default function SavedJobs({ onNavigate, onJobClick }: { onNavigate: (item: string) => void, onJobClick?: () => void }) {
  const [savedJobs, setSavedJobs] = useState(initialSavedJobs);

  const handleRemove = (id: number) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden">
      <CandidateSidebar activeItem="saved" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <CandidateHeader title="Việc làm đã lưu" onNavigate={onNavigate} />
        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">Việc làm đã lưu</h1>
              <span className="bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs font-bold border border-slate-200">
                {savedJobs.length}
              </span>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => onJobClick && onJobClick()} 
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer ${
                    job.isExpired 
                      ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300' 
                      : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="mb-2.5 flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 font-bold text-slate-500 text-base shrink-0 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                        {job.logo}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRemove(job.id); }}
                          className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                          title="Bỏ lưu"
                        >
                          <Trash2 size={16} />
                        </button>
                        <span className="text-[11px] text-slate-400">Đăng tuyển {job.postedAt}</span>
                      </div>
                    </div>
                    
                    <h3 className={`mb-1 text-base font-bold transition-colors line-clamp-1 ${job.isExpired ? 'text-slate-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>
                      {job.title}
                    </h3>
                    <p className="mb-2 text-xs font-medium text-slate-500">{job.company}</p>
                    
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                        {job.type}
                      </span>
                      {job.tags.map((tag, index) => (
                        <span key={index} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between border-t border-slate-100 pt-2.5 gap-2">
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${job.isExpired ? 'text-slate-500' : 'text-green-600'}`}>{job.salary}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                      {job.isExpired ? (
                        <span className="text-xs font-semibold text-rose-600 bg-rose-50/80 px-2.5 py-1 rounded-md border border-rose-200 flex items-center gap-1">
                          <Clock size={13} /> Hết hạn ứng tuyển
                        </span>
                      ) : (
                        <>
                          <span className="text-[11px] font-medium text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 w-fit">
                            Hạn ứng tuyển: {job.deadline}
                          </span>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-auto text-center cursor-pointer">
                            Ứng tuyển
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed col-span-1 xl:col-span-2">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="text-slate-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có công việc nào được lưu</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                  Khám phá hàng ngàn cơ hội việc làm hấp dẫn và lưu lại để ứng tuyển sau.
                </p>
                <button 
                  onClick={() => onNavigate('discover')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Khám phá việc làm
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
