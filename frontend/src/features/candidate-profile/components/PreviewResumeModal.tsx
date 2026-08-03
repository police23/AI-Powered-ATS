import React from 'react';
import { FileText, Download, X } from 'lucide-react';
import { CandidateResumeItem } from '../pages/CandidateResumes';

interface PreviewResumeModalProps {
  resume: CandidateResumeItem | null;
  onClose: () => void;
  onDownload: (resume: CandidateResumeItem) => void;
}

export default function PreviewResumeModal({ resume, onClose, onDownload }: PreviewResumeModalProps) {
  if (!resume) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{resume.title}</h3>
              <p className="text-xs text-slate-500 font-mono">{resume.fileName} ({resume.fileSize})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewer Content Mockup */}
        <div className="flex-1 bg-slate-200/60 p-6 overflow-y-auto flex items-center justify-center">
          <div className="bg-white w-full max-w-xl min-h-[500px] shadow-lg rounded-xl p-8 border border-slate-300 space-y-6 text-slate-800">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-900">NGUYỄN VĂN A</h2>
              <p className="text-indigo-600 font-semibold">SENIOR FRONTEND DEVELOPER</p>
              <p className="text-xs text-slate-500 mt-1">Email: nguyenvana@gmail.com • Phone: 0901234567 • Location: TP. Hồ Chí Minh</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Kinh nghiệm làm việc mẫu</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-bold text-slate-800">Senior Frontend Engineer — ATS Technology Solution</p>
                  <p className="text-xs text-slate-500">2023 — Hiện tại</p>
                  <p className="text-xs text-slate-600 mt-1">Phát triển hệ thống Applicant Tracking System bằng React 18, TypeScript, TailwindCSS và Spring Boot Modulith.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">Bản xem trước tệp PDF chuẩn từ hệ thống ATS</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => onDownload(resume)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Tải file gốc</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
