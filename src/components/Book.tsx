'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
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
    const totalBooks = 150;
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
      // FIX: lookAt outward so the cover (+Z) faces INWARD toward camera at center
      dummy.lookAt(sphereX * 2, sphereY * 2, sphereZ * 2);
      dummy.rotateY(Math.PI / 2);

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
      {/* Invisible hitbox */}
      <mesh>
        <boxGeometry args={[2.2, 3.0, 0.6]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0} />
      </mesh>

      {/* Spine */}
      <mesh position={[-0.76, 0, 0]}>
        <boxGeometry args={[0.10, 2.4, 0.36]} />
        <meshStandardMaterial color={data.coverColor} roughness={0.8} />
      </mesh>

      {/* Front Cover */}
      <group position={[-0.73, 0, 0.18]} ref={coverRef}>
        <mesh position={[0.73, 0, 0]}>
          <boxGeometry args={[1.46, 2.4, 0.08]} />
          <meshStandardMaterial color={theme.bg} roughness={0.7} />
          <Html transform position={[0, 0, 0.042]} distanceFactor={4.5} zIndexRange={[100, 0]}>
            {/* Rich CSS Book Cover */}
            <div style={{
              width: '144px',
              height: '224px',
              background: `linear-gradient(160deg, ${theme.bg} 0%, #000 100%)`,
              border: `2px solid ${theme.accent}55`,
              borderRadius: '3px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 8px',
              boxSizing: 'border-box',
              boxShadow: `inset 0 0 20px ${theme.accent}22, 0 0 15px ${theme.accent}33`,
              overflow: 'hidden',
              position: 'relative',
              pointerEvents: 'none',
            }}>
              {/* Corner ornaments */}
              {['0 0', '0 auto', 'auto 0', 'auto auto'].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  [i < 2 ? 'top' : 'bottom']: '5px',
                  [i % 2 === 0 ? 'left' : 'right']: '5px',
                  width: '14px', height: '14px',
                  borderTop: i < 2 ? `1.5px solid ${theme.accent}` : 'none',
                  borderBottom: i >= 2 ? `1.5px solid ${theme.accent}` : 'none',
                  borderLeft: i % 2 === 0 ? `1.5px solid ${theme.accent}` : 'none',
                  borderRight: i % 2 !== 0 ? `1.5px solid ${theme.accent}` : 'none',
                }} />
              ))}

              {/* Category badge */}
              <div style={{
                background: theme.badge,
                border: `1px solid ${theme.accent}66`,
                borderRadius: '2px',
                padding: '2px 8px',
                fontSize: '8px',
                color: theme.accent,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'serif',
                zIndex: 1,
              }}>
                {data.category}
              </div>

              {/* Decorative divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${theme.accent}88)` }} />
                <span style={{ color: theme.accent, fontSize: '10px' }}>{theme.pattern}</span>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${theme.accent}88)` }} />
              </div>

              {/* Main symbol */}
              <div style={{
                fontSize: '44px',
                lineHeight: 1,
                filter: `drop-shadow(0 0 12px ${theme.accent})`,
                textAlign: 'center',
              }}>
                {data.symbol}
              </div>

              {/* Decorative divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${theme.accent}88)` }} />
                <span style={{ color: theme.accent, fontSize: '10px' }}>{theme.pattern}</span>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${theme.accent}88)` }} />
              </div>

              {/* Book title */}
              <div style={{
                color: '#fff',
                fontSize: '11px',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                textAlign: 'center',
                lineHeight: '1.35',
                textShadow: `0 0 10px ${theme.accent}99`,
                padding: '0 4px',
                zIndex: 1,
              }}>
                {data.title}
              </div>

              {/* Bottom publisher label */}
              <div style={{
                color: `${theme.accent}88`,
                fontSize: '7px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'serif',
              }}>
                Thư Viện Cổ Tích
              </div>
            </div>
          </Html>
        </mesh>
      </group>

      {/* Back Cover */}
      <mesh position={[0, 0, -0.18]} receiveShadow rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[1.52, 2.4, 0.08]} />
        <meshStandardMaterial color={data.coverColor} roughness={0.4} metalness={0.3} />
        <Html transform position={[0, 0, 0.042]} distanceFactor={4.5} zIndexRange={[100, 0]}>
          <div style={{
            width: '144px', height: '224px',
            background: `linear-gradient(180deg, #0a0a0a 0%, #1a1209 100%)`,
            border: `1px solid ${theme.accent}33`,
            borderRadius: '3px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '16px 12px', boxSizing: 'border-box',
            opacity: 0.7, pointerEvents: 'none', gap: '8px',
          }}>
            <div style={{ color: `${theme.accent}99`, fontSize: '20px' }}>{theme.pattern}</div>
            <div style={{ color: `${theme.accent}66`, fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'serif', textAlign: 'center' }}>
              Thư Viện<br/>Huyền Bí
            </div>
            <div style={{ width: '40px', height: '1px', background: `${theme.accent}44` }} />
            <div style={{ color: `${theme.accent}44`, fontSize: '7px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'serif' }}>Bản Chép Tay</div>
          </div>
        </Html>
      </mesh>

      {/* Pages Block */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.43, 2.28, 0.28]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.6} />
      </mesh>

      {/* Title Label on hover */}
      {(hovered && !isSelected) && (
        <Html position={[0, 1.6, 0]} center distanceFactor={10} zIndexRange={[50, 0]}>
          <div style={{
            background: 'rgba(0,0,0,0.92)',
            border: `1px solid ${theme.accent}66`,
            padding: '6px 14px', borderRadius: '6px',
            whiteSpace: 'nowrap', pointerEvents: 'none',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ color: `${theme.accent}99`, fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'serif', marginBottom: '2px' }}>{data.category}</div>
            <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'Georgia, serif', fontStyle: 'italic', textShadow: `0 0 8px ${theme.accent}` }}>{data.title}</div>
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
