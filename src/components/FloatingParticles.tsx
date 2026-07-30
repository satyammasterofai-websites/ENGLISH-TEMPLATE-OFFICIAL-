import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingParticles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate static sparkles to avoid hydration mismatch, 
    // but random enough for a natural feel
    const generated = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // %
      y: Math.random() * 100, // %
      size: Math.random() * 4 + 1.5, // 1.5px to 5.5px
      duration: Math.random() * 25 + 15, // 15s to 40s (very slow)
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.2, // 0.2 to 0.7
    }));
    setSparkles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-gradient-to-tr from-amber-200 via-gold-400 to-yellow-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
          animate={{
            y: [0, -150], // Float upwards slowly
            x: [0, (sparkle.id % 2 === 0 ? 40 : -40)], // Gentle swaying
            opacity: [0, sparkle.opacity, sparkle.opacity, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            y: {
              duration: sparkle.duration,
              repeat: Infinity,
              ease: "linear",
            },
            x: {
              duration: sparkle.duration * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            },
            opacity: {
              duration: sparkle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            },
            delay: sparkle.delay,
          }}
        />
      ))}
    </div>
  );
}
