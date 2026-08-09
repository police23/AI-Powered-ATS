import React, { useState } from 'react';
import AdminHeader from '../../../layouts/AdminHeader';
import AdminSidebar from '../../../layouts/AdminSidebar';
import { Search, Filter, MoreVertical, Building, Ban, CheckCircle, Eye, X, Mail, Phone, MapPin, Globe, FileText, Check, AlertCircle, Calendar } from 'lucide-react';
import { Pagination } from '../../../components';

interface AdminCompaniesProps {
  onNavigate?: (item: string) => void;
}

const MOCK_COMPANIES = [
  { id: '1', name: 'TechCorp Vietnam', email: 'contact@techcorp.vn', phone: '0123456789', status: 'verified', joinedAt: '2026-05-10', address: 'Quận 1, TP. HCM', website: 'techcorp.vn', jobsCount: 15 },
  { id: '2', name: 'Công ty Cổ phần VNG', email: 'hr@vng.com.vn', phone: '0987654321', status: 'verified', joinedAt: '2026-05-12', address: 'Quận 7, TP. HCM', website: 'vng.com.vn', jobsCount: 42 },
  { id: '3', name: 'Startup Global', email: 'hello@startupglobal.io', phone: '0234567890', status: 'pending', joinedAt: '2026-05-15', address: 'Quận Cầu Giấy, Hà Nội', website: 'startupglobal.io', jobsCount: 3 },
  { id: '4', name: 'FPT Software', email: 'recruitment@fsoft.com.vn', phone: '0345678901', status: 'verified', joinedAt: '2026-05-20', address: 'Khu Công Nghệ Cao, TP. Thủ Đức', website: 'fpt-software.com', jobsCount: 120 },
  { id: '5', name: 'Marketing Pro', email: 'hr@marketingpro.vn', phone: '0456789012', status: 'banned', joinedAt: '2026-06-01', address: 'Quận Đống Đa, Hà Nội', website: 'marketingpro.vn', jobsCount: 0 },
  { id: '6', name: 'VNPAY', email: 'tuyendung@vnpay.vn', phone: '0567890123', status: 'verified', joinedAt: '2026-06-10', address: 'Quận Đống Đa, Hà Nội', website: 'vnpay.vn', jobsCount: 25 },
  { id: '7', name: 'MOMO', email: 'hr@momo.vn', phone: '0678901234', status: 'verified', joinedAt: '2026-06-20', address: 'Quận 7, TP. HCM', website: 'momo.vn', jobsCount: 30 },
  { id: '8', name: 'NewTech Edu', email: 'contact@newtechedu.com', phone: '0789012345', status: 'pending', joinedAt: '2026-07-05', address: 'Quận 3, TP. HCM', website: 'newtechedu.com', jobsCount: 1 },
];

export default function AdminCompanies({ onNavigate }: AdminCompaniesProps) {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleToggleStatus = (id: string, newStatus: string) => {
    setCompanies(companies.map(c => {
      if (c.id === id) {
        return { ...c, status: newStatus };
      }
      return c;
    }));
    setActionMenuOpen(null);
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const currentCompanies = filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1"><Check size={12} /> Đã xác thực</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1"><AlertCircle size={12} /> Chờ duyệt</span>;
      case 'banned':
        return <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1"><Ban size={12} /> Bị cấm</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <AdminSidebar activeItem="companies" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <AdminHeader title="Quản lý Công ty" onNavigate={onNavigate} />
        
        <main className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm công ty theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-48 pl-3 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-700"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="verified">Đã xác thực</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="banned">Bị cấm</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Công ty</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin liên hệ</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {currentCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 shrink-0">
                              <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                <Building size={20} />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{company.name}</div>
                              <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                <FileText size={12} /> {company.jobsCount} tin tuyển dụng
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="text-sm text-slate-700 flex items-center gap-1.5">
                              <Mail size={14} className="text-slate-400" />
                              {company.email}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Phone size={14} className="text-slate-400" />
                              {company.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(company.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {company.joinedAt.split('-').reverse().join('/')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                          <button 
                            onClick={() => setActionMenuOpen(actionMenuOpen === company.id ? null : company.id)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {actionMenuOpen === company.id && (
                            <div className="absolute right-6 top-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in slide-in-from-top-1 duration-150">
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                onClick={() => {
                                  setSelectedCompany(company);
                                  setActionMenuOpen(null);
                                }}
                              >
                                <Eye size={14} className="text-slate-400" />
                                Xem chi tiết
                              </button>
                              
                              {company.status === 'pending' && (
                                <button 
                                  className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                  onClick={() => handleToggleStatus(company.id, 'verified')}
                                >
                                  <CheckCircle size={14} />
                                  Duyệt công ty
                                </button>
                              )}

                              {company.status !== 'banned' ? (
                                <button 
                                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  onClick={() => handleToggleStatus(company.id, 'banned')}
                                >
                                  <Ban size={14} />
                                  Đình chỉ
                                </button>
                              ) : (
                                <button 
                                  className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                  onClick={() => handleToggleStatus(company.id, 'verified')}
                                >
                                  <CheckCircle size={14} />
                                  Bỏ đình chỉ
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {currentCompanies.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          Không tìm thấy công ty nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage - 1}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page + 1)}
              />
            </div>
            
          </div>
        </main>
      </div>

      {/* Company Details Slide-over */}
      {selectedCompany && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedCompany(null)}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Chi tiết công ty</h2>
              <button 
                onClick={() => setSelectedCompany(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-20 w-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-3xl shadow-sm shrink-0">
                    <Building size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedCompany.name}</h3>
                    <div className="mt-2">
                      {getStatusBadge(selectedCompany.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Thông tin liên hệ</h4>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          <Mail size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Email doanh nghiệp</p>
                          <p className="font-medium text-slate-800">{selectedCompany.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          <Phone size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Số điện thoại</p>
                          <p className="font-medium text-slate-800">{selectedCompany.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          <Globe size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Website</p>
                          <a href={`https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:underline">
                            {selectedCompany.website}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Địa chỉ</p>
                          <p className="font-medium text-slate-800">{selectedCompany.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Hoạt động tuyển dụng</h4>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-sm text-slate-600">Tổng tin tuyển dụng</span>
                        </div>
                        <span className="text-lg font-bold text-slate-800">{selectedCompany.jobsCount}</span>
                      </div>
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400" />
                          <span className="text-sm text-slate-600">Ngày tham gia hệ thống</span>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{selectedCompany.joinedAt.split('-').reverse().join('/')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              {selectedCompany.status === 'pending' && (
                <button 
                  onClick={() => { handleToggleStatus(selectedCompany.id, 'verified'); setSelectedCompany({...selectedCompany, status: 'verified'}); }}
                  className="flex-1 bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <CheckCircle size={16} /> Duyệt công ty
                </button>
              )}
              {selectedCompany.status === 'verified' && (
                <button 
                  onClick={() => { handleToggleStatus(selectedCompany.id, 'banned'); setSelectedCompany({...selectedCompany, status: 'banned'}); }}
                  className="flex-1 bg-white border border-rose-200 text-rose-600 font-medium py-2 px-4 rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Ban size={16} /> Đình chỉ hoạt động
                </button>
              )}
              {selectedCompany.status === 'banned' && (
                <button 
                  onClick={() => { handleToggleStatus(selectedCompany.id, 'verified'); setSelectedCompany({...selectedCompany, status: 'verified'}); }}
                  className="flex-1 bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <CheckCircle size={16} /> Khôi phục hoạt động
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
