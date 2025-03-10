'use client';

import { useEffect, useState } from 'react';
import { fetchDesigns } from '../../services/supabaseService';
import GalleryItem from './GalleryItem';
import Link from 'next/link';

export interface Design {
  id: string;
  name: string;
  creator: string;
  image?: string;
  pixelData: (string | null)[][];
  colorPalette: string[];
  bounds?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
  createdAt: string;
}

export default function GalleryContainer() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setLoading(true);
        const result = await fetchDesigns();
        
        if (result.success && result.data) {
          // Process the designs to ensure pixelData is properly formatted
          const processedDesigns = result.data.map(design => {
            // Ensure pixelData is a 2D array
            let processedPixelData = design.pixelData;
            
            // If pixelData is not an array or is empty, create a default empty grid
            if (!Array.isArray(processedPixelData) || processedPixelData.length === 0) {
              processedPixelData = Array(10).fill(Array(10).fill(null));
            }
            
            return {
              ...design,
              pixelData: processedPixelData
            };
          });
          
          setDesigns(processedDesigns);
        } else {
          setError('Failed to load designs');
          console.error('Error loading designs:', result.error);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Exception loading designs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDesigns();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 gallery-loading">
        <div className="nes-text is-primary">Loading designs...</div>
        <i className="nes-icon is-large star is-half mt-4"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 gallery-error">
        <div className="nes-container is-rounded is-error">
          <p>{error}</p>
          <button 
            className="nes-btn is-error mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12 gallery-empty">
        <div className="nes-container is-rounded with-title">
          <p className="title">No Designs Yet</p>
          <p>Be the first to create a LEGO masterpiece!</p>
          <Link href="/builder" className="nes-btn is-primary mt-4">
            Start Building
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {designs.map((design) => (
        <GalleryItem key={design.id} design={design} />
      ))}
    </div>
  );
} 