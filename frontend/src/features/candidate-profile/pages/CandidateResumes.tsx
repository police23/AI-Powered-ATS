import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Star,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Plus,
  Sparkles,
  AlertCircle,
  Pencil,
  FileCheck,
  X,
  ShieldCheck,
  Search,
  ChevronRight
} from 'lucide-react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import UploadResumeModal, { UploadResumeData } from '../components/UploadResumeModal';
import PreviewResumeModal from '../components/PreviewResumeModal';
import { candidateResumeApi, CandidateResumeResponse } from '../api/candidateResume.api';

export interface CandidateResumeItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  isDefault: boolean;
  aiSkills: string[];
  completenessScore: number;
}

interface CandidateResumesProps {
  onNavigate?: (item: string) => void;
}

export default function CandidateResumes({ onNavigate }: CandidateResumesProps) {
  const [resumes, setResumes] = useState<CandidateResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Interaction states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewResume, setPreviewResume] = useState<CandidateResumeItem | null>(null);
  const [editingResumeId, setEditingResumeId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // Delete confirmation & Toast
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      const data = await candidateResumeApi.getAllResumes();
      const mapped: CandidateResumeItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        fileName: item.fileName,
        fileSize: item.fileSizeFormatted,
        uploadDate: new Date(item.createdAt).toLocaleDateString('vi-VN'),
        isDefault: item.isDefault,
        aiSkills: ['PDF Resume', 'ATS Validated'],
        completenessScore: 90
      }));
      setResumes(mapped);
    } catch (err) {
      console.warn('Backend API not reachable or fallback to demo state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      await candidateResumeApi.setDefaultResume(id);
      setResumes(prev =>
        prev.map(item => ({
          ...item,
          isDefault: item.id === id
        }))
      );
      const target = resumes.find(r => r.id === id);
      triggerToast(`Đã đặt "${target?.title || 'CV'}" làm CV mặc định khi ứng tuyển!`);
    } catch (err) {
      triggerToast('Không thể cập nhật CV mặc định.');
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      const target = resumes.find(r => r.id === id);
      await candidateResumeApi.deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
      setDeleteConfirmId(null);
      triggerToast(`Đã xóa "${target?.title || 'CV'}" thành công.`);
    } catch (err) {
      triggerToast('Không thể xóa tệp CV.');
      setDeleteConfirmId(null);
    }
  };

  const handleStartRename = (resume: CandidateResumeItem) => {
    setEditingResumeId(resume.id);
    setEditingTitle(resume.title);
  };

  const handleSaveRename = async (id: string) => {
    if (!editingTitle.trim()) return;
    try {
      await candidateResumeApi.updateResumeTitle(id, editingTitle.trim());
      setResumes(prev =>
        prev.map(item => (item.id === id ? { ...item, title: editingTitle.trim() } : item))
      );
      setEditingResumeId(null);
      triggerToast('Đã cập nhật tên gợi nhớ CV thành công!');
    } catch (err) {
      triggerToast('Không thể đổi tên CV.');
    }
  };

  const handleUploadSubmit = async (data: UploadResumeData) => {
    try {
      const created = await candidateResumeApi.uploadResume(data.file, data.title, data.setAsDefault);
      const newResumeItem: CandidateResumeItem = {
        id: created.id,
        title: created.title,
        fileName: created.fileName,
        fileSize: created.fileSizeFormatted,
        uploadDate: new Date(created.createdAt).toLocaleDateString('vi-VN'),
        isDefault: created.isDefault,
        aiSkills: ['PDF Resume', 'ATS Validated'],
        completenessScore: 90
      };

      if (created.isDefault) {
        setResumes(prev => prev.map(r => ({ ...r, isDefault: false })).concat(newResumeItem));
      } else {
        setResumes(prev => [newResumeItem, ...prev]);
      }

      setShowUploadModal(false);
      triggerToast(`Đã tải lên CV "${newResumeItem.title}" thành công!`);
    } catch (err: any) {
      triggerToast(err?.message || 'Có lỗi xảy ra khi tải lên tệp CV.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Candidate Sidebar */}
      <CandidateSidebar activeItem="profile" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Candidate Header */}
        <CandidateHeader onNavigate={onNavigate} />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          )}

          {/* Page Header Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>AI Resume Portfolio</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  Quản lý danh sách CV ứng tuyển
                </h1>
                <p className="text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
                  Tải lên và lưu trữ nhiều mẫu CV cho các mục tiêu nghề nghiệp khác nhau. Hệ thống AI ATS sẽ tự động phân tích kỹ năng và khớp hồ sơ của bạn với các vị trí tuyển dụng phù hợp nhất.
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 shrink-0 cursor-pointer"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span>Tải CV mới lên</span>
              </button>
            </div>
          </div>

          {/* Resumes Grid / List */}
          {resumes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <div className="h-20 w-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Bạn chưa có CV nào trong hệ thống</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Hãy tải lên tệp CV đầu tiên của bạn để sẵn sàng nộp đơn ứng tuyển các vị trí việc làm phù hợp!
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors cursor-pointer text-sm shadow-sm"
              >
                <Plus size={18} />
                <span>Tải CV ngay</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span>Danh sách tệp CV ({resumes.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {resumes.map(resume => {
                  const isEditing = editingResumeId === resume.id;

                  return (
                    <div
                      key={resume.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md p-6 relative overflow-hidden ${
                        resume.isDefault ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Ribbon for Default CV */}
                      {resume.isDefault && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1.5 shadow-xs">
                          <Star size={12} className="fill-white" />
                          <span>CV MẶC ĐỊNH</span>
                        </div>
                      )}

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        
                        {/* Left: Icon & Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                            <FileText size={28} />
                          </div>

                          <div className="space-y-2 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap pr-16 lg:pr-0">
                              {isEditing ? (
                                <div className="flex items-center gap-2 w-full max-w-md">
                                  <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    className="px-3 py-1.5 border border-indigo-500 rounded-lg text-sm font-semibold text-slate-800 outline-none w-full focus:ring-2 focus:ring-indigo-500/20"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveRename(resume.id)}
                                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                                  >
                                    Lưu
                                  </button>
                                  <button
                                    onClick={() => setEditingResumeId(null)}
                                    className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-300 cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {resume.title}
                                  </h3>
                                  <button
                                    onClick={() => handleStartRename(resume)}
                                    title="Chỉnh sửa tên gợi nhớ"
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                              <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                                {resume.fileName}
                              </span>
                              <span>•</span>
                              <span>{resume.fileSize}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 justify-end shrink-0">
                          {/* Set Default Button */}
                          {!resume.isDefault && (
                            <button
                              onClick={() => handleSetDefault(resume.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-colors cursor-pointer border border-slate-200/60"
                            >
                              <Star size={14} />
                              <span>Đặt làm mặc định</span>
                            </button>
                          )}

                          {/* Preview Button */}
                          <button
                            onClick={() => setPreviewResume(resume)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-indigo-100"
                          >
                            <Eye size={14} />
                            <span>Xem trước</span>
                          </button>

                          {/* Download Button */}
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              triggerToast(`Đang tải xuống file "${resume.fileName}"...`);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
                          >
                            <Download size={14} />
                            <span>Tải về</span>
                          </a>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteConfirmId(resume.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Xóa CV"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Separate Modal Components */}
      <UploadResumeModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadSubmit}
      />

      <PreviewResumeModal
        resume={previewResume}
        onClose={() => setPreviewResume(null)}
        onDownload={(resume) => triggerToast(`Đang tải xuống file "${resume.fileName}"...`)}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="h-14 w-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa CV?</h3>
            <p className="text-xs text-slate-500">
              Hành động này sẽ xóa vĩnh viễn tệp CV khỏi hệ thống. Bạn không thể hoàn tác sau khi thực hiện.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDeleteResume(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
