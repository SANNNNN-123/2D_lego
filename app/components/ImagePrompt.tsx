import React, { useState, useRef, useEffect } from 'react';

interface ImagePromptProps {
  onSubmit?: (prompt: string) => void;
}

const ImagePrompt: React.FC<ImagePromptProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pixelated, setPixelated] = useState(false);
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get pixel size based on selected grid size
  const getPixelSize = () => {
    switch (gridSize) {
      case 'small': return 4;
      case 'large': return 16;
      default: return 8; // medium
    }
  };

  // Apply pixelation effect when image loads or pixelated state changes
  useEffect(() => {
    if (!imageSrc || !pixelated) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageLoaded(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions
      canvas.width = 352;
      canvas.height = 272;
      
      // Draw original image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Pixelate by drawing at a lower resolution and scaling up
      const pixelSize = getPixelSize();
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Process image data to create pixelated effect
      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          // Get the color of the first pixel in the block
          const pixelIndex = (y * canvas.width + x) * 4;
          const r = imageData.data[pixelIndex];
          const g = imageData.data[pixelIndex + 1];
          const b = imageData.data[pixelIndex + 2];
          
          // Fill a rectangle with that color
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
          
          // Draw grid lines
          ctx.strokeStyle = 'rgba(0,0,0,0.5)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, pixelSize, pixelSize);
        }
      }
    };
  }, [imageSrc, pixelated, gridSize]);

  // Reset image loaded state when toggling pixelation off
  useEffect(() => {
    if (!pixelated) {
      setImageLoaded(false);
    }
  }, [pixelated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setProgress(0);
    setPixelated(false);
    setImageLoaded(false);
    
    // Start progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Cap at 90% until we actually get the image
        return prev < 90 ? prev + 10 : prev;
      });
    }, 500);
    
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();
      if (data.image) {
        setProgress(100); // Set to 100% when image is received
        setImageSrc(`data:image/png;base64,${data.image}`);
      }
      if (onSubmit) {
        onSubmit(prompt.trim());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
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
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Submit'}
            </button>
          </div>
          <div className="mt-2 nes-container" style={{ height: '280px', width: '100%', padding: '0 !important', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            {isLoading ? (
              <div style={{ width: '80%', textAlign: 'center' }}>
                <p className="nes-text">Generating image... {progress}%</p>
                <progress className="nes-progress is-success" value={progress} max="100"></progress>
              </div>
            ) : imageSrc ? (
              <>
                {pixelated ? (
                  <canvas 
                    ref={canvasRef} 
                    style={{ width: '100%', height: '100%', display: imageLoaded ? 'block' : 'none' }}
                  />
                ) : null}
                
                <img 
                  src={imageSrc} 
                  alt="Generated from prompt" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: (!pixelated || !imageLoaded) ? 'block' : 'none'
                  }}
                />
              </>
            ) : (
              <div className="nes-text" style={{ padding: '20px' }}>
                Enter a prompt and click Submit to generate an image
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="nes-checkbox mr-2" 
                checked={pixelated} 
                onChange={() => setPixelated(!pixelated)}
              />
              <span className="nes-text" style={{ fontSize: '1rem' }}>Pixelated</span>
            </label>
            
            <div style={{ display: 'inline-block' }}>
              <select
                className="nes-text"
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value as 'small' | 'medium' | 'large')}
                disabled={!pixelated}
                style={{ 
                  fontSize: '1rem',
                  border: '2px solid #000',
                  padding: '2px 4px',
                  backgroundColor: '#fff',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'black\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 2px center',
                  paddingRight: '20px',
                  opacity: pixelated ? 1 : 0.5
                }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ImagePrompt; 