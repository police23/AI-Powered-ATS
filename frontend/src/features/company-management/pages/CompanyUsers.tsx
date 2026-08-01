import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Shield, User, ToggleLeft, ToggleRight, Trash2, CheckCircle2, X, AlertCircle } from 'lucide-react';
import EmployerSidebar from '../../../layouts/EmployerSidebar';
import EmployerHeader from '../../../layouts/EmployerHeader';
import Footer from '../../../layouts/Footer';

const initialUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@techcorp.vn',
    role: 'hr',
    status: 'active',
    lastActive: 'Vừa xong',
    avatar: 'A'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@techcorp.vn',
    role: 'hr',
    status: 'active',
    lastActive: '2 giờ trước',
    avatar: 'B'
  },
  {
    id: 3,
    name: 'Lê Hoàng C',
    email: 'lehoangc@techcorp.vn',
    role: 'employee',
    status: 'inactive',
    lastActive: '3 ngày trước',
    avatar: 'C'
  },
  {
    id: 4,
    name: 'Phạm Minh D',
    email: 'phamminhd@techcorp.vn',
    role: 'employee',
    status: 'pending',
    lastActive: 'Chưa đăng nhập',
    avatar: 'D'
  }
];

export default function CompanyUsers({ onNavigate }: { onNavigate?: (item: string) => void }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('hr');
  const [showToast, setShowToast] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      const newUser = {
        id: users.length + 1,
        name: 'Người dùng mới',
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        lastActive: 'Chưa đăng nhập',
        avatar: inviteEmail.charAt(0).toUpperCase()
      };
      setUsers([...users, newUser]);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'hr':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1"><User size={12} /> Nhân sự</span>;
      default:
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1"><User size={12} /> Nhân viên</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-semibold">Active</span>;
    }
    return <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-semibold">Inactive</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row h-screen overflow-hidden">
      <EmployerSidebar activeItem="company-users" onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <EmployerHeader title="Quản lý Nhân sự Công ty" onNavigate={onNavigate} />
        
        {showToast && (
          <div className="absolute top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <div className="flex flex-col">
                <span className="font-bold text-sm">Đã gửi lời mời</span>
                <span className="text-xs opacity-80">Email mời đã được gửi tới {inviteEmail}</span>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">
            <div className="p-5 border-b border-slate-200 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Tài khoản nhân viên</h2>
                  <p className="text-sm text-slate-500 mt-1">Quản lý quyền truy cập và phân quyền cho các thành viên trong công ty.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={16} /> Thêm thành viên
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thành viên</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shrink-0">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{user.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                user.status === 'active' 
                                  ? 'text-emerald-600 hover:bg-emerald-50' 
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                              }`}
                              title={user.status === 'active' ? 'Chuyển sang Inactive' : 'Chuyển sang Active'}
                            >
                              {user.status === 'active' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                              title="Xóa thành viên"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search size={32} className="text-slate-300 mb-3" />
                          <p className="text-sm font-medium text-slate-600">Không tìm thấy thành viên nào</p>
                          <p className="text-xs mt-1">Vui lòng thử lại với từ khóa khác.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between text-sm text-slate-500">
              <p>Hiển thị <span className="font-medium text-slate-800">{filteredUsers.length}</span> / {users.length} thành viên</p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Thêm thành viên mới</h3>
              <button 
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email người nhận</label>
                  <input 
                    type="email" 
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="VD: hr@techcorp.vn"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Vai trò (Phân quyền)</label>
                  <select 
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="hr">Nhân sự</option>
                    <option value="employee">Nhân viên</option>
                  </select>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex gap-3 mt-2">
                  <AlertCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 mb-0.5">Giới hạn tài khoản</h4>
                    <p className="text-xs text-indigo-700/80 leading-relaxed">
                      Công ty bạn có thể thêm tối đa 10 tài khoản nhân sự miễn phí. Hiện tại đang sử dụng {users.length}/10.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 shadow-sm"
                >
                  Gửi lời mời
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
