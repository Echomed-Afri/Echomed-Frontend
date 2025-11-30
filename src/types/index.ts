export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isOnline?: boolean;
  createdAt: string;
  updatedAt?: string;

  // Patient specific
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: { name: string; phone: string };
  medicalHistory?: {
    conditions: string[];
    allergies: string[];
    medications: string[];
  };

  // Doctor specific
  specialty?: string;
  hospital?: string;
  bio?: string;
  rating?: number;
  isVerified?: boolean;
  licenseNumber?: string;
  availability?: {
    days: string[];
    hours: string;
  };

  // Frontend specific / Legacy
  location?: string;
  preferredLanguage?: Language;
  age?: number; // Derived or legacy
  conditions?: string[]; // Legacy alias for medicalHistory.conditions
  allergies?: string[]; // Legacy alias for medicalHistory.allergies
  bloodGroup?: string;
}

export interface Doctor extends User {
  role: "DOCTOR";
  experience?: number;
  languages?: Language[];
  avatar?: string;
}

export interface Patient extends User {
  role: "PATIENT";
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  type: "VIDEO" | "AUDIO" | "CHAT";
  createdAt: string;
  updatedAt?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;

  // Populated fields
  patient?: User;
  doctor?: User;
  patientName?: string;
  doctorName?: string;

  // Frontend specific
  category?: ConsultationCategory;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
  scheduledAt?: string; // Alias for startTime
}

export interface HomeVisit {
  id: string;
  patientId: string;
  symptoms: string;
  preferredDate: Date;
  location: {
    address: string;
    coordinates: [number, number];
    directions: string;
  };
  status: "pending" | "confirmed" | "in-progress" | "completed";
  assignedProvider?: string;
  cost: number;
}

export interface MenstrualCycle {
  id: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  flow: "light" | "medium" | "heavy";
  symptoms: string[];
  mood: string[];
  notes?: string;
}

export type Language = "en" | "tw" | "ee" | "ga" | "ha";

export type ConsultationCategory =
  | "general"
  | "womens-health"
  | "pediatrics"
  | "dermatology"
  | "mental-health"
  | "psychology";

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
  language: Language;
  imageUrl?: string;
}
