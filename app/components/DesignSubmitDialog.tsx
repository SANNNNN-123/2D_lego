import React, { useState, useEffect } from 'react';
import LegoDesignPreview from './LegoDesignPreview';

interface DesignSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, creator: string) => void;
  designImage: string | null;
  designData: {
    pixelData: (string | null)[][];
    colorPalette: string[];
  } | null;
}

const DesignSubmitDialog: React.FC<DesignSubmitDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  designData
}) => {
  const [name, setName] = useState('');
  const [creator, setCreator] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level

  // Reset states when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setName('');
      setCreator('');
      setZoomLevel(1); // Reset zoom level when dialog closes
    }
  }, [isOpen]);

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
  
  const handleSubmit = () => {
    onSubmit(name, creator);
    setShowSuccess(true);
    
    // Close the dialog after showing success message for 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };
  
  // Success message dialog
  if (showSuccess) {
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
            width: '100%',
            textAlign: 'center'
          }}
        >
          <div className="mb-4">
            <i className="nes-icon is-large star"></i>
          </div>
          <h3 className="title mb-4">Design Saved Successfully!</h3>
          <p className="mb-4">Your awesome Lego design has been saved.</p>
        </div>
      </div>
    );
  }
  
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
        <h3 className="title mb-4">Submit Your Design</h3>
        
        <div className="mb-2 flex justify-center">
          <div 
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
              <div style={{ 
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
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
            className="nes-btn is-small"
            onClick={handleZoomOut}
            style={{ padding: '0 8px', fontSize: '12px' }}
          >
            -
          </button>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            Zoom: {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            className="nes-btn is-small"
            onClick={handleZoomIn}
            style={{ padding: '0 8px', fontSize: '12px' }}
          >
            +
          </button>
          <button 
            className="nes-btn is-small"
            onClick={handleZoomReset}
            style={{ padding: '0 8px', fontSize: '10px' }}
          >
            Reset
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="name_field">Design Name</label>
          <input 
            type="text" 
            id="name_field" 
            className="nes-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="creator_field">Creator</label>
          <input 
            type="text" 
            id="creator_field" 
            className="nes-input"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button 
            className="nes-btn is-error" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="nes-btn is-primary"
            onClick={handleSubmit}
            disabled={!name || !creator}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignSubmitDialog; 