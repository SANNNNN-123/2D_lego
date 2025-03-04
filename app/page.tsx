"use client";

import { useState, useEffect } from "react";
import { BoardState, PieceType, PieceSize, PieceColor, COLORS } from "./types";
import Header from "./components/Header";
import Board from "./components/Board";
import PiecesPanel from "./components/PiecesPanel";

export default function Home() {
  const [boardState, setBoardState] = useState<BoardState>({ pieces: [] });
  const [showPiecesPanel, setShowPiecesPanel] = useState(false);
  const [selectedPieceType, setSelectedPieceType] = useState<PieceType>("Plate");
  const [selectedColor, setSelectedColor] = useState<PieceColor>(COLORS[2]); // Default to red
  const [selectedSize, setSelectedSize] = useState<PieceSize>([1, 1]); // Default to 1x1
  const [isPlacingPiece, setIsPlacingPiece] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p') {
        togglePiecesPanel();
      } else if (e.key.toLowerCase() === 'c') {
        clearBoard();
      } else if (e.key.toLowerCase() === 's') {
        // Toggle settings (not implemented)
      } else if (e.key === 'Escape') {
        // Cancel piece placement
        setIsPlacingPiece(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Clear the board
  const clearBoard = () => {
    setBoardState({ pieces: [] });
  };

  // Toggle the pieces panel
  const togglePiecesPanel = () => {
    setShowPiecesPanel(!showPiecesPanel);
    // Cancel piece placement when opening panel
    if (!showPiecesPanel) {
      setIsPlacingPiece(false);
    }
  };
  
  // Handle piece selection from the panel
  const handlePieceSelect = (size: PieceSize) => {
    setSelectedSize(size);
    setIsPlacingPiece(true);
    setShowPiecesPanel(false);
  };

  // Add a piece to the board
  const addPiece = (x: number, y: number) => {
    // Check if the piece would go out of bounds
    const [width, height] = selectedSize;
    if (x + width > 32 || y + height > 32) {
      return; // Don't place if it would go out of bounds
    }
    
    // Check for collision with existing pieces
    const hasCollision = boardState.pieces.some(piece => {
      const [pieceX, pieceY] = piece.position;
      const [pieceWidth, pieceHeight] = piece.size;
      
      // Check if the rectangles overlap
      return (
        x < pieceX + pieceWidth &&
        x + width > pieceX &&
        y < pieceY + pieceHeight &&
        y + height > pieceY
      );
    });
    
    if (hasCollision) {
      return; // Don't place if there's a collision
    }
    
    const newPiece = {
      id: `piece-${Date.now()}`,
      type: selectedPieceType,
      size: selectedSize,
      color: selectedColor,
      position: [x, y] as [number, number],
    };
    
    setBoardState(prev => ({
      pieces: [...prev.pieces, newPiece]
    }));
    
    // Reset placement state
    setIsPlacingPiece(false);
  };
  
  // Handle click on the board
  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showPiecesPanel) return; // Don't place pieces when panel is open
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 24);
    const y = Math.floor((e.clientY - rect.top) / 24);
    
    // Make sure we're within the board boundaries
    if (x >= 0 && x < 32 && y >= 0 && y < 32) {
      addPiece(x, y);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header 
        onTogglePiecesPanel={togglePiecesPanel}
        onClearBoard={clearBoard}
      />
      
      {/* Main board area */}
      <main className="flex-1 p-4 flex items-center justify-center">
        <Board 
          boardState={boardState}
          onBoardClick={handleBoardClick}
        />
      </main>
      
      {/* Pieces panel */}
      {showPiecesPanel && (
        <PiecesPanel
          onClose={togglePiecesPanel}
          selectedPieceType={selectedPieceType}
          setSelectedPieceType={setSelectedPieceType}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          onPieceSelect={handlePieceSelect}
        />
      )}
      
      {/* Status indicator */}
      {/* {isPlacingPiece && (
        // <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm">
        //   Click on the board to place a {selectedSize[0]}x{selectedSize[1]} piece (ESC to cancel)
        // </div>
      )} */}
    </div>
  );
}
