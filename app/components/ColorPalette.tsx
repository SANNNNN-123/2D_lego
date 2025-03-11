import React from 'react';
import { PieceColor } from '../types';

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
    const isSelected = selectedColor === color;
    
    return (
      <div 
        key={color}
        className={`color-swatch ${isSelected ? 'selected' : ''}`}
        onClick={() => onColorSelect(color)}
        style={{ backgroundColor: color }}
      >
        <div className="color-swatch-dot" style={{ backgroundColor: color }} />
      </div>
    );
  };

  return (
    <div className="nes-container with-title custom-cursor" style={{ padding: '1rem' }}>
      <p className="title" style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '10px' }}>Colors</p>
      <div className="grid grid-cols-5 gap-2">
        {colors.map(color => renderLegoPiece(color))}
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <div 
          className="relative cursor-pointer custom-cursor-click"
          style={{
            width: '32px',
            height: '32px',
            border: selectedColor !== null && selectedColor.startsWith('#') && !colors.includes(selectedColor) ? '3px solid black' : '1px solid #ccc',
            overflow: 'hidden',
          }}
        >
          <input 
            type="color" 
            value={selectedColor || '#FF0000'} 
            onChange={(e) => onColorSelect(e.target.value)}
            className="absolute custom-cursor-click"
            style={{
              width: '40px',
              height: '40px',
              top: '-5px',
              left: '-5px',
              cursor: 'url("/cursor-click.png"), pointer',
            }}
          />
        </div>
        <button
          className={`nes-btn ${selectedColor === null ? 'is-error' : ''}`}
          onClick={() => onColorSelect(null)}
          title="Eraser"
          style={{ 
            fontFamily: 'var(--font-press-start-2p)', 
            fontSize: '8px',
            padding: '4px 8px',
            height: 'auto',
            margin: '0',
          }}
        >
          Eraser
        </button>
      </div>
    </div>
  );
};

export default ColorPalette; 