import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 font-sans border-t border-slate-800 shrink-0 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-center md:text-left">
          © 2026 NexusHR Platform. Tất cả quyền được bảo lưu.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  );
}
