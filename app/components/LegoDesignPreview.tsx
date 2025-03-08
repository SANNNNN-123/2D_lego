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

  return (
    <div 
      className="lego-design-preview"
      style={{
        position: 'relative',
        width: `${width * cellSize}px`,
        height: `${height * cellSize}px`,
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        backgroundColor: 'white'
      }}
    >
      {/* Render each cell as a colored box without gaps */}
      {pixelData.map((row, y) => 
        row.map((color, x) => 
          color && (
            <div
              key={`piece-${x}-${y}`}
              style={{
                position: 'absolute',
                top: `${y * cellSize}px`,
                left: `${x * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: color,
                boxSizing: 'border-box',
                border: '1px solid rgba(128,128,128,0.3)'
              }}
            />
          )
        )
      )}
      
      {/* Render the studs using the LegoStud component */}
      {pixelData.map((row, y) => 
        row.map((color, x) => 
          color && (
            <LegoStud
              key={`stud-${x}-${y}`}
              x={x}
              y={y}
              color={color}
              isOnPiece={true}
            />
          )
        )
      )}
    </div>
  );
};

export default LegoDesignPreview; 