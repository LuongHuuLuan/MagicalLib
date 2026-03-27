'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useCursor, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { BookData, useLibraryStore } from '@/lib/store';
import { audioSystem } from '@/lib/audio';
import gsap from 'gsap';

interface BookProps {
  data: BookData;
}

// Category-based cover themes
const CATEGORY_THEMES: Record<string, { bg: string; accent: string; badge: string; pattern: string }> = {
  'Cổ tích':     { bg: '#2a1505', accent: '#f5a623', badge: '#7a3f00',  pattern: '✦' },
  'Truyền thuyết':{ bg: '#0d1f3c', accent: '#4fc3f7', badge: '#1a3a6b',  pattern: '⚜' },
  'Thần thoại':  { bg: '#1a0530', accent: '#ce93d8', badge: '#4a0080',  pattern: '✵' },
  'Ngụ ngôn':    { bg: '#0f2318', accent: '#81c784', badge: '#1b5e20',  pattern: '❧' },
};

const DEFAULT_THEME = { bg: '#1a1209', accent: '#ffd700', badge: '#3a2800', pattern: '✦' };

export default function Book({ data }: BookProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coverRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectedBookId = useLibraryStore((state) => state.selectedBookId);
  const selectBook = useLibraryStore((state) => state.selectBook);
  const setHoveredBook = useLibraryStore((state) => state.setHoveredBook);
  const searchQuery = useLibraryStore((state) => state.searchQuery);

  // Cached vector and dummy object to avoid allocations in useFrame
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targetScaleVec = useMemo(() => new THREE.Vector3(), []);

  const isSelected = selectedBookId === data.id;
  const isSearchMatch = searchQuery === '' || data.title.toLowerCase().includes(searchQuery.toLowerCase());

  const AURA_COLORS = ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96', '#ff8c00', '#00ffcc'];
  const bookAuraColor = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < data.id.length; i++) {
      hash = data.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AURA_COLORS[Math.abs(hash) % AURA_COLORS.length];
  }, [data.id]);

  const theme = CATEGORY_THEMES[data.category as string] ?? DEFAULT_THEME;
  const camera = useThree((state) => state.camera);
  const distanceToCamera = useMemo(() => new THREE.Vector3(), []);

  const wasSelected = useRef(false);

  useEffect(() => {
    if (isSelected && !wasSelected.current) {
      audioSystem.playSFX('open');
      gsap.to(groupRef.current!.position, { x: 0, y: -0.5, z: 5.5, duration: 1.5, ease: 'power3.inOut' });
      gsap.to(groupRef.current!.rotation, { x: -Math.PI / 8, y: 0, z: 0, duration: 1.5, ease: 'power3.inOut' });
      if (coverRef.current) {
        gsap.to(coverRef.current.rotation, { y: -Math.PI * 0.85, duration: 1.2, delay: 0.5, ease: 'power2.inOut' });
      }
    } else if (!isSelected && wasSelected.current) {
      audioSystem.playSFX('page');
      if (coverRef.current) {
        gsap.to(coverRef.current.rotation, { y: 0, duration: 1, ease: 'power2.inOut' });
      }
    }
    wasSelected.current = isSelected;
  }, [isSelected]);

  useCursor(hovered);

  useFrame((state) => {
    if (!groupRef.current || isSelected) return;

    const t = state.clock.getElapsedTime();

    if (searchQuery && !isSearchMatch) {
      targetVec.set(data.position[0], data.position[1] - 10, data.position[2]);
      groupRef.current.position.lerp(targetVec, 0.05);
      return;
    }

    if (searchQuery && isSearchMatch) {
      const angle = t * 2 + parseInt(data.id.replace(/\D/g, '')) * 0.5;
      const radius = 2 + Math.sin(t) * 0.5;
      targetVec.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 5);
      groupRef.current.position.lerp(targetVec, 0.05);
      groupRef.current.rotation.y += 0.05;
      return;
    }

    const index = parseInt(data.id.replace(/\D/g, ''));

    // Zoom-based Formation logic
    const distance = state.camera.position.length();
    let formationFactor = 1 - (distance - 30) / (70 - 30);
    formationFactor = Math.max(0, Math.min(1, formationFactor));
    formationFactor = Math.pow(formationFactor, 3);

    // Fibonacci Sphere
    const totalBooks = 80; // Match INITIAL_BOOKS in LibraryScene
    const sphereRadius = 25;
    const phi = Math.acos(1 - 2 * (index + 0.5) / totalBooks);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;

    const sphereX = Math.cos(theta) * Math.sin(phi) * sphereRadius;
    const sphereY = Math.cos(phi) * sphereRadius;
    const sphereZ = Math.sin(theta) * Math.sin(phi) * sphereRadius;

    const targetX = THREE.MathUtils.lerp(data.position[0], sphereX, formationFactor);
    const targetY = THREE.MathUtils.lerp(data.position[1], sphereY, formationFactor);
    const targetZ = THREE.MathUtils.lerp(data.position[2], sphereZ, formationFactor);

    let targetRotX = data.rotation[0];
    let targetRotY = data.rotation[1] + Math.sin(t * 0.5 + index) * 0.1;
    let targetRotZ = data.rotation[2] + Math.sin(t * 0.3) * 0.05;

    if (formationFactor > 0.01) {
      dummy.position.set(sphereX, sphereY, sphereZ);
      // lookAt outward → local +Z points INWARD (toward camera at center) ✓
      // NO rotateY: that was rotating the cover 90° sideways, breaking the fix
      dummy.lookAt(sphereX * 2, sphereY * 2, sphereZ * 2);

      targetRotX = THREE.MathUtils.lerp(targetRotX, dummy.rotation.x, formationFactor);
      targetRotY = THREE.MathUtils.lerp(targetRotY, dummy.rotation.y, formationFactor);
      targetRotZ = THREE.MathUtils.lerp(targetRotZ, dummy.rotation.z, formationFactor);
    }

    const floatY = Math.sin(t + index) * 0.1;
    targetVec.set(targetX, targetY + floatY, targetZ);
    groupRef.current.position.lerp(targetVec, 0.1);

    const isClose = isSelected && groupRef.current.position.z > 2.0;
    const targetCoverOpen = isClose ? -Math.PI * 0.8 : 0;
    if (coverRef.current) {
      coverRef.current.rotation.y = THREE.MathUtils.lerp(coverRef.current.rotation.y, targetCoverOpen, 0.12);
    }

    const targetScale = isSelected ? 1.5 : (hovered ? 1.2 : 1.0);
    targetScaleVec.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(targetScaleVec, 0.1);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isSelected) {
      selectBook(null);
    } else {
      audioSystem.playSFX('sparkle');
      selectBook(data.id);
    }
  };

  const isActive = hovered || isSelected;

  return (
    <group
      ref={groupRef}
      position={data.position}
      rotation={data.rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredBook(data.id);
        audioSystem.playSFX('hover');
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredBook(null);
      }}
    >
      {/* Much larger invisible hitbox for easier hovering/clicking */}
      <mesh>
        <boxGeometry args={[3.5, 4.5, 1.2]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0} />
      </mesh>

      {/* Spine */}
      <mesh position={[-0.76, 0, 0]}>
        <boxGeometry args={[0.10, 2.4, 0.36]} />
        <meshStandardMaterial color={data.coverColor} rough      {/* Front Cover - only show HTML when close or selected for performance */}
      <group position={[-0.73, 0, 0.18]} ref={coverRef}>
        <mesh position={[0.73, 0, 0]}>
          <boxGeometry args={[1.46, 2.4, 0.08]} />
          <meshStandardMaterial color={data.coverColor} roughness={0.7} />
          {(isSelected || hovered || (groupRef.current && camera.position.distanceTo(groupRef.current.position) < 45)) && (
            <Html transform position={[0, 0, 0.042]} distanceFactor={4.5} zIndexRange={[100, 0]} pointerEvents="none">
              <div className="w-36 h-56 flex flex-col items-center justify-center p-4 text-center pointer-events-none bg-black/40 backdrop-blur-sm border border-amber-500/20">
                <div className="text-amber-500/80 text-5xl mb-4 drop-shadow-lg">{data.symbol}</div>
                <div className="text-amber-200/50 text-[10px] font-serif uppercase tracking-[0.3em] mb-1">Thiên Thư</div>
                <div className="text-white text-base font-serif italic text-amber-500/50 drop-shadow-[0_0_8px_rgba(255,191,0,0.4)] leading-tight">{data.title}</div>
              </div>
            </Html>
          )}
        </mesh>
      </group>  )}
        </mesh>
      </group>

      {/* Back Cover - Simplified for performance (Removed HTML) */}
      <mesh position={[0, 0, -0.18]} receiveShadow rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[1.52, 2.4, 0.08]} />
        <meshStandardMaterial color={data.coverColor} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Pages Block */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.43, 2.28, 0.28]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.6} />
      </mesh>

      {/* Title Label on hover */}
      {(hovered && !isSelected) && (
        <Html position={[0, 2.2, 0]} center distanceFactor={5} zIndexRange={[50, 0]} pointerEvents="none">
          <div style={{
            background: 'rgba(5, 5, 5, 0.95)',
            border: `2px solid ${theme.accent}`,
            padding: '12px 24px', borderRadius: '10px',
            whiteSpace: 'nowrap', pointerEvents: 'none',
            boxShadow: `0 0 30px ${theme.accent}66`,
            transform: 'scale(1.2)',
          }}>
            <div style={{ color: theme.accent, fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'serif', marginBottom: '6px', textAlign: 'center' }}>{data.category}</div>
            <div style={{ color: '#fff', fontSize: '24px', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 'bold', textShadow: `0 0 15px ${theme.accent}`, textAlign: 'center', maxWidth: '300px', lineHeight: '1.2' }}>{data.title}</div>
          </div>
        </Html>
      )}

      {/* Edge Glow Aura */}
      <mesh position={[-0.05, 0, 0]}>
        <boxGeometry args={[1.8, 2.6, 0.6]} />
        <meshBasicMaterial
          color={bookAuraColor}
          transparent
          opacity={isActive ? 0.35 : 0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Sparkles only on selected */}
      {isSelected && (
        <Sparkles count={20} scale={2.5} size={4} speed={0.3} opacity={0.9} color="#ffbf00" />
      )}
    </group>
  );
}
