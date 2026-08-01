import React, { useState } from 'react';
import { Briefcase, MapPin, Search, Sparkles } from 'lucide-react';
import { mockJobs } from '../../../utils/data';
import { Job } from '../../../types';
import Footer from '../../../layouts/Footer';

export default function JobBoard({ onLoginClick, onJobClick, onSearchClick }: { onLoginClick: () => void, onJobClick: () => void, onSearchClick?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const results = mockJobs.filter(job => {
      const matchQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchLocation = location === '' || job.location.toLowerCase().includes(location.toLowerCase()) || 
                            (location === 'Khac' && !['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'].some(loc => job.location.toLowerCase().includes(loc.toLowerCase())));
                            
      return matchQuery && matchLocation;
    });
    setFilteredJobs(results);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl md:text-6xl">
            Khám phá công việc phù hợp <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              dành riêng cho bạn
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
            Hàng ngàn cơ hội việc làm IT chất lượng cao. Tải CV lên ngay để kết nối với những vị trí tuyển dụng tốt nhất.
          </p>

          {/* Search Bar */}
          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl bg-white p-3 shadow-md shadow-slate-200/50 md:flex-row md:items-center md:rounded-xl border border-slate-200">
            <div className="flex flex-[2] items-center gap-3 px-4 py-2 md:border-r md:border-slate-200">
              <Search size={20} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm theo tên việc làm" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-3 px-4 py-2">
              <MapPin size={20} className="text-slate-400 shrink-0" />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="">Tất cả địa điểm</option>
                <option value="HCM">Hồ Chí Minh</option>
                <option value="HN">Hà Nội</option>
                <option value="DN">Đà Nẵng</option>
                <option value="CT">Cần Thơ</option>
                <option value="HP">Hải Phòng</option>
                <option value="Khac">Khác</option>
              </select>
            </div>
            <button 
              onClick={() => onSearchClick ? onSearchClick() : handleSearch()}
              className="rounded-lg md:rounded-lg bg-indigo-600 px-8 py-3.5 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]">
              Tìm kiếm
            </button>
          </div>
          

        </div>
      </section>

      {/* Job List Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              {hasSearched ? (filteredJobs.length > 0 ? 'Kết quả tìm kiếm' : 'Không tìm thấy kết quả') : 'Việc làm nổi bật'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {hasSearched 
                ? (filteredJobs.length > 0 ? `Tìm thấy ${filteredJobs.length} việc làm phù hợp` : 'Hãy thử thay đổi từ khóa hoặc địa điểm tìm kiếm') 
                : 'Dựa trên xu hướng tuyển dụng mới nhất'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={onJobClick} />
          ))}
        </div>
      </section>
      </div>
      <Footer />
    </div>
  );
}

const JobCard: React.FC<{ job: Job, onClick: () => void }> = ({ job, onClick }) => {
  return (
    <div onClick={onClick} className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-md cursor-pointer">
      <div>
        <div className="mb-2.5 flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 font-bold text-slate-500 text-base shrink-0">
            {job.company.charAt(0)}
          </div>
        </div>
        
        <h3 className="mb-1 text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {job.title}
        </h3>
        <p className="mb-2 text-xs font-medium text-slate-500">{job.company}</p>
        
        <div className="mb-2 flex flex-wrap gap-1.5">
          {job.tags.map(tag => (
            <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-green-600">{job.salary}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin size={12} /> {job.location}
          </span>
        </div>
        <span className="text-xs text-slate-400">Đăng tuyển {job.postedAt}</span>
      </div>
    </div>
  );
}
