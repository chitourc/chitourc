import React from 'react';

interface Point {
  x: number; // percentage
  y: number; // pixels
}

interface PathConnectorProps {
  points: Point[];
}

const PathConnector: React.FC<PathConnectorProps> = ({ points }) => {
  if (points.length < 2) return null;

  // The path is built from bottom to top, so we connect points in reverse order of array
  const pathData = points
    .slice(0, -1)
    .map((point, index) => {
      const nextPoint = points[index + 1];
      const p0 = point;
      const p1 = nextPoint;

      // Control points for a smooth vertical S-curve
      const cp1x = p0.x;
      const cp1y = (p0.y + p1.y) / 2;
      const cp2x = p1.x;
      const cp2y = (p0.y + p1.y) / 2;
      
      return `M ${p0.x}% ${p0.y} C ${cp1x}% ${cp1y}, ${cp2x}% ${cp2y}, ${p1.x}% ${p1.y}`;
    })
    .join(' ');

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <path
        d={pathData}
        fill="none"
        stroke="#475569" // slate-600
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1 15"
      />
    </svg>
  );
};

export default PathConnector;
