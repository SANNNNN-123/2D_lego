import React, { useState } from 'react';

interface ImagePromptProps {
  onSubmit?: (prompt: string) => void;
}

const ImagePrompt: React.FC<ImagePromptProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="nes-container" style={{ width: '360px' }}>
      <h3 className="nes-text mb-2">Enter Image Prompt</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="nes-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Eg: cat, car, etc."
            />
            <button 
              type="submit" 
              className="nes-btn is-primary"
            >
              Submit
            </button>
          </div>
          <div className="mt-2 nes-container" style={{ height: '280px', width: '100%', padding: '0 !important' }}>
            {/* Image will be displayed here */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ImagePrompt; 