'use client';

import { Suspense } from 'react';
import { Header, Footer } from '../HomePage';
import GalleryContainer from './GalleryContainer';
import Link from 'next/link';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <section className="py-16">
          <div className="gallery-header">
            <h2>Gallery</h2>
            <div className="gallery-header-line"></div>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="nes-btn is-primary custom-cursor-click">
              Back to Home
            </Link>
            <Link href="/builder" className="nes-btn is-success custom-cursor-click">
              Create New Design
            </Link>
          </div>
          
          <div className="mt-8">
            <Suspense fallback={
              <div className="text-center py-12">
                <div className="nes-text is-primary">Loading gallery...</div>
                <div className="flex justify-center mt-4 space-x-2">
                    <i className="nes-icon is-large heart"></i>
                    <i className="nes-icon is-large heart is-half"></i>
                    <i className="nes-icon is-large heart is-transparent"></i>
                    <i className="nes-icon is-large heart"></i>
                </div>
              </div>
            }>
              <GalleryContainer 
                showViewAll={false} 
                showPagination={true} 
                itemsPerPage={9}
              />
            </Suspense>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
} 