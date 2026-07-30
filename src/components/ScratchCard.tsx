import React, { useEffect, useRef, useState } from "react";
import { Calendar, MapPin, Share2, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WeddingEvent } from "../types";
import { getGoogleCalendarLink } from "../utils";

interface ScratchCardProps {
  event: WeddingEvent;
}

export default function ScratchCard({ event }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isDrawingRef = useRef(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas responsive
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || isScratched) return;

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Draw metallic gold foil base
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#C59B27");
      gradient.addColorStop(0.3, "#F3E5AB");
      gradient.addColorStop(0.5, "#D4AF37");
      gradient.addColorStop(0.7, "#FFFDD0");
      gradient.addColorStop(1, "#AA7900");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a subtle border inside
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

      // Text styling
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

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isScratched]);

  // Scratch action handler
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2); // scratch brush radius 22px
    ctx.fill();

    checkScratchPercentage();
  };

  // Check how much of the foil has been cleared
  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;

      // Sample every 4th pixel to make computation ultra-fast
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentCount++;
        }
      }

      const totalSamples = pixels.length / 16;
      const percentCleared = (transparentCount / totalSamples) * 100;

      // Automatically reveal fully once scratched beyond 45%
      if (percentCleared > 45) {
        setIsScratched(true);
      }
    } catch (e) {
      console.error("Error evaluating canvas image data:", e);
    }
  };

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDrawingRef.current = true;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
  };

  // Auto Scratch helper for convenient accessibility
  const handleAutoReveal = () => {
    setIsScratched(true);
  };

  const handleShare = () => {
    const shareText = `Witness ${event.title} at ${event.venue} on ${event.date}! Join us: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const calendarLink = getGoogleCalendarLink({
    title: event.calendarTitle || event.title,
    date: event.calendarDate || "2026-09-12T15:30:00",
    venue: event.venue,
    details: event.details,
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm mx-auto h-[320px] rounded-2xl overflow-hidden bg-amber-100 border border-gold-400/30 shadow-2xl flex flex-col justify-between p-6"
    >
      {/* EVENT REVEALED CONTENT */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-widest font-sans font-semibold text-gold-200 uppercase">
            {event.id === "matrimony" ? "Sacrament of Matrimony" : "Wedding Event"}
          </span>
          <Sparkles className="w-4 h-4 text-gold-200 animate-pulse" />
        </div>

        <div className="my-2 text-left">
          <h3 className="font-serif text-2xl font-bold text-gold-200 tracking-wide mb-1">
            {event.title}
          </h3>
          <div className="h-[1px] w-16 bg-gold-400/30 my-3" />
          
          <div className="space-y-2.5 text-xs text-gray-700">
            <p className="flex items-center gap-2 font-serif text-gold-100">
              <Calendar className="w-3.5 h-3.5 text-gold-200 shrink-0" />
              <span>{event.date} • {event.time}</span>
            </p>
            <p className="flex items-start gap-2 text-gray-700 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-gold-200 shrink-0 mt-0.5" />
              <span>
                <strong>{event.venue}</strong>
                {event.details && <span className="block text-gray-600 text-[11px] mt-0.5">{event.details}</span>}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-4">
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-800 border border-gold-400/30 text-gold-200 hover:text-gold-100 hover:bg-emerald-700 text-[11px] font-sans font-medium uppercase tracking-wider transition-all"
          >
            Schedule
          </a>

          {event.mapsLink && (
            <a
              href={event.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gold-600 hover:bg-gold-500 text-emerald-50 text-[11px] font-sans font-semibold uppercase tracking-wider transition-all"
            >
              Directions
            </a>
          )}

          <button
            onClick={handleShare}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-800 border border-gold-400/30 text-gold-200 hover:text-gold-100 hover:bg-emerald-700 transition-all cursor-pointer"
            title="Share event details"
          >
            {isCopied ? <Check className="w-4 h-4 text-amber-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* REVEAL TOAST SUCCESS NOTIFICATION */}
      {isCopied && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-950 border border-amber-500 text-amber-200 text-[11px] rounded-full shadow-lg font-medium tracking-wide">
          Link copied!
        </div>
      )}

      {/* GOLD FOIL SCRATCH LAYER */}
      <AnimatePresence>
        {!isScratched && (
          <motion.div
            className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="absolute inset-0 w-full h-full block"
            />
            {/* Direct accessibility bypass button */}
            <button
              onClick={handleAutoReveal}
              id="scratch-reveal-btn"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-50/80 border border-gold-400/30 text-gold-200 text-[10px] rounded-full hover:bg-amber-100 shadow-md backdrop-blur-sm hover:text-gold-100 transition-all font-sans font-semibold uppercase tracking-widest cursor-pointer select-none"
            >
              Skip Scratch
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
