'use client';

import { useEffect, useState } from 'react';
import { fetchDesigns } from '../../services/supabaseService';
import GalleryItem from './GalleryItem';
import Link from 'next/link';
import DesignSelector from './DesignSelector';

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

interface GalleryContainerProps {
  limit?: number;
  showViewAll?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  onDesignSelect?: (design: Design) => void;
}

export default function GalleryContainer({ 
  limit, 
  showViewAll = true,
  showPagination = false,
  itemsPerPage = 9,
  onDesignSelect
}: GalleryContainerProps) {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [allDesigns, setAllDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages
  const totalPages = Math.ceil(allDesigns.length / itemsPerPage);

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
          
          // Store all designs for pagination
          setAllDesigns(processedDesigns);
          
          // Apply limit if provided, otherwise use pagination
          if (limit) {
            setDesigns(processedDesigns.slice(0, limit));
          } else if (showPagination) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            setDesigns(processedDesigns.slice(startIndex, startIndex + itemsPerPage));
          } else {
            setDesigns(processedDesigns);
          }
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
  }, [limit, currentPage, itemsPerPage, showPagination]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination items
  const renderPagination = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <button 
        key="page-1" 
        className={`gallery-pagination-item ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        1
      </button>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis-1" className="gallery-pagination-item">
          ...
        </span>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown
      
      pages.push(
        <button 
          key={`page-${i}`} 
          className={`gallery-pagination-item ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis-2" className="gallery-pagination-item">
          ...
        </span>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button 
          key={`page-${totalPages}`} 
          className={`gallery-pagination-item ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="text-center py-12 gallery-loading">
        <div className="nes-text is-primary">Loading designs...</div>
        <div className="flex justify-center mt-4 space-x-2">
          <i className="nes-icon is-large heart"></i>
          <i className="nes-icon is-large heart is-half"></i>
          <i className="nes-icon is-large heart is-transparent"></i>
          <i className="nes-icon is-large heart"></i>
        </div>
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

  if (allDesigns.length === 0) {
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
    <div className="gallery-container">
      <DesignSelector designs={designs} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designs.map((design) => (
          <GalleryItem 
            key={design.id} 
            design={design} 
            onDesignSelect={onDesignSelect}
          />
        ))}
      </div>
      
      {showViewAll && limit && allDesigns.length > limit && (
        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="nes-btn is-primary gallery-view-all"
          >
            View All Gallery
          </Link>
        </div>
      )}
      
      {showPagination && totalPages > 1 && (
        <div className="gallery-pagination">
          <button 
            className="gallery-pagination-item"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          {renderPagination()}
          
          <button 
            className="gallery-pagination-item"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
} 