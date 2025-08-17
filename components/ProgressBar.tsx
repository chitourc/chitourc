import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const progressPercent = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-[#10B981] h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progressPercent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;