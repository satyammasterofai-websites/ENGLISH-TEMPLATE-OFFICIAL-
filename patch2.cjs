const fs = require('fs');
let content = fs.readFileSync('src/components/OpeningAnimation.tsx', 'utf8');

const target = `            {/* Pulsing Outer Aura */}
            <div className="absolute w-32 h-32 rounded-full border border-rose-400/50 animate-ping opacity-35 group-hover:scale-110 transition-all duration-300" />
            
            {/* Elegant Seal Backing Lace */}
            <div className="absolute w-28 h-28 rounded-full bg-rose-500/80 border border-gold-400/60 shadow-xl flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
            
            {/* Lighter Crimson / Rose Red Wax Seal Body with Golden Stamp */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-600 border-2 border-rose-300/80 shadow-[inset_0_2px_8px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.3)] flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all duration-300">
              
              {/* Gold Holy Cross Logo Stamped */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-amber-100 font-serif text-3xl select-none leading-none drop-shadow-md">✝</span>
              </div>`;

const replacement = `            {/* Pulsing Outer Aura */}
            <div className="absolute w-32 h-32 rounded-full border border-gold-400/50 animate-ping opacity-35 group-hover:scale-110 transition-all duration-300" />
            
            {/* Elegant Seal Backing Lace */}
            <div className="absolute w-28 h-28 rounded-full bg-gold-500/80 border border-gold-400/60 shadow-xl flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-1000" />
            
            {/* Golden Wax Seal Body with Black Stamp */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-yellow-600 border-2 border-gold-300/80 shadow-[inset_0_2px_8px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.3)] flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all duration-300">
              
              {/* Black Stamp */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-black font-serif text-3xl select-none leading-none opacity-80 mix-blend-multiply">❦</span>
              </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/OpeningAnimation.tsx', content);
