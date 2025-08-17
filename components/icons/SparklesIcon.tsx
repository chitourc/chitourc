import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.868 2.884c.321-.772.136-1.606-.442-2.184a.75.75 0 10-1.06 1.06.82.82 0 01.198.225L9.63 3.65l-1.362-1.362a.75.75 0 00-1.06 1.06l1.361 1.362-.635.635a.75.75 0 001.06 1.06l.635-.635 1.362 1.362a.75.75 0 001.06-1.06L11.06 5.3l1.362-1.362a.75.75 0 00-1.06-1.06l-1.362 1.362.433-.953z" clipRule="evenodd" />
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.118 7.117a.75.75 0 10-1.06 1.06l1.06-1.06zM12.882 7.117a.75.75 0 011.06 1.06l-1.06-1.06zM7.118 12.883a.75.75 0 01-1.06-1.06l1.06 1.06zM12.882 12.883a.75.75 0 101.06-1.06l-1.06 1.06z" />
    </svg>
);

export default SparklesIcon;
