'use client';

import React, { useState, useEffect, useRef } from 'react';
import LegoDesignPreview from './LegoDesignPreview';
import { useDesign } from '../context/DesignContext';
import { LegoPiece, PieceColor } from '../types';

interface LearnDesignPreviewProps {
  pixelData: (string | null)[][];
  designName?: string;
  creatorName?: string;
  onTrace?: (pieces: LegoPiece[]) => void;
}

const LearnDesignPreview: React.FC<LearnDesignPreviewProps> = ({ 
  pixelData, 
  designName = 'Untitled Design',
  creatorName = 'Anonymous',
  onTrace
}) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { selectedDesign } = useDesign();
  const [isTracing, setIsTracing] = useState(false);
  
  // Calculate the dimensions of the design
  const designWidth = pixelData && pixelData[0] ? pixelData[0].length * 24 : 0;
  const designHeight = pixelData && pixelData.length ? pixelData.length * 24 : 0;
  
  // Get container dimensions on mount and when window resizes
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    // Initial measurement
    updateContainerSize();
    
    // Add resize listener
    window.addEventListener('resize', updateContainerSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);
  
  // Auto-adjust zoom to fit if design is too large
  useEffect(() => {
    if (!pixelData || pixelData.length === 0) return;
    
    // Only auto-adjust when scale is at default (1)
    if (scale === 1 && containerSize.width > 0 && containerSize.height > 0) {
      // Calculate zoom level to fit both width and height (with some padding)
      const paddingFactor = 0.9; // 10% padding
      const maxWidth = containerSize.width * paddingFactor;
      const maxHeight = containerSize.height * paddingFactor;
      
      const scaleX = maxWidth / designWidth;
      const scaleY = maxHeight / designHeight;
      
      // Use the smaller scale to ensure it fits in both dimensions
      const newScale = Math.min(scaleX, scaleY);
      
      // Only adjust if the design is too large
      if (newScale < 1) {
        // Round to 1 decimal place and ensure minimum scale
        const roundedScale = Math.max(0.2, Math.round(newScale * 10) / 10);
        setScale(roundedScale);
      }
    }
  }, [pixelData, containerSize, designWidth, designHeight, scale]);
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2)); // Max zoom 2x
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.2)); // Min zoom 0.2x
  };
  
  const handleReset = () => {
    setScale(1);
  };
  
  // Handle tracing the design
  const handleTrace = () => {
    setIsTracing(!isTracing);
    
    if (!selectedDesign || !selectedDesign.pixelData) return;
    
    // Create an array to hold all the pieces we'll place
    const piecesToPlace: LegoPiece[] = [];
    
    // Iterate through the pixel data to create pieces
    selectedDesign.pixelData.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          // Convert the hex color to rgba with 0.11 opacity
          const hexColor = color;
          // Parse the hex color to RGB
          const r = parseInt(hexColor.slice(1, 3), 16);
          const g = parseInt(hexColor.slice(3, 5), 16);
          const b = parseInt(hexColor.slice(5, 7), 16);
          // Create semi-transparent color
          const semiTransparentColor = `rgba(${r}, ${g}, ${b}, 0.11)`;
          
          // Create a new piece for each colored pixel with semi-transparency
          const newPiece: LegoPiece = {
            id: `traced-piece-${x}-${y}-${Date.now()}`,
            type: 'Plate',
            size: [1, 1],
            position: [x, y],
            color: semiTransparentColor,
          };
          
          piecesToPlace.push(newPiece);
        }
      });
    });
    
    // If we have an onTrace callback, call it with the pieces to place
    if (onTrace) {
      onTrace(piecesToPlace);
    }
    
    // After a short delay, reset the tracing state
    setTimeout(() => {
      setIsTracing(false);
    }, 100);
  };
  
  // Render a color swatch for the color palette
  const renderColorSwatch = (color: string) => {
    return (
      <div 
        key={color}
        className="color-swatch"
        style={{ 
          backgroundColor: color,
          width: '24px',
          height: '24px',
          borderRadius: '2px',
          border: '1px solid #000',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          className="color-swatch-dot" 
          style={{ 
            backgroundColor: color,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.2)'
          }} 
        />
      </div>
    );
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
      {/* Color Palette and Trace Button */}
      {selectedDesign && selectedDesign.colorPalette && selectedDesign.colorPalette.length > 0 && (
        <div className="mb-2 p-2" style={{ border: '2px solid #000', borderRadius: '4px' }}>
          <div className="flex justify-between items-center mb-2">
            <p style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '10px', margin: '0' }}>Colors</p>
            <button
              className={`nes-btn ${isTracing ? 'is-success' : 'is-primary'}`}
              onClick={handleTrace}
              style={{ 
                fontFamily: 'var(--font-press-start-2p)', 
                fontSize: '10px',
                padding: '2px 8px',
                height: 'auto',
                margin: '0',
                backgroundColor: isTracing ? '#92cc41' : '#209cee',
                color: 'white'
              }}
            >
              {isTracing ? 'Tracing...' : 'Trace'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedDesign.colorPalette.map(color => renderColorSwatch(color))}
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center" 
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
      <div className="flex justify-center items-center mt-4" style={{ height: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          height: '24px',
          overflow: 'hidden'
        }}>
          <button 
            className="nes-btn is-small"
            onClick={handleZoomOut}
            style={{ 
              padding: '0', 
              width: '24px',
              height: '20px', 
              minHeight: 'unset',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: '0',
              margin: '0'
            }}
          >
            -
          </button>
          <div style={{ 
            padding: '0 8px', 
            fontSize: '12px', 
            height: '20px', 
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
          }}>
            Zoom: {Math.round(scale * 100)}%
          </div>
          <button 
            className="nes-btn is-small"
            onClick={handleZoomIn}
            style={{ 
              padding: '0', 
              width: '24px',
              height: '20px', 
              minHeight: 'unset',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: '0',
              margin: '0'
            }}
          >
            +
          </button>
        </div>
        <button 
          className="nes-btn is-small"
          onClick={handleReset}
          style={{ 
            padding: '0 8px', 
            height: '24px', 
            minHeight: 'unset',
            fontSize: '10px',
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default LearnDesignPreview; 