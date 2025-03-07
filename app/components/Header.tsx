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
        <button 
          className="px-2 py-1 hover:bg-gray-100 font-medium"
          onClick={onTogglePiecesPanel}
        >
          PIECES
        </button>
        <button 
          className="px-2 py-1 hover:bg-gray-100 font-medium"
          onClick={onClearBoard}
        >
          CLEAR
        </button>
        <button className="px-2 py-1 hover:bg-gray-100 font-medium">
          SUBMIT
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