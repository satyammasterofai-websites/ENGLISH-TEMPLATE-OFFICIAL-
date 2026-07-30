import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Send, Users, Mail, Phone, User, MessageSquare, Heart, Lock, Eye } from "lucide-react";
import { submitRSVP, getAdminData } from "../firebase";
import { CoupleConfig } from "../types";

interface RSVPSectionProps {
  couple?: CoupleConfig;
}

export default function RSVPSection({ couple }: RSVPSectionProps = {}) {
  const [formData, setFormData] = useState({
    name: "",
    guests: 1,
    attending: "Yes" as "Yes" | "No" | "Maybe",
    side: "" as "groom" | "bride" | "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [confetti, setConfetti] = useState<{id: number, x: number, y: number, color: string}[]>([]);

  // Admin View State
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminRsvps, setAdminRsvps] = useState<any[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const fetchAdminData = async () => {
    setLoadingAdmin(true);
    setAdminError("");
    try {
      const data = await getAdminData(adminPassword);
      setAdminRsvps(data.rsvps || []);
    } catch (e: any) {
      setAdminError(e.message || "Invalid password");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleSelectSide = (side: "groom" | "bride") => {
    setFormData((prev) => ({ ...prev, side }));
    
    const particles = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * -200 - 50,
      color: side === "groom" ? "#3b82f6" : "#ffffff",
    }));
    setConfetti(particles);

    setTimeout(() => setConfetti([]), 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setErrorMessage("Please fill in your Name.");
      setStatus("error");
      return;
    }
    if (!formData.side) {
      setErrorMessage("Please pick your side (Groom or Bride).");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await submitRSVP(formData);
      setStatus("success");
      setFormData({
        name: "",
        guests: 1,
        attending: "Yes",
        side: "",
        message: "",
      });
    } catch (e: any) {
      setErrorMessage(e.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="rsvp-section" className="relative py-24 px-4 z-10 max-w-4xl mx-auto text-center">
      
      <div className="text-center mb-16">
        <span className="text-gray-600 font-serif text-sm tracking-[0.25em] uppercase block mb-2">
          Grace Us With Your Presence
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold mb-3">
          Kindly RSVP
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-3" />
      </div>

      <div className="relative max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* SUCCESS SCREEN */}
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 rounded-3xl bg-amber-50/70 backdrop-blur-xl border border-gold-400/40 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-gold-300 mb-6 animate-bounce" />
              <h3 className="font-serif text-3xl font-bold text-gold-200 mb-4">
                Thank You!
              </h3>
              <p className="text-gray-700 font-sans text-sm leading-relaxed max-w-sm mb-6">
                Your RSVP response has been recorded with divine grace. We look forward to celebrating the Holy Sacrament of Matrimony with you!
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="py-2.5 px-6 rounded-lg bg-emerald-800 border border-gold-400/30 text-gold-200 hover:text-gold-100 hover:border-gold-300 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Submit another response
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-8 sm:p-10 rounded-3xl bg-amber-50/60 backdrop-blur-lg border border-gold-400/10 hover:border-gold-400/20 backdrop-blur-md shadow-2xl text-left space-y-6 relative group transition-all"
            >
              {/* Card Corner Ornaments */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-gold-400/20" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-gold-400/20" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-gold-400/20" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-gold-400/20" />

              {/* PICK YOUR SIDE */}
              <div className="mb-6">
                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold font-sans mb-3 block text-center">
                  Pick Your Side <span className="text-red-500">*</span>
                </label>
                <div className="relative grid grid-cols-2 gap-4">
                  {/* TEAM GROOM */}
                  <button
                    type="button"
                    onClick={() => handleSelectSide("groom")}
                    className={`relative p-4 rounded-xl border text-center transition-all duration-500 cursor-pointer focus:outline-none overflow-hidden ${
                      formData.side === "groom"
                        ? "bg-blue-950/20 border-gold-400 shadow-[0_0_20px_rgba(251,191,36,0.15)] scale-[1.02]"
                        : "bg-amber-100/40 backdrop-blur-sm border-gold-200/20 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <Heart className={`w-5 h-5 transition-transform duration-300 ${
                        formData.side === "groom" ? "text-blue-400 fill-blue-400 scale-110" : "text-gray-600"
                      }`} />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold mb-0.5 block">
                      Team Groom
                    </span>
                    <h3 className="font-serif text-lg font-bold text-gold-200">
                      {couple?.groom?.name?.split(' ')[0] || "Groom"}
                    </h3>
                  </button>

                  {/* TEAM BRIDE */}
                  <button
                    type="button"
                    onClick={() => handleSelectSide("bride")}
                    className={`relative p-4 rounded-xl border text-center transition-all duration-500 cursor-pointer focus:outline-none overflow-hidden ${
                      formData.side === "bride"
                        ? "bg-gray-100/5 border-gold-400 shadow-[0_0_20px_rgba(251,191,36,0.15)] scale-[1.02]"
                        : "bg-amber-100/40 backdrop-blur-sm border-gold-200/20 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <Heart className={`w-5 h-5 transition-transform duration-300 ${
                        formData.side === "bride" ? "text-white fill-white scale-110" : "text-gray-600"
                      }`} />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-700 font-semibold mb-0.5 block">
                      Team Bride
                    </span>
                    <h3 className="font-serif text-lg font-bold text-gold-200">
                      {couple?.bride?.name?.split(' ')[0] || "Bride"}
                    </h3>
                  </button>

                  <AnimatePresence>
                    {confetti.length > 0 && (
                      <div className="absolute top-1/2 left-1/2 pointer-events-none">
                        {confetti.map((c) => (
                          <motion.div
                            key={c.id}
                            className="absolute w-2 h-2 rounded-full"
                            style={{ backgroundColor: c.color, boxShadow: "0 0 6px rgba(251,191,36,0.6)" }}
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                            animate={{ x: c.x, y: c.y, scale: 0, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.0, ease: "easeOut" }}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold font-sans mb-1.5 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gold-500/40" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-amber-100/70 backdrop-blur-md border border-gold-200/25 rounded-xl pl-11 pr-4 py-3 text-sm text-gold-100 placeholder-gray-500 focus:outline-none focus:border-gold-400/80 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Grid: Guests & Attendance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Will you attend? */}
                <div>
                  <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold font-sans mb-1.5 block">
                    Will you attend?
                  </label>
                  <select
                    name="attending"
                    value={formData.attending}
                    onChange={handleChange}
                    className="w-full bg-amber-100/70 backdrop-blur-md border border-gold-200/25 rounded-xl px-4 py-3 text-sm text-gold-100 focus:outline-none focus:border-gold-400/80 transition-all font-sans"
                  >
                    <option value="Yes">Yes, I will attend</option>
                    <option value="No">No, I cannot attend</option>
                    <option value="Maybe">Maybe / Undecided</option>
                  </select>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold font-sans mb-1.5 block">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gold-500/40" />
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      max="10"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-amber-100/70 backdrop-blur-md border border-gold-200/25 rounded-xl pl-11 pr-4 py-3 text-sm text-gold-100 focus:outline-none focus:border-gold-400/80 transition-all font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold font-sans mb-1.5 block">
                  Blessing / Note of Celebration
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-4 w-4.5 h-4.5 text-gold-500/40" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Leave a message for the couple..."
                    className="w-full bg-amber-100/70 backdrop-blur-md border border-gold-200/25 rounded-xl pl-11 pr-4 py-3 text-sm text-gold-100 placeholder-gray-500 focus:outline-none focus:border-gold-400/80 transition-all font-sans resize-none"
                  />
                </div>
              </div>

              {/* Error Alert Display */}
              {status === "error" && (
                <div className="p-3 bg-red-950 border border-red-500 text-red-200 text-xs rounded-xl font-medium tracking-wide">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-rsvp-btn"
                disabled={status === "submitting"}
                className="w-full py-3.5 px-6 rounded-xl bg-gold-600 hover:bg-gold-500 disabled:bg-gold-800 text-emerald-50 font-sans font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_20px_rgba(202,138,4,0.2)] active:scale-98"
              >
                {status === "submitting" ? (
                  <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 fill-emerald-950" />
                    Send RSVP Invitation Response
                  </>
                )}
              </button>

            </motion.form>
          )}
        </AnimatePresence>

        {/* ADMIN VIEW BUTTON */}
        <div className="mt-8 pt-8 border-t border-gold-200/10">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="mx-auto flex items-center gap-2 text-[10px] text-gold-500 hover:text-gray-600 uppercase tracking-widest font-semibold transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            View RSVPs
          </button>

          <AnimatePresence>
            {showAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="bg-amber-100/40 border border-gold-200/20 rounded-xl p-6 text-left">
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                      type="password"
                      placeholder="Enter Admin Password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="flex-1 bg-amber-50 border border-gold-200/30 rounded-lg px-4 py-2.5 text-xs text-gold-100 placeholder-gray-600 focus:outline-none focus:border-gold-400 transition-all"
                    />
                    <button
                      onClick={fetchAdminData}
                      disabled={loadingAdmin || !adminPassword}
                      className="whitespace-nowrap px-6 py-2.5 bg-gold-600 hover:bg-gold-500 text-emerald-50 font-bold text-xs uppercase tracking-wider rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loadingAdmin ? (
                        <div className="w-3 h-3 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      View
                    </button>
                  </div>

                  {adminError && (
                    <p className="text-red-700 text-xs mb-4 font-medium">{adminError}</p>
                  )}

                  {adminRsvps.length > 0 && (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                      <div className="text-xs text-gray-600 mb-2 font-serif">Total RSVPs: {adminRsvps.length}</div>
                      {adminRsvps.map((rsvp: any) => (
                        <div key={rsvp.id} className="p-3 bg-amber-50/60 backdrop-blur-lg rounded-lg border border-gold-200/10">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-gold-200 font-semibold text-sm">{rsvp.name}</h4>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${rsvp.attending === "Yes" ? "bg-amber-500/20 text-amber-700" : rsvp.attending === "No" ? "bg-red-500/20 text-red-700" : "bg-yellow-500/20 text-amber-700"}`}>
                              {rsvp.attending}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                            <span>Side: <span className="text-gold-100 capitalize">{rsvp.side}</span></span>
                            <span>Guests: <span className="text-gold-100">{rsvp.guests}</span></span>
                          </div>
                          {rsvp.message && (
                            <p className="text-gray-700 text-xs mt-2 italic border-l-2 border-gold-200/30 pl-2">"{rsvp.message}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
