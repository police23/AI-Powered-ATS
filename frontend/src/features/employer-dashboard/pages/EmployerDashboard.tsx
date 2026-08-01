import React from 'react';
import { Briefcase, Users, FileText, Settings, BarChart2, Calendar, Bell, Search, Plus, MoreHorizontal, ChevronRight, Activity, Filter, MapPin, Clock, User, Building, Info, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LabelList } from 'recharts';
import Footer from '../../../layouts/Footer';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';

// Datasets for different scope modes
const scopeData = {
  company: {
    label: "Toàn công ty (TechCorp)",
    desc: "Tổng hợp toàn bộ các tin tuyển dụng và ứng viên của tất cả nhân sự trong công ty",
    kpis: {
      openJobs: { value: "5", trend: "+2", trendUp: true },
      newApps: { value: "124", trend: "+14%", trendUp: true },
      interviews: { value: "12", trend: "Tuần này", trendUp: true },
      offerRate: { value: "18%", trend: "-2%", trendUp: false }
    },
    funnel: [
      { title: "Lượt xem", value: "2,450", conversion: "100%", color: "slate" },
      { title: "Ứng tuyển", value: "845", conversion: "34.5%", color: "indigo" },
      { title: "Phỏng vấn", value: "124", conversion: "14.6%", color: "amber" },
      { title: "Offer Letter", value: "45", conversion: "36.2%", color: "emerald" },
      { title: "Đã nhận việc", value: "38", conversion: "84.4%", color: "blue" }
    ],
    performance: [
      { name: 'T2', views: 240, applications: 140 },
      { name: 'T3', views: 300, applications: 139 },
      { name: 'T4', views: 200, applications: 98 },
      { name: 'T5', views: 278, applications: 39 },
      { name: 'T6', views: 189, applications: 48 },
      { name: 'T7', views: 239, applications: 38 },
      { name: 'CN', views: 349, applications: 43 },
    ],
    byRole: [
      { name: 'Marketing Exec', value: 89 },
      { name: 'React Developer', value: 45 },
      { name: 'UI/UX Designer', value: 32 },
      { name: 'Node.js Backend', value: 28 },
      { name: 'QA Lead Tester', value: 18 },
    ],
    activeJobs: [
      { id: 1, title: 'Senior React Developer', apps: 45, new: 12, expires: '5 ngày', assignee: 'Nguyễn Văn A' },
      { id: 2, title: 'UI/UX Designer Lead', apps: 28, new: 5, expires: '12 ngày', assignee: 'Nguyễn Văn A' },
      { id: 3, title: 'Marketing Executive', apps: 89, new: 24, expires: '15 ngày', assignee: 'Trần Thị B' },
      { id: 4, title: 'Backend Engineer', apps: 15, new: 3, expires: '3 ngày', assignee: 'Lê Hoàng C' },
    ]
  },
  me: {
    label: "Cá nhân (Nguyễn Văn A - Tôi)",
    desc: "Chỉ hiển thị con số thống kê cho các tin tuyển dụng do bạn (Nguyễn Văn A) trực tiếp quản lý",
    kpis: {
      openJobs: { value: "2", trend: "0", trendUp: true },
      newApps: { value: "48", trend: "+8%", trendUp: true },
      interviews: { value: "5", trend: "Tuần này", trendUp: true },
      offerRate: { value: "21%", trend: "+3%", trendUp: true }
    },
    funnel: [
      { title: "Lượt xem", value: "980", conversion: "100%", color: "slate" },
      { title: "Ứng tuyển", value: "320", conversion: "32.6%", color: "indigo" },
      { title: "Phỏng vấn", value: "48", conversion: "15.0%", color: "amber" },
      { title: "Offer Letter", value: "18", conversion: "37.5%", color: "emerald" },
      { title: "Đã nhận việc", value: "15", conversion: "83.3%", color: "blue" }
    ],
    performance: [
      { name: 'T2', views: 110, applications: 60 },
      { name: 'T3', views: 130, applications: 58 },
      { name: 'T4', views: 85, applications: 40 },
      { name: 'T5', views: 120, applications: 18 },
      { name: 'T6', views: 80, applications: 22 },
      { name: 'T7', views: 95, applications: 15 },
      { name: 'CN', views: 150, applications: 20 },
    ],
    byRole: [
      { name: 'React Developer', value: 45 },
      { name: 'UI/UX Designer', value: 32 },
      { name: 'Frontend Eng.', value: 24 },
      { name: 'Product Spec.', value: 16 },
      { name: 'Web Designer', value: 11 },
    ],
    activeJobs: [
      { id: 1, title: 'Senior React Developer', apps: 45, new: 12, expires: '5 ngày', assignee: 'Nguyễn Văn A' },
      { id: 2, title: 'UI/UX Designer Lead', apps: 28, new: 5, expires: '12 ngày', assignee: 'Nguyễn Văn A' },
    ]
  },
  'hr-2': {
    label: "Trần Thị B (Chuyên viên HR)",
    desc: "Chỉ hiển thị con số thống kê cho các tin tuyển dụng do Trần Thị B phụ trách",
    kpis: {
      openJobs: { value: "2", trend: "+1", trendUp: true },
      newApps: { value: "52", trend: "+18%", trendUp: true },
      interviews: { value: "4", trend: "Tuần này", trendUp: true },
      offerRate: { value: "16%", trend: "-1%", trendUp: false }
    },
    funnel: [
      { title: "Lượt xem", value: "1,120", conversion: "100%", color: "slate" },
      { title: "Ứng tuyển", value: "380", conversion: "33.9%", color: "indigo" },
      { title: "Phỏng vấn", value: "52", conversion: "13.7%", color: "amber" },
      { title: "Offer Letter", value: "20", conversion: "38.5%", color: "emerald" },
      { title: "Đã nhận việc", value: "16", conversion: "80.0%", color: "blue" }
    ],
    performance: [
      { name: 'T2', views: 90, applications: 50 },
      { name: 'T3', views: 120, applications: 55 },
      { name: 'T4', views: 80, applications: 38 },
      { name: 'T5', views: 110, applications: 14 },
      { name: 'T6', views: 75, applications: 18 },
      { name: 'T7', views: 100, applications: 15 },
      { name: 'CN', views: 140, applications: 18 },
    ],
    byRole: [
      { name: 'Marketing Exec.', value: 89 },
      { name: 'Content Spec.', value: 28 },
      { name: 'SEO Lead', value: 22 },
      { name: 'Media Planner', value: 15 },
      { name: 'Brand Exec.', value: 10 },
    ],
    activeJobs: [
      { id: 3, title: 'Marketing Executive', apps: 89, new: 24, expires: '15 ngày', assignee: 'Trần Thị B' },
      { id: 5, title: 'Content Marketing Specialist', apps: 18, new: 4, expires: '20 ngày', assignee: 'Trần Thị B' },
    ]
  },
  'hr-3': {
    label: "Lê Hoàng C (Chuyên viên HR)",
    desc: "Chỉ hiển thị con số thống kê cho các tin tuyển dụng do Lê Hoàng C phụ trách",
    kpis: {
      openJobs: { value: "1", trend: "0", trendUp: true },
      newApps: { value: "24", trend: "+5%", trendUp: true },
      interviews: { value: "3", trend: "Tuần này", trendUp: true },
      offerRate: { value: "12%", trend: "-4%", trendUp: false }
    },
    funnel: [
      { title: "Lượt xem", value: "350", conversion: "100%", color: "slate" },
      { title: "Ứng tuyển", value: "145", conversion: "41.4%", color: "indigo" },
      { title: "Phỏng vấn", value: "24", conversion: "16.5%", color: "amber" },
      { title: "Offer Letter", value: "7", conversion: "29.2%", color: "emerald" },
      { title: "Đã nhận việc", value: "7", conversion: "100%", color: "blue" }
    ],
    performance: [
      { name: 'T2', views: 40, applications: 30 },
      { name: 'T3', views: 50, applications: 26 },
      { name: 'T4', views: 35, applications: 20 },
      { name: 'T5', views: 48, applications: 7 },
      { name: 'T6', views: 34, applications: 8 },
      { name: 'T7', views: 44, applications: 8 },
      { name: 'CN', views: 59, applications: 5 },
    ],
    byRole: [
      { name: 'Node.js Backend', value: 25 },
      { name: 'DevOps Eng.', value: 18 },
      { name: 'QA Tester', value: 14 },
      { name: 'Python Dev', value: 11 },
      { name: 'System Admin', value: 8 },
    ],
    activeJobs: [
      { id: 4, title: 'Backend Engineer', apps: 15, new: 3, expires: '3 ngày', assignee: 'Lê Hoàng C' },
    ]
  }
};

export default function EmployerDashboard({ onCreateJobClick, onNavigate }: { onCreateJobClick?: () => void, onNavigate?: (item: string) => void }) {
  const isCompanyAdmin = localStorage.getItem('isCompanyAdmin') !== 'false';
  
  const currentData = scopeData[isCompanyAdmin ? 'company' : 'me'] || scopeData.company;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden">
      <EmployerSidebar activeItem="dashboard" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <EmployerHeader title="Tổng quan (Dashboard)" onNavigate={onNavigate} />
        
        {/* Dashboard Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Xin chào, TechCorp!</h2>
              <p className="text-slate-500 text-sm mt-1">Dưới đây là tóm tắt hoạt động tuyển dụng của {isCompanyAdmin ? 'công ty' : 'bạn'} trong 30 ngày qua.</p>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate('post-job')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus size={18} /> Đăng tin tuyển dụng
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
            <StatCard title="Job đang tuyển" value={currentData.kpis.openJobs.value} trend={currentData.kpis.openJobs.trend} trendUp={currentData.kpis.openJobs.trendUp} icon={Briefcase} color="indigo" />
            <StatCard title="Hồ sơ đã nhận" value={currentData.kpis.newApps.value} trend={currentData.kpis.newApps.trend} trendUp={currentData.kpis.newApps.trendUp} icon={FileText} color="blue" />
            <StatCard title="Lịch phỏng vấn" value={currentData.kpis.interviews.value} trend={currentData.kpis.interviews.trend} trendUp={currentData.kpis.interviews.trendUp} icon={Calendar} color="amber" />
            <StatCard title="Tỷ lệ chốt Offer" value={currentData.kpis.offerRate.value} trend={currentData.kpis.offerRate.trend} trendUp={currentData.kpis.offerRate.trendUp} icon={BarChart2} color="emerald" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Performance Chart - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <h3 className="text-base font-bold text-slate-800">Hiệu suất tuyển dụng (7 ngày qua)</h3>
                  <div className="flex items-center gap-2">
                    <button className="text-slate-500 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-5 h-72 lg:h-80 w-full shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData.performance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                        labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="views" name="Lượt xem" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="applications" name="Lượt ứng tuyển" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

            </div>

            {/* Sidebar Columns - Takes 1 column */}
            <div className="lg:col-span-1 space-y-6 lg:space-y-8">
              
              {/* Top 5 Applications by Job Chart */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <h3 className="text-base font-bold text-slate-800">Top 5 vị trí có nhiều người ứng tuyển nhất</h3>
                </div>
                <div className="p-5 h-72 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData.byRole} margin={{ top: 10, right: 35, left: -20, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Bar dataKey="value" name="Lượt ứng tuyển" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                        <LabelList dataKey="value" position="right" style={{ fontSize: '12px', fontWeight: 600, fill: '#475569' }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>


            </div>
          </div>

          {/* Recent Applicants Section at the bottom */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Ứng viên mới ứng tuyển gần đây</h3>
                <p className="text-xs text-slate-400 mt-0.5">6 hồ sơ ứng tuyển mới nhất nhận được</p>
              </div>
              <button 
                onClick={() => onNavigate && onNavigate('candidates')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                Xem tất cả <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {[
                { name: 'Nguyễn Văn Minh', job: 'Senior React Developer', exp: '4 năm kinh nghiệm', time: '15 phút trước', avatarBg: 'bg-indigo-100 text-indigo-700', status: 'CV Mới' },
                { name: 'Trần Thị Thu Trang', job: 'Marketing Executive', exp: '2 năm kinh nghiệm', time: '45 phút trước', avatarBg: 'bg-emerald-100 text-emerald-700', status: 'CV Mới' },
                { name: 'Lê Hoàng Nam', job: 'UI/UX Designer Lead', exp: '5 năm kinh nghiệm', time: '2 giờ trước', avatarBg: 'bg-purple-100 text-purple-700', status: 'CV Mới' },
                { name: 'Phạm Quốc Anh', job: 'Backend Engineer (Node.js)', exp: '3 năm kinh nghiệm', time: '4 giờ trước', avatarBg: 'bg-amber-100 text-amber-700', status: 'CV Mới' },
                { name: 'Vũ Thị Thanh Hải', job: 'QA Lead Tester', exp: '4 năm kinh nghiệm', time: 'Hôm qua, 16:30', avatarBg: 'bg-rose-100 text-rose-700', status: 'CV Mới' },
                { name: 'Đỗ Tuấn Kiệt', job: 'DevOps Engineer', exp: '3 năm kinh nghiệm', time: 'Hôm qua, 14:15', avatarBg: 'bg-sky-100 text-sky-700', status: 'CV Mới' },
              ].map((candidate, index) => (
                <div key={index} className="p-3.5 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50/80 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full ${candidate.avatarBg} font-bold text-sm flex items-center justify-center shrink-0 border border-white shadow-xs`}>
                      {candidate.name.split(' ').slice(-2).map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{candidate.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                        Ứng tuyển: <span className="text-slate-800 font-semibold">{candidate.job}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>{candidate.exp}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{candidate.time}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigate && onNavigate('candidates')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Xem hồ sơ
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color }: any) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trendUp === true ? "bg-emerald-50 text-emerald-700" : trendUp === false ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{value}</h4>
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </div>
    </div>
  );
}



