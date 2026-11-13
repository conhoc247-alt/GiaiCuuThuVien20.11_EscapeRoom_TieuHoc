import React, { useEffect, useRef } from 'react';

interface FireworksCanvasProps {
  active?: boolean;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let intervalId: NodeJS.Timeout;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface Firework {
      x: number;
      y: number;
      targetY: number;
      speed: number;
      vy: number;
      exploded: boolean;
    }

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
    }

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];

    const createParticles = (x: number, y: number) => {
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particles.push({
          x,
          y,
          radius: Math.random() * 2 + 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
        });
      }
    };

    intervalId = setInterval(() => {
      if (active) {
        fireworks.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          targetY: Math.random() * (canvas.height / 2),
          speed: Math.random() * 3 + 4,
          vy: -(Math.random() * 3 + 4),
          exploded: false,
        });
      }
    }, 1500);

    const loop = () => {
      ctx.fillStyle = 'rgba(0, 32, 63, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.y += fw.vy;
        if (fw.vy >= 0 || fw.y <= fw.targetY) {
          fw.exploded = true;
          createParticles(fw.x, fw.y);
          fireworks.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFE3';
          ctx.fill();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.03;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ADEFD1';
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(intervalId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-1"
    />
  );
};
