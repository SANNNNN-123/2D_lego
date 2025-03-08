import React, { useState } from 'react';
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

  if (!isOpen) return null;
  
  // Calculate the dimensions of the preview container
  const previewWidth = designData && designData.pixelData[0] ? designData.pixelData[0].length * 24 : 0;
  const previewHeight = designData && designData.pixelData ? designData.pixelData.length * 24 : 0;
  
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
        
        <div className="mb-4 flex justify-center">
          <div 
            style={{
              border: '1px solid #ccc',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              maxWidth: '100%',
              maxHeight: '300px',
              width: previewWidth > 0 ? `${previewWidth}px` : 'auto',
              height: previewHeight > 0 ? `${previewHeight}px` : 'auto'
            }}
          >
            {designData ? (
              <LegoDesignPreview 
                pixelData={designData.pixelData} 
                cellSize={24}
              />
            ) : (
              <div className="text-center p-4">No design data available</div>
            )}
          </div>
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
            onClick={() => onSubmit(name, creator)}
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