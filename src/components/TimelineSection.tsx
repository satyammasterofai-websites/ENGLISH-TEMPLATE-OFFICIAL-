import { motion } from "motion/react";
import { BookOpen, Calendar, Church, Home, Music, Sparkles } from "lucide-react";

interface TimelineItem {
  title: string;
  date: string;
  time: string;
  description: string;
  icon: any;
}

export default function TimelineSection() {
  const timelineData: TimelineItem[] = [
    {
      title: "Rehearsal Dinner",
      date: "Friday, 24 November 2026",
      time: "06:30 PM",
      description: "The Palace Hotel",
      icon: BookOpen,
    },
    {
      title: "Holy Matrimony",
      date: "Saturday, 25 November 2026",
      time: "02:00 PM",
      description: "Grace Cathedral, San Francisco",
      icon: Church,
    },
    {
      title: "Wedding Reception",
      date: "Saturday, 25 November 2026",
      time: "05:00 PM",
      description: "Fairmont San Francisco - Celebratory Feast, Toasts & Dancing",
      icon: Music,
    },
    {
      title: "Farewell Brunch",
      date: "Sunday, 26 November 2026",
      time: "10:30 AM",
      description: "The Alexander Residence - Casual brunch",
      icon: Sparkles,
    },
  ];

  return (
    <section className="relative py-24 px-4 z-10 max-w-5xl mx-auto overflow-hidden">
      
      <div className="text-center mb-16 relative">
        <span className="text-gold-300 font-serif text-sm tracking-[0.3em] uppercase block mb-3 drop-shadow-sm">
          Chronology of Sacraments
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl text-gold-200 tracking-wider font-bold mb-4 drop-shadow-md">
          Our Wedding Timeline
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-[1px] w-16 bg-gradient-to-l from-gold-400 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-gold-400 rotate-45" />
          <div className="h-[1px] w-16 bg-gradient-to-r from-gold-400 to-transparent" />
        </div>
      </div>

      {/* Timeline core tree */}
      <div className="relative">
        
        {/* Continuous center line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold-500/10 via-gold-400 to-gold-500/10 -translate-x-1/2" />

        <div className="space-y-12">
          {timelineData.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={item.title} className="relative flex flex-col md:flex-row items-start md:items-center">
                
                {/* Node icon */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 border-2 border-gold-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  <Icon className="w-4 h-4 text-gold-300" />
                </div>

                {/* Left/Right Container */}
                <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isEven ? "md:pr-14 md:text-right" : "md:pl-14 md:text-left md:col-start-2 ml-auto"}`}>
                  
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="p-6 bg-amber-50/40 border border-gold-400/10 hover:border-gold-400/30 rounded-2xl backdrop-blur-md shadow-xl transition-all duration-300 group"
                  >
                    <span className="text-[10px] text-gold-200 font-sans tracking-widest uppercase block mb-1">
                      {item.date} • {item.time}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-gold-300 group-hover:text-gold-200 transition-colors drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed font-sans">
                      {item.description}
                    </p>

                    {/* Corner Ornaments */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-gold-400/10 group-hover:border-gold-400/30 transition-all" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-gold-400/10 group-hover:border-gold-400/30 transition-all" />
                  </motion.div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
