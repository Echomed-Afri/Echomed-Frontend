import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // App Name
    appName: 'Echomed Africa',
    
    // Onboarding
    onboarding1: 'Consult with a doctor from anywhere in Ghana.',
    onboarding2: 'Pay with Mobile Money or book home visits.',
    onboarding3: 'Use voice notes if typing is hard.',
    getStarted: 'Get Started',
    
    // Authentication
    phoneNumber: 'Phone Number',
    enterPhone: 'Enter your phone number',
    verifyOTP: 'Verify OTP',
    enterOTP: 'Enter the code sent to your phone',
    referralCode: 'Referral Code (Optional)',
    
    // Profile Setup
    fullName: 'Full Name',
    gender: 'Gender',
    age: 'Age',
    location: 'Location',
    preferredLanguage: 'Preferred Language',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    
    // Home Screen
    consultNow: 'Consult a Doctor Now',
    scheduleVisit: 'Schedule Home Visit',
    myPrescriptions: 'My Prescriptions',
    healthRecords: 'My Health Records',
    menstrualTracker: 'Menstrual Tracker',
    psychConsult: 'Psychological Consult',
    recoveryPrograms: 'Recovery Retreats & Programs',
    freeConsultPromo: 'Free consultation for new users!',
    
    // Consultation
    videoCall: 'Video Call',
    voiceCall: 'Voice Call',
    textChat: 'Text Chat',
    voiceNote: 'Send Voice Note',
    general: 'General',
    womensHealth: "Women's Health",
    pediatrics: 'Pediatrics',
    dermatology: 'Skin Care',
    mentalHealth: 'Mental Health',
    
    // Chat
    typeMessage: 'Type a message...',
    
    // Common
    next: 'Next',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    
    // Health Tips
    dailyTip: 'Daily Health Tip',
    learnMore: 'Learn More'
  },
  
  tw: {
    // Twi translations
    appName: 'Echomed Africa',
    onboarding1: 'Kasa ne dɔkta bi wɔ baabiara wɔ Ghana.',
    onboarding2: 'Tua ka denam Mobile Money so anaa hyɛ fie akɔhwɛ.',
    onboarding3: 'Fa nne nkrataa di dwuma sɛ kyerɛw yɛ den a.',
    getStarted: 'Fi Ase',
    consultNow: 'Kasa ne Dɔkta Seesei',
    typeMessage: 'Kyerɛw nkrasɛm...',
    // Add more Twi translations as needed
  },
  
  ee: {
    // Ewe translations
    appName: 'Echomed Africa',
    onboarding1: 'Ƒo nu kple dokta aɖe tso Ghana ƒe afisiafi.',
    getStarted: 'Dze Egɔme',
    typeMessage: 'Ŋlɔ nya aɖe...',
    // Add more Ewe translations as needed
  },
  
  ga: {
    // Ga translations
    appName: 'Echomed Africa',
    onboarding1: 'Kɛ dokta ko lɛ Ghana afee kɛ.',
    getStarted: 'Bɛɛ Lɛ',
    typeMessage: 'Ŋmaa numo...',
    // Add more Ga translations as needed
  },
  
  ha: {
    // Hausa translations
    appName: 'Echomed Africa',
    onboarding1: 'Yi magana da likita daga ko\'ina a Ghana.',
    getStarted: 'Fara',
    typeMessage: 'Rubuta saƙo...',
    // Add more Hausa translations as needed
  }
};

export function t(key: string, language: Language): string {
  return translations[language]?.[key] || translations.en[key] || key;
}