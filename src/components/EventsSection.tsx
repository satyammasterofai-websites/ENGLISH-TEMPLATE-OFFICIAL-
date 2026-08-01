import React from "react";
import { WeddingEvent } from "../types";
import EventCarousel from "./EventCarousel";

interface EventsSectionProps {
  events: WeddingEvent[];
  eventsImage?: string;
}

export default function EventsSection({ events, eventsImage }: EventsSectionProps) {
  return (
    <section id="events-section" className="relative py-24 px-4 z-10 max-w-7xl mx-auto">
      
      <div className="text-center mb-16 relative">
        <span className="text-gold-300 font-serif text-sm tracking-[0.3em] uppercase block mb-3 drop-shadow-sm">
          Liturgical Celebrations
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-black tracking-wider font-bold mb-4 drop-shadow-sm">
          Wedding Events
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-[1px] w-16 bg-gradient-to-l from-gold-400 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-gold-400 rotate-45" />
          <div className="h-[1px] w-16 bg-gradient-to-r from-gold-400 to-transparent" />
        </div>
      </div>

      {/* Grid of Scratch Cards fallback or detail blocks */}
      {events && events.length > 0 ? (
        <EventCarousel events={events} />
      ) : eventsImage ? (
        <div className="w-full flex justify-center mb-12">
          <img 
            src={eventsImage} 
            alt="Wedding Events Schedule" 
            className="w-full max-w-4xl rounded-2xl border border-gold-200/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] object-cover"
          />
        </div>
      ) : null}

    </section>
  );
}
