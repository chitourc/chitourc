import React from 'react';

interface ChestIconProps {
  className?: string;
}

const ChestIcon: React.FC<ChestIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path fillRule="evenodd" d="M6 3a1 1 0 011-1h6a1 1 0 011 1v2h2a1 1 0 011 1v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a1 1 0 011-1h2V3zm2-1h4v2H8V2zM4 6v10h12V6H4z" clipRule="evenodd" />
    <path d="M9 12a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
  </svg>
);

export default ChestIcon;
