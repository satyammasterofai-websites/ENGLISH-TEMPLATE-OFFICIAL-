import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Heart, Send, Sparkles, Lock, Eye } from "lucide-react";
import { Blessing } from "../types";
import { submitBlessing, getAdminData } from "../firebase";

interface BlessingsWallProps {
  blessings: Blessing[];
  onRefresh: () => void;
}

export default function BlessingsWall({ blessings, onRefresh }: BlessingsWallProps) {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  // Admin View State
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const handleUnlock = async () => {
    try {
      // Validate password via getAdminData
      await getAdminData(adminPassword);
      setAdminUnlocked(true);
      setAdminError("");
    } catch (e: any) {
      setAdminError(e.message || "Invalid password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setStatus("submitting");

    try {
      await submitBlessing(formData);
      setStatus("success");
      setFormData({ name: "", message: "" });
      onRefresh(); // reload parent database list
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <section id="blessings-section" className="relative py-24 px-4 z-10 max-w-5xl mx-auto text-center">
      
      <div className="text-center mb-16">
        <span className="text-gray-600 font-serif text-sm tracking-[0.25em] uppercase block mb-2">
          Shower of Love
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wider font-semibold mb-3">
          The Blessings Wall
        </h2>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* BLESSING SUBMISSION FORM */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            id="blessings-form"
            className="p-6 rounded-2xl bg-amber-50/70 border border-gold-400/10 hover:border-gold-400/20 backdrop-blur-md shadow-2xl text-left relative overflow-hidden transition-all"
          >
            {/* Form decorative shine */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-gray-600 animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-gold-200">
                Send Your Blessings
              </h3>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold font-sans mb-1 block">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full bg-amber-100/50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 placeholder-gray-500 focus:outline-none focus:border-gold-400/50 transition-all font-sans"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold font-sans mb-1 block">
                  Your Wishes & Prayers
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  rows={4}
                  placeholder="May God bless your matrimony..."
                  className="w-full bg-amber-100/50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 placeholder-gray-500 focus:outline-none focus:border-gold-400/50 transition-all font-sans resize-none"
                />
              </div>

              {/* Status alerts */}
              {status === "success" && (
                <div className="p-2.5 bg-amber-950/60 border border-amber-500 text-amber-200 text-[10px] rounded-lg font-medium text-center">
                  ✦ Blessing published instantly! Thank you.
                </div>
              )}

              {status === "error" && (
                <div className="p-2.5 bg-red-950/60 border border-red-500 text-red-200 text-[10px] rounded-lg font-medium text-center">
                  Failed to send blessing. Try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-2.5 px-4 rounded-lg bg-gold-600 hover:bg-gold-500 disabled:bg-gold-800 text-emerald-50 font-sans font-bold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Send className="w-3 h-3" />
                Publish Blessing
              </button>
            </div>
          </form>
        </div>

        {/* BLESSINGS ADMIN VIEW */}
        <div className="lg:col-span-2">
          {!showAdmin && (
             <button
                onClick={() => setShowAdmin(true)}
                className="mx-auto flex items-center gap-2 text-[10px] text-gold-500 hover:text-gray-600 uppercase tracking-widest font-semibold transition-colors cursor-pointer mt-10 lg:mt-0"
              >
                <Lock className="w-3 h-3" />
                View Blessings
              </button>
          )}

          <AnimatePresence>
            {showAdmin && !adminUnlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-amber-100/50 border border-gold-200/20 rounded-xl p-6 text-left">
                  <div className="flex flex-col sm:flex-row gap-4 mb-2">
                    <input
                      type="password"
                      placeholder="Enter Admin Password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="flex-1 bg-amber-50 border border-gold-200/30 rounded-lg px-4 py-2.5 text-xs text-gold-100 placeholder-gray-600 focus:outline-none focus:border-gold-400 transition-all"
                    />
                    <button
                      onClick={handleUnlock}
                      disabled={!adminPassword}
                      className="whitespace-nowrap px-6 py-2.5 bg-gold-600 hover:bg-gold-500 text-emerald-50 font-bold text-xs uppercase tracking-wider rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </div>
                  {adminError && <p className="text-red-400 text-xs mt-2 font-medium">{adminError}</p>}
                </div>
              </motion.div>
            )}

            {showAdmin && adminUnlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="h-[450px] overflow-y-auto pr-2 space-y-4 rounded-2xl p-4 bg-amber-50/20 border border-gold-200/10 custom-scrollbar"
              >
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-gold-200 font-serif text-lg">Blessings ({blessings.length})</h3>
                   <button onClick={() => setAdminUnlocked(false)} className="text-gray-600 text-[10px] uppercase cursor-pointer hover:text-gold-300">Lock</button>
                </div>
                {blessings && blessings.length > 0 ? (
                  blessings.map((bless, idx) => (
                    <motion.div
                      key={bless.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.4) }}
                      className="p-5 rounded-xl bg-amber-100/50 border border-gold-200/10 hover:border-gold-400/20 transition-all text-left relative group"
                    >
                      <MessageSquare className="absolute right-4 top-4 w-4 h-4 text-gold-500/10 group-hover:text-gold-500/20 transition-all" />
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-gray-600" />
                        <span className="font-serif text-sm font-semibold text-gold-200">
                          {bless.name}
                        </span>
                        <span className="text-[9px] text-gray-500 font-sans ml-auto">
                          {new Date(bless.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 font-sans text-xs leading-relaxed italic">
                        "{bless.message}"
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <span className="text-gold-500 text-3xl mb-3">⚜</span>
                    <p className="text-gray-600 text-xs">
                      No blessings recorded yet. Be the first to bless the couple!
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </section>
  );
}
