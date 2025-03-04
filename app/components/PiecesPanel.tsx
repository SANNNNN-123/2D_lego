import React, { useState, useRef, useEffect } from 'react';
import { PieceType, PieceSize, PieceColor, PIECE_SIZES, COLORS } from '../types';
import { GripVertical } from 'lucide-react';

interface PiecesPanelProps {
  onClose: () => void;
  selectedPieceType: PieceType;
  setSelectedPieceType: (type: PieceType) => void;
  selectedColor: PieceColor;
  setSelectedColor: (color: PieceColor) => void;
  selectedSize: PieceSize;
  onPieceSelect: (size: PieceSize) => void;
}

const PiecesPanel: React.FC<PiecesPanelProps> = ({
  onClose,
  selectedPieceType,
  setSelectedPieceType,
  selectedColor,
  setSelectedColor,
  selectedSize,
  onPieceSelect,
}) => {
  // State for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Refs for the panel and drag handle
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Initialize panel position to center of screen
  useEffect(() => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth / 2 - rect.width / 2,
        y: window.innerHeight / 2 - rect.height / 2
      });
    }
  }, []);
  
  // Handle mouse down on drag handle
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);
  
  // Render a piece option in the panel
  const renderPieceOption = (size: PieceSize) => {
    const [width, height] = size;
    const isSelected = selectedSize[0] === width && selectedSize[1] === height;
    
    return (
      <div 
        key={`${width}x${height}`}
        className={`piece-option ${isSelected ? 'ring-2 ring-black' : ''}`}
        style={{
          width: `${width * 30}px`,
          height: `${height * 30}px`,
          backgroundColor: selectedColor,
          borderRadius: "2px",
          position: "relative",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
        onClick={() => onPieceSelect(size)}
      >
        {/* Render studs on the piece */}
        {Array.from({ length: width * height }).map((_, i) => {
          const row = Math.floor(i / width);
          const col = i % width;
          return (
            <div
              key={i}
              className="stud"
              style={{
                position: "absolute",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.1)",
                top: `${row * 30 + 8}px`,
                left: `${col * 30 + 8}px`,
                boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 1px 1px rgba(0, 0, 0, 0.2)",
                background: `${selectedColor} linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.05))`,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div 
      ref={panelRef}
      className="fixed bg-white rounded shadow-lg z-10 w-80 pieces-panel"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
    >
      {/* Draggable header */}
      <div 
        className="flex items-center p-2 border-b bg-gray-100 rounded-t cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center ml-2">
          <GripVertical size={16} className="text-gray-500 grip-icon" />
        </div>
        <h3 className="text-sm font-bold mx-auto">PIECES</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 mr-2"
        >
          ✕
        </button>
      </div>
      
      {/* Panel content */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {PIECE_SIZES.map(size => renderPieceOption(size))}
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm uppercase font-bold mb-2">COLOR</h3>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm uppercase font-bold mb-2">TYPE</h3>
          <div className="flex gap-4">
            <button
              className={`px-4 py-1 rounded ${selectedPieceType === 'Plate' ? 'bg-gray-200' : 'bg-white border border-gray-200'}`}
              onClick={() => setSelectedPieceType('Plate')}
            >
              Plate
            </button>
            <button
              className={`px-4 py-1 rounded ${selectedPieceType === 'Tile' ? 'bg-gray-200' : 'bg-white border border-gray-200'}`}
              onClick={() => setSelectedPieceType('Tile')}
            >
              Tile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiecesPanel; 