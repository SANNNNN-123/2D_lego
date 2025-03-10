'use client';

import Link from 'next/link';
import { Design } from './GalleryContainer';
import { useEffect, useState } from 'react';
import LegoDesignPreview from '../LegoDesignPreview';

interface GalleryItemProps {
  design: Design;
}

export default function GalleryItem({ design }: GalleryItemProps) {
  const [dominantColor, setDominantColor] = useState<string>('#CCCCCC');
  const [trimmedPixelData, setTrimmedPixelData] = useState<(string | null)[][]>([]);
  
  useEffect(() => {
    // Set the dominant color from the color palette if available
    if (design.colorPalette && design.colorPalette.length > 0) {
      // Use the first color in the palette as the dominant color
      setDominantColor(design.colorPalette[0]);
    }
    
    // Trim the pixel data to only include the actual design (non-null cells)
    if (design.pixelData && design.pixelData.length > 0) {
      // Find the bounds of the actual design (non-null cells)
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      
      // First pass: find the bounds
      design.pixelData.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) { // If the cell has a color (not null)
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        });
      });
      
      // If we found any non-null cells
      if (minX !== Infinity && minY !== Infinity) {
        // Add some padding around the design (1 cell on each side)
        minX = Math.max(0, minX - 1);
        minY = Math.max(0, minY - 1);
        maxX = Math.min(design.pixelData[0].length - 1, maxX + 1);
        maxY = Math.min(design.pixelData.length - 1, maxY + 1);
        
        // Second pass: create a new array with only the cells within the bounds
        const trimmed: (string | null)[][] = [];
        for (let y = minY; y <= maxY; y++) {
          const newRow: (string | null)[] = [];
          for (let x = minX; x <= maxX; x++) {
            newRow.push(design.pixelData[y][x]);
          }
          trimmed.push(newRow);
        }
        setTrimmedPixelData(trimmed);
      } else {
        // If no non-null cells were found, use the original data
        setTrimmedPixelData(design.pixelData);
      }
    }
  }, [design.colorPalette, design.pixelData]);

  // Format the date
  const formattedDate = new Date(design.createdAt).toLocaleDateString();
  
  // Determine if we should use the image or render a preview
  const hasImage = !!design.image;
  const hasPixelData = trimmedPixelData.length > 0;

  // Calculate the appropriate scale for the LEGO preview
  const calculatePreviewScale = () => {
    if (!hasPixelData) return 0.5;
    
    const width = trimmedPixelData[0]?.length || 0;
    const height = trimmedPixelData.length || 0;
    
    // Calculate scale based on the container size (192px height)
    const containerHeight = 192; // 48px * 4 (h-48 class)
    const containerWidth = 300; // Approximate width of gallery item
    
    // Calculate scale to fit within container with some padding
    const scaleX = (containerWidth - 40) / (width * 24);
    const scaleY = (containerHeight - 40) / (height * 24);
    
    // Use the smaller scale to ensure it fits
    let scale = Math.min(scaleX, scaleY);
    
    // Cap the scale to reasonable values
    scale = Math.min(scale, 1.0); // Don't make it too big
    scale = Math.max(scale, 0.4); // Don't make it too small
    
    return scale;
  };
  
  const previewScale = calculatePreviewScale();

  return (
    <div className="gallery-item">
      <div className="gallery-item-header">
        <p style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '12px', margin: 0 }}>
          {design.name || 'Untitled Design'}
        </p>
      </div>
      
      <Link href={`/builder?id=${design.id}`}>
        <div
          className="h-48 cursor-pointer overflow-hidden"
          style={{
            backgroundImage: !hasImage && !hasPixelData
              ? `repeating-linear-gradient(45deg, ${dominantColor}22, ${dominantColor}22 10px, ${dominantColor}44 10px, ${dominantColor}44 20px)`
              : 'none',
            backgroundSize: "100px 100px",
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            border: 'none'
          }}
        >
          {hasImage ? (
            <img 
              src={design.image} 
              alt={design.name || 'LEGO Design'}
              className="w-full h-full object-contain"
            />
          ) : hasPixelData ? (
            <div className="flex items-center justify-center h-full w-full lego-preview-container">
              <div 
                className="lego-preview-wrapper"
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'center',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <LegoDesignPreview 
                  pixelData={trimmedPixelData} 
                  cellSize={24} 
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div
                className="w-24 h-24"
                style={{
                  backgroundColor: dominantColor,
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 3px, transparent 3px)",
                  backgroundSize: "12px 12px",
                  backgroundPosition: "6px 6px",
                }}
              />
            </div>
          )}
        </div>
      </Link>
      
      <div className="gallery-item-footer">
        <p style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '10px', margin: 0 }}>
          Created by {design.creator || 'Anonymous'}
        </p>
      </div>
    </div>
  );
} 