import React from 'react';

const ExerciseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.5 2.5a.75.75 0 01.75.75V5h.75A.75.75 0 018 5.75v1.5a.75.75 0 01-1.5 0V6.5h-.75a.75.75 0 01-.75-.75V3.25a.75.75 0 01.75-.75zM12.5 2.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3.25a.75.75 0 01.75-.75zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2.5 13.5a1 1 0 000 2h15a1 1 0 100-2h-15z" />
    </svg>
);

export default ExerciseIcon;
