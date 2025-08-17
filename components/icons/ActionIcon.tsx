import React from 'react';

const ActionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 10a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7z" />
        <path d="M8 10V8a4 4 0 1 1 8 0v2" />
        <path d="M12 14v2" />
        <path d="M10 16h4" />
    </svg>
);

export default ActionIcon;
