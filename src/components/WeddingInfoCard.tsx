import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin } from "lucide-react";
import confetti from "canvas-confetti";

interface WeddingInfoCardProps {
  date: string;
  time: string;
  venue: string;
  mapsLink?: string;
}

export default function WeddingInfoCard({ date, time, venue, mapsLink }: WeddingInfoCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
        drawOverlay();
      }
    };

    const drawOverlay = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#C59B27");
      gradient.addColorStop(0.3, "#F3E5AB");
      gradient.addColorStop(0.5, "#D4AF37");
      gradient.addColorStop(0.7, "#FFFDD0");
      gradient.addColorStop(1, "#AA7900");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

      ctx.fillStyle = "#3E2723";
      ctx.font = "bold 20px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillText("✨ Scratch to Reveal ✨", canvas.width / 2, canvas.height / 2);
      ctx.shadowBlur = 0;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let isDrawing = false;
    let hasScratchedAtAll = false;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ("touches" in e) ? e.touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
      const y = ("touches" in e) ? e.touches[0].clientY - rect.top : (e as MouseEvent).clientY - rect.top;
      return { x, y };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      hasScratchedAtAll = true;
      scratch(e);
    };

    const stopDrawing = () => {
      isDrawing = false;
      if (hasScratchedAtAll) {
        checkReveal();
      }
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      if (e.cancelable) e.preventDefault();
      
      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();
    };

    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let clearPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
      }
      
      const totalPixels = pixels.length / 4;
      if (clearPixels / totalPixels > 0.4) {
        setIsRevealed(true);
        canvas.style.opacity = "0";
        setTimeout(() => {
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }, 500);

        // Celebration animation for 4 seconds
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults, particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults, particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);
      }
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", scratch, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      // Event listeners are auto-cleaned if canvas is removed, but good practice
    };
  }, [isRevealed]);

  return (
    <div className="w-full max-w-xl mx-auto mb-16 relative px-4">
      
      {/* Revealed Heading */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h3 className="font-serif text-3xl md:text-4xl text-gold-200 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(218,165,32,0.5)]">
              You Are Invited
            </h3>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        className="relative bg-amber-100 border border-gold-400/30 rounded-xl overflow-hidden shadow-2xl min-h-[140px] flex items-center justify-center p-6"
      >
        {/* The hidden content */}
        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between opacity-100 z-10 transition-opacity duration-1000">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-gold-900/30 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-gold-200" />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-gray-600 uppercase tracking-widest font-sans">Date</p>
              <p className="text-gold-100 font-serif text-base">{date}</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-gold-900/40" />

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-gold-900/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-gold-200" />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-gray-600 uppercase tracking-widest font-sans">Time</p>
              <p className="text-gold-100 font-serif text-base">{time}</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-gold-900/40" />

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-gold-900/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-gold-200" />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-gray-600 uppercase tracking-widest font-sans">Venue</p>
              {mapsLink ? (
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-gold-100 font-serif text-base hover:text-gold-300 underline underline-offset-4 decoration-gold-600/50">
                  {venue}
                </a>
              ) : (
                <p className="text-gold-100 font-serif text-base">{venue}</p>
              )}
            </div>
          </div>

        </div>

        {/* The scratchable overlay canvas */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-20 cursor-crosshair touch-none transition-opacity duration-500 rounded-xl"
          />
        )}
      </div>
    </div>
  );
}
