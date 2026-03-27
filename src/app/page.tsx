'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the 3D scene to avoid SSR issues with Three.js
const LibraryScene = dynamic(() => import('@/components/LibraryScene'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-blue-400 animate-pulse text-2xl font-serif">Entering the Magical Library...</div>
    </div>
  )
});

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Suspense fallback={null}>
        <LibraryScene />
      </Suspense>
    </main>
  );
}
