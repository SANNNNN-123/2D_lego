'use client';

import { useEffect, useState } from 'react';
import { fetchDesigns } from '../../services/supabaseService';

export default function DesignCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateCounter = async () => {
      try {
        setIsLoading(true);
        const result = await fetchDesigns();
        
        if (result.success && result.data) {
          setCount(result.data.length);
          
          // Also update the DOM element if it exists
          const counterElement = document.getElementById('design-counter');
          if (counterElement) {
            counterElement.textContent = `${result.data.length} LEGO art created and counting!`;
          }
        } else {
          console.error('Error fetching designs for counter:', result.error);
          // Set a fallback message
          const counterElement = document.getElementById('design-counter');
          if (counterElement) {
            counterElement.textContent = 'Create your first LEGO design!';
          }
        }
      } catch (error) {
        console.error('Exception updating design counter:', error);
        // Set a fallback message
        const counterElement = document.getElementById('design-counter');
        if (counterElement) {
          counterElement.textContent = 'Create your first LEGO design!';
        }
      } finally {
        setIsLoading(false);
      }
    };

    updateCounter();

    // Set up a refresh interval (every 30 seconds)
    const intervalId = setInterval(updateCounter, 30000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // This component doesn't render anything visible
  return null;
} 