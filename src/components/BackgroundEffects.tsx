import { motion } from "motion/react";
import { Flower2, Sparkles } from "lucide-react";
import FloatingParticles from "./FloatingParticles";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep luxurious emerald background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FFF0F5] to-[#FFFFFF]" />

      {/* Subtle royal church-style stained-glass background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Elegant Frame Outline */}
      <div className="absolute inset-4 md:inset-8 border border-gold-400/10 rounded-2xl pointer-events-none" />
      <div className="absolute inset-6 md:inset-10 border border-gold-400/5 rounded-xl pointer-events-none hidden md:block" />

      {/* Ornate Corner Elements (Top Left) */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-24 h-24 border-t border-l border-gold-400/20 rounded-tl-2xl flex items-start justify-start p-2">
        <Flower2 className="w-5 h-5 text-gold-600/20" />
      </div>
      {/* Ornate Corner Elements (Top Right) */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 w-24 h-24 border-t border-r border-gold-400/20 rounded-tr-2xl flex items-start justify-end p-2">
        <Sparkles className="w-5 h-5 text-gold-600/20" />
      </div>
      {/* Ornate Corner Elements (Bottom Left) */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-24 h-24 border-b border-l border-gold-400/20 rounded-bl-2xl flex items-end justify-start p-2">
        <Sparkles className="w-5 h-5 text-gold-600/20" />
      </div>
      {/* Ornate Corner Elements (Bottom Right) */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-24 h-24 border-b border-r border-gold-400/20 rounded-br-2xl flex items-end justify-end p-2">
        <Flower2 className="w-5 h-5 text-gold-600/20" />
      </div>

      {/* Ambient Candle Glow (Soft radial gradients in margins) */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] animate-pulse-slow" />
      <div className="absolute top-3/4 -right-40 w-96 h-96 rounded-full bg-yellow-600/10 blur-[100px] animate-pulse-slow [animation-delay:1.5s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-900/5 blur-[120px]" />

      {/* Floating Gold Sparkles Component */}
      <FloatingParticles />
    </div>
  );
}
