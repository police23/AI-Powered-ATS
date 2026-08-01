import React, { useState } from 'react';
import { Briefcase, Users, FileText, Settings, BarChart2, Calendar, Bell, Search, Filter, MoreVertical, MoreHorizontal, ChevronRight, Mail, Phone, ExternalLink, X, Clock, MapPin } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Footer from '../../../layouts/Footer';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';

type Candidate = {
  id: number;
  name: string;
  role: string;
  matchScore: number;
  status: string;
  time: string;
  email: string;
  phone: string;
  exp: string;
  avatar: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewFormat?: string;
};

const mockCandidates: Candidate[] = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Senior React Developer', matchScore: 95, status: 'applied', time: '2 giờ trước', email: 'nguyenvana@gmail.com', phone: '0987654321', exp: '4 năm', avatar: 'A' },
  { id: 2, name: 'Trần Thị B', role: 'Senior React Developer', matchScore: 88, status: 'reviewing', time: '1 ngày trước', email: 'tranthib@gmail.com', phone: '0912345678', exp: '3 năm', avatar: 'B' },
  { id: 3, name: 'Lê Văn C', role: 'UI/UX Designer', matchScore: 92, status: 'interview_hr', time: '2 ngày trước', email: 'levanc@gmail.com', phone: '0933445566', exp: '5 năm', avatar: 'C' },
  { id: 4, name: 'Phạm Thị D', role: 'Node.js Developer', matchScore: 78, status: 'offer', time: '3 ngày trước', email: 'phamthid@gmail.com', phone: '0977889900', exp: '2 năm', avatar: 'D' },
  { id: 5, name: 'Hoàng Minh E', role: 'Frontend Engineer', matchScore: 85, status: 'applied', time: '5 giờ trước', email: 'hoangminhe@gmail.com', phone: '0901223344', exp: '2.5 năm', avatar: 'E' },
  { id: 6, name: 'Đỗ Tiến F', role: 'Fullstack Dev', matchScore: 65, status: 'rejected', time: '4 ngày trước', email: 'dotienf@gmail.com', phone: '0944556677', exp: '1 năm', avatar: 'F' },
];

const PIPELINES: Record<string, { id: string; title: string; color: string }[]> = {
  'Senior React Developer': [
    { id: 'applied', title: 'Mới ứng tuyển', color: 'bg-slate-100 border-slate-200 text-slate-800' },
    { id: 'reviewing', title: 'Đang xem xét', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 'interview_hr', title: 'Phỏng vấn HR', color: 'bg-amber-50 border-amber-200 text-amber-800' },
    { id: 'interview_tech', title: 'Phỏng vấn Technical', color: 'bg-orange-50 border-orange-200 text-orange-800' },
    { id: 'interview_manager', title: 'Phỏng vấn Manager', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { id: 'offer', title: 'Offer letter', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { id: 'rejected', title: 'Không phù hợp', color: 'bg-red-50 border-red-200 text-red-800' }
  ],
  'UI/UX Designer': [
    { id: 'applied', title: 'Mới ứng tuyển', color: 'bg-slate-100 border-slate-200 text-slate-800' },
    { id: 'reviewing', title: 'Đang xem xét', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 'interview_portfolio', title: 'Phỏng vấn Portfolio', color: 'bg-amber-50 border-amber-200 text-amber-800' },
    { id: 'offer', title: 'Offer letter', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { id: 'rejected', title: 'Không phù hợp', color: 'bg-red-50 border-red-200 text-red-800' }
  ],
  'Node.js Developer': [
    { id: 'applied', title: 'Mới ứng tuyển', color: 'bg-slate-100 border-slate-200 text-slate-800' },
    { id: 'reviewing', title: 'Đang xem xét', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 'test_assignment', title: 'Bài Test Kỹ Thuật', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
    { id: 'interview_tech', title: 'Phỏng vấn Technical', color: 'bg-orange-50 border-orange-200 text-orange-800' },
    { id: 'offer', title: 'Offer letter', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { id: 'rejected', title: 'Không phù hợp', color: 'bg-red-50 border-red-200 text-red-800' }
  ]
};

export default function ApplicantTracking({ onNavigate }: { onNavigate?: (item: string) => void }) {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [sortBy, setSortBy] = useState('matchScore');
  const [selectedJob, setSelectedJob] = useState('Senior React Developer');

  const [schedulingCandidate, setSchedulingCandidate] = useState<{ id: number; status: string; oldStatus: string } | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewFormat, setInterviewFormat] = useState('Online');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [viewingCandidateCV, setViewingCandidateCV] = useState<number | null>(null);

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    if (!day || !month || !year) return dateString;
    return `${day}/${month}/${year}`;
  };

  const currentColumns = PIPELINES[selectedJob] || PIPELINES['Senior React Developer'];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const candidateId = parseInt(draggableId);
      
      // Optimistic update
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, status: destination.droppableId } : c
      ));

      if (destination.droppableId.includes('interview') || destination.droppableId === 'test_assignment' || destination.droppableId === 'interview_portfolio') {
        setSchedulingCandidate({ id: candidateId, status: destination.droppableId, oldStatus: source.droppableId });
      }
    }
  };

  const confirmSchedule = () => {
    if (schedulingCandidate) {
      setCandidates(prev => prev.map(c => 
        c.id === schedulingCandidate.id ? { 
          ...c, 
          interviewDate,
          interviewTime,
          interviewFormat
        } : c
      ));
      setSchedulingCandidate(null);
      setInterviewDate('');
      setInterviewTime('');
      setInterviewFormat('Online');
    }
  };

  const cancelSchedule = () => {
    if (schedulingCandidate) {
      // Revert status
      setCandidates(prev => prev.map(c => 
        c.id === schedulingCandidate.id ? { ...c, status: schedulingCandidate.oldStatus } : c
      ));
      setSchedulingCandidate(null);
      setInterviewDate('');
      setInterviewTime('');
      setInterviewFormat('Online');
    }
  };

  const jobFilteredCandidates = candidates.filter(c => 
    c.role === selectedJob
  );

  const sortedCandidates = [...jobFilteredCandidates].sort((a, b) => {
    if (sortBy === 'matchScore') {
      return b.matchScore - a.matchScore;
    }
    if (sortBy === 'experience') {
      const getExp = (expStr: string) => parseFloat(expStr) || 0;
      return getExp(b.exp) - getExp(a.exp);
    }
    if (sortBy === 'recent') {
      const getTimeVal = (timeStr: string) => {
        if (timeStr.includes('giờ')) return parseInt(timeStr) || 0;
        if (timeStr.includes('ngày')) return (parseInt(timeStr) || 0) * 24;
        return 1000;
      };
      return getTimeVal(a.time) - getTimeVal(b.time);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row">
      <EmployerSidebar activeItem="candidates" onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <EmployerHeader title="Quản lý ứng viên" onNavigate={onNavigate} />

        {/* Filters and Actions */}
        <div className="bg-white border-b border-slate-200 p-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm tên, email..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all"
              />
            </div>
            <div className="h-9 w-px bg-slate-200"></div>
            <select 
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="border-none text-sm font-medium text-slate-700 outline-none cursor-pointer hover:text-indigo-600 bg-transparent"
            >
              <option value="Senior React Developer">Senior React Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Node.js Developer">Node.js Developer</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Sắp xếp:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white cursor-pointer"
            >
              <option value="matchScore">Độ phù hợp cao nhất</option>
              <option value="recent">Ứng tuyển gần đây</option>
              <option value="experience">Kinh nghiệm nhiều nhất</option>
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto p-6 bg-slate-50/50">
            <div className="flex gap-6 h-full min-w-max pb-4">
              {currentColumns.map((column) => {
                const columnCandidates = sortedCandidates.filter(c => c.status === column.id);
                
                return (
                  <div key={column.id} className="w-80 flex flex-col h-full bg-slate-100/50 rounded-xl border border-slate-200/60 overflow-hidden">
                    <div className={`p-4 border-b ${column.color}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-wider">{column.title}</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/50">{columnCandidates.length}</span>
                      </div>
                    </div>
                    
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div 
                          className={`p-3 flex-1 overflow-y-auto space-y-3 ${snapshot.isDraggingOver ? 'bg-slate-200/50' : ''}`}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {columnCandidates.map((candidate, index) => (
                            // @ts-ignore
                            <Draggable key={candidate.id} draggableId={candidate.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white p-4 rounded-lg border ${snapshot.isDragging ? 'border-indigo-500 shadow-lg scale-[1.02]' : 'border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md'} transition-all cursor-grab active:cursor-grabbing group`}
                                  style={provided.draggableProps.style}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-sm">
                                        {candidate.avatar}
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{candidate.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-1">{candidate.role}</p>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <button 
                                        onClick={() => setActiveMenuId(activeMenuId === candidate.id ? null : candidate.id)}
                                        className="text-slate-400 hover:text-slate-800 p-1 rounded-md hover:bg-slate-100 transition-colors"
                                      >
                                        <MoreHorizontal size={16} />
                                      </button>
                                      {activeMenuId === candidate.id && (
                                        <>
                                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                                          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                                            <button 
                                              onClick={() => {
                                                setViewingCandidateCV(candidate.id);
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                            >
                                              <FileText size={16} />
                                              Xem chi tiết CV
                                            </button>
                                            {!['applied', 'reviewing', 'offer', 'rejected'].includes(candidate.status) && (
                                              <button 
                                                onClick={() => {
                                                  setSchedulingCandidate({ id: candidate.id, status: candidate.status, oldStatus: candidate.status });
                                                  if (candidate.interviewDate) setInterviewDate(candidate.interviewDate);
                                                  if (candidate.interviewTime) setInterviewTime(candidate.interviewTime);
                                                  if (candidate.interviewFormat) setInterviewFormat(candidate.interviewFormat);
                                                  setActiveMenuId(null);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                              >
                                                <Calendar size={16} />
                                                Điều chỉnh lịch phỏng vấn
                                              </button>
                                            )}
                                            {!['applied', 'offer', 'rejected'].includes(candidate.status) && (
                                              <button 
                                                onClick={() => {
                                                  setCandidates(prev => prev.map(c => 
                                                    c.id === candidate.id ? { ...c, status: 'rejected' } : c
                                                  ));
                                                  setActiveMenuId(null);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-slate-100 mt-1 pt-1"
                                              >
                                                <X size={16} />
                                                Đánh dấu Không phù hợp
                                              </button>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="mb-3 space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                      <Mail size={12} className="shrink-0" />
                                      <span className="truncate">{candidate.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                      <Phone size={12} className="shrink-0" />
                                      <span>{candidate.phone}</span>
                                    </div>
                                    {candidate.interviewDate && candidate.interviewTime && (
                                      <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50/50 p-1 rounded">
                                        <Clock size={12} className="shrink-0" />
                                        <span>{formatDateDisplay(candidate.interviewDate)} {candidate.interviewTime}</span>
                                      </div>
                                    )}
                                    {candidate.interviewFormat && (
                                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 p-1 rounded">
                                        <MapPin size={12} className="shrink-0" />
                                        <span>{candidate.interviewFormat}</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between text-xs mb-3">
                                    <span className="text-slate-500 font-medium">{candidate.exp} kinh nghiệm</span>
                                    <span className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                      {candidate.matchScore}% Phù hợp
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-[11px] text-slate-400">{candidate.time}</span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {columnCandidates.length === 0 && !snapshot.isDraggingOver && (
                            <div className="h-24 flex items-center justify-center text-sm font-medium text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                              Không có ứng viên
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </div>
        </DragDropContext>
        <Footer />
      </main>

      {/* Scheduling Modal */}
      {schedulingCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Lên lịch phỏng vấn</h3>
              <button 
                onClick={cancelSchedule}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày phỏng vấn</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type={isDateFocused ? "date" : "text"}
                    value={isDateFocused ? interviewDate : formatDateDisplay(interviewDate)}
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={() => setIsDateFocused(false)}
                    onChange={(e) => {
                      if (e.target.type === 'date') {
                        setInterviewDate(e.target.value);
                      }
                    }}
                    placeholder="dd/mm/yyyy"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Thời gian</label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hình thức phỏng vấn</label>
                <select 
                  value={interviewFormat}
                  onChange={(e) => setInterviewFormat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                >
                  <option value="Online">Online (Google Meet / Zoom)</option>
                  <option value="Offline">Trực tiếp tại văn phòng</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={cancelSchedule}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmSchedule}
                disabled={!interviewDate || !interviewTime}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Xác nhận lịch
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CV Viewing Modal */}
      {viewingCandidateCV && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">Hồ sơ ứng viên</h3>
              <div className="flex items-center gap-2">
                <button 
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink size={14} /> Tải xuống CV
                </button>
                <button 
                  onClick={() => setViewingCandidateCV(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col lg:flex-row gap-6">
              {(() => {
                const candidate = candidates.find(c => c.id === viewingCandidateCV);
                if (!candidate) return null;
                
                return (
                  <>
                    {/* Left Sidebar - Info */}
                    <div className="w-full lg:w-1/3 space-y-4">
                      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-20 w-20 rounded-full bg-indigo-100 text-indigo-600 font-bold text-2xl flex items-center justify-center mb-4 ring-4 ring-indigo-50">
                            {candidate.avatar}
                          </div>
                          <h4 className="text-xl font-bold text-slate-800">{candidate.name}</h4>
                          <p className="text-sm font-medium text-slate-500 mt-1">{candidate.role}</p>
                          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            Phù hợp {candidate.matchScore}%
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs text-slate-500 font-medium">Email</span>
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                              <Mail size={14} className="text-slate-400" />
                              {candidate.email}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs text-slate-500 font-medium">Số điện thoại</span>
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                              <Phone size={14} className="text-slate-400" />
                              {candidate.phone}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs text-slate-500 font-medium">Kinh nghiệm</span>
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                              <Briefcase size={14} className="text-slate-400" />
                              {candidate.exp}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="text-xs text-slate-500 font-medium">Thời gian ứng tuyển</span>
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                              <Clock size={14} className="text-slate-400" />
                              {candidate.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Content - Mock CV */}
                    <div className="w-full lg:w-2/3">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                        <div className="bg-slate-800 p-4 flex items-center justify-between text-slate-300 border-b border-slate-700">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <FileText size={16} className="text-slate-400" />
                            CV_{candidate.name.replace(/ /g, '_')}.pdf
                          </div>
                        </div>
                        <div className="p-8 aspect-[1/1.4] overflow-y-auto bg-white mx-auto border-x border-slate-100">
                          {/* CV Content Mock */}
                          <div className="space-y-6 max-w-lg mx-auto">
                            <div className="border-b-2 border-slate-800 pb-4">
                              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{candidate.name}</h1>
                              <h2 className="text-lg font-medium text-slate-600 mt-1">{candidate.role}</h2>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-6 border-b-2 border-indigo-500 inline-block"></span>
                                Tóm tắt mục tiêu
                              </h3>
                              <p className="text-sm text-slate-600 leading-relaxed text-justify">
                                Chuyên gia {candidate.role} với {candidate.exp} kinh nghiệm phát triển các ứng dụng web hiệu năng cao. Có kỹ năng giải quyết vấn đề xuất sắc, làm việc nhóm hiệu quả và luôn mong muốn học hỏi các công nghệ mới nhất để mang lại giá trị tốt nhất cho sản phẩm.
                              </p>
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-6 border-b-2 border-indigo-500 inline-block"></span>
                                Kinh nghiệm làm việc
                              </h3>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800">Senior Frontend Developer</h4>
                                    <span className="text-xs font-semibold text-slate-500">2023 - Hiện tại</span>
                                  </div>
                                  <p className="text-xs font-medium text-indigo-600 mb-2">Tech Solutions Inc.</p>
                                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>Phát triển và duy trì hệ thống web portal sử dụng React, TypeScript.</li>
                                    <li>Cải thiện 30% hiệu năng trang web thông qua tối ưu hóa bundle size.</li>
                                    <li>Dẫn dắt nhóm 4 lập trình viên junior.</li>
                                  </ul>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-800">Web Developer</h4>
                                    <span className="text-xs font-semibold text-slate-500">2021 - 2023</span>
                                  </div>
                                  <p className="text-xs font-medium text-indigo-600 mb-2">Digital Creative Agency</p>
                                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                                    <li>Xây dựng website responsive cho nhiều khách hàng lớn.</li>
                                    <li>Làm việc chặt chẽ với đội ngũ thiết kế UI/UX để đảm bảo chất lượng.</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-6 border-b-2 border-indigo-500 inline-block"></span>
                                Học vấn & Kỹ năng
                              </h3>
                              <div className="text-sm text-slate-600">
                                <p className="font-bold text-slate-800">Cử nhân Công nghệ Thông tin</p>
                                <p className="text-xs mb-3">Đại học Bách Khoa - 2021</p>
                                
                                <div className="flex flex-wrap gap-2 mt-4">
                                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-700">JavaScript/TypeScript</span>
                                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-700">React.js</span>
                                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-700">Next.js</span>
                                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-700">Tailwind CSS</span>
                                  <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-700">Git/GitHub</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

