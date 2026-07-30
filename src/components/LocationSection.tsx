import { MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";

export default function LocationSection() {
  const mapUrl = "https://maps.google.com/maps?q=Grace+Cathedral,+San+Francisco&t=&z=15&ie=UTF8&iwloc=&output=embed";
  const navigateUrl = "https://maps.app.goo.gl/";

  return (
    <section className="relative py-20 px-4 z-10 max-w-5xl mx-auto">
      
      <div className="text-center mb-12">
        <span className="text-gold-200 font-serif text-sm tracking-[0.25em] uppercase block mb-2">
          Sanctuary Venue
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold mb-3">
          Location & Sanctuary
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto rounded-3xl p-1.5 bg-gradient-to-br from-gold-100 via-gold-500 to-gold-900 shadow-[0_25px_50px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        <div className="bg-amber-50/95 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center justify-between">
          
          {/* Details Column */}
          <div className="w-full lg:w-2/5 text-left flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-gold-400/10 border border-gold-400/30">
                  <MapPin className="w-5 h-5 text-gold-300" />
                </div>
                <span className="text-gold-200 uppercase tracking-widest font-semibold font-sans text-xs">
                  Holy Matrimony
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gold-100 mb-2">
                Grace Cathedral
              </h3>
              <p className="text-gold-300 font-serif italic text-sm mb-4">
                Diocese of California
              </p>
              
              <div className="h-[1px] w-full bg-gold-400/20 my-4" />
              
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                Located in the heart of Nob Hill, San Francisco. Elegant architecture and magnificent stained glass windows await our guests as we stand before the holy altar.
              </p>
            </div>

            <a
              href={navigateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gold-600 hover:bg-gold-500 text-emerald-50 font-sans font-bold uppercase tracking-wider text-xs transition-all shadow-[0_10px_20px_rgba(202,138,4,0.3)] active:scale-98 cursor-pointer"
            >
              <Navigation className="w-4 h-4 fill-emerald-950" />
              Navigate with Google Maps
            </a>
          </div>

          {/* Interactive Map Iframe Column */}
          <div className="w-full lg:w-3/5 aspect-video sm:aspect-16/10 rounded-xl overflow-hidden border border-gold-400/20 bg-amber-100 relative">
            <iframe
              src={mapUrl}
              className="absolute inset-0 w-full h-full border-0 focus:outline-none"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="St. Casimir's Roman Catholic Church Map Location"
            />
            {/* Visual aesthetic color grading overlay */}
            <div className="absolute inset-0 pointer-events-none border border-gold-400/10 rounded-xl mix-blend-overlay" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
