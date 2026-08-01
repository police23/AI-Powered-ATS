import React, { useState } from 'react';
import { Building, MapPin, Globe, Users, Briefcase, Camera, Image as ImageIcon, Save, CheckCircle2, Link as LinkIcon, Plus, Trash2, Eye, ArrowLeft, Mail, Phone, ExternalLink, Edit } from 'lucide-react';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import Footer from '../../../layouts/Footer';

export default function CompanyProfile({ onNavigate, isCandidateView = false, isCandidatePortal = false, onBack }: { onNavigate?: (item: string) => void, isCandidateView?: boolean, isCandidatePortal?: boolean, onBack?: () => void }) {
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [benefits, setBenefits] = useState([
    'Bảo hiểm sức khỏe cao cấp',
    'MacBook Pro cho nhân viên',
    'Môi trường làm việc linh hoạt'
  ]);
  const [newBenefit, setNewBenefit] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedToast(true);
    setIsEditMode(false);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-800 flex ${isCandidateView && !isCandidatePortal ? "flex-col" : "flex-col md:flex-row h-screen overflow-hidden"}`}>
      {isCandidatePortal ? (
        <CandidateSidebar activeItem="search" onNavigate={onNavigate} />
      ) : !isCandidateView ? (
        <EmployerSidebar activeItem="company-profile" onNavigate={onNavigate} />
      ) : null}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {isCandidatePortal ? (
          <CandidateHeader title="Trang công ty" onNavigate={onNavigate} />
        ) : !isCandidateView ? (
          <EmployerHeader title="Hồ sơ công ty" onNavigate={onNavigate} />
        ) : (
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>
            </div>
          </header>
        )}
        
        {showSavedToast && (
          <div className="absolute top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <div className="flex flex-col">
                <span className="font-bold text-sm">Đã lưu thành công</span>
                <span className="text-xs opacity-80">Hồ sơ công ty đã được cập nhật</span>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          {isCandidatePortal && onBack && (
            <div className="mb-4">
              <button 
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
            </div>
          )}
          {!isEditMode ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-800">Tổng quan hồ sơ công ty</h2>
                {!isCandidateView && (
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors font-medium bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg"
                  >
                    <Edit size={16} /> Chỉnh sửa hồ sơ
                  </button>
                )}
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-64 bg-slate-100 relative">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400" alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="px-8 pb-8 relative">
                  <div className="absolute -top-16 left-8">
                    <div className="w-32 h-32 bg-white rounded-xl shadow-md border-4 border-white overflow-hidden flex items-center justify-center text-indigo-500 font-bold text-4xl bg-indigo-50">
                      TC
                    </div>
                  </div>
                  <div className="ml-40 pt-4">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">TechCorp Vietnam</h1>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Building size={16} className="text-slate-400" /> Công nghệ thông tin (IT)</span>
                      <span className="flex items-center gap-1.5"><Users size={16} className="text-slate-400" /> 51 - 150 nhân viên</span>
                      <span className="flex items-center gap-1.5"><Globe size={16} className="text-slate-400" /> <a href="#" className="text-indigo-600 hover:underline">www.techcorp.vn</a></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-10">
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Giới thiệu công ty</h3>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
                    <p>TechCorp Vietnam là công ty hàng đầu trong lĩnh vực phát triển phần mềm, tập trung vào việc xây dựng các giải pháp sáng tạo cho khách hàng toàn cầu. Với đội ngũ kỹ sư tài năng, chúng tôi không ngừng cải tiến để mang lại giá trị tốt nhất.</p>
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Phúc lợi & Môi trường</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Liên hệ & Địa điểm</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <Mail size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-0.5">Email</p>
                        <a href="mailto:hr@techcorp.vn" className="text-sm font-medium text-indigo-600 hover:underline">hr@techcorp.vn</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-0.5">Điện thoại</p>
                        <p className="text-sm font-medium text-slate-800">028 3456 7890</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Trụ sở chính</p>
                        <p className="text-sm font-medium text-slate-800">Tầng 12, Tòa nhà Nexus, 123 Đường A, Quận 1, TP. Hồ Chí Minh</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
          <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <button 
                type="button"
                onClick={() => setIsEditMode(false)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
              >
                <ArrowLeft size={18} /> Quay lại tổng quan
              </button>
            </div>
            
            {/* Cover & Logo */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-48 bg-slate-100 relative group">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400" alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <ImageIcon size={16} /> Thay đổi ảnh bìa
                  </button>
                </div>
              </div>
              
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-12 left-6">
                  <div className="w-24 h-24 bg-white rounded-xl shadow-md border-4 border-white overflow-hidden relative group">
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-3xl">
                      TC
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera size={20} className="text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="ml-32 pt-3 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">TechCorp Vietnam</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <Globe size={14} /> www.techcorp.vn
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-10">
              {/* General Information */}
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Thông tin chung</h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên công ty</label>
                      <input type="text" defaultValue="TechCorp Vietnam" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngành nghề</label>
                      <select className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                        <option value="it">Công nghệ thông tin (IT)</option>
                        <option value="fintech">Tài chính công nghệ (Fintech)</option>
                        <option value="ecommerce">Thương mại điện tử</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Website công ty</label>
                      <div className="relative">
                        <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="url" defaultValue="https://www.techcorp.vn" className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Quy mô nhân sự</label>
                      <div className="relative">
                        <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                          <option value="1-50">1 - 50 nhân viên</option>
                          <option value="51-150" selected>51 - 150 nhân viên</option>
                          <option value="151-500">151 - 500 nhân viên</option>
                          <option value="500+">500+ nhân viên</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Giới thiệu công ty</label>
                    <textarea rows={6} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" defaultValue="TechCorp Vietnam là công ty hàng đầu trong lĩnh vực phát triển phần mềm, tập trung vào việc xây dựng các giải pháp sáng tạo cho khách hàng toàn cầu. Với đội ngũ kỹ sư tài năng, chúng tôi không ngừng cải tiến để mang lại giá trị tốt nhất."></textarea>
                    <p className="text-xs text-slate-500 mt-2">Mô tả ngắn gọn về sứ mệnh, tầm nhìn và văn hóa làm việc của công ty.</p>
                  </div>
                </div>
              </section>

              {/* Benefits */}
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Phúc lợi & Môi trường</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                      placeholder="Thêm phúc lợi (VD: Du lịch hàng năm...)" 
                      className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                    <button type="button" onClick={addBenefit} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                      <Plus size={16} /> Thêm
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 group">
                        <span className="text-sm font-medium text-slate-700">{benefit}</span>
                        <button type="button" onClick={() => removeBenefit(idx)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-rose-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Contact & Location */}
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Liên hệ & Địa điểm</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email liên hệ</label>
                      <input type="email" defaultValue="hr@techcorp.vn" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại</label>
                      <input type="tel" defaultValue="028 3456 7890" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Thành phố</label>
                      <select className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="hn">Hà Nội</option>
                        <option value="dn">Đà Nẵng</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Địa chỉ chi tiết</label>
                      <textarea rows={3} className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" defaultValue="Tầng 12, Tòa nhà Nexus, 123 Đường A, Quận 1"></textarea>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                  <Save size={18} /> Lưu thay đổi
                </button>
              </div>
            </div>
            
          </form>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
