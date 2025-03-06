import React, { memo } from 'react';
import { letterToFlag } from '../../lib/flag-system/flagMap';

interface FlagDisplayProps {
  word: string;
  showWord?: boolean;
  flagHeight?: number;
}

const FlagDisplay = memo(function FlagDisplay({ 
  word, 
  showWord = false, 
  flagHeight = 80 
}: FlagDisplayProps) {
  // If no word, show instructions
  if (!word) {
    return (
      <div className="text-center p-8">
        <span className="text-white/60 font-mono text-xl block">
          Enter or generate a word to visualize the flags
        </span>
      </div>
    );
  }
  
  return (
    <>
      {/* Container for flags, perfectly centered */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 0,
        lineHeight: 0,
      }}>
        {/* Render each flag with sequential animation */}
        {word.split('').map((letter, index) => {
          const flag = letterToFlag(letter);
          
          if (!flag) return null;
          
          return (
            <div 
              key={`${letter}-${index}`}
              style={{ 
                height: flagHeight,
                display: 'inline-block',
                margin: 0,
                padding: 0,
                animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s forwards`,
                opacity: 0,
                fontSize: 0,
                lineHeight: 0
              }}
              aria-label={`Nautical flag for letter ${letter}: ${flag.name}`}
            >
              <img
                src={flag.flagPath}
                alt={`Nautical flag ${flag.name} (letter ${letter})`}
                height={flagHeight}
                style={{ 
                  height: `${flagHeight}px`,
                  margin: 0,
                  padding: 0,
                  display: 'block'
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Show the word when requested */}
      {showWord && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease-in-out forwards',
            animationDelay: `${word.length * 0.1 + 0.2}s`,
            opacity: 0,
            padding: 0,
            margin: 0
          }}
        >
          <span
            style={{
              fontFamily: '"Druk Text Wide Heavy", system-ui',
              fontSize: '48px',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'white',
              textShadow: '0 0 10px rgba(255,255,255,0.3)',
              display: 'inline-block',
              textAlign: 'center'
            }}
          >
            {word}
          </span>
        </div>
      )}
    </>
  );
});

export default FlagDisplay;
