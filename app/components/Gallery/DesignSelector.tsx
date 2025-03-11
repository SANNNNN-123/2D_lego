'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Design } from './GalleryContainer';
import { useDesign } from '../../context/DesignContext';

interface DesignSelectorProps {
  designs: Design[];
}

export default function DesignSelector({ designs }: DesignSelectorProps) {
  const router = useRouter();
  const { setSelectedDesign } = useDesign();

  // Function to handle design selection
  const handleDesignSelect = (design: Design) => {
    // Set the selected design in context
    setSelectedDesign(design);
    
    // Navigate to the builder page
    router.push(`/builder?id=${design.id}`);
  };

  // Attach the handleDesignSelect function to each GalleryItem
  useEffect(() => {
    if (!designs || designs.length === 0) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
      if (index < designs.length) {
        const design = designs[index];
        
        // Add click event listener to the gallery item
        item.addEventListener('click', (e) => {
          // Prevent default if it's a link
          if ((e.target as HTMLElement).tagName === 'A' || 
              (e.target as HTMLElement).closest('a')) {
            e.preventDefault();
          }
          
          handleDesignSelect(design);
        });
      }
    });

    // Cleanup function to remove event listeners
    return () => {
      galleryItems.forEach(item => {
        item.removeEventListener('click', () => {});
      });
    };
  }, [designs, setSelectedDesign, router]);

  // This component doesn't render anything visible
  return null;
} 