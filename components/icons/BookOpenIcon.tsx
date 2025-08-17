import React from 'react';

const BookOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 3.25a.75.75 0 00-1.5 0v1.25a.75.75 0 001.5 0V3.25z" />
        <path fillRule="evenodd" d="M3.25 5.75a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75V5.75zM4.75 7.25v8.11a2.25 2.25 0 002.05 2.138l.45.053h4.5a2.25 2.25 0 002.5-2.25V7.25H4.75z" clipRule="evenodd" />
    </svg>
);

export default BookOpenIcon;
