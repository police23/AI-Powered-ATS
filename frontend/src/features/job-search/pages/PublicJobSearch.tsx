import React from 'react';
import CandidateJobSearch from './CandidateJobSearch';

export default function PublicJobSearch({ onLoginClick, onJobClick, onHomeClick }: { onLoginClick: () => void, onJobClick: () => void, onHomeClick: () => void }) {
  return (
    <CandidateJobSearch 
      isPublic={true}
      onLoginClick={onLoginClick}
      onNavigate={(item) => {
        if (item === 'home') onHomeClick();
      }}
      onJobClick={onJobClick}
    />
  );
}
