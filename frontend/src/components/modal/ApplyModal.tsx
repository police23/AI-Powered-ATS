import React, { useState, useEffect } from 'react';
import { X, FileText, Upload, Loader2, AlertCircle } from 'lucide-react';
import { candidateResumeApi, CandidateResumeResponse } from '../../features/candidate-profile/api/candidateResume.api';
import { candidateApplicationApi } from '../../features/candidate-applications/api/candidateApplication.api';

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  companyLogo,
  isOpen,
  onClose,
  onSuccess
}: ApplyModalProps) {
  const [resumes, setResumes] = useState<CandidateResumeResponse[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingResumes, setFetchingResumes] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload new state
  const [isUploadingNew, setIsUploadingNew] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchResumes = async () => {
      try {
        setFetchingResumes(true);
        const data = await candidateResumeApi.getAllResumes();
        setResumes(data);
        const defaultResume = data.find(r => r.isDefault) || data[0];
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id);
        } else {
          setIsUploadingNew(true);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách CV:', err);
      } finally {
        setFetchingResumes(false);
      }
    };

    fetchResumes();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    let activeResumeId = selectedResumeId;

    try {
      setSubmitting(true);

      // If user selected a file to upload or is in upload mode
      if (uploadFile) {
        const uploaded = await candidateResumeApi.uploadResume(
          uploadFile, 
          uploadFile.name.replace(/\.[^/.]+$/, ''), 
          resumes.length === 0
        );
        activeResumeId = uploaded.id;
      } else if (isUploadingNew && !activeResumeId) {
        setErrorMessage('Vui lòng chọn file CV (PDF) để ứng tuyển');
        setSubmitting(false);
        return;
      }

      if (!activeResumeId) {
        setErrorMessage('Vui lòng chọn một hồ sơ CV để ứng tuyển');
        setSubmitting(false);
        return;
      }

      await candidateApplicationApi.applyForJob({
        jobId,
        resumeId: activeResumeId
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi nộp hồ sơ:', err);
      const msg = err?.message || 'Có lỗi xảy ra khi nộp hồ sơ ứng tuyển';
      setErrorMessage(msg);
      if (msg.includes('trước đó') || err?.code === 'ALREADY_APPLIED') {
        onSuccess();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-lg overflow-hidden">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="h-full w-full object-cover" />
              ) : (
                companyName.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 line-clamp-1">Ứng tuyển {jobTitle}</h3>
              <p className="text-xs font-medium text-slate-500">{companyName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* CV Selection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText size={15} className="text-indigo-600" />
                Chọn hồ sơ CV ứng tuyển <span className="text-rose-500">*</span>
              </label>
              {resumes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadingNew(!isUploadingNew);
                    setUploadFile(null);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  {isUploadingNew ? "Chọn từ danh sách CV" : "+ Tải CV mới lên"}
                </button>
              )}
            </div>

            {fetchingResumes ? (
              <div className="flex items-center justify-center p-6 text-slate-400 gap-2">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                <span className="text-xs">Đang tải danh sách CV...</span>
              </div>
            ) : isUploadingNew || resumes.length === 0 ? (
              uploadFile ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 transition-all">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-bold">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{uploadFile.name}</p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB • PDF
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <label
                      htmlFor="modal-cv-file"
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer shadow-2xs"
                    >
                      Thay đổi file
                    </label>
                    <button
                      type="button"
                      onClick={() => setUploadFile(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Bỏ chọn file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="file"
                    id="modal-cv-file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    id="modal-cv-file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor="modal-cv-file" className="cursor-pointer flex flex-col items-center gap-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-1">
                      <Upload size={22} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      Tải lên CV định dạng PDF
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">Nhấn để chọn tệp từ máy tính (Tối đa 10MB)</span>
                  </label>
                </div>
              )
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {resumes.map(r => (
                  <label
                    key={r.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedResumeId === r.id
                        ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="selectedResume"
                        checked={selectedResumeId === r.id}
                        onChange={() => {
                          setSelectedResumeId(r.id);
                          setIsUploadingNew(false);
                        }}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{r.title}</p>
                        <p className="text-[11px] text-slate-400">{r.fileName} • {r.fileSizeFormatted}</p>
                      </div>
                    </div>
                    {r.isDefault && (
                      <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        Mặc định
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>


          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Nộp hồ sơ ứng tuyển'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
