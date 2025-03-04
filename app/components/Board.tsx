import React, { useState, useRef } from 'react';
import { LegoPiece, PieceColor } from '../types';
import LegoStud from './LegoStud';
import ColorPalette from './ColorPalette';

interface BoardProps {
  width: number;
  height: number;
}

const Board: React.FC<BoardProps> = ({ width, height }) => {
  const [pieces, setPieces] = useState<LegoPiece[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>('#FF0000');
  const [isDragging, setIsDragging] = useState(false);
  const lastPlacedPosition = useRef<{ x: number; y: number } | null>(null);

  const handleClick = (x: number, y: number) => {
    if (selectedColor === null) {
      // Eraser mode - remove piece at clicked position
      erasePieceAt(x, y);
    } else {
      placePieceAt(x, y);
    }
  };

  const erasePieceAt = (x: number, y: number) => {
    // Don't erase if it's the same position as last erased piece during drag
    if (lastPlacedPosition.current?.x === x && lastPlacedPosition.current?.y === y) {
      return;
    }

    const isOccupied = pieces.some(piece => {
      const [pieceX, pieceY] = piece.position;
      const [pieceWidth, pieceHeight] = piece.size;
      return x >= pieceX && 
             x < pieceX + pieceWidth && 
             y >= pieceY && 
             y < pieceY + pieceHeight;
    });

    if (isOccupied) {
      // Remove existing pieces at this position
      setPieces(pieces.filter(piece => {
        const [pieceX, pieceY] = piece.position;
        const [pieceWidth, pieceHeight] = piece.size;
        return !(x >= pieceX && 
                x < pieceX + pieceWidth && 
                y >= pieceY && 
                y < pieceY + pieceHeight);
      }));

      // Add a new piece with the base color
      const newPiece: LegoPiece = {
        id: `piece-${Date.now()}`,
        type: 'Plate',
        size: [1, 1],
        position: [x, y],
        color: '#808080', // Light grey from our color palette
      };
      
      setPieces(prevPieces => [...prevPieces, newPiece]);
      lastPlacedPosition.current = { x, y };
    }
  };

  const placePieceAt = (x: number, y: number) => {
    // Don't place if it's the same position as last placed piece during drag
    if (lastPlacedPosition.current?.x === x && lastPlacedPosition.current?.y === y) {
      return;
    }

    // Add new 1x1 piece
    const newPiece: LegoPiece = {
      id: `piece-${Date.now()}`,
      type: 'Plate',
      size: [1, 1],
      position: [x, y],
      color: selectedColor as PieceColor,
    };
    
    // Check if position is already occupied
    const isOccupied = pieces.some(piece => {
      const [pieceX, pieceY] = piece.position;
      const [pieceWidth, pieceHeight] = piece.size;
      return x >= pieceX && 
             x < pieceX + pieceWidth && 
             y >= pieceY && 
             y < pieceY + pieceHeight;
    });

    if (!isOccupied) {
      setPieces([...pieces, newPiece]);
      lastPlacedPosition.current = { x, y };
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    lastPlacedPosition.current = null;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastPlacedPosition.current = null;
  };

  const handleMouseMove = (x: number, y: number) => {
    if (isDragging) {
      if (selectedColor === null) {
        // In eraser mode, erase any piece we touch
        erasePieceAt(x, y);
      } else {
        // In color mode, place pieces in empty spots
        placePieceAt(x, y);
      }
    }
  };

  return (
    <div className="flex gap-8 items-start">
      <div
        className="board relative bg-white rounded-lg shadow-xl"
        style={{
          width: `${width * 24}px`,
          height: `${height * 24}px`,
          backgroundColor: '#f0f0f0',
          backgroundImage: `
            linear-gradient(to right, rgba(128,128,128,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128,128,128,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          border: '1px solid rgba(0,0,0,0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Base grid for clicking */}
        {Array.from({ length: width * height }).map((_, i) => {
          const y = Math.floor(i / width);
          const x = i % width;
          const isOccupied = pieces.some(piece => {
            const [pieceX, pieceY] = piece.position;
            const [pieceWidth, pieceHeight] = piece.size;
            return x >= pieceX && 
                   x < pieceX + pieceWidth && 
                   y >= pieceY && 
                   y < pieceY + pieceHeight;
          });

          return (
            <div
              key={`cell-${x}-${y}`}
              style={{
                position: 'absolute',
                top: `${y * 24}px`,
                left: `${x * 24}px`,
                width: '24px',
                height: '24px',
                cursor: selectedColor === null ? 'pointer' : (isOccupied ? 'not-allowed' : 'pointer'),
                backgroundColor: 'transparent',
                transition: 'background-color 0.1s ease',
                zIndex: 0,
              }}
              onMouseEnter={(e) => {
                if (selectedColor === null || !isOccupied) {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                  handleMouseMove(x, y);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                if (selectedColor === null || !isOccupied) {
                  handleMouseDown();
                  handleClick(x, y);
                }
              }}
            />
          );
        })}

        {/* Render all pieces */}
        {pieces.map((piece) => (
          <div
            key={piece.id}
            style={{
              position: 'absolute',
              width: `${piece.size[0] * 24}px`,
              height: `${piece.size[1] * 24}px`,
              backgroundColor: piece.color,
              top: `${piece.position[1] * 24}px`,
              left: `${piece.position[0] * 24}px`,
              zIndex: 2,
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              backgroundImage: `
                linear-gradient(to right, rgba(128,128,128,0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(128,128,128,0.2) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          >
            {piece.type === 'Plate' && Array.from({ length: piece.size[0] * piece.size[1] }).map((_, i) => {
              const studY = Math.floor(i / piece.size[0]);
              const studX = i % piece.size[0];
              return (
                <LegoStud
                  key={`stud-${i}`}
                  x={studX}
                  y={studY}
                  color={piece.color}
                  isOnPiece={true}
                />
              );
            })}
          </div>
        ))}

        {/* Base studs */}
        {Array.from({ length: width * height }).map((_, i) => {
          const y = Math.floor(i / width);
          const x = i % width;
          const isOccupied = pieces.some(piece => {
            const [pieceX, pieceY] = piece.position;
            const [pieceWidth, pieceHeight] = piece.size;
            return x >= pieceX && 
                   x < pieceX + pieceWidth && 
                   y >= pieceY && 
                   y < pieceY + pieceHeight;
          });
          
          return (
            <LegoStud
              key={`base-stud-${x}-${y}`}
              x={x}
              y={y}
              isOnPiece={false}
              isClickable={selectedColor === null || !isOccupied}
              onClick={() => handleClick(x, y)}
              onMouseEnter={() => handleMouseMove(x, y)}
            />
          );
        })}
      </div>

      {/* Color Palette */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <ColorPalette
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      </div>
    </div>
  );
};

export default Board; 