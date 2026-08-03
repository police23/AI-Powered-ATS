import React, { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

export interface UploadResumeData {
  file: File;
  title: string;
  setAsDefault: boolean;
}

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadResumeData) => void;
}

export default function UploadResumeModal({ isOpen, onClose, onSubmit }: UploadResumeModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setUploadError('Hệ thống chỉ chấp nhận tệp định dạng PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Dung lượng tệp vượt quá giới hạn cho phép (tối đa 5MB).');
        return;
      }
      setSelectedFile(file);
      if (!resumeTitle) {
        setResumeTitle(file.name.replace(/\.pdf$/i, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Vui lòng chọn một tệp CV định dạng PDF.');
      return;
    }
    if (!resumeTitle.trim()) {
      setUploadError('Vui lòng nhập tên gợi nhớ cho CV.');
      return;
    }

    onSubmit({
      file: selectedFile,
      title: resumeTitle.trim(),
      setAsDefault
    });

    // Reset Form
    setSelectedFile(null);
    setResumeTitle('');
    setSetAsDefault(false);
    setUploadError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tải tệp CV mới lên</h3>
              <p className="text-xs text-slate-500">Chỉ hỗ trợ file PDF, dung lượng tối đa 5MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {uploadError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Drag & Drop File Zone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50 hover:bg-indigo-50/30 cursor-pointer relative group">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="space-y-2 pointer-events-none">
              <div className="h-12 w-12 rounded-full bg-white border border-slate-200 text-indigo-600 flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 transition-transform">
                <Upload size={22} />
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
                  <p className="text-xs text-emerald-600 font-medium">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • File PDF hợp lệ
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Kéo thả file PDF vào đây hoặc <span className="text-indigo-600 font-bold underline">bấm chọn tệp</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Định dạng .pdf duy nhất (tối đa 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Resume Title Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Tên gợi nhớ cho CV <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Set Default Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-700">
              Đặt mẫu CV này làm CV Mặc định ngay sau khi tải lên
            </span>
          </label>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              Tải lên & Lưu
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
