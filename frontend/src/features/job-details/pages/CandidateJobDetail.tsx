import React from 'react';
import CandidateSidebar from '../../../layouts/CandidateSidebar';
import CandidateHeader from '../../../layouts/CandidateHeader';
import JobDetail from './JobDetail';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';

export default function CandidateJobDetail({ onBack, onApply, onNavigate, onViewCompany }: { onBack: () => void, onApply: () => void, onNavigate: (item: string) => void, onViewCompany?: () => void }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <CandidateSidebar activeItem="search" onNavigate={onNavigate} />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <CandidateHeader title="Chi tiết công việc" onNavigate={onNavigate} />
        <div className="flex-1">
          <JobDetail onBack={onBack} onApply={onApply} onViewCompany={onViewCompany} />
        </div>
      </main>
    </div>
  );
}
