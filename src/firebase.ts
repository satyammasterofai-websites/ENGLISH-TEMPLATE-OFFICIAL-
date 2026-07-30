import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  memoryLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAMkWZ4HDDXtPlMb5YrgANmddy9Kc7gqc",
  authDomain: "ganpati-it-solution.firebaseapp.com",
  databaseURL: "https://ganpati-it-solution-default-rtdb.firebaseio.com",
  projectId: "ganpati-it-solution",
  storageBucket: "ganpati-it-solution.firebasestorage.app",
  messagingSenderId: "750617637566",
  appId: "1:750617637566:web:41a6d1ff352a21d50ea4ef",
  measurementId: "G-X83SB71XSH",
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: memoryLocalCache(),
});

// Helper for initial seed data so the app always works
const FALLBACK_CONFIG = {
  settings: {
    adminPassword: "4260",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000",
    eventsImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000",
    logoUrl: "",
    faviconUrl: "",
    bgMusicUrl:
      "https://www.image2url.com/r2/default/audio/1784482114008-00613128-d6df-4522-98a2-5e6edabe723f.mp3",
    sections: {
      countdown: true,
      couple: true,
      invitationMessage: true,
      gallery: true,
      pickYourSide: true,
      scratchCards: true,
      timeline: true,
      family: true,
      location: true,
      rsvp: true,
      blessings: true,
    },
    seo: {
      title: "Michael & Sarah - Holy Matrimony Invitation",
      description:
        "We warmly invite you to celebrate the Holy Sacrament of Matrimony as we begin our beautiful journey together in faith, hope, and love.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    },
  },
  couple: {
    groom: {
      name: "Michael Alexander",
      parents: "Son of David & Elizabeth Alexander",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    },
    bride: {
      name: "Sarah Jenkins",
      parents: "Daughter of Robert & Martha Jenkins",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    },
    invitation:
      "With immense joy and heartfelt gratitude to God, we warmly invite you to witness and celebrate the Holy Sacrament of Matrimony as we begin our beautiful journey together in faith, hope, and everlasting love. Your prayers, blessings, and presence will make our celebration truly complete.",
    countdownDate: "2026-11-25T14:00:00",
  },
  events: [
    {
      id: "matrimony",
      title: "Holy Matrimony",
      date: "Saturday, 25 November 2026",
      time: "02:00 PM",
      venue: "Grace Cathedral, San Francisco",
      details: "Diocese of California",
      mapsLink: "https://maps.app.goo.gl/",
      calendarTitle: "Michael & Sarah - Holy Matrimony",
      calendarDesc: "Join us for our Holy Matrimony service.",
      calendarDate: "2026-11-25T14:00:00",
      image:
        "https://images.unsplash.com/photo-1544591522-8d76db86f5c5?auto=format&fit=crop&q=80&w=900",
    },
    {
      id: "rehearsal-dinner",
      title: "Rehearsal Dinner",
      date: "Friday, 24 November 2026",
      time: "06:30 PM",
      venue: "The Palace Hotel",
      details: "Intimate dinner for family and wedding party",
      mapsLink: "https://maps.app.goo.gl/",
      calendarTitle: "Michael & Sarah - Rehearsal Dinner",
      calendarDesc: "Rehearsal Dinner",
      calendarDate: "2026-11-24T18:30:00",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=900",
    },
    {
      id: "reception",
      title: "Wedding Reception",
      date: "Saturday, 25 November 2026",
      time: "05:00 PM",
      venue: "Fairmont San Francisco",
      details: "Celebratory Feast, Toasts & Dancing",
      mapsLink: "https://maps.app.goo.gl/",
      calendarTitle: "Michael & Sarah - Wedding Reception",
      calendarDesc: "Join us for our wedding reception.",
      calendarDate: "2026-11-25T17:00:00",
      image:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=900",
    },
    {
      id: "farewell-brunch",
      title: "Farewell Brunch",
      date: "Sunday, 26 November 2026",
      time: "10:30 AM",
      venue: "The Alexander Residence",
      details: "Casual brunch to bid farewell to the newlyweds",
      mapsLink: "",
      calendarTitle: "Michael & Sarah - Farewell Brunch",
      calendarDesc: "Join us for a farewell brunch.",
      calendarDate: "2026-11-26T10:30:00",
      image:
        "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?auto=format&fit=crop&q=80&w=900",
    },
  ],
  family: {
    bride: { relation: "Sister", name: "Emily Jenkins" },
    groom: { relation: "Brother", name: "David Alexander Jr." },
  },
  gallery: [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1520854221256-17451cc35dcd?auto=format&fit=crop&q=80&w=1000",
  ],
};

export const getPublicData = async () => {
  const fetchWithTimeout = <T>(promise: Promise<T>, ms: number) => {
    let timeoutId: any;
    const timeoutPromise = new Promise<T>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Timeout')), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
  };

  try {
    const configSnap = await fetchWithTimeout(getDoc(doc(db, "wedding", "config")), 2000);
    const config = configSnap.exists() ? configSnap.data() : FALLBACK_CONFIG;
    const blessingsSnap = await fetchWithTimeout(
      getDocs(query(collection(db, "blessings"), orderBy("timestamp", "desc"))),
      2000
    );
    const blessings = blessingsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    return {
      settings: config.settings,
      couple: config.couple,
      events: config.events,
      family: config.family,
      gallery: config.gallery,
      blessings: blessings,
    };
  } catch (e) {
    console.warn("Firebase read failed or timed out, falling back to local defaults.", e);
    return { ...FALLBACK_CONFIG, blessings: [] };
  }
};

export const submitRSVP = async (data: any) => {
  return await addDoc(collection(db, "rsvps"), {
    ...data,
    timestamp: serverTimestamp(),
  });
};

export const submitBlessing = async (data: any) => {
  return await addDoc(collection(db, "blessings"), {
    ...data,
    timestamp: serverTimestamp(),
  });
};

export const getAdminData = async (password: string) => {
  const configSnap = await getDoc(doc(db, "wedding", "config"));
  const config = configSnap.exists() ? configSnap.data() : FALLBACK_CONFIG;
  const correctPassword = config.settings?.adminPassword || "admin";

  if (password !== correctPassword) throw new Error("Incorrect Password.");

  const rsvpsSnap = await getDocs(
    query(collection(db, "rsvps"), orderBy("timestamp", "desc")),
  );
  const rsvps = rsvpsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const blessingsSnap = await getDocs(
    query(collection(db, "blessings"), orderBy("timestamp", "desc")),
  );
  const blessings = blessingsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return {
    ...config,
    rsvps,
    blessings,
  };
};

export const updateAdminData = async (password: string, updates: any) => {
  const current: any = await getAdminData(password);
  await setDoc(
    doc(db, "wedding", "config"),
    {
      settings: { ...current.settings, ...updates.settings },
      couple: { ...current.couple, ...updates.couple },
      events: updates.events || current.events,
      family: updates.family || current.family,
      gallery: updates.gallery || current.gallery,
    },
    { merge: true },
  );
};

export const deleteRsvp = async (id: string) => {
  await deleteDoc(doc(db, "rsvps", id));
};

export const deleteBlessing = async (id: string) => {
  await deleteDoc(doc(db, "blessings", id));
};
