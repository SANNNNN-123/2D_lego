"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import Board from '../components/Board';
import Header from '../components/Header';

export default function Builder() {
  const router = useRouter();
  const boardRef = useRef<{ clearBoard: () => void } | null>(null);

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleClearBoard = () => {
    // Show confirmation dialog by triggering the 'C' key functionality in Board
    const event = new KeyboardEvent('keydown', { key: 'C' });
    window.dispatchEvent(event);
  };

  const handleTogglePiecesPanel = () => {
    // Will be implemented when needed
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        onTogglePiecesPanel={handleTogglePiecesPanel}
        onClearBoard={handleClearBoard}
        onHomeClick={handleHomeClick}
      />
      <main className="flex-1 flex items-center justify-center">
        <Board width={30} height={30} />
      </main>
    </div>
  );
} 