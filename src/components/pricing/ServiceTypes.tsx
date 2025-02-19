'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const complexityOptions = [
  {
    label: 'HIGH\nCOMPLEXITY',
    value: 'high',
    credits: 1.5,
    hoverColor: '#FF0000',
    selectedColor: '#FF0000'
  },
  {
    label: 'LOW\nCOMPLEXITY',
    value: 'low',
    credits: 1,
    hoverColor: '#00FF00',
    selectedColor: '#00FF00'
  },
  {
    label: 'MEDIUM\nCOMPLEXITY',
    value: 'medium',
    credits: 1.25,
    hoverColor: '#0000FF',
    selectedColor: '#0000FF'
  }
] as const;

const ComplexityButton = ({ option, selected, onClick }: {
  option: (typeof complexityOptions)[number],
  selected: boolean,
  onClick: () => void
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex flex-col items-center justify-center w-full p-6 text-center border transition-all cursor-pointer"
      style={{
        borderColor: selected ? option.selectedColor : 'rgba(255,255,255,0.4)',
        backgroundColor: selected ? `${option.selectedColor}10` : 'transparent'
      }}
    >
      <div 
        className="whitespace-pre-line mb-4 text-white"
        style={{ fontFamily: 'var(--font-druk-text-wide)' }}
      >
        {option.label}
      </div>
      <div 
        className="text-sm text-white/60"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        {option.credits} CREDITS/HOUR
      </div>
    </motion.button>
  );
};

export function ServiceTypes() {
  const [selectedComplexity, setSelectedComplexity] = useState<string>('medium');

  return (
    <div className="w-full max-w-screen-lg mx-auto px-6 py-12">
      <div 
        className="text-xl text-white mb-6"
        style={{ fontFamily: 'var(--font-druk-text-wide)' }}
      >
        SERVICE TYPE
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {complexityOptions.map((option) => (
          <ComplexityButton
            key={option.value}
            option={option}
            selected={selectedComplexity === option.value}
            onClick={() => setSelectedComplexity(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
