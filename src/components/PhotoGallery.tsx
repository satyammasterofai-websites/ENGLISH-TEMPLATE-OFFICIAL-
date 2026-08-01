import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PhotoGalleryProps {
  images: string[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Default fallback images if empty
  const defaultImages = [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1520854221256-17451cc35dcd?auto=format&fit=crop&q=80&w=1000"
  ];

  const list = images && images.length > 0 ? images : defaultImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 5000); // Auto slide every 5s
    return () => clearInterval(timer);
  }, [list.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % list.length);
  };

  return (
    <section className="relative py-24 px-4 z-10 max-w-5xl mx-auto">
      
      <div className="text-center mb-16">
        <span className="text-gold-200 font-serif text-sm tracking-[0.25em] uppercase block mb-2">
          Shared Moments
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold mb-3">
          Our Love Gallery
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto" />
      </div>

      {/* Main Slide Frame Container */}
      <div className="relative w-full max-w-4xl mx-auto aspect-16/10 rounded-2xl overflow-hidden p-1.5 bg-gradient-to-br from-gold-100 via-gold-500 to-gold-900 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-amber-50">
          
          <AnimatePresence>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={list[activeIndex]}
                alt={`Wedding Moment ${activeIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Subtle vignette overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-emerald-950/20" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-amber-50/60 border border-gold-400/20 text-gold-200 hover:text-gold-100 hover:bg-amber-100/90 transition-all duration-300 backdrop-blur-sm cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-amber-50/60 border border-gold-400/20 text-gold-200 hover:text-gold-100 hover:bg-amber-100/90 transition-all duration-300 backdrop-blur-sm cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Picture Index Counter */}
          <div className="absolute bottom-4 left-6 bg-amber-50/80 border border-gold-400/20 rounded-full px-3 py-1 backdrop-blur-sm text-[11px] font-serif text-gold-200 tracking-wider">
            {activeIndex + 1} / {list.length}
          </div>
        </div>
      </div>
    </section>
  );
}
