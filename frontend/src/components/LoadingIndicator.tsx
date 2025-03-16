// src/components/LoadingIndicator.tsx

import React, { useState, useEffect } from 'react';

interface LoadingIndicatorProps {}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '') return '.';
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="bg-synth-background p-6 rounded-lg z-10 max-w-md w-full mx-4 transform transition-all duration-200 scale-100">
        <div className="flex flex-col items-center justify-center">
          <img src="/images/_milk-running.gif" alt="Loading..." className="w-32 h-32 object-contain" />
          <h2 className="text-2xl font-retro text-synth-primary neon-text mt-4">
            Loading<span className="inline-block min-w-[3ch]">{dots}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default LoadingIndicator;