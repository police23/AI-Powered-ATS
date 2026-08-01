import React, { useState } from 'react';
import { Search, Plus, Calendar as CalendarIcon, Clock, MapPin, Video, User, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Mail, Phone } from 'lucide-react';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import Footer from '../../../layouts/Footer';

const mockInterviews = [
  {
    id: 1,
    candidate: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0987 654 321',
    position: 'Senior React Developer',
    round: 'Technical Interview',
    interviewer: 'Trần Văn Cường (Tech Lead)',
    date: 'Hôm nay',
    time: '09:00 - 10:00',
    type: 'online',
    link: 'https://meet.google.com/abc-xyz-def',
    status: 'upcoming',
    avatar: 'A'
  },
  {
    id: 2,
    candidate: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0912 345 678',
    position: 'UI/UX Designer',
    round: 'HR Interview',
    interviewer: 'Lê Minh Thu (HR Manager)',
    date: 'Hôm nay',
    time: '14:30 - 15:30',
    type: 'offline',
    location: 'Tầng 3, Tòa nhà Nexus, Quận 1',
    status: 'upcoming',
    avatar: 'B'
  },
  {
    id: 3,
    candidate: 'Lê Hoàng C',
    email: 'lehoangc@gmail.com',
    phone: '0933 445 566',
    position: 'Product Manager',
    round: 'Culture Fit Interview',
    interviewer: 'Phạm Đức Anh (CEO)',
    date: 'Hôm qua',
    time: '10:00 - 11:00',
    type: 'online',
    link: 'https://meet.google.com/xyz-abc-def',
    status: 'completed',
    avatar: 'C',
    result: 'passed'
  },
  {
    id: 4,
    candidate: 'Phạm Minh D',
    email: 'phamminhd@gmail.com',
    phone: '0977 889 900',
    position: 'Backend Engineer',
    round: 'Technical Interview',
    interviewer: 'Nguyễn Mai Anh (Senior Backend)',
    date: 'Hôm qua',
    time: '15:00 - 16:00',
    type: 'offline',
    location: 'Tầng 3, Tòa nhà Nexus, Quận 1',
    status: 'completed',
    avatar: 'D',
    result: 'failed'
  },
  {
    id: 5,
    candidate: 'Hoàng Văn E',
    email: 'hoangvane@gmail.com',
    phone: '0901 234 567',
    position: 'Frontend Developer (React)',
    round: 'Technical Interview',
    interviewer: 'Trần Văn Cường (Tech Lead)',
    date: 'Ngày mai',
    time: '09:30 - 10:30',
    type: 'online',
    link: 'https://meet.google.com/def-ghi-jkl',
    status: 'upcoming',
    avatar: 'E'
  },
  {
    id: 6,
    candidate: 'Đỗ Thị F',
    email: 'dothif@gmail.com',
    phone: '0945 678 910',
    position: 'Business Analyst',
    round: 'HR Interview',
    interviewer: 'Lê Minh Thu (HR Manager)',
    date: 'Ngày mai',
    time: '14:00 - 15:00',
    type: 'offline',
    location: 'Tầng 3, Tòa nhà Nexus, Quận 1',
    status: 'upcoming',
    avatar: 'F'
  },
  {
    id: 7,
    candidate: 'Phạm Văn G',
    email: 'phamvang@gmail.com',
    phone: '0988 123 456',
    position: 'Fullstack Developer',
    round: 'Technical Interview',
    interviewer: 'Nguyễn Mai Anh',
    date: 'Thứ 7',
    time: '10:00 - 11:00',
    type: 'online',
    link: 'https://meet.google.com/xyz-abc-def',
    status: 'upcoming',
    avatar: 'G'
  },
  {
    id: 8,
    candidate: 'Trần Thị H',
    email: 'tranthih@gmail.com',
    phone: '0911 222 333',
    position: 'Marketing Manager',
    round: 'Culture Fit Interview',
    interviewer: 'Phạm Đức Anh (CEO)',
    date: 'Thứ 2',
    time: '14:00 - 15:00',
    type: 'offline',
    location: 'Tầng 3, Tòa nhà Nexus, Quận 1',
    status: 'upcoming',
    avatar: 'H'
  },
  {
    id: 9,
    candidate: 'Lê Văn I',
    email: 'levani@gmail.com',
    phone: '0933 111 222',
    position: 'Product Designer',
    round: 'Portfolio Review',
    interviewer: 'Lê Minh Thu',
    date: 'Thứ 4',
    time: '09:00 - 10:00',
    type: 'online',
    link: 'https://meet.google.com/123-456-789',
    status: 'upcoming',
    avatar: 'I'
  }
];

export default function InterviewCalendar({ onNavigate }: { onNavigate?: (item: string) => void }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  const days = [
    { label: 'Hôm nay', date: '23/07/2026', shortDate: '23/07' },
    { label: 'Ngày mai', date: '24/07/2026', shortDate: '24/07' },
    { label: 'Thứ 7', date: '25/07/2026', shortDate: '25/07' },
    { label: 'Chủ nhật', date: '26/07/2026', shortDate: '26/07' },
    { label: 'Thứ 2', date: '27/07/2026', shortDate: '27/07' },
    { label: 'Thứ 3', date: '28/07/2026', shortDate: '28/07' },
    { label: 'Thứ 4', date: '29/07/2026', shortDate: '29/07' }
  ];
  
  const selectedDay = days[selectedDayIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden">
      <EmployerSidebar activeItem="calendar" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <EmployerHeader title="Lịch phỏng vấn" onNavigate={onNavigate} />

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Danh sách phỏng vấn</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Online
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500 ml-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Offline
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Day selector */}
              <div className="flex items-center justify-between py-2 px-3 mb-6 rounded-xl border border-slate-200 bg-slate-50/50">
                <button
                  onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
                  disabled={selectedDayIndex === 0}
                  className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none transition-all cursor-pointer"
                >
                  <ChevronLeft size={20} className="text-slate-700" />
                </button>
                <div className="text-sm font-bold text-slate-800">
                  {selectedDay.label}, {selectedDay.shortDate}
                </div>
                <button
                  onClick={() => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1))}
                  disabled={selectedDayIndex === days.length - 1}
                  className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:shadow-none transition-all cursor-pointer"
                >
                  <ChevronRight size={20} className="text-slate-700" />
                </button>
              </div>

              <div>
                
                
                {mockInterviews.filter(i => i.date === selectedDay.label).length > 0 ? (
                  <div className="space-y-3">
                    {mockInterviews.filter(i => i.date === selectedDay.label).map(interview => (
                      <div key={interview.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all group">
                        <div className="w-16 flex flex-col items-center justify-center shrink-0 border-r border-slate-200 pr-4">
                          <span className="text-sm font-bold text-slate-800">{interview.time.split(' - ')[0]}</span>
                          <span className="text-xs text-slate-500">{interview.time.split(' - ')[1]}</span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{interview.candidate}</h4>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              interview.type === 'online' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {interview.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-slate-600 font-medium">{interview.position}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{interview.round}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Mail size={14} className="text-slate-400" />
                              <span>{interview.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone size={14} className="text-slate-400" />
                              <span>{interview.phone}</span>
                            </div>
                            {interview.type === 'online' ? (
                              <div className="flex items-center gap-1.5">
                                <Video size={14} className="text-slate-400" />
                                <a href={interview.link} className="text-indigo-600 hover:underline">{interview.link}</a>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-slate-400" />
                                <span>{interview.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 w-full mt-2 pt-2 border-t border-slate-100">
                              <User size={14} className="text-slate-400" />
                              <span>Người phỏng vấn: <span className="font-medium text-slate-700">{interview.interviewer}</span></span>
                            </div>
                          </div>
                        </div>

                        {interview.status === 'upcoming' && (
                          <div className="hidden sm:flex flex-col gap-2 shrink-0 border-l border-slate-100 pl-4 justify-center min-w-[110px]">
                            {selectedDay.label === 'Hôm nay' && (
                              <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold w-full transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
                              >
                                <CheckCircle2 size={14} />
                                Xác nhận
                              </button>
                            )}
                            <button
                              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold w-full transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
                            >
                              <Clock size={14} />
                              Thay đổi
                            </button>
                            <button
                              className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 px-3.5 py-2 rounded-lg text-xs font-semibold w-full transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
                            >
                              <XCircle size={14} />
                              Hủy lịch
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-500 text-sm flex flex-col items-center justify-center">
                    <CalendarIcon size={32} className="text-slate-300 mb-3" />
                    Không có lịch phỏng vấn nào trong ngày này
                  </div>
                )}
              </div>

            </div>
          </div>
          
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
