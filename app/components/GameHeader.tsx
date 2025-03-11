import React, { useState } from 'react';
import Link from 'next/link';
import DesignSubmitDialog from './DesignSubmitDialog';
import { saveDesign } from '../services/supabaseService';

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
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex gap-2">
          <button className="nes-btn" onClick={() => console.log('Pieces clicked')}>
            GALLERY
          </button>
          <button className="nes-btn" onClick={onClear}>
            CLEAR
          </button>
          <button className="nes-btn" onClick={handleSubmitClick}>
            SUBMIT
          </button>
        </div>
        <div>
          <Link href="/" className="nes-btn">
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
    </div>
  );
};

export default GameHeader; 