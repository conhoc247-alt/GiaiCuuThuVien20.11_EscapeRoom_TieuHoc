import React, { useEffect, useRef } from 'react';

interface MagicDustOverlayProps {
  /** Key or counter that increments/changes whenever a new room is opened */
  triggerKey: number | string;
  /** Whether a room transition is currently active */
  isTransitioning?: boolean;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  glowColor: string;
  life: number;
  maxLife: number;
  isStarShape: boolean;
}

const DUST_COLORS = [
  { fill: '#FFD700', glow: 'rgba(255, 215, 0, 0.85)' },
  { fill: '#FFF9AE', glow: 'rgba(255, 249, 174, 0.8)' },
  { fill: '#FFE066', glow: 'rgba(255, 224, 102, 0.8)' },
  { fill: '#FDE047', glow: 'rgba(253, 224, 71, 0.75)' },
  { fill: '#ADEFD1', glow: 'rgba(173, 239, 209, 0.55)' },
];

export const MagicDustOverlay: React.FC<MagicDustOverlayProps> = ({
  triggerKey,
  isTransitioning = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const burstUntilRef = useRef<number>(0);

  // Trigger a fresh burst of golden magic dust whenever a room is opened
  useEffect(() => {
    burstUntilRef.current = performance.now() + 5500;
  }, [triggerKey, isTransitioning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: DustParticle[] = [];

    const createParticle = (spawnMode: 'ambient' | 'edge-burst' | 'center-swirl'): DustParticle => {
      // Favor golden hues (first 4 entries) to synchronize with Task 1 scroll magic dust
      const paletteIndex =
        Math.random() < 0.88
          ? Math.floor(Math.random() * 4)
          : DUST_COLORS.length - 1;
      const palette = DUST_COLORS[paletteIndex];

      let x = Math.random() * width;
      let y = Math.random() * height;
      let vx = (Math.random() - 0.5) * 0.65;
      let vy = -Math.random() * 0.7 - 0.2;

      if (spawnMode === 'edge-burst') {
        // Spawn around the periphery / doorway frame and drift inward & upward
        const side = Math.floor(Math.random() * 4);
        if (side === 0) {
          x = Math.random() * width * 0.25;
          y = Math.random() * height;
          vx = Math.random() * 1.1 + 0.2;
        } else if (side === 1) {
          x = width - Math.random() * width * 0.25;
          y = Math.random() * height;
          vx = -Math.random() * 1.1 - 0.2;
        } else if (side === 2) {
          x = Math.random() * width;
          y = height - Math.random() * height * 0.25;
          vy = -Math.random() * 1.3 - 0.35;
        } else {
          x = Math.random() * width;
          y = Math.random() * height * 0.25;
          vy = Math.random() * 0.8 + 0.15;
        }
      } else if (spawnMode === 'center-swirl') {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * Math.min(width, height) * 0.38;
        x = width / 2 + Math.cos(angle) * dist;
        y = height / 2 + Math.sin(angle) * dist;
        vx = Math.cos(angle) * (0.4 + Math.random() * 0.9);
        vy = Math.sin(angle) * (0.4 + Math.random() * 0.9) - 0.35;
      }

      const maxLife = 120 + Math.random() * 160;
      const radius = Math.random() < 0.22 ? 2.2 + Math.random() * 1.6 : 0.9 + Math.random() * 1.4;

      return {
        x,
        y,
        vx,
        vy,
        radius,
        baseAlpha: 0.45 + Math.random() * 0.55,
        alpha: 0,
        twinkleSpeed: 0.04 + Math.random() * 0.08,
        twinklePhase: Math.random() * Math.PI * 2,
        color: palette.fill,
        glowColor: palette.glow,
        life: 0,
        maxLife,
        isStarShape: radius > 2.1 || Math.random() < 0.25,
      };
    };

    // Initial burst of golden magic dust
    for (let i = 0; i < 65; i++) {
      const p = createParticle(i % 2 === 0 ? 'edge-burst' : 'center-swirl');
      p.life = Math.random() * 35;
      particles.push(p);
    }

    const drawFourPointSparkle = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number
    ) => {
      context.beginPath();
      const outer = size * 2.1;
      const inner = size * 0.45;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const nextAngle = angle + Math.PI / 4;
        const ox = cx + Math.cos(angle) * outer;
        const oy = cy + Math.sin(angle) * outer;
        const ix = cx + Math.cos(nextAngle) * inner;
        const iy = cy + Math.sin(nextAngle) * inner;
        if (i === 0) {
          context.moveTo(ox, oy);
        } else {
          context.lineTo(ox, oy);
        }
        context.lineTo(ix, iy);
      }
      context.closePath();
      context.fill();
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      const isBurstActive = now < burstUntilRef.current;
      const targetCount = isBurstActive ? 95 : 45;

      if (particles.length < targetCount) {
        const spawnCount = isBurstActive ? 3 : 1;
        for (let s = 0; s < spawnCount && particles.length < targetCount; s++) {
          particles.push(
            createParticle(
              isBurstActive
                ? Math.random() < 0.6
                  ? 'edge-burst'
                  : 'center-swirl'
                : 'ambient'
            )
          );
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;

        // Gentle magical wave drift
        p.x += p.vx + Math.sin(p.life * 0.03 + p.twinklePhase) * 0.22;
        p.y += p.vy;

        // Fade-in / Fade-out envelope combined with rapid sparkle twinkle
        const lifeRatio = p.life / p.maxLife;
        const envelope =
          lifeRatio < 0.18
            ? lifeRatio / 0.18
            : lifeRatio > 0.78
            ? Math.max(0, (1 - lifeRatio) / 0.22)
            : 1;

        const twinkle = 0.45 + 0.55 * Math.sin(p.life * p.twinkleSpeed + p.twinklePhase);
        p.alpha = p.baseAlpha * envelope * twinkle;

        if (
          p.life >= p.maxLife ||
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20
        ) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.isStarShape ? 12 : 8;
        ctx.shadowColor = p.glowColor;

        if (p.isStarShape) {
          drawFourPointSparkle(ctx, p.x, p.y, p.radius);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[60]"
      aria-hidden="true"
    />
  );
};
