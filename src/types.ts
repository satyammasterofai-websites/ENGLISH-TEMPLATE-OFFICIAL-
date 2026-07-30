export interface SectionConfig {
  countdown: boolean;
  couple: boolean;
  invitationMessage: boolean;
  gallery: boolean;
  pickYourSide: boolean;
  scratchCards: boolean;
  timeline: boolean;
  family: boolean;
  location: boolean;
  rsvp: boolean;
  blessings: boolean;
}

export interface SEOMetadata {
  title: string;
  description: string;
  image: string;
}

export interface SettingsConfig {
  heroImage: string;
  eventsImage?: string;
  logoUrl: string;
  faviconUrl: string;
  bgMusicUrl: string;
  sections: SectionConfig;
  seo: SEOMetadata;
  adminPassword?: string;
}

export interface PersonDetails {
  name: string;
  parents: string;
  image: string;
}

export interface CoupleConfig {
  groom: PersonDetails;
  bride: PersonDetails;
  invitation: string;
  countdownDate: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  details: string;
  mapsLink: string;
  calendarTitle: string;
  calendarDesc: string;
  calendarDate: string;
  image?: string;
}

export interface FamilyRelation {
  relation: string;
  name: string;
}

export interface FamilyConfig {
  bride: FamilyRelation;
  groom: FamilyRelation;
}

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  email: string;
  guests: number;
  attending: "Yes" | "No" | "Maybe";
  side?: string;
  message: string;
  timestamp: string;
}

export interface Blessing {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface WeddingData {
  settings: SettingsConfig;
  couple: CoupleConfig;
  events: WeddingEvent[];
  family: FamilyConfig;
  gallery: string[];
  blessings: Blessing[];
}

export interface FullAdminData extends WeddingData {
  rsvps: RSVP[];
}
