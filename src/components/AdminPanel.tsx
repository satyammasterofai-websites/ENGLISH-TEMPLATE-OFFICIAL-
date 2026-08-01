import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Settings, Users, Image as ImageIcon, Heart, Calendar, Eye, Download, Trash2, Save, LogOut, Check, Sliders, MapPin } from "lucide-react";
import { FullAdminData, RSVP, Blessing, WeddingEvent, CoupleConfig } from "../types";
import { getAdminData, updateAdminData, deleteRsvp, deleteBlessing } from "../firebase";

interface AdminPanelProps {
  onClose: () => void;
  onRefreshPublicData: () => void;
}

export default function AdminPanel({ onClose, onRefreshPublicData }: AdminPanelProps) {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"couple" | "sections" | "events" | "registries" | "gallery" | "rsvps" | "blessings">("couple");
  const [db, setDb] = useState<FullAdminData | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Load Admin Data upon successful login
  const fetchAdminData = async (pass: string) => {
    try {
      const data = await getAdminData(pass);
      setDb(data);
      setIsLoggedIn(true);
      sessionStorage.setItem("admin_password", pass);
    } catch (err: any) {
      setLoginError(err.message || "Invalid password. Please try again.");
    }
  };

  // Check session storage on mount
  useEffect(() => {
    const savedPass = sessionStorage.getItem("admin_password");
    if (savedPass) {
      setPassword(savedPass);
      fetchAdminData(savedPass);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    fetchAdminData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    setIsLoggedIn(false);
    setPassword("");
    setDb(null);
  };

  // Save changes to backend database
  const handleSave = async () => {
    if (!db) return;
    setSaveStatus("saving");
    try {
      await updateAdminData(password, db);
      setSaveStatus("success");
      onRefreshPublicData(); // refresh the background public website values!
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e) {
      setSaveStatus("error");
    }
  };

  // Delete RSVP item
  const handleDeleteRsvp = async (rsvpId: string) => {
    if (!confirm("Are you sure you want to delete this RSVP response?")) return;
    try {
      await deleteRsvp(rsvpId);
      if (db) {
        setDb({
          ...db,
          rsvps: db.rsvps.filter((r) => r.id !== rsvpId)
        });
      }
    } catch (e) {
      alert("Error deleting RSVP.");
    }
  };

  // Delete Blessing item
  const handleDeleteBlessing = async (blessId: string) => {
    if (!confirm("Are you sure you want to delete this blessing?")) return;
    try {
      await deleteBlessing(blessId);
      if (db) {
        setDb({
          ...db,
          blessings: db.blessings.filter((b) => b.id !== blessId)
        });
      }
    } catch (e) {
      alert("Error deleting blessing.");
    }
  };

  // CSV Export Trigger
  const handleCSVExport = () => {
    if (!db) return;
    let csv = "ID,Full Name,Phone Number,Email,Number of Guests,Will Attend?,Message,Submitted At\n";
    db.rsvps.forEach((r: any) => {
      const name = `"${(r.name || '').replace(/"/g, '""')}"`;
      const phone = `"${(r.phone || '').replace(/"/g, '""')}"`;
      const email = `"${(r.email || '').replace(/"/g, '""')}"`;
      const guests = r.guests || 1;
      const attending = `"${(r.attending || '').replace(/"/g, '""')}"`;
      const message = `"${(r.message || '').replace(/"/g, '""')}"`;
      const time = `"${(r.timestamp ? new Date(r.timestamp?.seconds ? r.timestamp.seconds * 1000 : r.timestamp).toISOString() : '').replace(/"/g, '""')}"`;
      csv += `${r.id},${name},${phone},${email},${guests},${attending},${message},${time}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rsvps.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Nested State Updates
  const updateGroom = (field: string, value: string) => {
    if (!db) return;
    setDb({
      ...db,
      couple: {
        ...db.couple,
        groom: { ...db.couple.groom, [field]: value }
      }
    });
  };

  const updateBride = (field: string, value: string) => {
    if (!db) return;
    setDb({
      ...db,
      couple: {
        ...db.couple,
        bride: { ...db.couple.bride, [field]: value }
      }
    });
  };

  const updateSections = (sectionName: string, enabled: boolean) => {
    if (!db) return;
    setDb({
      ...db,
      settings: {
        ...db.settings,
        sections: { ...db.settings.sections, [sectionName]: enabled }
      }
    });
  };

  const updateEventField = (index: number, field: keyof WeddingEvent, value: string) => {
    if (!db) return;
    const updatedEvents = [...db.events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setDb({ ...db, events: updatedEvents });
  };

  const removeEvent = (index: number) => {
    if (!db) return;
    const updatedEvents = db.events.filter((_, i) => i !== index);
    setDb({ ...db, events: updatedEvents });
  };

  // Add Gallery Image URL
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl || !db) return;
    setDb({
      ...db,
      gallery: [...db.gallery, newGalleryUrl]
    });
    setNewGalleryUrl("");
  };

  // Remove Gallery Image
  const handleRemoveGalleryImage = (idx: number) => {
    if (!db) return;
    setDb({
      ...db,
      gallery: db.gallery.filter((_, i) => i !== idx)
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, updater: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updater(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-amber-50/95 overflow-y-auto px-4 py-8 flex items-start justify-center backdrop-blur-md">
      
      {/* 1. LOCKSCREEN VIEW */}
      {!isLoggedIn ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-amber-50 p-8 rounded-3xl border border-gold-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mt-20 relative text-center"
        >
          {/* Victorian corner ornaments */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-gold-400" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-gold-400" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-gold-400" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-gold-400" />

          <div className="w-16 h-16 bg-gold-400/10 border border-gold-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-gold-200" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-gold-200 tracking-wider mb-2">
            Admin Lockscreen
          </h1>
          <p className="text-gray-600 text-xs font-sans max-w-xs mx-auto mb-6">
            Please enter your administrator access credentials to configure the wedding invitation details.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] text-gold-200 uppercase tracking-widest font-semibold font-sans mb-1 block">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (default: admin)"
                className="w-full bg-amber-100 border border-gold-200/20 rounded-xl px-4 py-3 text-sm text-gold-100 placeholder-gray-600 focus:outline-none focus:border-gold-400/80 font-sans"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/50 border border-red-500 text-red-200 text-xs rounded-xl text-center font-medium">
                {loginError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 border border-gold-200/20 text-gold-200 hover:text-gold-200 hover:bg-emerald-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Panel
              </button>
              <button
                type="submit"
                id="login-btn"
                className="flex-1 py-3 px-4 rounded-xl bg-gold-600 hover:bg-gold-500 text-emerald-50 font-sans font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
              >
                Access Admin
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        
        /* 2. ADMIN DASHBOARD PANEL */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl bg-amber-50 rounded-3xl border border-gold-400/30 shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-amber-100 px-6 py-5 border-b border-gold-200/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-400/10 rounded-full border border-gold-400/30">
                <Settings className="w-5 h-5 text-gold-200 animate-spin" />
              </div>
              <div className="text-left">
                <h2 className="font-serif text-lg font-bold text-gold-200 tracking-wider">
                  Wedding Administration Center
                </h2>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-sans font-medium">
                  Direct Real-time Invitation Customization
                </p>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleSave}
                id="save-admin-btn"
                disabled={saveStatus === "saving"}
                className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-gold-600 hover:bg-gold-500 text-emerald-50 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:bg-gold-800"
              >
                {saveStatus === "saving" ? (
                  <div className="w-3.5 h-3.5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                ) : saveStatus === "success" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Publish Changes
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-800 border border-gold-200/20 text-gold-200 hover:text-gold-200 hover:bg-emerald-700 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>

              <button
                onClick={onClose}
                className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-800 border border-gold-200/20 text-gold-200 hover:text-gold-200 hover:bg-emerald-700 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Exit Admin
              </button>
            </div>
          </div>

          {/* Error / Success Floating Alerts */}
          {saveStatus === "success" && (
            <div className="bg-amber-950 border-b border-amber-500 text-amber-200 text-xs py-3 text-center font-medium tracking-wide">
              ✦ Success: Changes written to db.json and published live!
            </div>
          )}
          {saveStatus === "error" && (
            <div className="bg-red-950 border-b border-red-500 text-red-200 text-xs py-3 text-center font-medium tracking-wide">
              Failed to write database file. Please inspect the container log.
            </div>
          )}

          {/* Workspace body layout */}
          <div className="flex flex-col md:flex-row min-h-[500px]">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-amber-100/30 border-r border-gold-200/10 p-4 space-y-1.5 flex flex-col">
              <button
                onClick={() => setActiveTab("couple")}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "couple" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }`}
              >
                <Heart className="w-4 h-4 shrink-0" />
                Couple profiles
              </button>

              <button
                onClick={() => setActiveTab("sections")}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "sections" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0" />
                Theme & Sections
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "events" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                Liturgical Events
              </button>

              <button
                onClick={() => setActiveTab("registries")}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "registries" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }`}
              >
                <Heart className="w-4 h-4 shrink-0" />
                Registries
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "gallery" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                Photo gallery
              </button>

              <button
                onClick={() => setActiveTab("rsvps")}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeTab === "rsvps" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                RSVP Responses
                {db && db.rsvps && db.rsvps.length > 0 && (
                  <span className="absolute right-3 bg-red-600 text-white rounded-full text-[9px] px-1.5 py-0.5 font-bold leading-none">
                    {db.rsvps.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("blessings")}
                className={`flex items-center gap-2.5 w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "blessings" ? "bg-gold-600 text-emerald-50 shadow-md" : "text-gold-200 hover:bg-amber-100"
                }`}
              >
                <Heart className="w-4 h-4 shrink-0 fill-current" />
                Wishes Wall
              </button>
            </div>

            {/* Config Workspace */}
            <div className="flex-1 p-6 text-left max-w-full overflow-hidden">
              {db && (
                <>
                  {/* TAB 1: COUPLE & PARENTS */}
                  {activeTab === "couple" && (
                    <div className="space-y-6">
                      <h3 className="font-serif text-xl text-gold-200 border-b border-gold-200/10 pb-2 mb-4">
                        Edit Groom & Bride Profiles
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Groom */}
                        <div className="p-4 bg-amber-100/40 rounded-xl border border-gold-200/10 space-y-4">
                          <h4 className="font-serif text-gold-200 uppercase tracking-widest text-xs mb-2">Groom Profiles</h4>
                          
                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Full Name</label>
                            <input
                              type="text"
                              value={db.couple.groom.name}
                              onChange={(e) => updateGroom("name", e.target.value)}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Parent Details</label>
                            <input
                              type="text"
                              value={db.couple.groom.parents}
                              onChange={(e) => updateGroom("parents", e.target.value)}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans block">Profile Picture URL</label>
                              <label className="text-[9px] text-gold-200 uppercase cursor-pointer hover:text-gold-200">
                                Upload File
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => updateGroom("image", url))} />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={db.couple.groom.image}
                              onChange={(e) => updateGroom("image", e.target.value)}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>
                        </div>

                        {/* Bride */}
                        <div className="p-4 bg-amber-100/40 rounded-xl border border-gold-200/10 space-y-4">
                          <h4 className="font-serif text-gold-200 uppercase tracking-widest text-xs mb-2">Bride Profiles</h4>
                          
                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Full Name</label>
                            <input
                              type="text"
                              value={db.couple.bride.name}
                              onChange={(e) => updateBride("name", e.target.value)}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Parent Details</label>
                            <input
                              type="text"
                              value={db.couple.bride.parents}
                              onChange={(e) => updateBride("parents", e.target.value)}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans block">Profile Picture URL</label>
                              <label className="text-[9px] text-gold-200 uppercase cursor-pointer hover:text-gold-200">
                                Upload File
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => updateBride("image", url))} />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={db.couple.bride.image}
                              onChange={(e) => updateBride("image", e.target.value)}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* General settings */}
                      <div className="p-4 bg-amber-100/40 rounded-xl border border-gold-200/10 space-y-4">
                        <h4 className="font-serif text-gold-200 uppercase tracking-widest text-xs mb-2">General Content Config</h4>

                        <div>
                          <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Invitation Message</label>
                          <textarea
                            rows={3}
                            value={db.couple.invitation}
                            onChange={(e) => setDb({ ...db, couple: { ...db.couple, invitation: e.target.value } })}
                            className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Wedding Countdown Target (ISO format)</label>
                            <input
                              type="datetime-local"
                              value={db.couple.countdownDate.substring(0, 16)}
                              onChange={(e) => setDb({ ...db, couple: { ...db.couple, countdownDate: e.target.value } })}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Background Music URL (.mp3)</label>
                            <input
                              type="text"
                              value={db.settings.bgMusicUrl}
                              onChange={(e) => setDb({ ...db, settings: { ...db.settings, bgMusicUrl: e.target.value } })}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SECTIONS & THEME */}
                  {activeTab === "sections" && (
                    <div className="space-y-6">
                      <h3 className="font-serif text-xl text-gold-200 border-b border-gold-200/10 pb-2 mb-4">
                        Enable / Disable Invitation Sections
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Object.keys(db.settings.sections).map((secKey) => {
                          const isEnabled = (db.settings.sections as any)[secKey];
                          return (
                            <button
                              key={secKey}
                              type="button"
                              onClick={() => updateSections(secKey, !isEnabled)}
                              className={`p-3.5 rounded-xl border text-center font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all ${
                                isEnabled
                                  ? "bg-gold-600/10 border-gold-400 text-gold-200 shadow-md"
                                  : "bg-amber-100/20 border-gold-200/20 text-gray-500 hover:border-gold-400/20"
                              }`}
                            >
                              {secKey}
                              <div className="text-[9px] mt-1 font-medium text-gray-600">
                                {isEnabled ? "● ENABLED" : "○ DISABLED"}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Hero and SEO */}
                      <div className="p-4 bg-amber-100/40 rounded-xl border border-gold-200/10 space-y-4 mt-6">
                        <h4 className="font-serif text-gold-200 uppercase tracking-widest text-xs mb-2">Hero Cover & SEO Metadata</h4>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans block">Hero Image URL</label>
                            <label className="text-[9px] text-gold-200 uppercase cursor-pointer hover:text-gold-200">
                              Upload File
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setDb({ ...db, settings: { ...db.settings, heroImage: url } }))} />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={db.settings.heroImage}
                            onChange={(e) => setDb({ ...db, settings: { ...db.settings, heroImage: e.target.value } })}
                            className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans block">Events Image URL</label>
                            <label className="text-[9px] text-gold-200 uppercase cursor-pointer hover:text-gold-200">
                              Upload File
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setDb({ ...db, settings: { ...db.settings, eventsImage: url } }))} />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={db.settings.eventsImage || ""}
                            onChange={(e) => setDb({ ...db, settings: { ...db.settings, eventsImage: e.target.value } })}
                            className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">SEO Browser Tab Title</label>
                            <input
                              type="text"
                              value={db.settings.seo.title}
                              onChange={(e) => setDb({ ...db, settings: { ...db.settings, seo: { ...db.settings.seo, title: e.target.value } } })}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">SEO Sharing Description</label>
                            <input
                              type="text"
                              value={db.settings.seo.description}
                              onChange={(e) => setDb({ ...db, settings: { ...db.settings, seo: { ...db.settings.seo, description: e.target.value } } })}
                              className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: EVENTS SCRATCH CARDS */}
                  {activeTab === "events" && (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      <h3 className="font-serif text-xl text-gold-200 border-b border-gold-200/10 pb-2 mb-4">
                        Edit Event Scratch Card Timings & Directions
                      </h3>

                      <div className="space-y-8">
                        {db.events && db.events.map((event, idx) => (
                          <div key={event.id} className="p-4 bg-amber-100/40 rounded-xl border border-gold-200/10 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-200 font-serif text-xs font-semibold">
                                  {idx + 1}
                                </span>
                                <h4 className="font-serif text-gold-200 font-semibold text-sm">{event.title} Card ({event.id})</h4>
                              </div>
                              <button
                                onClick={() => removeEvent(idx)}
                                className="text-red-400 hover:text-red-300 text-xs tracking-wider uppercase flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Card Display Date</label>
                                <input
                                  type="text"
                                  value={event.date}
                                  onChange={(e) => updateEventField(idx, "date", e.target.value)}
                                  className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Card Display Time</label>
                                <input
                                  type="text"
                                  value={event.time}
                                  onChange={(e) => updateEventField(idx, "time", e.target.value)}
                                  className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Venue Name</label>
                                <input
                                  type="text"
                                  value={event.venue}
                                  onChange={(e) => updateEventField(idx, "venue", e.target.value)}
                                  className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Venue Diocese / Sub-details</label>
                                <input
                                  type="text"
                                  value={event.details}
                                  onChange={(e) => updateEventField(idx, "details", e.target.value)}
                                  className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans mb-1 block">Google Maps Share Link</label>
                              <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-gold-500/40" />
                                <input
                                  type="text"
                                  value={event.mapsLink}
                                  onChange={(e) => updateEventField(idx, "mapsLink", e.target.value)}
                                  className="w-full bg-amber-50 border border-gold-200/20 rounded-lg pl-9 pr-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans block">Event Thumbnail Image URL</label>
                                <label className="text-[9px] text-gold-200 uppercase cursor-pointer hover:text-gold-200">
                                  Upload File
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => updateEventField(idx, "image", url))} />
                                </label>
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={event.image || ""}
                                  onChange={(e) => updateEventField(idx, "image", e.target.value)}
                                  placeholder="Enter image URL or upload file"
                                  className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PHOTO GALLERY UPLOAD */}
                  {activeTab === "registries" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-serif text-gold-200">Gift Registries</h3>
                        <button
                          onClick={handleAddRegistry}
                          className="px-3 py-1.5 bg-amber-100 text-gold-600 rounded-lg text-sm font-medium hover:bg-gold-200 transition-colors"
                        >
                          + Add Registry
                        </button>
                      </div>

                      <div className="grid gap-4">
                        {db.registries?.map((reg, idx) => (
                          <div key={idx} className="bg-amber-50/50 p-4 rounded-xl border border-gold-200/30 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gold-200">Registry {idx + 1}</h4>
                              <button
                                onClick={() => handleRemoveRegistry(idx)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">Store Name</label>
                                <input
                                  type="text"
                                  value={reg.storeName}
                                  onChange={(e) => handleUpdateRegistry(idx, "storeName", e.target.value)}
                                  className="w-full bg-white border border-gold-200/30 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gold-400"
                                  placeholder="e.g. Macy's"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">URL Link</label>
                                <input
                                  type="text"
                                  value={reg.url}
                                  onChange={(e) => handleUpdateRegistry(idx, "url", e.target.value)}
                                  className="w-full bg-white border border-gold-200/30 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gold-400"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider">Description (Optional)</label>
                                <input
                                  type="text"
                                  value={reg.description || ""}
                                  onChange={(e) => handleUpdateRegistry(idx, "description", e.target.value)}
                                  className="w-full bg-white border border-gold-200/30 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gold-400"
                                  placeholder="e.g. Home goods and kitchenware"
                                />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "gallery" && (
                    <div className="space-y-6">
                      <h3 className="font-serif text-xl text-gold-200 border-b border-gold-200/10 pb-2 mb-4">
                        Manage Photo Gallery Images
                      </h3>

                      {/* Add Image Box */}
                      <div className="p-4 bg-amber-100/40 rounded-xl border border-gold-200/10 flex items-end gap-3 flex-wrap">
                        <div className="flex-1 min-w-[240px]">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] text-gray-600 uppercase tracking-widest font-sans block">New Slide Image URL</label>
                            <label className="text-[9px] text-gold-200 uppercase cursor-pointer hover:text-gold-200">
                              Upload File
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewGalleryUrl(url))} />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            placeholder="Enter image URL (e.g. from Unsplash or upload)"
                            className="w-full bg-amber-50 border border-gold-200/20 rounded-lg px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddGalleryImage}
                          className="py-2 px-5 rounded-lg bg-gold-600 hover:bg-gold-500 text-emerald-50 font-sans font-bold uppercase tracking-wider text-xs transition-all cursor-pointer h-9 shrink-0"
                        >
                          Add Slide
                        </button>
                      </div>

                      {/* Current Image Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                        {db.gallery && db.gallery.map((img, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-gold-200/20 bg-amber-50 h-32">
                            <img src={img} alt="slide" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-500 transition-all cursor-pointer"
                                title="Remove Image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="absolute bottom-2 left-2 bg-amber-50/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-gold-200">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: RSVPS HUB */}
                  {activeTab === "rsvps" && (
                    <div className="space-y-6">
                      <div className="border-b border-gold-200/10 pb-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-xl text-gold-200">
                            Registered RSVP Attendance Responses
                          </h3>
                          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-sans font-medium">
                            {db.rsvps ? db.rsvps.length : 0} responses recorded in database
                          </p>
                        </div>

                        <button
                          onClick={handleCSVExport}
                          id="export-csv-btn"
                          className="flex items-center gap-1.5 py-2 px-4 rounded-lg bg-emerald-800 border border-gold-400/30 text-gold-200 hover:text-gold-100 hover:border-gold-400 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          Export RSVPs as CSV
                        </button>
                      </div>

                      {/* RSVPs Table */}
                      <div className="overflow-x-auto rounded-xl border border-gold-200/15 bg-amber-100/20 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-amber-100 border-b border-gold-200/25">
                              <th className="p-3 font-serif text-[11px] uppercase tracking-wider text-gold-200">Name</th>
                              <th className="p-3 font-serif text-[11px] uppercase tracking-wider text-gold-200">Contact</th>
                              <th className="p-3 font-serif text-[11px] uppercase tracking-wider text-gold-200">Side</th>
                              <th className="p-3 font-serif text-[11px] uppercase tracking-wider text-gold-200">Attending?</th>
                              <th className="p-3 font-serif text-[11px] uppercase tracking-wider text-gold-200">Guests</th>
                              <th className="p-3 font-serif text-[11px] uppercase tracking-wider text-gold-200">Message</th>
                              <th className="p-3 font-serif text-[11px] uppercase tracking-wider text-gold-200 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gold-900/5 text-xs text-gray-700">
                            {db.rsvps && db.rsvps.length > 0 ? (
                              db.rsvps.map((rsvp) => (
                                <tr key={rsvp.id} className="hover:bg-amber-100/50 transition-all">
                                  <td className="p-3 font-semibold text-gold-100">{rsvp.name}</td>
                                  <td className="p-3">
                                    <p>{rsvp.phone}</p>
                                    <p className="text-gray-500 text-[10px]">{rsvp.email}</p>
                                  </td>
                                  <td className="p-3 capitalize">{rsvp.side || "N/A"}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      rsvp.attending === "Yes" ? "bg-amber-950 text-amber-300 border border-amber-500/30" :
                                      rsvp.attending === "No" ? "bg-red-950 text-red-300 border border-red-500/30" :
                                      "bg-amber-950 text-amber-300 border border-amber-500/30"
                                    }`}>
                                      {rsvp.attending}
                                    </span>
                                  </td>
                                  <td className="p-3 text-gold-200 font-bold">{rsvp.guests}</td>
                                  <td className="p-3 max-w-[200px] truncate italic text-gray-600" title={rsvp.message}>
                                    {rsvp.message || "—"}
                                  </td>
                                  <td className="p-3 text-center">
                                    <button
                                      onClick={() => handleDeleteRsvp(rsvp.id)}
                                      className="p-1.5 rounded bg-red-950 text-red-300 hover:bg-red-900 transition-all cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                                  No RSVPs registered yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: BLESSINGS WALL MODERATOR */}
                  {activeTab === "blessings" && (
                    <div className="space-y-6">
                      <h3 className="font-serif text-xl text-gold-200 border-b border-gold-200/10 pb-2 mb-4">
                        Moderate Wishes & Prayers Wall
                      </h3>

                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {db.blessings && db.blessings.length > 0 ? (
                          db.blessings.map((bless) => (
                            <div key={bless.id} className="p-4 rounded-xl bg-amber-100/40 border border-gold-200/10 flex items-start justify-between gap-4">
                              <div className="text-left space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif text-sm font-semibold text-gold-100">{bless.name}</span>
                                  <span className="text-[9px] text-gray-500 font-sans">{new Date(bless.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-700 text-xs italic">"{bless.message}"</p>
                              </div>

                              <button
                                onClick={() => handleDeleteBlessing(bless.id)}
                                className="p-1.5 rounded bg-red-950 text-red-300 hover:bg-red-900 transition-all cursor-pointer h-8 shrink-0"
                                title="Delete Blessing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500 italic">
                            No blessings recorded on the wall.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </>
              )}
            </div>

          </div>

        </motion.div>
      )}

    </div>
  );
}
