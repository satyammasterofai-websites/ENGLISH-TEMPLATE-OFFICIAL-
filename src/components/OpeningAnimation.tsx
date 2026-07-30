import { motion } from "motion/react";
import { useState } from "react";
import confetti from "canvas-confetti";

interface OpeningAnimationProps {
  onOpen: () => void;
  title?: string;
}

export default function OpeningAnimation({ onOpen, title = "Wedding Invitation" }: OpeningAnimationProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);

    // Fire blast animation
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#ef4444', '#dc2626'],
      disableForReducedMotion: true,
    });

    // Play a gentle synthetic bell tone if possible (HTML Audio Context)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First tone (G4)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(392.00, audioCtx.currentTime); // G4
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 3.0);

      // Second tone (C5) for a harmonized cathedral bell chord
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.0);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 4.0);
      }, 300);

    } catch (e) {
      console.log("Audio play failed or was blocked by browser policies.");
    }

    // Delay the onOpen callback until doors finish parting
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, y: "-100%", filter: "blur(8px)" }}
      transition={{ duration: 1.0, ease: [0.77, 0, 0.175, 1] }}
    >
      {/* LEFT DOOR */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#FFFFFF] border-r border-gold-400/50 flex justify-center items-center z-40 overflow-hidden shadow-[inset_-10px_0_30px_rgba(0,0,0,0.5)]"
        initial={{ x: 0 }}
        animate={{ x: isOpened ? "-100%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      >
        {/* Intricate Door Panels / Boxes Structure */}
        <div className="absolute inset-4 sm:inset-8 border-2 border-gold-400/30 rounded-sm pointer-events-none" />
        <div className="absolute inset-8 sm:inset-12 border border-gold-400/20 rounded-sm pointer-events-none" />
        
        <div className="h-[80%] w-[70%] border border-gold-400/30 flex flex-col items-center justify-between p-4 sm:p-8 relative">
          {/* Top Panel Box */}
          <div className="w-full h-[40%] border border-gold-400/20 relative flex items-center justify-center">
            <div className="w-16 h-16 border border-gold-400/20 rotate-45 flex items-center justify-center">
              <span className="text-gold-200/40 text-xs">❦</span>
            </div>
          </div>
          {/* Bottom Panel Box */}
          <div className="w-full h-[40%] border border-gold-400/20 relative flex items-center justify-center">
             <div className="w-16 h-16 border border-gold-400/20 rotate-45 flex items-center justify-center">
               <span className="text-gold-200/40 text-xs">❧</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT DOOR */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FFFFFF] border-l border-gold-400/50 flex justify-center items-center z-40 overflow-hidden shadow-[inset_10px_0_30px_rgba(0,0,0,0.5)]"
        initial={{ x: 0 }}
        animate={{ x: isOpened ? "100%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      >
        {/* Intricate Door Panels / Boxes Structure */}
        <div className="absolute inset-4 sm:inset-8 border-2 border-gold-400/30 rounded-sm pointer-events-none" />
        <div className="absolute inset-8 sm:inset-12 border border-gold-400/20 rounded-sm pointer-events-none" />
        
        <div className="h-[80%] w-[70%] border border-gold-400/30 flex flex-col items-center justify-between p-4 sm:p-8 relative">
          {/* Top Panel Box */}
          <div className="w-full h-[40%] border border-gold-400/20 relative flex items-center justify-center">
             <div className="w-16 h-16 border border-gold-400/20 rotate-45 flex items-center justify-center">
               <span className="text-gold-200/40 text-xs">❦</span>
             </div>
          </div>
          {/* Bottom Panel Box */}
          <div className="w-full h-[40%] border border-gold-400/20 relative flex items-center justify-center">
             <div className="w-16 h-16 border border-gold-400/20 rotate-45 flex items-center justify-center">
               <span className="text-gold-200/40 text-xs">❧</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* CENTER WAX SEAL ENVELOPE */}
      <div className="relative z-50 flex flex-col items-center justify-center text-center">
        {/* The Envelope Center */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isOpened ? 1.5 : 1, opacity: isOpened ? 0 : 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Premium Wax Seal Button */}
          <button
            onClick={handleOpen}
            id="open-seal-btn"
            className="group relative flex items-center justify-center focus:outline-none cursor-pointer"
          >
            {/* Pulsing Outer Aura */}
            <div className="absolute w-32 h-32 rounded-full border border-gold-400/50 animate-ping opacity-35 group-hover:scale-110 transition-all duration-300" />
            
            {/* Elegant Seal Backing Lace */}
            <div className="absolute w-28 h-28 rounded-full bg-gold-500/80 border border-gold-400/60 shadow-xl flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
            
            {/* Golden Wax Seal Body with Black Stamp */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-yellow-600 border-2 border-gold-300/80 shadow-[inset_0_2px_8px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.3)] flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all duration-300">
              
              {/* Black Stamp */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-black font-serif text-3xl select-none leading-none opacity-80 mix-blend-multiply">✝</span>
              </div>

              {/* Shimmer overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Tap To Open Label under button */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-max px-5 py-2 bg-white/95 border border-gold-400/50 rounded-full shadow-lg backdrop-blur-md text-center">
              <span className="text-gray-950 font-serif text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase animate-pulse block">
                Tap to Open
              </span>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Atmospheric backgrounds for the opening scene */}
      <div className="absolute inset-0 bg-[#101728]/95 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none z-20" />
    </motion.div>
  );
}
