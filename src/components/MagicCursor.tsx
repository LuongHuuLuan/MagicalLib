'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
}

export default function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const spawnParticles = useCallback((x: number, y: number) => {
    for (let i = 0; i < 4; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 0.5,
        life: 1.0,
        size: Math.random() * 4 + 2,
        hue: Math.random() * 60 + 30, // gold 30-90
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      spawnParticles(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0.01);
      for (const p of particlesRef.current) {
        p.life -= 0.035;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.05; // float up

        if (p.life <= 0) continue;
        const alpha = p.life;
        const r = p.size * p.life;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 85%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw wand cursor
      const { x, y } = mouseRef.current;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4); // 45°

      // Wand shaft
      const shaftGrad = ctx.createLinearGradient(-18, 0, 16, 0);
      shaftGrad.addColorStop(0, 'rgba(255,240,180,0.95)');
      shaftGrad.addColorStop(0.5, 'rgba(200,160,80,0.85)');
      shaftGrad.addColorStop(1, 'rgba(100,60,20,0.7)');
      ctx.strokeStyle = shaftGrad;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(16, 0);
      ctx.stroke();

      // Wand handle wrap (decorative rings)
      ctx.strokeStyle = 'rgba(255,200,80,0.6)';
      ctx.lineWidth = 1;
      for (let i = 6; i <= 14; i += 4) {
        ctx.beginPath();
        ctx.arc(i, 0, 1.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Tip glow star
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(255,220,50,0.9)';
      const tipGrad = ctx.createRadialGradient(-18, 0, 0, -18, 0, 10);
      tipGrad.addColorStop(0, 'rgba(255,255,220,1)');
      tipGrad.addColorStop(0.3, 'rgba(255,210,50,0.9)');
      tipGrad.addColorStop(1, 'rgba(255,100,50,0)');
      ctx.fillStyle = tipGrad;
      ctx.beginPath();
      ctx.arc(-18, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Star sparkle at tip
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'white';
      ctx.font = '10px serif';
      ctx.fillText('✦', -23, 4);

      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [spawnParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
