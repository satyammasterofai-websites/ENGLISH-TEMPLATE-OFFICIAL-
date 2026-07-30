import { Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";

interface MusicControllerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function MusicController({ isPlaying, onToggle }: MusicControllerProps) {
  return (
    <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
      {/* Visual Equalizer Bars showing when playing */}
      {isPlaying && (
        <div className="flex items-end gap-1 h-6 px-3 py-1 bg-amber-50/80 rounded-full border border-gold-400/20 backdrop-blur-md shadow-lg select-none">
          <motion.div
            className="w-[2px] bg-gold-400 rounded-full"
            animate={{ height: [4, 16, 4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-[2px] bg-gold-300 rounded-full"
            animate={{ height: [8, 20, 8] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="w-[2px] bg-gold-400 rounded-full"
            animate={{ height: [6, 12, 6] }}
            transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.div
            className="w-[2px] bg-gold-500 rounded-full"
            animate={{ height: [10, 18, 10] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <span className="text-[10px] text-gold-300 tracking-wider font-medium font-serif ml-1.5 uppercase hidden sm:inline">
            Hymn
          </span>
        </div>
      )}

      {/* Main floating action trigger */}
      <button
        onClick={onToggle}
        id="toggle-audio-btn"
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-amber-100/90 border border-gold-400/40 text-gold-200 hover:text-gold-100 hover:border-gold-300 shadow-2xl transition-all duration-300 cursor-pointer focus:outline-none backdrop-blur-md active:scale-95"
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-gray-600" />
        )}
        
        {/* Subtle decorative gold ring */}
        <div className="absolute inset-[-2px] rounded-full border border-gold-400/10 pointer-events-none group-hover:border-gold-400/30 transition-all duration-300" />
      </button>
    </div>
  );
}
