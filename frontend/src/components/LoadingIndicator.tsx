// src/components/LoadingIndicator.tsx

import React from 'react';

interface LoadingIndicatorProps {}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
    </div>
  );
}

export default LoadingIndicator;