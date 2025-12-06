import axios from "axios";

// API Base URL Configuration
// Use environment variable for all environments
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("echomed_token") || localStorage.getItem("echomed_admin_token");
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Always add apikey for Supabase Gateway
  if (anonKey) {
    config.headers.apikey = anonKey;
  }

  // Always use Anon Key for Authorization to satisfy Supabase Gateway
  if (anonKey) {
    config.headers.Authorization = `Bearer ${anonKey}`;
  }

  if (token) {
    // Pass our custom token in a separate header to bypass Gateway validation
    config.headers['x-custom-auth'] = token;
  }
  
  return config;
});

export interface LoginResponse {
  user?: any;
  doctor?: any;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Auth API
export const authAPI = {
  // Patient auth
  registerPatient: async (userData: any): Promise<LoginResponse> => {
    const response = await api.post("/auth/patient/register", userData);
    return response.data;
  },

  loginPatient: async (
    supabaseUserId: string,
    email: string
  ): Promise<LoginResponse> => {
    const response = await api.post("/auth/patient/login", {
      supabaseUserId,
      email,
    });
    return response.data;
  },

  // Doctor auth
  registerDoctor: async (doctorData: any): Promise<LoginResponse> => {
    const response = await api.post("/auth/doctor/register", doctorData);
    return response.data;
  },

  loginDoctor: async (
    supabaseUserId: string,
    email: string
  ): Promise<LoginResponse> => {
    const response = await api.post("/auth/doctor/login", {
      supabaseUserId,
      email,
    });
    return response.data;
  },
};

// Patients API
export const patientAPI = {
  getAllPrescriptions: async (patientId: string) => {
    const response = await api.get(`/patient/${patientId}/prescription`);
    return response.data;
  },
};

// Doctors API
export const doctorsAPI = {
  getAvailableDoctors: async (category?: string, isAvailable?: boolean) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (isAvailable !== undefined) params.append("isAvailable", isAvailable.toString());

    const response = await api.get(`/doctors?${params.toString()}`);
    return response.data;
  },

  // Get current doctor's profile (requires auth token)
  getDoctorProfile: async (doctorId: string) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  updateDoctorStatus: async (doctorId: string, isAvailable: boolean) => {
    const response = await api.put(`/doctors/${doctorId}/status`, { isAvailable });
    return response.data;
  },

  updateDoctorProfile: async (doctorId: string, doctorData: any) => {
    const response = await api.put(`/doctors/${doctorId}/profile`, doctorData);
    return response.data;
  },
};

// Consultations API
export const consultationsAPI = {
  createConsultation: async (consultationData: any) => {
    const response = await api.post("/consultations", consultationData);
    return response.data;
  },

  getConsultations: async (doctorId: String) => {
    // Backend infers doctor ID from the auth token
    const response = await api.get(`/consultations`);
    return response.data;
  },

  updateConsultationStatus: async (consultationId: string, status: string) => {
    const response = await api.put(`/consultations/${consultationId}/status`, {
      status,
    });
    return response.data;
  },
};

export default api;
