import React, { useState, useRef, useEffect } from 'react';
import { LegoPiece, PieceColor } from '../types';
import LegoStud from './LegoStud';
import ColorPalette from './ColorPalette';
import ImagePrompt from './ImagePrompt';
import GameHeader from './GameHeader';
import html2canvas from 'html2canvas';

interface BoardProps {
  width: number;
  height: number;
}

const Board: React.FC<BoardProps> = ({ width, height }) => {
  const [pieces, setPieces] = useState<LegoPiece[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>('#FF0000');
  const [isDragging, setIsDragging] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const lastPlacedPosition = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Add keyboard event listener for 'C' key
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === 'c' || e.key === 'C') {
  //       setShowClearConfirmation(true);
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);

  const handleClearBoard = () => {
    setPieces([]);
    setShowClearConfirmation(false);
  };

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
      // Simply remove any pieces at this position without replacing them
      const newPieces = pieces.filter(piece => {
        const [pieceX, pieceY] = piece.position;
        const [pieceWidth, pieceHeight] = piece.size;
        return !(x >= pieceX && 
                x < pieceX + pieceWidth && 
                y >= pieceY && 
                y < pieceY + pieceHeight);
      });
      
      setPieces(newPieces);
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

    // Remove any existing pieces at this position
    const filteredPieces = pieces.filter(piece => {
      const [pieceX, pieceY] = piece.position;
      const [pieceWidth, pieceHeight] = piece.size;
      return !(x >= pieceX && 
              x < pieceX + pieceWidth && 
              y >= pieceY && 
              y < pieceY + pieceHeight);
    });

    // Add the new piece
    setPieces([...filteredPieces, newPiece]);
    lastPlacedPosition.current = { x, y };
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

  const captureDesignData = async () => {
    // If there are no pieces, return early with a message
    if (pieces.length === 0) {
      return {
        pixelData: [[]],
        colorPalette: [],
        imageDataUrl: null
      };
    }

    // Find the boundaries of the occupied area
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    // Determine the boundaries of all pieces
    pieces.forEach(piece => {
      const [pieceX, pieceY] = piece.position;
      const [pieceWidth, pieceHeight] = piece.size;
      
      minX = Math.min(minX, pieceX);
      minY = Math.min(minY, pieceY);
      maxX = Math.max(maxX, pieceX + pieceWidth - 1);
      maxY = Math.max(maxY, pieceY + pieceHeight - 1);
    });

    // Add a small padding around the occupied area (2 cells)
    const padding = 2;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(width - 1, maxX + padding);
    maxY = Math.min(height - 1, maxY + padding);

    // Calculate dimensions of the occupied area
    const occupiedWidth = maxX - minX + 1;
    const occupiedHeight = maxY - minY + 1;

    // Create a matrix representation of just the occupied area
    const boardMatrix = Array(occupiedHeight).fill(0).map(() => Array(occupiedWidth).fill(null));
    
    // Fill the matrix with piece data
    pieces.forEach(piece => {
      const [pieceX, pieceY] = piece.position;
      const [pieceWidth, pieceHeight] = piece.size;
      
      // Fill the matrix cells occupied by this piece, adjusting for the offset
      for (let y = pieceY; y < pieceY + pieceHeight; y++) {
        for (let x = pieceX; x < pieceX + pieceWidth; x++) {
          if (y >= minY && y <= maxY && x >= minX && x <= maxX) {
            boardMatrix[y - minY][x - minX] = piece.color;
          }
        }
      }
    });
    
    // Get all unique colors used in the design
    const colorPalette = [...new Set(pieces.map(piece => piece.color))];
    
    return {
      pixelData: boardMatrix,
      colorPalette,
      imageDataUrl: null,
      bounds: { minX, minY, maxX, maxY, width: occupiedWidth, height: occupiedHeight }
    };
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GameHeader 
        onClear={() => setShowClearConfirmation(true)}
        onSubmit={() => {}}
        captureDesignData={captureDesignData}
      />
      
      {/* Confirmation Dialog */}
      {showClearConfirmation && (
        <div className="nes-dialog-overlay">
          <div className="nes-container is-rounded with-title" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', maxWidth: '300px', margin: '0', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <p className="title" style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '10px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>Clear Design</p>
            <p className="nes-text mb-4" style={{ fontSize: '10px' }}>Are you sure you want to clear all blocks from the design?</p>
            <div className="flex justify-center gap-4">
              <button 
                className="nes-btn"
                onClick={() => setShowClearConfirmation(false)}
                style={{ margin: '0' }}
              >
                No
              </button>
              <button 
                className="nes-btn is-error"
                onClick={handleClearBoard}
                style={{ margin: '0' }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-8 items-start justify-center mt-4">
        {/* Image Prompt Component */}
        <ImagePrompt onSubmit={(prompt) => {
          // console.log("Image prompt submitted:", prompt);
        }} />

        <div
          ref={boardRef}
          className="board relative bg-white rounded-lg shadow-xl"
          id="board-container"
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
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.1s ease',
                  zIndex: 0,
                }}
                onMouseEnter={(e) => {
                  // Always show hover effect since we can place or erase anywhere
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                  // Always call handleMouseMove to allow erasing
                  handleMouseMove(x, y);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleMouseDown();
                  // In eraser mode, always call handleClick
                  // In color mode, only call handleClick if the cell is not occupied
                  handleClick(x, y);
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
                cursor: selectedColor === null ? 'pointer' : 'default', // Show pointer cursor in eraser mode
              }}
              onMouseDown={(e) => {
                if (selectedColor === null) {
                  // In eraser mode, erase this piece
                  e.preventDefault();
                  e.stopPropagation();
                  handleMouseDown();
                  // Erase the entire piece at once by removing it from the pieces array
                  setPieces(pieces.filter(p => p.id !== piece.id));
                  lastPlacedPosition.current = { x: piece.position[0], y: piece.position[1] };
                }
              }}
              onMouseEnter={(e) => {
                if (isDragging && selectedColor === null) {
                  // If dragging in eraser mode, erase this piece
                  setPieces(pieces.filter(p => p.id !== piece.id));
                  lastPlacedPosition.current = { x: piece.position[0], y: piece.position[1] };
                }
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
        <ColorPalette
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      </div>
    </div>
  );
};

export default Board;