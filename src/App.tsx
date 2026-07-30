import React, { useEffect, useRef, useState } from "react";
import { Lock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { WeddingData } from "./types";
import BackgroundEffects from "./components/BackgroundEffects";
import OpeningAnimation from "./components/OpeningAnimation";
import MusicController from "./components/MusicController";
import HeroSection from "./components/HeroSection";
import CoupleSection from "./components/CoupleSection";
import WeddingInvitationMessage from "./components/WeddingInvitationMessage";
import Countdown from "./components/Countdown";
import PhotoGallery from "./components/PhotoGallery";
import EventsSection from "./components/EventsSection";
import TimelineSection from "./components/TimelineSection";
import FamilySection from "./components/FamilySection";
import LocationSection from "./components/LocationSection";
import RSVPSection from "./components/RSVPSection";
import BlessingsWall from "./components/BlessingsWall";
import AdminPanel from "./components/AdminPanel";
import WeddingInfoCard from "./components/WeddingInfoCard";
import SectionDivider from "./components/SectionDivider";
import ScrollToTop from "./components/ScrollToTop";
import FloatingElements from "./components/FloatingElements";

import { getPublicData } from "./firebase";

const FadeInSection = ({ children, index = 0 }: { children: React.ReactNode, index?: number }) => {
  // Only apply delay to the first few sections that might be visible on initial load
  const delay = index < 4 ? index * 0.2 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.0, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch Public Configuration
  const fetchPublicData = async () => {
    try {
      const data = await getPublicData();
      setWeddingData(data);
      
      // Initialize HTML Audio if audio exists
      if (data.settings?.bgMusicUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(data.settings.bgMusicUrl);
          audioRef.current.loop = true;
          // Set slight volume to be elegant and not blasting
          audioRef.current.volume = 0.25;
        } else {
          audioRef.current.src = data.settings.bgMusicUrl;
        }
      }
    } catch (e) {
      console.error("Failed to load wedding details:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
    
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle Invitation opened
  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Start background music
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play blocked, waiting for click", err));
    }
  };

  // Toggle audio play/pause
  const handleToggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio blocked", err));
    }
  };

  if (isLoading || !weddingData) {
    return (
      <div className="fixed inset-0 bg-amber-50 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-gold-200 font-serif text-sm tracking-widest uppercase animate-pulse">
          Loading Sacred Invitation...
        </span>
      </div>
    );
  }

  const { settings, couple, events, family, gallery, blessings } = weddingData;

  return (
    <div className="relative min-h-screen bg-amber-50 text-emerald-50 selection:bg-gold-600 selection:text-emerald-50">
      
      {/* 1. PARALLAX AMBIENT BACKGROUNDS & PARTICLES */}
      <BackgroundEffects />
      <FloatingElements />
      <FloatingElements />

      {/* 2. OPENING WAX SEAL DOOR ANIMATION OVERLAY */}
      <AnimatePresence>
        {!isOpen && (
          <OpeningAnimation 
            onOpen={handleOpenInvitation} 
            title={settings.seo?.title || "Wedding Invitation"} 
          />
        )}
      </AnimatePresence>

      {/* 3. FLOATING MUSIC MANAGER */}
      {isOpen && (
        <MusicController isPlaying={isPlaying} onToggle={handleToggleAudio} />
      )}

      {/* 4. MAIN INVITATION WEBPAGE (Visible when doors open) */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="relative z-10 w-full"
      >
        {/* HERO HEADER */}
        <HeroSection couple={couple} heroImage={settings.heroImage} />

        <div className="relative bg-gradient-to-b from-transparent via-emerald-950/90 to-amber-50 pt-12">
          
          {/* Elegant Scroll Down Indicator */}
          <div className="flex flex-col items-center gap-2 select-none z-20 mb-12">
            <span className="text-gold-200 text-[10px] font-sans tracking-[0.25em] uppercase drop-shadow-md">
              Explore invitation
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-gold-300 drop-shadow-md" />
            </motion.div>
          </div>

          {/* TRADITIONAL INVITATION SERIF LETTER */}
          {settings.sections.invitationMessage && (
            <FadeInSection index={0}>
              <WeddingInvitationMessage message={couple.invitation} />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* WEDDING INFO SCRATCH CARD */}
          <FadeInSection index={1}>
            <WeddingInfoCard 
              date={events.length > 0 ? events[0].date : "25 November 2026"} 
              time={events.length > 0 ? events[0].time : "02:00 PM"} 
              venue={events.length > 0 ? events[0].venue : "Grace Cathedral"} 
              mapsLink={events.length > 0 ? events[0].mapsLink : "#"}
            />
            <SectionDivider />
          </FadeInSection>

          {/* DYNAMIC METRIC TIMER */}
          {settings.sections.countdown && (
            <FadeInSection index={2}>
              <Countdown targetDate={couple.countdownDate} />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* COUPLE PROFILES SECTION */}
          {settings.sections.couple && (
            <FadeInSection index={3}>
              <CoupleSection couple={couple} />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* LITURGICAL EVENTS SCRATCH REVEALERS - Moved just below Groom & Bride */}
          {settings.sections.scratchCards && (
            <FadeInSection>
              <EventsSection events={events} eventsImage={settings.eventsImage} />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* PHOTO SLIDER */}
          {settings.sections.gallery && (
            <FadeInSection>
              <PhotoGallery images={gallery} />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* CHRONOLOGY TIMELINE */}
          {settings.sections.timeline && (
            <FadeInSection>
              <TimelineSection />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* FAMILY LINES LISTINGS */}
          {settings.sections.family && (
            <FadeInSection>
              <FamilySection family={family} />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* VENUE SATELLITE NAVIGATION Map */}
          {settings.sections.location && (
            <FadeInSection>
              <LocationSection />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* RSVP FORM CONTAINER */}
          {settings.sections.rsvp && (
            <FadeInSection>
              <RSVPSection couple={couple} />
              <SectionDivider />
            </FadeInSection>
          )}

          {/* WISHLIST AND BLESSINGS WALL */}
          {settings.sections.blessings && (
            <FadeInSection>
              <BlessingsWall blessings={blessings} onRefresh={fetchPublicData} />
            </FadeInSection>
          )}
        </div>

        {/* BRUTALIST AND LUXURY GOLD FOOTER */}
        <footer className="relative py-16 px-4 text-center z-10 border-t border-gold-200/10 bg-amber-50/60 backdrop-blur-sm overflow-hidden mt-12">
          {/* Subtle floral background emblem */}
          <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center text-gold-400 select-none pointer-events-none">
            <span className="text-[140px] font-serif">⚜</span>
          </div>

          <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center justify-center">
            
            <p className="font-serif text-sm sm:text-base text-gold-100 max-w-lg mx-auto leading-relaxed italic mb-8 px-4">
              "We look forward to celebrating this blessed occasion with you. Thank you for being part of our special day."
            </p>

            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-6" />

            <h3 className="font-calligraphy text-4xl sm:text-5xl font-bold text-gold-200 tracking-wider mb-2 drop-shadow-md">
              {couple.groom.name.split(' ')[0]} & {couple.bride.name.split(' ')[0]}
            </h3>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-gray-600">
              {new Date(couple.countdownDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {events.length > 0 ? events[0].venue.split(',')[0] : 'San Francisco'}
            </p>

            {/* Vintage administrative login key */}
            <div className="absolute bottom-4 right-4 group/tooltip z-50">
              <button
                onClick={() => setIsAdminOpen(true)}
                id="admin-open-btn"
                className="flex items-center gap-2 px-4 py-2 text-gold-600 bg-amber-100/50 hover:bg-amber-100 border border-gold-400/30 hover:text-gold-500 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] active:scale-95 transition-all duration-300 cursor-pointer rounded-full group"
                aria-label="Open Administrative Panel Settings"
              >
                <Lock className="w-4 h-4 group-hover:animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-semibold font-sans">Admin Panel</span>
              </button>
              
              {/* Custom Tooltip */}
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-max max-w-xs opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 bg-amber-50 border border-gold-400/30 text-gold-100 text-xs p-3 rounded-lg shadow-2xl translate-y-2 group-hover/tooltip:translate-y-0 text-left z-50">
                <span className="block font-serif font-bold mb-1 text-gold-400 border-b border-gold-200/50 pb-1">Admin Dashboard</span>
                <span className="block font-sans text-[11px] leading-relaxed text-gray-600 mt-1">Manage RSVP responses, blessings, events, and update configuration settings securely.</span>
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-amber-50 border-b border-r border-gold-400/30 rotate-45" />
              </div>
            </div>
          </div>
        </footer>
      </motion.main>

      {/* SCROLL TO TOP FAB */}
      <ScrollToTop />

      {/* 5. MODAL CONFIGURATION HUB (ADMIN DASHBOARD PANEL) */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            onClose={() => setIsAdminOpen(false)} 
            onRefreshPublicData={fetchPublicData} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
