import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;       // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
        Trang trước
      </button>

      <span className="text-sm text-slate-500 font-semibold px-4 bg-slate-100 py-2 rounded-xl min-w-[110px] text-center">
        Trang {currentPage + 1} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
      >
        Trang sau
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
