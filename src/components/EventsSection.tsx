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
      
      <div className="text-center mb-16">
        <span className="text-gold-200 font-serif text-sm tracking-[0.25em] uppercase block mb-2">
          Liturgical Celebrations
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold mb-3">
          Wedding Events
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
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
