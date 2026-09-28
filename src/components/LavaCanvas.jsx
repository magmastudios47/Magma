import { useEffect, useRef } from 'react';

export default function LavaCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Lava blobs
    const BLOBS = 8;
    const blobs = Array.from({ length: BLOBS }, (_, i) => ({
      x: (canvas.width / BLOBS) * i + Math.random() * 80,
      y: canvas.height * (0.5 + Math.random() * 0.5),
      r: 60 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.3 + 0.1),
      color: [`rgba(255,59,0,`, `rgba(255,120,0,`, `rgba(255,180,0,`, `rgba(200,30,0,`][
        Math.floor(Math.random() * 4)
      ],
    }));

    // Particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 400,
      r: Math.random() * 3 + 1,
      alpha: Math.random(),
      vy: -(Math.random() * 1.2 + 0.5),
      vx: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r || b.x > w + b.r) b.vx *= -1;
        if (b.y < -b.r) { b.y = h + b.r; b.x = Math.random() * w; }

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color + '0.9)');
        grad.addColorStop(0.5, b.color + '0.5)');
        grad.addColorStop(1, b.color + '0)');
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.004;
        if (p.alpha <= 0) {
          p.y = h;
          p.x = Math.random() * w;
          p.alpha = 0.8 + Math.random() * 0.2;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, ${p.alpha})`;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}
