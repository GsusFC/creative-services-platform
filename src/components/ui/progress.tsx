import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

const Progress = ({ value, max = 100, className }: ProgressProps) => {
  const percentage = Math.min(Math.max(value, 0), max) / max * 100;

  return (
    <div className={`relative w-full h-2 bg-gray-200 rounded ${className}`}> 
      <div
        className="absolute h-full bg-blue-600 rounded"
        style={{ width: `${percentage}%` }}
        aria-label={`Progress: ${percentage}%`}
      />
    </div>
  );
};

const ProgressComponent = ({ percentage }: { percentage: number }) => {
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded">
      <div
        className="absolute h-full bg-blue-600 rounded"
        style={{ width: `${percentage}%` }}
        aria-label={`Progress: ${percentage}%`}
      />
    </div>
  );
};

export default Progress;
