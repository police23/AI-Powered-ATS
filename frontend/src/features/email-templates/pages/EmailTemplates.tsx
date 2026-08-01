import React, { useState } from 'react';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import { Mail, Edit2, Check, X, Save } from 'lucide-react';

const DEFAULT_TEMPLATES = [
  {
    id: 'interview_invitation',
    name: 'Mời phỏng vấn',
    subject: 'Thư mời phỏng vấn - [Tên Công Ty]',
    body: `Chào [Tên Ứng Viên],

Chúng tôi rất ấn tượng với hồ sơ của bạn cho vị trí [Vị Trí Ứng Tuyển]. Chúng tôi muốn mời bạn tham gia một buổi phỏng vấn để trao đổi thêm về kinh nghiệm và sự phù hợp của bạn với công ty.

Thời gian: [Thời Gian Phỏng Vấn]
Địa điểm/Link: [Địa Điểm Phỏng Vấn]

Vui lòng xác nhận lịch phỏng vấn bằng cách phản hồi lại email này.

Trân trọng,
Bộ phận Tuyển dụng
[Tên Công Ty]`,
  },
  {
    id: 'offer_letter',
    name: 'Thư mời nhận việc (Offer Letter)',
    subject: 'Thư mời nhận việc - [Tên Công Ty]',
    body: `Chào [Tên Ứng Viên],

Chúc mừng bạn! Chúng tôi rất vui mừng thông báo rằng bạn đã trúng tuyển vị trí [Vị Trí Ứng Tuyển] tại [Tên Công Ty].

Vui lòng xem chi tiết thư mời nhận việc (Offer Letter) được đính kèm trong email này.
Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.

Trân trọng,
Bộ phận Tuyển dụng
[Tên Công Ty]`,
  },
  {
    id: 'rejection_letter',
    name: 'Hồ sơ không phù hợp',
    subject: 'Thông báo kết quả ứng tuyển - [Tên Công Ty]',
    body: `Chào [Tên Ứng Viên],

Cảm ơn bạn đã quan tâm và dành thời gian tham gia ứng tuyển cho vị trí [Vị Trí Ứng Tuyển] tại [Tên Công Ty].

Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ và kinh nghiệm của bạn hiện tại chưa thực sự phù hợp với định hướng của công ty cho vị trí này.

Chúng tôi sẽ lưu trữ hồ sơ của bạn và liên hệ lại khi có cơ hội việc làm phù hợp hơn trong tương lai.
Chúc bạn thành công trên con đường sự nghiệp.

Trân trọng,
Bộ phận Tuyển dụng
[Tên Công Ty]`,
  }
];

export default function EmailTemplates({ onNavigate }: { onNavigate?: (item: string) => void }) {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ subject: '', body: '' });
  const [showToast, setShowToast] = useState(false);

  const activeTemplate = templates.find(t => t.id === activeTab) || templates[0];

  const handleEditClick = () => {
    setEditingId(activeTemplate.id);
    setEditForm({ subject: activeTemplate.subject, body: activeTemplate.body });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ subject: '', body: '' });
  };

  const handleSave = () => {
    if (editingId) {
      setTemplates(prev => prev.map(t => 
        t.id === editingId ? { ...t, subject: editForm.subject, body: editForm.body } : t
      ));
      setEditingId(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <EmployerSidebar activeItem="email-templates" onNavigate={onNavigate} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <EmployerHeader title="Mẫu Email Tự Động" onNavigate={onNavigate} />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Cấu hình mẫu Email</h2>
                  <p className="text-sm text-slate-500">Thiết lập nội dung email tự động gửi cho ứng viên tại các giai đoạn khác nhau.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setActiveTab(template.id);
                      handleCancelEdit();
                    }}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 outline-none transition-colors ${
                      activeTab === template.id 
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">{activeTemplate.name}</h3>
                  {editingId !== activeTemplate.id && (
                    <button 
                      onClick={handleEditClick}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <Edit2 size={14} />
                      Chỉnh sửa
                    </button>
                  )}
                </div>
                
                {editingId === activeTemplate.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tiêu đề Email</label>
                      <input 
                        type="text"
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung Email</label>
                      <div className="mb-2 flex flex-wrap gap-2 text-xs">
                        <span className="text-slate-500">Biến hỗ trợ:</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">[Tên Ứng Viên]</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">[Vị Trí Ứng Tuyển]</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">[Tên Công Ty]</span>
                        {activeTemplate.id === 'interview_invitation' && (
                          <>
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">[Thời Gian Phỏng Vấn]</span>
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">[Địa Điểm Phỏng Vấn]</span>
                          </>
                        )}
                      </div>
                      <textarea 
                        value={editForm.body}
                        onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                        rows={8}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-mono whitespace-pre-wrap"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button 
                        onClick={handleCancelEdit}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        <X size={16} />
                        Hủy
                      </button>
                      <button 
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Save size={16} />
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 opacity-80 pointer-events-none">
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 mb-1">Tiêu đề Email</label>
                      <div className="text-sm font-medium text-slate-800">{activeTemplate.subject}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 mb-1">Nội dung Email</label>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono leading-relaxed">
                        {activeTemplate.body}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 z-50">
          <div className="h-6 w-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
            <Check size={14} strokeWidth={3} />
          </div>
          <p className="text-sm font-medium">Đã lưu mẫu email thành công</p>
        </div>
      )}
    </div>
  );
}
