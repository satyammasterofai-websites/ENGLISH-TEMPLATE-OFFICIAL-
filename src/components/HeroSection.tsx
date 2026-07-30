import { Calendar, MapPin, Clock } from "lucide-react";
import { CoupleConfig } from "../types";

interface HeroSectionProps {
  couple: CoupleConfig;
  heroImage: string;
}

export default function HeroSection({ couple, heroImage }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden z-10 bg-amber-50">
      {/* Parallax Hero Image background */}
      {heroImage ? (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage})`,
          }}
        />
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
          <p className="text-gray-500 font-sans text-sm">Please add a Hero Image URL in the Admin Panel.</p>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center mt-20">
      </div>
      
    </section>
  );
}
