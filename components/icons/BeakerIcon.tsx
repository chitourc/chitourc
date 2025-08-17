import React from 'react';

const BeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v.518a.75.75 0 01-.396.67l-2.006 1.114a.75.75 0 00-.396.67v5.528a.75.75 0 00.396.67l2.006 1.114a.75.75 0 01.396.67v.518a.75.75 0 01-1.5 0v-.518a.75.75 0 01-.396-.67l-2.006-1.114a.75.75 0 00-.396-.67V7.534a.75.75 0 00.396-.67L8.604 5.75a.75.75 0 01.396-.67V4.75a.75.75 0 01.75-.75h.5z" clipRule="evenodd" />
        <path d="M5.626 4.352a.75.75 0 011.06 0L10 6.666l3.314-2.314a.75.75 0 111.06 1.06L11.06 7.727l3.314 2.314a.75.75 0 11-1.06 1.06L10 8.788l-3.314 2.313a.75.75 0 11-1.06-1.06l3.314-2.314-3.314-2.314a.75.75 0 010-1.06z" />
    </svg>
);

export default BeakerIcon;
