import React from 'react';
import { LegoPiece as LegoPieceType } from '../types';
import LegoStud from './LegoStud';

interface LegoPieceProps {
  piece: LegoPieceType;
}

const LegoPiece: React.FC<LegoPieceProps> = ({ piece }) => {
  const [width, height] = piece.size;
  const [x, y] = piece.position;
  
  return (
    <div
      className="custom-cursor-click"
      style={{
        position: "absolute",
        width: `${width * 24}px`,
        height: `${height * 24}px`,
        backgroundColor: piece.color,
        top: `${y * 24}px`,
        left: `${x * 24}px`,
        zIndex: 2,
        borderRadius: "2px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        backgroundImage: `
          linear-gradient(to right, rgba(128,128,128,0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(128,128,128,0.2) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
        cursor: "url('/cursor-click.png'), pointer",
      }}
    >
      {/* Render studs on the piece if it's a plate */}
      {piece.type === "Plate" && Array.from({ length: width * height }).map((_, i) => {
        const studY = Math.floor(i / width);
        const studX = i % width;
        return (
          <LegoStud
            key={i}
            x={studX}
            y={studY}
            color={piece.color}
            isOnPiece={true}
            isClickable={true}
          />
        );
      })}
    </div>
  );
};

export default LegoPiece; 