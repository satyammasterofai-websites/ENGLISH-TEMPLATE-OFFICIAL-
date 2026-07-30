import { motion } from "motion/react";
import { FamilyConfig } from "../types";

interface FamilySectionProps {
  family: FamilyConfig;
}

export default function FamilySection({ family }: FamilySectionProps) {
  return (
    <section className="relative py-20 px-4 z-10 max-w-5xl mx-auto">
      
      <div className="text-center mb-16">
        <span className="text-gold-200 font-serif text-sm tracking-[0.25em] uppercase block mb-2">
          Beloved Families
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold mb-3">
          Family Lineage & Siblings
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-400" />
          <span className="text-gold-300 font-serif text-lg">⚜</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto relative">
        {/* Connecting Line (Desktop only) */}
        <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent -translate-y-1/2 z-0" />

        {/* GROOM SIDE CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-10 rounded-3xl bg-amber-100 border-[2px] border-gold-200/30 text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] group hover:border-gold-400/50 hover:shadow-[0_20px_50px_rgba(218,165,32,0.1)] transition-all duration-500 z-10"
        >
          {/* Inner Decorative Border */}
          <div className="absolute inset-2 border border-gold-400/20 rounded-2xl pointer-events-none group-hover:border-gold-400/40 transition-colors duration-500" />
          
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-gold-200 uppercase tracking-widest mb-1 mt-4">
            Groom's Side
          </h3>
          <span className="text-[9px] text-gray-600 font-sans tracking-[0.25em] uppercase block mb-6">
            Supporting the Groom
          </span>
          
          <div className="flex items-center justify-center gap-3 my-8">
             <div className="h-px w-8 bg-gold-400/30" />
             <span className="text-gold-200 font-serif text-2xl leading-none block drop-shadow-md">💙</span>
             <div className="h-px w-8 bg-gold-400/30" />
          </div>

          {/* Sibling Info */}
          <div className="mb-4">
            <p className="text-[10px] text-gold-500 uppercase tracking-widest font-semibold font-sans mb-2">
              {family?.groom?.relation || "Sister"}
            </p>
            <p className="font-serif text-xl sm:text-2xl font-medium text-gold-100">
              {family?.groom?.name || "Aleena A"}
            </p>
          </div>

          {/* Corner Ornaments */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold-400/30 rounded-tl-lg group-hover:border-gold-400 transition-colors" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold-400/30 rounded-tr-lg group-hover:border-gold-400 transition-colors" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold-400/30 rounded-bl-lg group-hover:border-gold-400 transition-colors" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold-400/30 rounded-br-lg group-hover:border-gold-400 transition-colors" />
        </motion.div>

        {/* BRIDE SIDE CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative p-10 rounded-3xl bg-amber-100 border-[2px] border-gold-200/30 text-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] group hover:border-gold-400/50 hover:shadow-[0_20px_50px_rgba(218,165,32,0.1)] transition-all duration-500 z-10"
        >
          {/* Inner Decorative Border */}
          <div className="absolute inset-2 border border-gold-400/20 rounded-2xl pointer-events-none group-hover:border-gold-400/40 transition-colors duration-500" />
          
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-gold-200 uppercase tracking-widest mb-1 mt-4">
            Bride's Side
          </h3>
          <span className="text-[9px] text-gray-600 font-sans tracking-[0.25em] uppercase block mb-6">
            Supporting the Bride
          </span>
          
          <div className="flex items-center justify-center gap-3 my-8">
             <div className="h-px w-8 bg-gold-400/30" />
             <span className="text-gold-200 font-serif text-2xl leading-none block drop-shadow-md">🤍</span>
             <div className="h-px w-8 bg-gold-400/30" />
          </div>

          {/* Sibling Info */}
          <div className="mb-4">
            <p className="text-[10px] text-gold-500 uppercase tracking-widest font-semibold font-sans mb-2">
              {family?.bride?.relation || "Brother"}
            </p>
            <p className="font-serif text-xl sm:text-2xl font-medium text-gold-100">
              {family?.bride?.name || "Betto Rajeev"}
            </p>
          </div>

          {/* Corner Ornaments */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold-400/30 rounded-tl-lg group-hover:border-gold-400 transition-colors" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold-400/30 rounded-tr-lg group-hover:border-gold-400 transition-colors" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold-400/30 rounded-bl-lg group-hover:border-gold-400 transition-colors" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold-400/30 rounded-br-lg group-hover:border-gold-400 transition-colors" />
        </motion.div>
      </div>
    </section>
  );
}
