import axios from "axios";

// API Base URL Configuration
// In development: use localhost
// In production: use Render backend URL (set via environment variable)
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL || "https://your-app-name.onrender.com/api"
    : "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("echomed_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
  getAvailableDoctors: async (category?: string, isOnline?: boolean) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (isOnline !== undefined) params.append("isOnline", isOnline.toString());

    const response = await api.get(`/doctors?${params.toString()}`);
    return response.data;
  },

  // Get current doctor's profile (requires auth token)
  getDoctorProfile: async (doctorId: string) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  updateDoctorStatus: async (doctorId: string, isOnline: boolean) => {
    const response = await api.put(`/doctors/${doctorId}/status`, { isOnline });
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
    const response = await api.get(`/doctors/${doctorId}/consultations`);
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
