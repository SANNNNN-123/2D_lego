import React from 'react';
import Link from 'next/link';

interface GameHeaderProps {
  onClear?: () => void;
  onSubmit?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onClear, onSubmit }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex gap-2">
          <button className="nes-btn" onClick={() => console.log('Pieces clicked')}>
            PIECES [P]
          </button>
          <button className="nes-btn" onClick={onClear}>
            CLEAR [C]
          </button>
          <button className="nes-btn" onClick={onSubmit}>
            SUBMIT [S]
          </button>
        </div>
        <div>
          <Link href="/" className="nes-btn">
            HOME
          </Link>
        </div>
      </div>
      {/* Double line separator */}
      <div className="nes-separator"></div>
    </div>
  );
};

export default GameHeader; 