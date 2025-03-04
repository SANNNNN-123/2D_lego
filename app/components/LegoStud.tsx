import React from 'react';

interface LegoStudProps {
  x: number;
  y: number;
  color?: string;
  isOnPiece?: boolean;
}

const LegoStud: React.FC<LegoStudProps> = ({ 
  x, 
  y, 
  color = "#e0e0e0",
  isOnPiece = false 
}) => {
  // Base stud styling
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: color,
    top: `${y * 24 + 6}px`,
    left: `${x * 24 + 6}px`,
    zIndex: isOnPiece ? 3 : 1,
  };

  // Additional styling based on whether it's on a piece or the baseplate
  const studStyle: React.CSSProperties = isOnPiece
    ? {
        ...baseStyle,
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 1px 1px rgba(0, 0, 0, 0.2)",
      }
    : {
        ...baseStyle,
        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
        background: `${color} linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0.05))`,
      };

  return (
    <div 
      className={isOnPiece ? "stud" : "stud-base"} 
      style={studStyle}
    />
  );
};

export default LegoStud; 