import { motion } from "motion/react";
import { CoupleConfig } from "../types";

interface CoupleSectionProps {
  couple: CoupleConfig;
}

export default function CoupleSection({ couple }: CoupleSectionProps) {
  return (
    <section id="couple-section" className="relative py-24 px-4 max-w-6xl mx-auto z-10">
      
      {/* Decorative Top Accent */}
      <div className="flex justify-center mb-6">
        <span className="text-gold-200 font-serif text-xl">✦   ⚜   ✦</span>
      </div>
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold mb-3">
          The Groom & The Bride
        </h2>
        <div className="h-[1px] w-36 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto" />
      </div>

      {/* Groom & Bride Container */}
      <div className="relative flex flex-col md:flex-row justify-center items-center gap-16 md:gap-8 lg:gap-16">
        
        {/* GROOM CARD */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center group w-full md:w-1/2 max-w-sm"
        >
          {/* Portrait Image with Golden Frame */}
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-t-full p-2 bg-gradient-to-b from-gold-300 via-gold-600 to-emerald-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-8 overflow-hidden group-hover:shadow-[0_20px_60px_rgba(218,165,32,0.3)] transition-shadow duration-700">
            <div className="relative w-full h-full rounded-t-[90px] overflow-hidden bg-amber-100 border-[3px] border-emerald-950">
              <img
                src={couple.groom.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"}
                alt={couple.groom.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Victorian Corner Ornaments (Bottom) */}
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/70" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/70" />
            </div>
            
            {/* Elegant Name Plate */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[90%] min-h-[70px] py-3 px-4 bg-amber-50/80 backdrop-blur-md border border-gold-400/40 rounded-lg shadow-2xl z-10 flex flex-col items-center justify-center">
               <span className="text-gold-200 font-serif text-[9px] tracking-widest uppercase mb-1 shrink-0">
                 The Groom
               </span>
               <h3 className="font-calligraphy text-2xl sm:text-3xl text-gold-100 tracking-wide w-full text-center group-hover:text-gold-200 transition-colors leading-tight flex-1 flex items-center justify-center pt-1 drop-shadow-md">
                 {couple.groom.name}
               </h3>
            </div>
          </div>

          {/* Groom details */}
          <div className="mt-8 px-4 flex flex-col items-center">
            <div className="h-6 w-px bg-gold-600/30 mb-4" />
            <p className="text-gray-700 font-serif text-xs sm:text-sm tracking-wide max-w-sm italic">
              {couple.groom.parents}
            </p>
          </div>
        </motion.div>

        {/* STYLISH '&' DIVIDER */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="hidden md:flex flex-col items-center justify-center z-20 mx-4"
        >
          <div className="h-24 w-px bg-gradient-to-b from-transparent via-gold-500/50 to-transparent mb-4" />
          <div className="w-16 h-16 rounded-full bg-amber-100 border border-gold-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(218,165,32,0.15)]">
            <span className="font-serif text-4xl text-gold-300 italic pr-1">
              &
            </span>
          </div>
          <div className="h-24 w-px bg-gradient-to-t from-transparent via-gold-500/50 to-transparent mt-4" />
        </motion.div>
        
        {/* Mobile '&' */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="md:hidden w-12 h-12 rounded-full bg-amber-100 border border-gold-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(218,165,32,0.15)] my-4 z-20"
        >
          <span className="font-serif text-2xl text-gold-300 italic pr-1">
            &
          </span>
        </motion.div>

        {/* BRIDE CARD */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center text-center group w-full md:w-1/2 max-w-sm"
        >
          {/* Portrait Image with Golden Frame */}
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-t-full p-2 bg-gradient-to-b from-gold-300 via-gold-600 to-emerald-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-8 overflow-hidden group-hover:shadow-[0_20px_60px_rgba(218,165,32,0.3)] transition-shadow duration-700">
            <div className="relative w-full h-full rounded-t-[90px] overflow-hidden bg-amber-100 border-[3px] border-emerald-950">
              <img
                src={couple.bride.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"}
                alt={couple.bride.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Victorian Corner Ornaments (Bottom) */}
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/70" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/70" />
            </div>

            {/* Elegant Name Plate */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[90%] min-h-[70px] py-3 px-4 bg-amber-50/80 backdrop-blur-md border border-gold-400/40 rounded-lg shadow-2xl z-10 flex flex-col items-center justify-center">
               <span className="text-gold-200 font-serif text-[9px] tracking-widest uppercase mb-1 shrink-0">
                 The Bride
               </span>
               <h3 className="font-calligraphy text-2xl sm:text-3xl text-gold-100 tracking-wide w-full text-center group-hover:text-gold-200 transition-colors leading-tight flex-1 flex items-center justify-center pt-1 drop-shadow-md">
                 {couple.bride.name}
               </h3>
            </div>
          </div>

          {/* Bride details */}
          <div className="mt-8 px-4 flex flex-col items-center">
            <div className="h-6 w-px bg-gold-600/30 mb-4" />
            <p className="text-gray-700 font-serif text-xs sm:text-sm tracking-wide max-w-sm italic">
              {couple.bride.parents}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
