import { motion } from "motion/react";

export default function SectionDivider() {
  return (
    <div className="w-full flex justify-center items-center py-8 sm:py-16 opacity-80 pointer-events-none">
      <div className="flex items-center gap-4 w-full max-w-lg mx-auto px-4">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold-500/50 to-gold-500/10"></div>
        <motion.div 
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-gold-200 font-serif text-lg sm:text-xl flex items-center gap-2 drop-shadow-md"
        >
          <span className="text-sm">✧</span>
          <span>❦</span>
          <span className="text-sm">✧</span>
        </motion.div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold-500/50 to-gold-500/10"></div>
      </div>
    </div>
  );
}
