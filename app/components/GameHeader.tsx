import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import DesignSubmitDialog from './DesignSubmitDialog';
import ExportDesignDialog from './ExportDesignDialog';
import { saveDesign } from '../services/supabaseService';
import { useSearchParams } from 'next/navigation';

interface GameHeaderProps {
  onClear?: () => void;
  onSubmit?: () => void;
  captureDesignData?: () => Promise<{
    pixelData: (string | null)[][];
    colorPalette: string[];
    imageDataUrl: string | null;
    bounds?: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
      width: number;
      height: number;
    };
  }>;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onClear, onSubmit, captureDesignData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [designData, setDesignData] = useState<{
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
  } | null>(null);
  
  // Track if this is the initial render
  const isInitialMount = useRef(true);
  
  // Track if the export button was explicitly clicked
  const exportButtonClicked = useRef(false);
  
  // Get the search params to check if we're loading a design from the gallery
  const searchParams = useSearchParams();
  const designId = searchParams ? searchParams.get('id') : null;
  
  // On initial mount, ensure export dialog is closed
  useEffect(() => {
    // Only run this effect on the initial mount
    if (isInitialMount.current) {
      setIsExportDialogOpen(false);
      isInitialMount.current = false;
    }
  }, []);
  
  // Reset export dialog state when designId changes
  useEffect(() => {
    if (!exportButtonClicked.current) {
      setIsExportDialogOpen(false);
    }
    // Reset the flag after handling
    exportButtonClicked.current = false;
  }, [designId]);

  const handleSubmitClick = async () => {
    if (captureDesignData) {
      try {
        const result = await captureDesignData();
        setDesignImage(result.imageDataUrl);
        setDesignData({ 
          pixelData: result.pixelData, 
          colorPalette: result.colorPalette,
          bounds: result.bounds 
        });
        setIsDialogOpen(true);
      } catch (error) {
        alert('Failed to capture design. Please try again.');
      }
    }
  };

  const handleExportClick = async () => {
    // Set the flag to indicate the export button was explicitly clicked
    exportButtonClicked.current = true;
    
    if (captureDesignData) {
      try {
        const result = await captureDesignData();
        setDesignData({ 
          pixelData: result.pixelData, 
          colorPalette: result.colorPalette,
          bounds: result.bounds 
        });
        // Only open the export dialog when explicitly clicked
        setIsExportDialogOpen(true);
      } catch (error) {
        alert('Failed to capture design. Please try again.');
      }
    }
  };

  const handleDialogSubmit = async (name: string, creator: string) => {
    if (designData) {
      try {
        const result = await saveDesign({
          name,
          creator,
          image: '', // We're not using image anymore
          pixelData: designData.pixelData,
          colorPalette: designData.colorPalette,
          bounds: designData.bounds
        });
        
        if (result.success) {
          setIsDialogOpen(false);
        } else {
          // Safely access error message if it exists
          const errorMessage = result.error && typeof result.error === 'object' && 'message' in result.error 
            ? result.error.message 
            : 'Unknown error';
          alert(`Failed to save design: ${errorMessage}`);
        }
      } catch (error) {
        alert(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      alert('Missing design data. Please try again.');
    }
  };

  return (
    <div className="w-full mb-6 custom-cursor">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {/* Hidden dummy button to absorb any automatic clicks */}
          <button 
            className="nes-btn custom-cursor-click dummy-button"
            aria-hidden="true"
            tabIndex={-1}
          ></button>
          
          <button className="nes-btn custom-cursor-click" onClick={handleExportClick}>
            EXPORT
          </button>
          <button className="nes-btn custom-cursor-click" onClick={onClear}>
            CLEAR
          </button>
          <button className="nes-btn custom-cursor-click" onClick={handleSubmitClick}>
            SUBMIT
          </button>
        </div>
        <div>
          <Link href="/" className="nes-btn custom-cursor-click">
            HOME
          </Link>
        </div>
      </div>
      {/* Double line separator */}
      <div className="nes-separator"></div>
      
      <DesignSubmitDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        designImage={designImage}
        designData={designData}
      />

      <ExportDesignDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        designData={designData}
      />
      
      {/* Add styling for the dummy button */}
      <style jsx>{`
        .dummy-button {
          width: 0;
          height: 0;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          overflow: hidden;
          position: absolute;
          opacity: 0;
          pointer-events: auto; /* Still capture clicks */
        }
      `}</style>
    </div>
  );
};

export default GameHeader; 