import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import LegoDesignPreview from './LegoDesignPreview';

interface ExportDesignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  designData: {
    pixelData: (string | null)[][];
    colorPalette: string[];
    bounds?: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
      width: number;
      height: number;
    };
  } | null;
}

const ExportDesignDialog: React.FC<ExportDesignDialogProps> = ({
  isOpen,
  onClose,
  designData
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg'>('png');
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate the dimensions of the preview container
  const previewWidth = designData && designData.pixelData[0] ? designData.pixelData[0].length * 24 : 0;
  const previewHeight = designData && designData.pixelData ? designData.pixelData.length * 24 : 0;
  
  // Auto-adjust zoom to fit if design is too large
  useEffect(() => {
    if (previewHeight > 280 && zoomLevel === 1) {
      // Calculate zoom level to fit the height (with some padding)
      const newZoom = Math.max(0.2, 280 / previewHeight);
      setZoomLevel(Math.round(newZoom * 10) / 10); // Round to 1 decimal place
    }
  }, [previewHeight, designData, zoomLevel]);
  
  if (!isOpen) return null;
  
  // Calculate zoomed dimensions
  const zoomedWidth = previewWidth * zoomLevel;
  const zoomedHeight = previewHeight * zoomLevel;

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom 2x
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.2)); // Min zoom 0.2x
  };
  
  const handleZoomReset = () => {
    setZoomLevel(1); // Reset to default zoom
  };

  // Create a separate canvas for PNG export
  const createExportCanvas = async () => {
    if (!designData) return null;
    
    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const pixelData = designData.pixelData;
    const height = pixelData.length;
    const width = pixelData[0].length;
    const cellSize = 24;
    
    // Set canvas dimensions
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;
    
    // Fill background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw each colored cell
    pixelData.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          // Draw the main block
          ctx.fillStyle = color;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Draw border
          ctx.strokeStyle = 'rgba(128,128,128,0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Draw stud (circle in the middle)
          const studRadius = cellSize * 0.25;
          const studCenterX = x * cellSize + cellSize / 2;
          const studCenterY = y * cellSize + cellSize / 2;
          
          ctx.beginPath();
          ctx.arc(studCenterX, studCenterY, studRadius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    return canvas;
  };

  // Export as PNG using custom canvas rendering
  const exportAsPNG = async () => {
    if (!designData) return;
    
    try {
      setExportStatus('exporting');
      
      // Use our custom canvas creation function
      const canvas = await createExportCanvas();
      
      if (!canvas) {
        throw new Error('Failed to create canvas');
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `lego-design-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2000);
    }
  };

  // Export as SVG
  const exportAsSVG = () => {
    if (!designData) return;
    
    try {
      setExportStatus('exporting');
      
      const pixelData = designData.pixelData;
      const height = pixelData.length;
      const width = pixelData[0].length;
      const cellSize = 24;
      
      // Create SVG content
      let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * cellSize}" height="${height * cellSize}" viewBox="0 0 ${width * cellSize} ${height * cellSize}">`;
      
      // Background
      svgContent += `<rect width="100%" height="100%" fill="white"/>`;
      
      // Add each colored cell
      pixelData.forEach((row, y) => {
        row.forEach((color, x) => {
          if (color) {
            // Main block
            svgContent += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" stroke="rgba(128,128,128,0.3)" stroke-width="1"/>`;
            
            // Stud (circle in the middle)
            const studRadius = cellSize * 0.25;
            const studCenterX = x * cellSize + cellSize / 2;
            const studCenterY = y * cellSize + cellSize / 2;
            
            svgContent += `<circle cx="${studCenterX}" cy="${studCenterY}" r="${studRadius}" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>`;
          }
        });
      });
      
      svgContent += `</svg>`;
      
      // Create a Blob from the SVG content
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `lego-design-${new Date().getTime()}.svg`;
      link.href = url;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Error exporting as SVG:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2000);
    }
  };

  const handleExport = () => {
    if (exportFormat === 'png') {
      exportAsPNG();
    } else {
      exportAsSVG();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div 
        className="nes-container is-rounded bg-white p-4 max-w-md w-full"
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="title">Export Your Design</h3>
          <button 
            onClick={onClose}
            className="nes-btn is-error"
            style={{ padding: '0px 8px', height: '30px', lineHeight: '30px' }}
          >
            ×
          </button>
        </div>
        
        <div className="mb-4 flex justify-center">
          <div 
            ref={containerRef}
            style={{
              border: '1px solid #ccc',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'auto',
              maxWidth: '100%',
              maxHeight: '300px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {designData ? (
              <div 
                ref={previewRef}
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <LegoDesignPreview 
                  pixelData={designData.pixelData} 
                  cellSize={24}
                />
              </div>
            ) : (
              <div className="text-center p-4">No design data available</div>
            )}
          </div>
        </div>
        
        {/* Zoom controls */}
        <div className="flex justify-center gap-2 mb-4">
          <button 
            onClick={handleZoomOut}
            className="nes-btn is-primary"
            style={{ padding: '0px 8px', height: '30px', lineHeight: '30px' }}
          >
            -
          </button>
          <button 
            onClick={handleZoomReset}
            className="nes-btn"
            style={{ padding: '0px 8px', height: '30px', lineHeight: '30px' }}
          >
            Reset
          </button>
          <button 
            onClick={handleZoomIn}
            className="nes-btn is-primary"
            style={{ padding: '0px 8px', height: '30px', lineHeight: '30px' }}
          >
            +
          </button>
        </div>
        
        {/* Export format selection and export button in one row */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="block mb-2">Export Format:</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  className="nes-radio"
                  name="export-format"
                  checked={exportFormat === 'png'}
                  onChange={() => setExportFormat('png')}
                />
                <span>PNG</span>
              </label>
              <label>
                <input
                  type="radio"
                  className="nes-radio"
                  name="export-format"
                  checked={exportFormat === 'svg'}
                  onChange={() => setExportFormat('svg')}
                />
                <span>SVG</span>
              </label>
            </div>
          </div>
          
          <button 
            onClick={handleExport}
            className={`nes-btn ${exportStatus === 'exporting' ? 'is-disabled' : 'is-primary'}`}
            disabled={exportStatus === 'exporting' || !designData}
          >
            {exportStatus === 'idle' && 'Export'}
            {exportStatus === 'exporting' && 'Exporting...'}
            {exportStatus === 'success' && 'Exported!'}
            {exportStatus === 'error' && 'Error! Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDesignDialog; 