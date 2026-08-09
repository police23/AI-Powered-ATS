import React, { useState } from 'react';
import AdminHeader from '../../../layouts/AdminHeader';
import AdminSidebar from '../../../layouts/AdminSidebar';
import { Search, Filter, MoreVertical, Shield, User, Building, Ban, CheckCircle, Eye, X, Mail, Phone, Calendar, MapPin, Clock, SearchX } from 'lucide-react';
import { Pagination } from '../../../components';

interface AdminUsersProps {
  onNavigate?: (item: string) => void;
}

const MOCK_USERS = [
  { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'candidate', status: 'active', joinedAt: '2026-05-10', company: null },
  { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', role: 'hr', status: 'active', joinedAt: '2026-05-12', company: 'TechCorp Vietnam' },
  { id: '3', name: 'Lê Văn C', email: 'levanc@example.com', role: 'candidate', status: 'banned', joinedAt: '2026-05-15', company: null },
  { id: '4', name: 'Phạm Minh D', email: 'phamminhd@example.com', role: 'hr', status: 'active', joinedAt: '2026-05-20', company: 'Công ty Cổ phần VNG' },
  { id: '5', name: 'Hoàng Hữu E', email: 'hoanghuue@example.com', role: 'candidate', status: 'active', joinedAt: '2026-06-01', company: null },
  { id: '6', name: 'Vũ Đức F', email: 'vuducf@example.com', role: 'candidate', status: 'active', joinedAt: '2026-06-05', company: null },
  { id: '7', name: 'Bùi Thị G', email: 'buithig@example.com', role: 'hr', status: 'active', joinedAt: '2026-06-10', company: 'FPT Software' },
  { id: '8', name: 'Đặng Minh H', email: 'dangminhh@example.com', role: 'candidate', status: 'active', joinedAt: '2026-06-15', company: null },
  { id: '9', name: 'Ngô Hữu I', email: 'ngohuui@example.com', role: 'hr', status: 'active', joinedAt: '2026-06-20', company: 'VNPAY' },
  { id: '10', name: 'Đỗ Thị K', email: 'dothik@example.com', role: 'candidate', status: 'active', joinedAt: '2026-06-25', company: null },
  { id: '11', name: 'Lý Quang L', email: 'lyquangl@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-01', company: null },
  { id: '12', name: 'Hồ Thanh M', email: 'hothanhm@example.com', role: 'hr', status: 'active', joinedAt: '2026-07-05', company: 'MOMO' },
  { id: '13', name: 'Trương Tuấn N', email: 'truongtuann@example.com', role: 'candidate', status: 'banned', joinedAt: '2026-07-10', company: null },
  { id: '14', name: 'Nguyễn Hải O', email: 'nguyenhaio@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-12', company: null },
  { id: '15', name: 'Phan Thị P', email: 'phanthip@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-14', company: null },
  { id: '16', name: 'Đoàn Nhật Q', email: 'doannhatq@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-15', company: null },
  { id: '17', name: 'Trần Văn R', email: 'tranvanr@example.com', role: 'candidate', status: 'banned', joinedAt: '2026-07-16', company: null },
  { id: '18', name: 'Lê Cát S', email: 'lecats@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-17', company: null },
  { id: '19', name: 'Đinh Tuấn T', email: 'dinhtuant@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-18', company: null },
  { id: '20', name: 'Ngô Thanh U', email: 'ngothanhu@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-19', company: null },
  { id: '21', name: 'Hồ Xuân V', email: 'hoxuanv@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-20', company: null },
  { id: '22', name: 'Nguyễn Bá X', email: 'nguyenbax@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-21', company: null },
  { id: '23', name: 'Trần Đăng Y', email: 'trandangy@example.com', role: 'candidate', status: 'active', joinedAt: '2026-07-22', company: null },
];

export default function AdminUsers({ onNavigate }: AdminUsersProps) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('candidate');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
      }
      return u;
    }));
    setActionMenuOpen(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterRole, filterStatus]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <AdminSidebar activeItem="users" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <AdminHeader title="Quản lý Người dùng" onNavigate={onNavigate} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-slate-300 rounded-lg p-1">
                  <button 
                    onClick={() => setFilterRole('candidate')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filterRole === 'candidate' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Ứng viên
                  </button>
                  <button 
                    onClick={() => setFilterRole('hr')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filterRole === 'hr' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Nhà tuyển dụng
                  </button>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-40 pl-3 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-700"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="banned">Không hoạt động</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 shrink-0">
                              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                {user.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{user.name}</div>
                              <div className="text-sm text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-sm text-slate-700">
                              {user.role === 'candidate' ? <User size={14} className="text-emerald-600" /> : <Building size={14} className="text-indigo-600" />}
                              <span className="font-medium">{user.role === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}</span>
                            </div>
                            {user.role === 'hr' && user.company && (
                              <div className="text-xs text-slate-500 flex items-center gap-1 ml-5">
                                <span>{user.company}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {user.joinedAt.split('-').reverse().join('/')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                          <button 
                            onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {actionMenuOpen === user.id && (
                            <div className="absolute right-6 top-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in slide-in-from-top-1 duration-150">
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionMenuOpen(null);
                                }}
                              >
                                <Eye size={14} className="text-slate-400" />
                                Xem chi tiết
                              </button>
                              
                              {user.status === 'active' ? (
                                <button 
                                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  onClick={() => handleToggleStatus(user.id)}
                                >
                                  <Ban size={14} />
                                  Cấm tài khoản
                                </button>
                              ) : (
                                <button 
                                  className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                  onClick={() => handleToggleStatus(user.id)}
                                >
                                  <CheckCircle size={14} />
                                  Mở khóa tài khoản
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {currentUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          Không tìm thấy người dùng nào phù hợp.
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

      {/* User Details Slide-over */}
      {selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedUser(null)}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Chi tiết người dùng</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-2xl border-4 border-white shadow-sm">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedUser.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full ${
                        selectedUser.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {selectedUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                      <span className="text-sm font-medium text-slate-500 border-l border-slate-300 pl-2">
                        {selectedUser.role === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}
                      </span>
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
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-medium text-slate-800">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          <Phone size={16} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Số điện thoại</p>
                          <p className="font-medium text-slate-800">0987 654 321</p>
                        </div>
                      </div>
                      {selectedUser.company && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-400 shadow-sm shrink-0">
                            <Building size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Công ty</p>
                            <p className="font-medium text-indigo-700">{selectedUser.company}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Hoạt động</h4>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400" />
                          <span className="text-sm text-slate-600">Ngày tham gia</span>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{selectedUser.joinedAt.split('-').reverse().join('/')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-sm text-slate-600">Đăng nhập lần cuối</span>
                        </div>
                        <span className="text-sm font-medium text-slate-800">2 giờ trước</span>
                      </div>
                      {selectedUser.role === 'candidate' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-600">Hồ sơ ứng tuyển</span>
                          </div>
                          <span className="text-sm font-medium text-indigo-600">12 công việc</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-600">Tin tuyển dụng</span>
                          </div>
                          <span className="text-sm font-medium text-indigo-600">5 tin đang mở</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
              {selectedUser.status === 'active' ? (
                <button 
                  onClick={() => { handleToggleStatus(selectedUser.id); setSelectedUser({...selectedUser, status: 'banned'}); }}
                  className="flex-1 bg-white border border-rose-200 text-rose-600 font-medium py-2 px-4 rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Ban size={16} /> Cấm tài khoản
                </button>
              ) : (
                <button 
                  onClick={() => { handleToggleStatus(selectedUser.id); setSelectedUser({...selectedUser, status: 'active'}); }}
                  className="flex-1 bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <CheckCircle size={16} /> Mở khóa tài khoản
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
