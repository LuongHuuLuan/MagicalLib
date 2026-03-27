'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Environment, Sparkles } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { useLibraryStore, BookData } from '@/lib/store';
import Book from './Book';
import SearchBar from './SearchBar';
import Reader from './Reader';
import StartOverlay from './StartOverlay';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useState } from 'react';
import { VIETNAMESE_TALES } from '@/lib/data';

const WOOD_COLORS = ['#3d2b1f', '#1a3c1a', '#4a3728', '#2d5a27', '#3a5f0b', '#1f1f1f', '#5c4033', '#7a4a2b', '#2b1b0f', '#6b8e23', '#101d10', '#8b4513'];
const SYMBOLS = ['🌳', '🌿', 'ᛖ', '☾', '✿', '🐺', '🍄', '⚡', '🧬', '♪', '👁', '☄', '🍁', '🍃', '🕯️', '🗝️'];
const TITLES = ['Whispers', 'Chronicles', 'Runes', 'Roots', 'Glade', 'Midnight', 'Fairy', 'Amber', 'Sylvan', 'Canopy', 'Shadow', 'Golden', 'Mystic', 'Ancient', 'Lost', 'Forgotten'];
const SUFFIXES = ['of the Oak', 'of Moss', 'of Bark', 'of Stars', 'of the Grove', 'of Time', 'of Dreams', 'of the Fae', 'of Leaves', 'of Earth'];
const generateBooks = (count: number): BookData[] => {
  return Array.from({ length: count }, (_, i) => {
    const tale = VIETNAMESE_TALES[i % VIETNAMESE_TALES.length];
    return {
      id: `book-${i}`,
      title: `${tale.title} (Bản thứ ${Math.floor(i / VIETNAMESE_TALES.length) + 1})`,
      description: tale.description,
      content: tale.content,
      coverColor: WOOD_COLORS[Math.floor(Math.random() * WOOD_COLORS.length)],
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      category: tale.category,
      origin: tale.origin,
      moral: tale.moral,
      position: [
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60,
        -10 - Math.random() * 80
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
    };
  });
};

const INITIAL_BOOKS = generateBooks(80);

function HoverLight() {
  const hoveredBookId = useLibraryStore((state) => state.hoveredBookId);
  const selectedBookId = useLibraryStore((state) => state.selectedBookId);
  const books = useLibraryStore((state) => state.books);

  const lightRef = useRef<THREE.PointLight>(null);
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const intensity = useRef(0);

  useFrame(() => {
    if (!lightRef.current) return;

    if (hoveredBookId && !selectedBookId) {
      const book = books.find(b => b.id === hoveredBookId);
      if (book) {
        targetPosition.current.set(book.position[0], book.position[1], book.position[2] + 1);
        intensity.current = THREE.MathUtils.lerp(intensity.current, 5, 0.1);
      }
    } else {
      intensity.current = THREE.MathUtils.lerp(intensity.current, 0, 0.1);
    }

    lightRef.current.position.lerp(targetPosition.current, 0.1);
    lightRef.current.intensity = intensity.current;
  });

  return (
    <pointLight
      ref={lightRef}
      distance={8}
      color="#4facfe"
    />
  );
}

function SceneContent() {
  const books = useLibraryStore((state) => state.books);
  const selectedBookId = useLibraryStore((state) => state.selectedBookId);
  const activeCategory = useLibraryStore((state) => state.activeCategory);

  const selectedBook = books.find(b => b.id === selectedBookId);
  const displayBooks = activeCategory === 'Tất cả' ? books : books.filter(b => b.category === activeCategory);

  const orbitRef = useRef<any>(null);
  const savedPos = useRef(new THREE.Vector3(0, 0, 25));
  const isReturning = useRef(false);

  useFrame((state) => {
    if (!orbitRef.current) return;

    if (selectedBookId) {
      orbitRef.current.enabled = false;
      state.camera.position.lerp(new THREE.Vector3(0, 1.5, 10.5), 0.05);
      state.camera.lookAt(0, -0.5, 4);
      isReturning.current = true;
    } else if (isReturning.current) {
      orbitRef.current.enabled = false;
      state.camera.position.lerp(savedPos.current, 0.08);
      state.camera.lookAt(0, 0, 0); // Target center

      if (state.camera.position.distanceTo(savedPos.current) < 0.5) {
        state.camera.position.copy(savedPos.current);
        state.camera.lookAt(0, 0, 0);
        isReturning.current = false;
        orbitRef.current.enabled = true;
      }
    } else {
      orbitRef.current.enabled = true;
      savedPos.current.copy(state.camera.position);
    }
  });

  return (
    <>
      <color attach="background" args={['#020502']} />
      <fog attach="fog" args={['#020502', 15, 120]} />
      <ambientLight intensity={0.4} />

      {/* Dynamic Light for Selected Book */}
      {selectedBook && (
        <pointLight
          position={[selectedBook.position[0], selectedBook.position[1], selectedBook.position[2] + 1]}
          intensity={10}
          distance={10}
          color="#ffbf00"
        />
      )}

      {/* Dynamic Light for Hovered Book */}
      <HoverLight />

      <pointLight position={[15, 25, 10]} intensity={4} color="#ffbf00" />
      <pointLight position={[-20, -15, -30]} intensity={3} color="#2d5a27" />

      <Stars radius={150} depth={80} count={6000} factor={7} saturation={0} fade speed={1.5} />

      {/* Dense Background Galaxy (The 'Hundreds of Books' illusion) */}
      <Sparkles count={800} scale={[100, 80, 100]} size={2} speed={0.3} opacity={0.4} color="#90ee90" />
      <Sparkles count={400} scale={[80, 60, 80]} size={3.5} speed={0.5} opacity={0.3} color="#ffbf00" />

      {displayBooks.map((book) => (
        <Book key={book.id} data={book} />
      ))}

      <Environment preset="forest" />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      <OrbitControls
        ref={orbitRef}
        enablePan={false}
        minDistance={0.1}
        maxDistance={100}
        makeDefault
      />
    </>
  );
}

export default function LibraryScene() {
  const setBooks = useLibraryStore((state) => state.setBooks);
  const selectedBookId = useLibraryStore((state) => state.selectedBookId);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setBooks(INITIAL_BOOKS);
  }, [setBooks]);

  return (
    <div className="relative w-full h-screen bg-[#050505]">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, started ? 12 : 25]} fov={50} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {!started ? (
        <StartOverlay onStart={() => setStarted(true)} />
      ) : (
        <>
          <SearchBar />
          {selectedBookId && <Reader />}
        </>
      )}

      {/* Background Ambience Layer */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
