import React from 'react';

interface FlagInfo {
  letter: string;
  name: string;
  flagPath: string;
}

interface FlagPatternProps {
  flagInfo: FlagInfo;
  showLetter?: boolean;
}

const FlagPattern: React.FC<FlagPatternProps> = ({ flagInfo, showLetter = false }) => {
  const { letter, flagPath } = flagInfo;
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 200" 
      width="100%" 
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
    >
      <image 
        href={flagPath} 
        width="300" 
        height="200"
        preserveAspectRatio="xMidYMid meet"
      />
      {showLetter && (
        <text 
          x="150" 
          y="100" 
          fontFamily="Arial, sans-serif" 
          fontSize="40"
          fontWeight="bold"
          fill="white" 
          textAnchor="middle" 
          dominantBaseline="middle"
          style={{ filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))" }}
        >
          {letter}
        </text>
      )}
    </svg>
  );
};

export default FlagPattern;
