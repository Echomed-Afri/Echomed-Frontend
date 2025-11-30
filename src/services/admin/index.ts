import api from "../api";

// Use a different token key for admin, if available
const withAdminAuth = (headers: any = {}) => {
  const adminToken = localStorage.getItem("echomed_admin_token");
  if (adminToken) {
    headers.Authorization = `Bearer ${adminToken}`;
  }
  return { headers };
};

export const adminUsersAPI = {
  list: async (params?: {
    page?: number;
    limit?: number;
    role?: "PATIENT" | "DOCTOR";
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.role) searchParams.append("role", params.role);

    const qs = searchParams.toString();
    const url = qs ? `/admin/users?${qs}` : "/admin/users";
    const response = await api.get(url, withAdminAuth());
    return response.data;
  },
  search: async (
    q: string,
    role?: "PATIENT" | "DOCTOR",
    page?: number,
    limit?: number
  ) => {
    const params = new URLSearchParams();
    params.append("q", q);
    if (role) params.append("role", role);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    const response = await api.get(
      `/admin/users/search?${params.toString()}`,
      withAdminAuth()
    );
    return response.data;
  },
  get: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`, withAdminAuth());
    return response.data;
  },
  create: async (userData: any) => {
    const response = await api.post("/admin/users", userData, withAdminAuth());
    return response.data;
  },
  update: async (userId: string, userData: any) => {
    const response = await api.put(
      `/admin/users/${userId}`,
      userData,
      withAdminAuth()
    );
    return response.data;
  },
  updateVerification: async (userId: string, isVerified: boolean) => {
    const response = await api.put(
      `/admin/users/${userId}/verification`,
      { isVerified },
      withAdminAuth()
    );
    return response.data;
  },
  remove: async (userId: string) => {
    const response = await api.delete(
      `/admin/users/${userId}`,
      withAdminAuth()
    );
    return response.data;
  },
};

// Doctor verification API
export const adminDoctorsAPI = {
  getPending: async (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    const response = await api.get(
      `/admin/doctors/pending?${searchParams.toString()}`,
      withAdminAuth()
    );
    return response.data;
  },
  verify: async (doctorId: string) => {
    const response = await api.post(
      `/admin/doctors/${doctorId}/verify`,
      {},
      withAdminAuth()
    );
    return response.data;
  },
  reject: async (doctorId: string, reason?: string) => {
    const response = await api.post(
      `/admin/doctors/${doctorId}/reject`,
      { reason },
      withAdminAuth()
    );
    return response.data;
  },
};

export const adminConsultationsAPI = {
  list: async () => {
    const response = await api.get("/admin/consultations", withAdminAuth());
    return response.data;
  },
  get: async (consultationId: string) => {
    const response = await api.get(
      `/admin/consultations/${consultationId}`,
      withAdminAuth()
    );
    return response.data;
  },
  updateStatus: async (
    consultationId: string,
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  ) => {
    const response = await api.put(
      `/admin/consultations/${consultationId}/status`,
      { status },
      withAdminAuth()
    );
    return response.data;
  },
};

export const adminPrescriptionsAPI = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    doctorId?: string;
    patientId?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));
    if (params?.status) searchParams.append("status", params.status);
    if (params?.doctorId) searchParams.append("doctorId", params.doctorId);
    if (params?.patientId) searchParams.append("patientId", params.patientId);

    const response = await api.get(
      `/admin/prescriptions?${searchParams.toString()}`,
      withAdminAuth()
    );
    return response.data;
  },
  get: async (prescriptionId: string) => {
    const response = await api.get(
      `/admin/prescriptions/${prescriptionId}`,
      withAdminAuth()
    );
    return response.data;
  },
  updateStatus: async (
    prescriptionId: string,
    status: "ACTIVE" | "COMPLETED" | "CANCELLED"
  ) => {
    const response = await api.put(
      `/admin/prescriptions/${prescriptionId}/status`,
      { status },
      withAdminAuth()
    );
    return response.data;
  },
};

export const adminSystemAPI = {
  stats: async () => {
    const response = await api.get("/admin/stats", withAdminAuth());
    return response.data;
  },
  health: async () => {
    const response = await api.get("/admin/health", withAdminAuth());
    return response.data;
  },
};
