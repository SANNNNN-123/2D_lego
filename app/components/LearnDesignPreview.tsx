'use client';

import React, { useState } from 'react';
import LegoDesignPreview from './LegoDesignPreview';
import { useDesign } from '../context/DesignContext';

interface LearnDesignPreviewProps {
  pixelData: (string | null)[][];
  designName?: string;
  creatorName?: string;
}

const LearnDesignPreview: React.FC<LearnDesignPreviewProps> = ({ 
  pixelData, 
  designName = 'Untitled Design',
  creatorName = 'Anonymous'
}) => {
  const [scale, setScale] = useState(1);
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2)); // Max zoom 2x
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.2)); // Min zoom 0.2x
  };
  
  const handleReset = () => {
    setScale(1);
  };
  
  if (!pixelData || pixelData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="nes-text">No design selected</p>
        <p className="nes-text text-sm mt-2">Click on a design in the gallery to view it here</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="nes-text">{designName}</h3>
        <p className="nes-text text-sm">Created by {creatorName}</p>
      </div>
      
      <div className="flex-1 overflow-auto flex items-center justify-center" 
        style={{ 
          border: '4px solid #000',
          borderRadius: '4px',
          backgroundColor: '#f0f0f0',
          position: 'relative'
        }}
      >
        <div style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'center',
          transition: 'transform 0.2s ease-in-out'
        }}>
          <LegoDesignPreview pixelData={pixelData} cellSize={24} />
        </div>
      </div>
      
      {/* Zoom controls */}
      <div className="flex justify-center gap-2 mt-4">
        <button 
          className="nes-btn is-small"
          onClick={handleZoomOut}
          style={{ padding: '0 8px', fontSize: '12px' }}
        >
          -
        </button>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          Zoom: {Math.round(scale * 100)}%
        </span>
        <button 
          className="nes-btn is-small"
          onClick={handleZoomIn}
          style={{ padding: '0 6px', fontSize: '12px' }}
        >
          +
        </button>
        <button 
          className="nes-btn is-small"
          onClick={handleReset}
          style={{ padding: '0 6px', fontSize: '10px' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default LearnDesignPreview; 