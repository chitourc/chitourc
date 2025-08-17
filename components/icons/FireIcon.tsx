import React from 'react';

interface FireIconProps {
  className?: string;
}

const FireIcon: React.FC<FireIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM10 18a1 1 0 01.707.293l2 2a1 1 0 11-1.414 1.414l-2-2A1 1 0 0110 18zm-6.707-6.293a1 1 0 111.414-1.414l2 2a1 1 0 11-1.414 1.414l-2-2a1 1 0 010-1.414zM10 4a1 1 0 01-1-1V1a1 1 0 112 0v2a1 1 0 01-1 1z" 
      clipRule="evenodd" 
    />
     <path d="M10 18a1 1 0 01.707.293l2 2a1 1 0 11-1.414 1.414l-2-2A1 1 0 0110 18zm-6.707-6.293a1 1 0 111.414-1.414l2 2a1 1 0 11-1.414 1.414l-2-2a1 1 0 010-1.414zM10 4a1 1 0 01-1-1V1a1 1 0 112 0v2a1 1 0 01-1 1z"/>
     <path d="M10 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6z"/>
     <path d="M12.863 5.137a.5.5 0 01.874.433l-1.5 6a.5.5 0 01-.968-.24l1.5-6a.5.5 0 01.094-.193zM10 14a4 4 0 100-8 4 4 0 000 8z"/>
  </svg>
);

export default FireIcon;
