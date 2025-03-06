import React, { memo, useRef, useEffect } from 'react';

interface FlagControlsProps {
  word: string;
  maxLength: number;
  isGenerating: boolean;
  onWordChange: (word: string) => void;
  onGenerateRandom: () => void;
  onExportSvg: () => void;
  onMaxLengthChange: (length: number) => void;
  onChangeBackground?: () => void;
}

const FlagControls = memo(function FlagControls({
  word,
  maxLength,
  isGenerating,
  onWordChange,
  onGenerateRandom,
  onExportSvg,
  onMaxLengthChange,
  onChangeBackground
}: FlagControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Keep focus on input when manually changed
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [word]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onWordChange(e.target.value);
  };
  
  // Handle length change
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMaxLengthChange(parseInt(e.target.value));
  };
  
  return (
    <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg p-6">
      <div className="flex flex-col gap-6">
        {/* Word Input */}
        <div className="w-full">
          <label className="block mb-2 text-sm font-mono text-white/60" id="word-input-label">
            CREATE WORD (MAX {maxLength} LETTERS)
          </label>
          <input 
            ref={inputRef}
            type="text" 
            className="w-full bg-black border border-white/20 rounded-md py-3 px-4 text-xl font-mono uppercase tracking-wider focus:border-[#00ff00] focus:outline-none" 
            placeholder="AAA..." 
            value={word}
            onChange={handleInputChange}
            aria-labelledby="word-input-label"
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-2">
            <button
              onClick={onGenerateRandom}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-[#00ff00] text-black font-mono uppercase tracking-wider disabled:opacity-50 hover:brightness-110 transition-all duration-300"
              aria-live="polite"
            >
              {isGenerating ? 'GENERATING...' : 'RANDOM WORD'}
            </button>
            
            {onChangeBackground && (
              <button
                onClick={onChangeBackground}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-mono uppercase tracking-wider transition-colors"
              >
                CHANGE BG
              </button>
            )}
          </div>
          
          <button 
            disabled={!word} 
            onClick={onExportSvg}
            className="px-6 py-3 bg-white/10 border border-white/20 text-white font-mono uppercase tracking-wider disabled:opacity-30 hover:bg-white/20 transition-all duration-300"
          >
            EXPORT SVG
          </button>
        </div>
        
        {/* Length control */}
        <div className="w-full border-t border-white/10 pt-4">
          <label className="block mb-2 text-sm font-mono text-white/60" id="length-control-label">
            MAXIMUM WORD LENGTH
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="2" 
              max="12" 
              className="w-full accent-[#00ff00]" 
              value={maxLength}
              onChange={handleLengthChange}
              aria-labelledby="length-control-label"
            />
            <span className="font-druk text-xl text-white">{maxLength}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FlagControls;
