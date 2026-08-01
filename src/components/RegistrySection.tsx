import React from "react";
import { ExternalLink, Gift } from "lucide-react";
import { Registry } from "../types";

interface RegistrySectionProps {
  registries: Registry[];
}

export default function RegistrySection({ registries }: RegistrySectionProps) {
  if (!registries || registries.length === 0) return null;

  return (
    <section id="registry-section" className="relative py-24 px-4 z-10 max-w-5xl mx-auto">
      <div className="text-center mb-16 relative">
        <span className="text-gold-300 font-serif text-sm tracking-[0.3em] uppercase block mb-3 drop-shadow-sm">
          Wedding Wishlist
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-black tracking-wider font-bold mb-4 drop-shadow-sm">
          Gift Registries
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-[1px] w-16 bg-gradient-to-l from-gold-400 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-gold-400 rotate-45" />
          <div className="h-[1px] w-16 bg-gradient-to-r from-gold-400 to-transparent" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {registries.map((reg, idx) => (
          <a
            key={idx}
            href={reg.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-8 bg-amber-50/60 border border-gold-200/30 hover:border-gold-400/50 rounded-2xl shadow-md hover:shadow-xl transition-all group backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gift className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-gold-900 mb-2">
              {reg.storeName}
            </h3>
            {reg.description && (
              <p className="text-gray-600 font-sans text-sm text-center mb-6 leading-relaxed">
                {reg.description}
              </p>
            )}
            <div className="mt-auto flex items-center justify-center gap-2 text-gold-600 font-semibold group-hover:text-emerald-800 transition-colors">
              <span className="uppercase tracking-wider text-xs">View Registry</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
