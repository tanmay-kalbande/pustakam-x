import React, { useEffect, useRef } from 'react';

interface TopoHeroBackgroundProps {
    className?: string;
}

const TopoHeroBackground: React.FC<TopoHeroBackgroundProps> = ({ className = '' }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const layersRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Mouse Parallax Logic
        const handleMouseMove = (e: MouseEvent) => {
            if (prefersReducedMotion) return;
            const x = (window.innerWidth / 2 - e.pageX) / 25;
            const y = (window.innerHeight / 2 - e.pageY) / 25;

            canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;

            layersRef.current.forEach((layer, index) => {
                if (!layer) return;
                const depth = (index + 1) * 15;
                const moveX = x * (index + 1) * 0.2;
                const moveY = y * (index + 1) * 0.2;
                layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px)`;
            });
        };

        // Entrance Animation
        canvas.style.opacity = '0';
        canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.8)';

        const timeout = setTimeout(() => {
            canvas.style.transition = prefersReducedMotion
                ? 'opacity 0.5s ease'
                : 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
            canvas.style.opacity = '1';
            canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
        }, 300);

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <>
            <style>{`
        .topo-viewport {
          perspective: 2000px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: absolute;
          inset: 0;
        }

        .topo-canvas-3d {
          position: relative;
          width: 900px;
          height: 600px;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .topo-layer {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(100, 150, 255, 0.06);
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }

        /* Layer 1: Deep space nebula — base layer */
        .topo-layer-1 {
          background-image: url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200');
          filter: contrast(1.3) brightness(0.3) saturate(0.6);
        }

        /* Layer 2: Galaxy / star field — screen blended */
        .topo-layer-2 {
          background-image: url('https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=1200');
          filter: contrast(1.2) brightness(0.45) saturate(0.5);
          opacity: 0.5;
          mix-blend-mode: screen;
        }

        /* Layer 3: Nebula dust clouds — overlay blended */
        .topo-layer-3 {
          background-image: url('https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&q=80&w=1200');
          filter: contrast(1.4) brightness(0.5) saturate(0.4);
          opacity: 0.35;
          mix-blend-mode: overlay;
        }

        .topo-contours {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background-image: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0,
            transparent 40px,
            rgba(100, 150, 255, 0.025) 41px,
            transparent 42px
          );
          transform: translateZ(120px);
          pointer-events: none;
        }

        .topo-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          opacity: 0.08;
        }

        .topo-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, rgba(100,150,255,0.3), transparent);
          animation: topo-flow 2s infinite ease-in-out;
          z-index: 5;
        }

        @keyframes topo-flow {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
        }

        @media (max-width: 768px) {
          .topo-canvas-3d {
            width: 500px;
            height: 350px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .topo-canvas-3d {
            transition: opacity 0.5s ease !important;
          }
          .topo-layer {
            transition: none !important;
          }
          .topo-scroll-hint {
            animation: none;
          }
        }
      `}</style>

            <div className={`topo-viewport ${className}`}>
                {/* SVG Filter for Grain */}
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                    <filter id="topo-grain-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                </svg>

                <div className="topo-grain" style={{ filter: 'url(#topo-grain-filter)' }} />

                <div className="topo-canvas-3d" ref={canvasRef}>
                    <div
                        className="topo-layer topo-layer-1"
                        ref={(el) => { if (el) layersRef.current[0] = el; }}
                    />
                    <div
                        className="topo-layer topo-layer-2"
                        ref={(el) => { if (el) layersRef.current[1] = el; }}
                    />
                    <div
                        className="topo-layer topo-layer-3"
                        ref={(el) => { if (el) layersRef.current[2] = el; }}
                    />
                    <div className="topo-contours" />
                </div>

                <div className="topo-scroll-hint" />
            </div>
        </>
    );
};

export default TopoHeroBackground;
