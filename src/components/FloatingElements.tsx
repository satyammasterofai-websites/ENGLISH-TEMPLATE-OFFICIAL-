import React, { useEffect, useState } from 'react';

const Sakura = () => (
  <svg width="22" height="22" viewBox="0 0 100 100" className="drop-shadow-sm opacity-90">
    <path fill="#fbcfe8" d="M50 50 C 30 10, 70 10, 50 50 Z" transform="rotate(0 50 50)" />
    <path fill="#fbcfe8" d="M50 50 C 30 10, 70 10, 50 50 Z" transform="rotate(72 50 50)" />
    <path fill="#fbcfe8" d="M50 50 C 30 10, 70 10, 50 50 Z" transform="rotate(144 50 50)" />
    <path fill="#fbcfe8" d="M50 50 C 30 10, 70 10, 50 50 Z" transform="rotate(216 50 50)" />
    <path fill="#fbcfe8" d="M50 50 C 30 10, 70 10, 50 50 Z" transform="rotate(288 50 50)" />
    <circle cx="50" cy="50" r="7" fill="#f472b6" />
  </svg>
);

const Petal = () => (
  <svg width="14" height="14" viewBox="0 0 100 100" className="drop-shadow-sm opacity-90">
    <path fill="#fce7f3" d="M50 90 Q20 60, 40 20 C50 10, 70 30, 50 90 Z" />
  </svg>
);

const Leaf = () => (
  <svg width="16" height="16" viewBox="0 0 100 100" className="drop-shadow-sm opacity-80">
    <path fill="#bbf7d0" d="M10 90 Q10 30, 90 10 Q90 70, 10 90 Z" />
  </svg>
);

const YellowFlower = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" className="drop-shadow-sm opacity-90">
    <path fill="#fef08a" d="M50 50 C 35 15, 65 15, 50 50 Z" transform="rotate(0 50 50)" />
    <path fill="#fef08a" d="M50 50 C 35 15, 65 15, 50 50 Z" transform="rotate(60 50 50)" />
    <path fill="#fef08a" d="M50 50 C 35 15, 65 15, 50 50 Z" transform="rotate(120 50 50)" />
    <path fill="#fef08a" d="M50 50 C 35 15, 65 15, 50 50 Z" transform="rotate(180 50 50)" />
    <path fill="#fef08a" d="M50 50 C 35 15, 65 15, 50 50 Z" transform="rotate(240 50 50)" />
    <path fill="#fef08a" d="M50 50 C 35 15, 65 15, 50 50 Z" transform="rotate(300 50 50)" />
    <circle cx="50" cy="50" r="10" fill="#facc15" />
  </svg>
);

const ELEMENTS = [Sakura, Petal, Petal, Petal, Leaf, YellowFlower];
const FLOWER_COUNT = 15;

export default function FloatingElements() {
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: FLOWER_COUNT }).map((_, i) => {
      const ElementComp = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
      const left = Math.random() * 100;
      const animationDuration = 15 + Math.random() * 25; // Slower falling, 15s to 40s
      const animationDelay = -Math.random() * 40; // Spread out start times
      const size = 0.5 + Math.random() * 1.5; // Scale from 0.5 to 2.0
      const swayAmplitude = 20 + Math.random() * 80;
      const rotationSpeed = 5 + Math.random() * 15;
      const rotationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
      
      return {
        id: i,
        Component: ElementComp,
        left,
        animationDuration,
        animationDelay,
        size,
        swayAmplitude,
        rotationSpeed,
        rotationDirection
      };
    });
    setElements(newElements);
  }, []);

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes float-fall {
          0% {
            transform: translateY(-10vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        @keyframes float-sway {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(var(--sway));
          }
        }
        @keyframes float-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${el.left}vw`,
            animation: `float-fall ${el.animationDuration}s linear infinite`,
            animationDelay: `${el.animationDelay}s`,
            '--sway': `${el.swayAmplitude}px`
          } as React.CSSProperties}
        >
          <div
            className="will-change-transform"
            style={{
              animation: `float-sway ${el.animationDuration / 2}s ease-in-out infinite`,
              animationDelay: `${el.animationDelay}s`,
            }}
          >
            <div
              className="will-change-transform"
              style={{
                transform: `scale(${el.size})`,
                animation: `float-spin ${el.rotationSpeed}s linear infinite ${el.rotationDirection}`,
              }}
            >
              <el.Component />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
