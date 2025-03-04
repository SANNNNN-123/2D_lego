import React from 'react';
import { BoardState } from '../types';
import LegoStud from './LegoStud';
import LegoPiece from './LegoPiece';

interface BoardProps {
  boardState: BoardState;
  onBoardClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Board: React.FC<BoardProps> = ({ boardState, onBoardClick }) => {
  // Create a 32x32 grid of studs
  const renderStuds = () => {
    const studs = [];
    const gridSize = 32;
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        studs.push(<LegoStud key={`stud-${x}-${y}`} x={x} y={y} />);
      }
    }
    
    return studs;
  };
  
  return (
    <div 
      className="w-[768px] h-[768px] bg-[var(--lego-board)] relative shadow-md"
      onClick={onBoardClick}
    >
      {/* Render the base studs */}
      {renderStuds()}
      
      {/* Render placed pieces */}
      {boardState.pieces.map(piece => (
        <LegoPiece key={piece.id} piece={piece} />
      ))}
    </div>
  );
};

export default Board; 