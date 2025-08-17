import React from 'react';

interface MicrophoneIconProps {
    className?: string;
}

const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 20 20" 
        fill="currentColor">
        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
        <path d="M5.5 9.5a.5.5 0 00-1 0v1a4.5 4.5 0 004.5 4.5v2.5a.5.5 0 001 0V15a4.5 4.5 0 004.5-4.5v-1a.5.5 0 00-1 0v1a3.5 3.5 0 01-3.5 3.5V10a3.5 3.5 0 01-3.5-3.5v-1z" />
    </svg>
);

export default MicrophoneIcon;