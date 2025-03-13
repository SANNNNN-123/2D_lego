'use client';

import React, { useState, useEffect } from 'react';
import ImagePrompt from './ImagePrompt';
import LearnDesignPreview from './LearnDesignPreview';
import { useDesign } from '../context/DesignContext';
import { LegoPiece } from '../types';

interface TabFolderProps {
  onImagePromptSubmit?: (prompt: string) => void;
  onTrace?: (pieces: LegoPiece[]) => void;
  onColorSelect?: (color: string | null) => void;
}

const TabFolder: React.FC<TabFolderProps> = ({ onImagePromptSubmit, onTrace, onColorSelect }) => {
  const [activeTab, setActiveTab] = useState<'imageGen' | 'learnDesign'>('imageGen');
  const { selectedDesign } = useDesign();
  
  // Automatically switch to the Learn to Design tab when a design is selected
  useEffect(() => {
    if (selectedDesign) {
      setActiveTab('learnDesign');
    }
  }, [selectedDesign]);

  return (
    <div className="nes-container" style={{ width: '100%', maxWidth: '360px', padding: '0' }}>
      {/* Tab Header */}
      <div className="flex" style={{ borderBottom: '4px solid #000' }}>
        <button
          className={`flex-1 nes-btn ${activeTab === 'imageGen' ? 'is-primary' : ''}`}
          style={{ 
            borderRadius: '0', 
            borderBottom: 'none',
            borderRight: '4px solid #000',
            margin: '0',
            fontSize: '8px',
            padding: '8px 4px'
          }}
          onClick={() => setActiveTab('imageGen')}
        >
          Image Gen
        </button>
        <button
          className={`flex-1 nes-btn ${activeTab === 'learnDesign' ? 'is-primary' : ''}`}
          style={{ 
            borderRadius: '0', 
            borderBottom: 'none',
            margin: '0',
            fontSize: '8px',
            padding: '8px 4px'
          }}
          onClick={() => setActiveTab('learnDesign')}
        >
          Learn to Design
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ padding: '16px' }}>
        {activeTab === 'imageGen' ? (
          <ImagePrompt onSubmit={onImagePromptSubmit} />
        ) : (
          <div style={{ height: '400px' }}>
            <LearnDesignPreview 
              pixelData={selectedDesign?.pixelData || []}
              designName={selectedDesign?.name}
              creatorName={selectedDesign?.creator}
              onTrace={onTrace}
              onColorSelect={onColorSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabFolder; 