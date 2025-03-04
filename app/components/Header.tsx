import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  onTogglePiecesPanel: () => void;
  onClearBoard: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onTogglePiecesPanel, onClearBoard, onHomeClick }) => {
  return (
    <header className="p-4 border-b flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <Image
            src="/logo.png"
            alt="2D LEGO Logo"
            width={32}
            height={32}
          />
          <span className="font-press-start font-medium">2D LEGO</span>
        </div>
        <button 
          className="px-2 py-1 hover:bg-gray-100 font-medium"
          onClick={onTogglePiecesPanel}
        >
          PIECES [P]
        </button>
        <button 
          className="px-2 py-1 hover:bg-gray-100 font-medium"
          onClick={onClearBoard}
        >
          CLEAR [C]
        </button>
        <button className="px-2 py-1 hover:bg-gray-100 font-medium">
          IMPORTS [I]
        </button>
      </div>
      <button 
        className="px-4 py-1 bg-gray-100 hover:bg-gray-200 font-medium rounded"
        onClick={onHomeClick}
      >
        HOME
      </button>
    </header>
  );
};

export default Header; 