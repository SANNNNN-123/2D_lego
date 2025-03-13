import React, { useState, useEffect, useRef } from 'react';
import { Pixelify } from 'react-pixelify';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [pixelData, setPixelData] = useState<Array<{x: number, y: number, color: string}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get pixel size based on selected grid size
  const getPixelSize = () => {
    switch (gridSize) {
      case 'small': return 4;
      case 'large': return 16;
      default: return 8; // medium
    }
  };

  // Handle pixelation toggle
  const handlePixelatedToggle = () => {
    // If turning on pixelation, ensure imageLoaded is true if we have an image
    if (!pixelated && imageSrc) {
      setImageLoaded(true);
      if (imageSrc && imageLoaded) {
        generatePixelData();
      }
    }
    setPixelated(!pixelated);
  };

  // Set image as loaded when image source changes
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImageLoaded(true);
        if (pixelated) {
          generatePixelData();
        }
      };
    }
  }, [imageSrc]);

  // Update pixel data when grid size changes
  useEffect(() => {
    if (pixelated && imageSrc && imageLoaded) {
      generatePixelData();
    }
  }, [gridSize, pixelated]);

  // Generate pixel data from the image
  const generatePixelData = () => {
    if (!imageSrc || !imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set willReadFrequently to true to optimize for frequent getImageData calls
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const pixelSize = getPixelSize();
    const width = 260;
    const height = 220;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw image to canvas
    const img = new Image();
    img.src = imageSrc;
    
    // Center the image in the canvas
    const aspectRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    
    if (aspectRatio > width / height) {
      // Image is wider than canvas
      drawWidth = width;
      drawHeight = width / aspectRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      // Image is taller than canvas
      drawHeight = height;
      drawWidth = height * aspectRatio;
      offsetX = (width - drawWidth) / 2;
    }
    
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Create pixelated data
    const pixels: Array<{x: number, y: number, color: string}> = [];
    
    // Process pixels in blocks of pixelSize
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        // Sample the center of each pixel block
        const centerX = Math.min(x + Math.floor(pixelSize / 2), width - 1);
        const centerY = Math.min(y + Math.floor(pixelSize / 2), height - 1);
        
        const index = (centerY * width + centerX) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        
        // Skip fully transparent pixels
        if (a < 10) continue;
        
        // Add pixel data
        pixels.push({
          x,
          y,
          color: `rgba(${r}, ${g}, ${b}, ${a / 255})`
        });
      }
    }
    
    setPixelData(pixels);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setProgress(0);
    setPixelated(false);
    setImageLoaded(false);
    setPixelData([]);
    
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

  // Custom pixelated view with perfectly aligned grid
  const PixelatedView = () => {
    const pixelSize = getPixelSize();
    const width = 260;
    const height = 220;
    
    // Calculate grid dimensions
    const rows = Math.ceil(height / pixelSize);
    const cols = Math.ceil(width / pixelSize);
    
    // Grid line properties
    const gridColor = "rgba(0, 0, 0, 0.3)";
    const gridThickness = 2; // Increased thickness
    
    return (
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative',
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: 'white'
        }}
      >
        {/* Hidden canvas for processing */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }} 
        />
        
        {/* Render each pixel as a div */}
        {pixelData.map((pixel, index) => (
          <div
            key={`pixel-${index}`}
            style={{
              position: 'absolute',
              left: `${pixel.x}px`,
              top: `${pixel.y}px`,
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: pixel.color
            }}
          />
        ))}
        
        {/* Grid overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          {/* Grid pattern */}
          <svg 
            width="100%" 
            height="100%" 
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            <defs>
              <pattern 
                id="grid" 
                width={pixelSize} 
                height={pixelSize} 
                patternUnits="userSpaceOnUse"
              >
                <path 
                  d={`M ${pixelSize} 0 L 0 0 0 ${pixelSize}`} 
                  fill="none" 
                  stroke={gridColor} 
                  strokeWidth={gridThickness}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* Right and bottom borders */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: `${gridThickness}px`,
            height: '100%',
            backgroundColor: gridColor
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${gridThickness}px`,
            backgroundColor: gridColor
          }} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 className="nes-text mb-2"></h3>
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
                <div className="nes-text" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ margin: '0 8px' }}>Generating image... {progress}%</span>
                </div>
                <progress className="nes-progress is-success" value={progress} max="100" style={{ width: '100%' }}></progress>
              </div>
            ) : imageSrc ? (
              <>
                {pixelated ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <PixelatedView />
                  </div>
                ) : (
                  <img 
                    src={imageSrc} 
                    alt="Generated from prompt" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      padding: '10px'
                    }}
                  />
                )}
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
                onChange={handlePixelatedToggle}
                disabled={!imageSrc || isLoading}
              />
              <span className="nes-text" style={{ 
                fontSize: '1rem',
                opacity: (!imageSrc || isLoading) ? 0.5 : 1
              }}>Pixelated</span>
            </label>
            
            <div style={{ display: 'inline-block' }}>
              <select
                className="nes-text"
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value as 'small' | 'medium' | 'large')}
                disabled={!pixelated || !imageSrc}
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
                  opacity: (pixelated && imageSrc) ? 1 : 0.5
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