import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { WeddingEvent } from "../types";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

interface EventCarouselProps {
  events: WeddingEvent[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [pauseUntil, setPauseUntil] = useState<number>(0);

  // Auto-advance every 10 seconds, but respect interactions and pauses
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isInteracting && Date.now() > pauseUntil) {
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [events.length, isInteracting, pauseUntil]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setPauseUntil(0); // Reset pause on manual interaction
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setPauseUntil(0); // Reset pause on manual interaction
  };

  const event = events[currentIndex];

  if (!event) return null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 sm:px-6 md:px-8">
      <div className="w-full relative group flex flex-col md:flex-row items-stretch bg-amber-100/60 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold-200/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col md:flex-row"
        >
          {/* Thumbnail Image */}
          <div className="w-full md:w-5/12 aspect-video md:aspect-auto relative bg-amber-50">
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gold-900">
                <MapPin className="w-12 h-12 opacity-20" />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative">
            <span className="text-gold-200 text-[10px] uppercase tracking-[0.3em] font-sans mb-3 block">
              Event Details
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-gold-100 mb-6 drop-shadow-md">
              {event.title}
            </h3>

            {/* Date Scratch Card integration will be here */}
            <div className="mb-8">
              <EventDateScratchCard 
                date={event.date} 
                time={event.time} 
                onInteractionStart={() => setIsInteracting(true)}
                onInteractionEnd={() => setIsInteracting(false)}
                onRevealed={() => {
                  setIsInteracting(false);
                  setPauseUntil(Date.now() + 10000);
                }}
              />
            </div>

            <div className="space-y-6 text-gray-700 font-sans text-sm md:text-base">              
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gold-50 font-medium">{event.venue}</p>
                  <p className="text-gray-600 text-xs mt-1">{event.details}</p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col items-center border-t border-gold-200/30 pt-6 gap-3">
               <button
                  onClick={() => {
                    const startStr = event.calendarDate.replace(/-|:|\.\d\d\d/g, "");
                    const endStr = startStr; // Basic 1 hr event or just point in time
                    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.calendarTitle)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(event.calendarDesc)}&location=${encodeURIComponent(event.venue)}`;
                    window.open(url, "_blank");
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-500 text-emerald-50 font-medium px-6 py-3 rounded-lg transition-colors text-sm shadow-[0_0_15px_rgba(218,165,32,0.3)]"
               >
                 <Calendar className="w-4 h-4" />
                 Save to Calendar
               </button>

               {event.mapsLink && (
                 <a 
                   href={event.mapsLink} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-50 hover:bg-emerald-800 text-gold-200 border border-gold-400/30 font-medium px-6 py-3 rounded-lg transition-colors text-sm shadow-md"
                 >
                   <MapPin className="w-4 h-4" />
                   Get Directions <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                 </a>
               )}
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
      </div>

      {/* Carousel Controls and Dots Indicator (Moved Below) */}
      <div className="mt-8 flex items-center justify-center gap-6 z-20">
        <button 
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-amber-100 border border-gold-400/30 flex items-center justify-center text-gold-200 hover:text-gold-200 hover:bg-emerald-800 transition-all shadow-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-gold-400 w-4" : "bg-gold-900/50 hover:bg-gold-600"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-amber-100 border border-gold-400/30 flex items-center justify-center text-gold-200 hover:text-gold-200 hover:bg-emerald-800 transition-all shadow-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Inline Scratch Card for Date/Time
function EventDateScratchCard({ 
  date, 
  time, 
  onInteractionStart,
  onInteractionEnd,
  onRevealed
}: { 
  date: string; 
  time: string;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
  onRevealed?: () => void;
}) {
  const [isRevealed, setIsRevealed] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Fixed smaller dimensions for the date card
    canvas.width = 340;
    canvas.height = 100;

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
      ctx.font = "bold 16px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillText("✨ Scratch to Reveal ✨", canvas.width / 2, canvas.height / 2);
      ctx.shadowBlur = 0;
    };

    drawOverlay();

    let isDrawing = false;
    let hasScratched = false;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ("touches" in e) ? e.touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
      const y = ("touches" in e) ? e.touches[0].clientY - rect.top : (e as MouseEvent).clientY - rect.top;
      return { x, y };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      hasScratched = true;
      if (onInteractionStart) onInteractionStart();
      scratch(e);
    };

    const stopDrawing = () => {
      isDrawing = false;
      if (onInteractionEnd) onInteractionEnd();
      if (hasScratched) checkReveal();
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      if (e.cancelable) e.preventDefault();
      
      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    };

    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let clearPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++;
      }
      
      if (clearPixels / (pixels.length / 4) > 0.4) {
        setIsRevealed(true);
        if (onRevealed) onRevealed();
        
        // Fire confetti when revealed
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#d97706'],
          disableForReducedMotion: true,
        });

        canvas.style.opacity = "0";
        setTimeout(() => {
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }, 500);
      }
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", scratch, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

  }, [isRevealed]);

  return (
    <div className="relative w-full max-w-[340px] h-[100px] bg-amber-50/80 border border-gold-400/30 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
      <div className="w-full flex flex-col items-center justify-center gap-2 opacity-100 z-10 px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-gold-100">
          <Calendar className="w-4 h-4 text-gold-200" />
          <p className="font-serif text-sm">{date}</p>
        </div>
        <div className="w-2/3 h-px bg-gold-900/50" />
        <div className="flex items-center justify-center gap-2 text-gold-100">
          <Clock className="w-4 h-4 text-gold-200" />
          <p className="font-serif text-sm">{time}</p>
        </div>
      </div>

      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-20 cursor-crosshair touch-none transition-opacity duration-500"
        />
      )}
    </div>
  );
}
