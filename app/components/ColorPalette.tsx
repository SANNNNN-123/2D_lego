import React from 'react';
import { PieceColor } from '../types';
import LegoStud from './LegoStud';

interface ColorPaletteProps {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onColorSelect }) => {
  // Define the color palette including all LEGO colors
  const colors = [
    '#000000', // Black
    '#FFFFFF', // White
    '#CC0000', // Red
    '#006400', // Dark Green
    '#0000CC', // Blue
    '#FFA500', // Orange
    '#F5F5DC', // Beige
    '#8B4513', // Brown
    '#87CEEB', // Light Blue
    '#90EE90', // Light Green
    '#808080', // Gray
    '#696969', // Dark Gray
    '#FF69B4', // Pink
    '#FF4500', // Orange Red
    '#8A2BE2', // Purple
    '#800000', // Maroon
    '#F0E68C', // Khaki
  ];

  const renderLegoPiece = (color: string) => {
    return (
      <div 
        key={color}
        className={`w-6 h-6 relative cursor-pointer ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
        onClick={() => onColorSelect(color)}
        style={{
          backgroundColor: color,
          borderRadius: '2px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          backgroundImage: `
            linear-gradient(to right, rgba(128,128,128,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128,128,128,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <LegoStud x={0} y={0} color={color} isOnPiece={true} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-6 gap-2">
        {colors.map(color => renderLegoPiece(color))}
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <div 
          className={`w-6 h-6 relative cursor-pointer overflow-hidden ${selectedColor !== null && selectedColor.startsWith('#') ? 'ring-2 ring-black' : ''}`}
        >
          <input 
            type="color" 
            value={selectedColor || '#FF0000'} 
            onChange={(e) => onColorSelect(e.target.value)}
            className="w-8 h-8 absolute -left-1 -top-1 cursor-pointer"
          />
        </div>
        <button
          className={`px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors
            ${selectedColor === null ? 'ring-2 ring-black bg-gray-100' : ''}`}
          onClick={() => onColorSelect(null)}
          title="Eraser"
        >
          Eraser
        </button>
      </div>
    </div>
  );
};

export default ColorPalette; 