'use client';

import Link from "next/link"
import Image from "next/image"
import { lazy, Suspense } from "react";
import './Gallery/gallery.css';

// Lazy load the components instead of using next/dynamic
const GalleryContainer = lazy(() => import('./Gallery/GalleryContainer'));
const DesignCounter = lazy(() => import('./Gallery/DesignCounter'));

export function Header() {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="2D LEGO Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <h1 className="text-xl font-bold ml-3" style={{ fontFamily: 'var(--font-press-start-2p)', margin: 0, letterSpacing: '-0.05em' }}>
            2D<span style={{ marginLeft: '0.3em' }}>LEGO</span>
          </h1>
        </div>
        <div>
          <Link href="#gallery" className="nes-btn">
            Gallery
          </Link>
        </div>
      </div>
      {/* Double line separator */}
      <div className="nes-separator"></div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="py-8 text-center">
      <div className="max-w-5xl mx-auto px-4">
        <div className="counter-notification">
          <span className="nes-icon coin is-small"></span>
          <span id="design-counter">Loading designs...</span>
        </div>
        <div className="flex justify-center space-x-4 mb-8">
          <i className="nes-ash"></i>
          <i className="nes-pokeball"></i>
          <i className="nes-bulbasaur"></i>
          <i className="nes-charmander"></i>
          <i className="nes-squirtle"></i>
          <i className="nes-kirby"></i>
        </div>
        <h1 
          className="text-4xl md:text-4xl font-bold mb-8 animate-fadeIn" 
          style={{ 
            fontFamily: 'var(--font-press-start-2p)', 
            marginBottom: '2rem', 
            marginTop: 0,
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
            fontSize: '80px',
            lineHeight: '1'
          }}
        >
          Build Anything You Imagine
        </h1>
        <p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12" 
          style={{ 
            fontFamily: 'var(--font-press-start-2p)', 
            fontSize: '12px',
            lineHeight: '1.8'
          }}
        >
          Create, design, and share your LEGO masterpieces with our intuitive 2D LEGO builder. No physical limitations,
          just pure creativity.
        </p>
        <Link
          href="/builder"
          className="nes-btn is-primary inline-flex items-center justify-center text-lg px-8 py-4 transition-transform hover:scale-105 homepage-cta"
          style={{
            fontSize: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '1rem 2rem !important',
            margin: '0.5rem !important',
            borderWidth: '6px !important'
          }}
        >
          Start Building
        </Link>
      </div>
    </section>
  )
}

export function GallerySection() {
  return (
    <section className="py-16" id="gallery">
      <div className="gallery-header">
        <h2>Gallery</h2>
        <div className="gallery-header-line"></div>
      </div>
      
      {/* Replace the static gallery items with the dynamic GalleryContainer */}
      <div className="mt-8">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="nes-text is-primary">Loading gallery...</div>
            <i className="nes-icon is-large star is-half"></i>
          </div>
        }>
          <GalleryContainer />
        </Suspense>
      </div>
      
      <div className="text-center mt-10">
        <Link
          href="/builder"
          className="nes-btn is-primary gallery-view-all"
        >
          View All Gallery
        </Link>
      </div>
    </section>
  )
}

function GalleryItem({ name, color }: { name: string; color: string }) {
  return (
    <div className="gallery-item">
      <div className="gallery-item-header">
        <p style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '12px', margin: 0 }}>{name}</p>
      </div>
      <div
        className="h-48"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${color}22, ${color}22 10px, ${color}44 10px, ${color}44 20px)`,
          backgroundSize: "100px 100px",
        }}
      >
        <div className="h-full flex items-center justify-center">
          <div
            className="w-24 h-24"
            style={{
              backgroundColor: color,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 3px, transparent 3px)",
              backgroundSize: "12px 12px",
              backgroundPosition: "6px 6px",
            }}
          />
        </div>
      </div>
      <div className="gallery-item-footer">
        <p style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '10px', margin: 0 }}>Created by LEGO Builder</p>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="py-10 mt-8">
      <div className="nes-separator mb-6"></div>
      <div className="flex flex-col md:flex-row justify-between items-center px-4">
        <div className="flex items-center mb-4 md:mb-0">
          <p className="text-sm" style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '12px' }}>© 2025 LEGO Builder.</p>
        </div>
        <div className="flex space-x-6">
        <p className="text-sm" style={{ fontFamily: 'var(--font-press-start-2p)', fontSize: '12px' }}>Zuhair Aziz</p>
        </div>
      </div>
    </footer>
  )
}

// Main HomePage component that combines all sections
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        <Header />
        <HeroSection />
        <GallerySection />
        <Footer />
        <Suspense fallback={null}>
          <DesignCounter />
        </Suspense>
      </div>
    </div>
  )
}

