import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate || "2026-09-12T15:30:00").getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-20 px-4 z-10 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-gold-200 font-serif text-sm tracking-[0.25em] uppercase block mb-2">
          Waiting in Joyful Hope
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold">
          The Matrimonial Countdown
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-3" />
      </div>

      {/* Countdown Line */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 md:gap-10 max-w-4xl mx-auto">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-2 sm:p-4 group"
            >
              {/* Value display */}
              <span className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-gold-200 mb-1 drop-shadow-[0_2px_10px_rgba(218,165,32,0.3)]">
                {String(item.value).padStart(2, "0")}
              </span>

              {/* Label display */}
              <span className="font-sans text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-gray-600 font-medium">
                {item.label}
              </span>
            </motion.div>

            {/* Divider between items */}
            {index < items.length - 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gold-900/50 font-serif text-2xl sm:text-4xl md:text-5xl mx-1 sm:mx-2 font-light"
              >
                :
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {timeLeft.isOver && (
        <div className="text-center mt-8">
          <p className="font-serif text-gold-200 text-lg tracking-widest uppercase animate-pulse">
            ✦ Today is the Blessed Day ✦
          </p>
        </div>
      )}
    </section>
  );
}
