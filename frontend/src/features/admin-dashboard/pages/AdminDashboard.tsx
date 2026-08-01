import React from 'react';
import AdminHeader from '../../../layouts/AdminHeader';
import AdminSidebar from '../../../layouts/AdminSidebar';
import { Users, Building, FileText, Activity } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate?: (item: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <AdminSidebar activeItem="dashboard" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <AdminHeader title="Bảng điều khiển Quản trị" onNavigate={onNavigate} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Tổng quan hệ thống</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Tổng số ứng viên', value: '12,450', icon: Users, color: 'blue', trend: '+12% tháng này' },
                { label: 'Doanh nghiệp đăng ký', value: '845', icon: Building, color: 'indigo', trend: '+5% tháng này' },
                { label: 'Tin tuyển dụng đang mở', value: '3,210', icon: FileText, color: 'emerald', trend: '+18% tháng này' },
                { label: 'Lượt ứng tuyển hôm nay', value: '456', icon: Activity, color: 'amber', trend: '+2% hôm qua' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className={`h-10 w-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mb-2">{stat.value}</p>
                  <p className="text-xs font-medium text-emerald-600">{stat.trend}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Người dùng mới đăng ký</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          U{i}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">Người dùng mới {i}</p>
                          <p className="text-xs text-slate-500">user{i}@example.com</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-400">10 phút trước</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Hoạt động hệ thống</h3>
                <div className="space-y-4">
                  {[
                    { text: 'Công ty TechCorp vừa đăng tin tuyển dụng mới', time: '15 phút trước' },
                    { text: 'Có 50 lượt ứng tuyển mới vào vị trí Frontend', time: '1 giờ trước' },
                    { text: 'Công ty ABC vừa nâng cấp gói dịch vụ', time: '2 giờ trước' },
                    { text: 'Phát hiện hoạt động đáng ngờ từ IP 192.168.x.x', time: '4 giờ trước' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-indigo-600 shrink-0"></div>
                      <div>
                        <p className="text-sm text-slate-700">{activity.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
