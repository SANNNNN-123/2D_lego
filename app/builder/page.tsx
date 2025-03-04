"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import Board from '../components/Board';
import Header from '../components/Header';

export default function Builder() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleClearBoard = () => {
    // Will be implemented when needed
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
        <Board width={32} height={32} />
      </main>
    </div>
  );
} 