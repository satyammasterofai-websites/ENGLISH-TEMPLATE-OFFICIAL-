import { motion } from "motion/react";

interface WeddingInvitationMessageProps {
  message: string;
}

export default function WeddingInvitationMessage({ message }: WeddingInvitationMessageProps) {
  return (
    <section className="relative py-20 px-4 max-w-4xl mx-auto text-center z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.0 }}
        className="relative bg-amber-50/60 border border-gold-300/30 rounded-3xl p-8 sm:p-12 md:p-16 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_20px_rgba(255,255,255,0.05)] overflow-hidden group"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold-400/10 rounded-full blur-[60px] pointer-events-none transition-all group-hover:bg-gold-300/15" />

        {/* Elegant Stained-Glass Lace Frame Accent */}
        <div className="absolute inset-3 border border-gold-400/10 pointer-events-none rounded-[20px]" />
        <div className="absolute inset-5 border border-gold-400/5 pointer-events-none rounded-[12px]" />

        {/* Top Lace/Cross Accent */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-gold-300 font-serif text-3xl leading-none drop-shadow-md">⚜</span>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-4 opacity-70" />
        </div>

        {/* The Invitation Text */}
        <p className="font-serif text-lg sm:text-xl md:text-2xl text-gold-100 leading-relaxed max-w-2xl mx-auto italic font-medium">
          "{message || "With immense joy and heartfelt gratitude to God, we warmly invite you to witness and celebrate the Holy Sacrament of Matrimony as we begin our beautiful journey together in faith, hope, and everlasting love. Your prayers, blessings, and presence will make our celebration truly complete."}"
        </p>

        {/* Bottom Lace/Cross Accent */}
        <div className="flex flex-col items-center mt-8">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-3" />
          <span className="text-gold-200 font-serif text-2xl leading-none">⚜</span>
        </div>

      </motion.div>
    </section>
  );
}
