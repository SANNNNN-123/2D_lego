import React from 'react';

interface LegoStudProps {
  x: number;
  y: number;
  color?: string;
  isOnPiece?: boolean;
  onClick?: () => void;
  isClickable?: boolean;
  onMouseEnter?: () => void;
}

const LegoStud: React.FC<LegoStudProps> = ({ 
  x, 
  y, 
  color = "#e0e0e0",
  isOnPiece = false,
  onClick,
  isClickable = false,
  onMouseEnter
}) => {
  // Base stud styling
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: color,
    top: `${y * 24 + 4}px`,
    left: `${x * 24 + 4}px`,
    zIndex: isOnPiece ? 3 : 1,
    cursor: isClickable ? 'url("/cursor-click.png"), pointer' : 'url("/cursor.png"), auto',
    transition: 'background-color 0.1s ease',
  };

  // Additional styling based on whether it's on a piece or the baseplate
  const studStyle: React.CSSProperties = isOnPiece
    ? {
        ...baseStyle,
        border: "1px solid rgba(0,0,0,0.2)",
        boxShadow: `
          inset 0 2px 3px rgba(255, 255, 255, 0.4),
          0 2px 2px rgba(0, 0, 0, 0.3)
        `,
        background: color.startsWith('rgba') 
          ? `${color}` 
          : `${color} radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)`,
      }
    : {
        ...baseStyle,
        border: "1px solid rgba(0,0,0,0.2)",
        boxShadow: `
          inset 0 2px 3px rgba(255, 255, 255, 0.4),
          0 2px 2px rgba(0, 0, 0, 0.3)
        `,
        background: color.startsWith('rgba') 
          ? `${color}` 
          : `${color} radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)`,
      };

  return (
    <div 
      className={`${isOnPiece ? "stud" : "stud-base"} ${isClickable ? "custom-cursor-click" : "custom-cursor"}`}
      style={studStyle}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          onMouseEnter?.();
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.backgroundColor = color;
        }
      }}
    />
  );
};

export default LegoStud; 