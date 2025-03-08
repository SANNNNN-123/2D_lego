import React from 'react';
import LegoStud from './LegoStud';

interface LegoDesignPreviewProps {
  pixelData: (string | null)[][];
  cellSize?: number;
}

const LegoDesignPreview: React.FC<LegoDesignPreviewProps> = ({ 
  pixelData, 
  cellSize = 24 
}) => {
  if (!pixelData || pixelData.length === 0) {
    return <div className="text-center p-4">No design data available</div>;
  }

  const height = pixelData.length;
  const width = pixelData[0].length;

  // Group adjacent cells with the same color to form pieces
  const pieces: { x: number; y: number; width: number; height: number; color: string }[] = [];
  
  // Create a copy of the pixelData to track which cells have been processed
  const processedCells = Array(height).fill(0).map(() => Array(width).fill(false));
  
  // Helper function to check if a cell has the same color
  const hasSameColor = (y: number, x: number, color: string) => {
    return y >= 0 && y < height && x >= 0 && x < width && 
           pixelData[y][x] === color && !processedCells[y][x];
  };
  
  // Process each cell to form pieces
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = pixelData[y][x];
      if (color && !processedCells[y][x]) {
        // Start a new piece
        let pieceWidth = 1;
        let pieceHeight = 1;
        
        // Mark this cell as processed
        processedCells[y][x] = true;
        
        // Check how far the piece extends horizontally
        while (hasSameColor(y, x + pieceWidth, color)) {
          processedCells[y][x + pieceWidth] = true;
          pieceWidth++;
        }
        
        // Check if the piece can extend vertically with the same width
        let canExtendVertically = true;
        while (canExtendVertically) {
          for (let dx = 0; dx < pieceWidth; dx++) {
            if (!hasSameColor(y + pieceHeight, x + dx, color)) {
              canExtendVertically = false;
              break;
            }
          }
          
          if (canExtendVertically) {
            // Mark all cells in this row as processed
            for (let dx = 0; dx < pieceWidth; dx++) {
              processedCells[y + pieceHeight][x + dx] = true;
            }
            pieceHeight++;
          }
        }
        
        // Add the piece
        pieces.push({
          x,
          y,
          width: pieceWidth,
          height: pieceHeight,
          color
        });
      }
    }
  }

  // Custom stud rendering to match the reference image
  const renderStud = (x: number, y: number, color: string, key: string) => {
    const studSize = 16; // Size of the stud
    const margin = 4; // Margin around the stud
    
    return (
      <div
        key={key}
        style={{
          position: 'absolute',
          width: `${studSize}px`,
          height: `${studSize}px`,
          borderRadius: '50%',
          backgroundColor: color,
          top: `${y * cellSize + margin}px`,
          left: `${x * cellSize + margin}px`,
          zIndex: 3,
          border: '1px solid rgba(0,0,0,0.2)',
          boxShadow: 'inset 0 2px 3px rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)',
          background: `${color} radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)`,
        }}
      />
    );
  };

  return (
    <div 
      className="lego-design-preview"
      style={{
        position: 'relative',
        width: `${width * cellSize}px`,
        height: `${height * cellSize}px`,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(to right, rgba(128,128,128,0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(128,128,128,0.3) 1px, transparent 1px)
        `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    >
      {/* Render the Lego pieces */}
      {pieces.map((piece, index) => (
        <div
          key={`piece-${index}`}
          style={{
            position: 'absolute',
            top: `${piece.y * cellSize}px`,
            left: `${piece.x * cellSize}px`,
            width: `${piece.width * cellSize}px`,
            height: `${piece.height * cellSize}px`,
            backgroundColor: piece.color,
            boxSizing: 'border-box',
            border: '1px solid rgba(0,0,0,0.15)',
            boxShadow: 'inset 0 2px 10px rgba(255, 255, 255, 0.3), inset 0 -2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1,
            // Add grid lines within each piece to match the reference image
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
            backgroundPosition: '0 0',
          }}
        />
      ))}
      
      {/* Render the studs on top of the pieces using our custom stud renderer */}
      {pieces.map((piece, pieceIndex) => {
        const studs = [];
        for (let dy = 0; dy < piece.height; dy++) {
          for (let dx = 0; dx < piece.width; dx++) {
            studs.push(
              renderStud(
                piece.x + dx,
                piece.y + dy,
                piece.color,
                `stud-${pieceIndex}-${dx}-${dy}`
              )
            );
          }
        }
        return studs;
      })}
    </div>
  );
};

export default LegoDesignPreview; 