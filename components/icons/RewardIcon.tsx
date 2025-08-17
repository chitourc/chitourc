import React from 'react';

const RewardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M11.983 1.907a.75.75 0 00-1.966 0l-3.334 2.11a.75.75 0 00-.333.633V7.5a.75.75 0 00.75.75h8.25a.75.75 0 00.75-.75V4.65a.75.75 0 00-.333-.633l-3.334-2.11zM10 3.827L11.667 5H8.333L10 3.827z" />
        <path d="M4.75 9.75a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H4.75z" />
        <path d="M5.25 12a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zM8.25 12a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018.25 12zm3 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
    </svg>
);

export default RewardIcon;
