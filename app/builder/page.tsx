"use client";

import React, { useEffect, Suspense } from 'react';
import Board from '../components/Board';
import { useSearchParams } from 'next/navigation';
import { useDesign } from '../context/DesignContext';
import { fetchDesignById } from '../services/supabaseService';

// Create a client component that uses useSearchParams
function BuilderContent() {
  const searchParams = useSearchParams();
  const designId = searchParams.get('id');
  const { setSelectedDesign } = useDesign();

  useEffect(() => {
    // Add builder-page class to body for mobile-specific styling
    document.body.classList.add('builder-page');
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('builder-page');
    };
  }, []);

  useEffect(() => {
    // If there's a design ID in the URL, fetch the design and set it in context
    if (designId) {
      const loadDesign = async () => {
        try {
          const result = await fetchDesignById(designId);
          if (result.success && result.data) {
            // Set the selected design in context
            setSelectedDesign(result.data);
            
            // Add a small delay to ensure the TabFolder component is mounted
            setTimeout(() => {
              // Find the "Learn to Design" tab button and click it
              const learnDesignTab = document.querySelector('.nes-btn:not(.is-primary)');
              if (learnDesignTab) {
                (learnDesignTab as HTMLButtonElement).click();
              }
            }, 500);
          }
        } catch (error) {
          console.error('Error loading design:', error);
        }
      };
      
      loadDesign();
    }
  }, [designId, setSelectedDesign]);

  return (
    <div className="min-h-screen flex flex-col bg-white p-4 builder-container">
      <main className="flex-1 flex items-center justify-center">
        <Board width={30} height={30} />
      </main>
    </div>
  );
}

// Main page component with Suspense boundary
export default function Builder() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BuilderContent />
    </Suspense>
  );
} 