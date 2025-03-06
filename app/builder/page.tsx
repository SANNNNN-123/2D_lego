"use client";

import React from 'react';
import Board from '../components/Board';

export default function Builder() {
  return (
    <div className="min-h-screen flex flex-col bg-white p-4">
      <main className="flex-1 flex items-center justify-center">
        <Board width={30} height={30} />
      </main>
    </div>
  );
} 