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
        d="M12.395 2.553a1 1 0 00-1.45.12l-2.495 3.89a1 1 0 00.985 1.506l.542-.09a1 1 0 011.053.822l.54 2.705a1 1 0 01-1.63.852l-2.422-2.068a1 1 0 00-1.157 0l-2.422 2.068a1 1 0 01-1.63-.852l.54-2.705a1 1 0 011.053-.822l.542.09a1 1 0 00.985-1.506l-2.495-3.89a1 1 0 00-1.45-.12A7.953 7.953 0 003 10c0 3.52 2.26 6.495 5.286 7.576a.5.5 0 00.428.022A7.953 7.953 0 0017 10c0-2.822-1.47-5.32-3.605-6.447z" 
        clipRule="evenodd" 
    />
  </svg>
);

export default FireIcon;
