import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { consultationsAPI, doctorsAPI } from "../../services/api";

import DoctorHeader from "../../components/doctor/DoctorHeader";
import DoctorStatsCards from "../../components/doctor/DoctorStatsCards";
import DoctorConsultationsList, {
  ConsultationItem,
} from "../../components/doctor/DoctorConsultationsList";

export default function DoctorDashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<any[]>([]);
  // Initialize from context if available
  const [isAvailable, setIsAvailable] = useState(
    (state.user as any)?.isAvailable || false
  );
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayConsultations: 0,
    pendingRequests: 0,
    rating: 4.5,
  });

  // Update isAvailable when user context changes
  useEffect(() => {
    const userAvailable = (state.user as any)?.isAvailable;
    if (userAvailable !== undefined) {
      console.log(
        "User context changed, updating isAvailable to:",
        userAvailable
      );
      setIsAvailable(userAvailable);
    }
  }, [state.user]);

  useEffect(() => {
    loadDoctorStatus();
    loadConsultations();
    return () => {
      // Cleanup
    };
  }, []);

  const loadDoctorStatus = async () => {
    const doctorUser = state.user as any;

    // Try to get doctor ID from context or localStorage
    const doctorId = doctorUser?.id || localStorage.getItem("echomed_user_id");

    if (!doctorId) {
      console.log(
        "No doctor user ID found for loading status. State.user:",
        state.user
      );
      return;
    }

    console.log("Loading doctor status for ID:", doctorId);

    try {
      const response = await doctorsAPI.getDoctorProfile(doctorId);
      console.log("Doctor profile response:", response);

      const doctor = response.doctor || response;
      console.log("Doctor data:", doctor);
      console.log("Doctor isAvailable:", doctor.isAvailable);

      // Set the availability state from the database
      setIsAvailable(doctor.isAvailable || false);
      // Update the user context with the full doctor data including isAvailable
      dispatch({ type: "SET_USER", payload: doctor });

      console.log("Set isAvailable to:", doctor.isAvailable || false);
    } catch (error) {
      console.error("Failed to load doctor status:", error);
    }
  };

  // const loadDoctorInfo = async () => {
  //   if (!state.user) {
  //     // If no user in context, try to fetch from API
  //     setLoading(true);
  //     try {
  //       const doctorProfile = await doctorsAPI.getDoctorProfile();
  //       dispatch({ type: 'SET_USER', payload: doctorProfile });
  //       dispatch({ type: 'SET_USER_TYPE', payload: 'doctor' });
  //     } catch (error) {
  //       console.error('Failed to load doctor info:', error);
  //       // If API fails, redirect to login
  //       navigate('/doctor-auth');
  //       return;
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const loadConsultations = async () => {
    try {
      if (!state.user || state.user.id === undefined) {
        // ProtectedRoute handles auth redirect, just skip loading
        return;
      }

      const response = await consultationsAPI.getConsultations(state.user!.id);
      const list = response.consultations || [];
      // Normalize status to lowercase for frontend compatibility
      const normalizedData = list.map((c: any) => ({
        ...c,
        status: c.status?.toLowerCase(),
      }));
      setConsultations(normalizedData);

      // Calculate stats
      const today = new Date().toDateString();
      const todayConsults = normalizedData.filter(
        (c: any) => new Date(c.createdAt).toDateString() === today
      );
      const pending = normalizedData.filter((c: any) => c.status === "pending");

      setStats({
        totalPatients: normalizedData.length,
        todayConsultations: todayConsults.length,
        pendingRequests: pending.length,
        rating: (state.user as any)?.rating || 4.5,
      });
    } catch (error) {
      console.error("Failed to load consultations:", error);
    }
  };

  const handleStatusToggle = async () => {
    const doctorUser = state.user as any;

    // Try to get doctor ID from context, localStorage, or state
    const doctorId = doctorUser?.id || localStorage.getItem("echomed_user_id");

    if (!doctorId) {
      console.log("No doctor user ID found. State.user:", state.user);
      console.log(
        "localStorage echomed_user_id:",
        localStorage.getItem("echomed_user_id")
      );
      return;
    }

    console.log("Toggling status from:", isAvailable, "to:", !isAvailable);

    try {
      const newStatus = !isAvailable;
      const response = await doctorsAPI.updateDoctorStatus(doctorId, newStatus);
      console.log("Status update response:", response);

      const updatedDoctor = response.doctor || response;
      console.log("Updated doctor:", updatedDoctor);

      // Update local state
      setIsAvailable(newStatus);
      // Update context state with the updated doctor data
      dispatch({ type: "SET_USER", payload: updatedDoctor });

      console.log("Status updated successfully to:", newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleConsultationAction = async (
    consultationId: string,
    action: string
  ) => {
    try {
      await consultationsAPI.updateConsultationStatus(
        consultationId,
        action.toUpperCase()
      );
      loadConsultations();

      if (action === "active") {
        // Navigate to chat screen with the consultation
        navigate(`/chat/${consultationId}`);
      }
    } catch (error) {
      console.error("Failed to update consultation:", error);
    }
  };

  const handleLogout = async () => {
    const doctorUser = state.user as any;
    const doctorId = doctorUser?.id || localStorage.getItem("echomed_user_id");

    // Set doctor status to offline before logging out
    if (doctorId) {
      try {
        await doctorsAPI.updateDoctorStatus(doctorId, false);
      } catch (error) {
        console.error("Failed to set offline status:", error);
        // Continue with logout even if status update fails
      }
    }

    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <DoctorHeader
        name={(state.user as any)?.name}
        specialty={(state.user as any)?.specialty}
        isOnline={isAvailable}
        onToggleOnline={handleStatusToggle}
        onLogout={handleLogout}
      />

      <div className="p-6">
        <DoctorStatsCards
          stats={[
            {
              label: "Total Patients",
              value: stats.totalPatients,
              icon: <Users className="w-5 h-5" />,
            },
            {
              label: "Today's Consultations",
              value: stats.todayConsultations,
              icon: <Calendar className="w-5 h-5" />,
            },
            {
              label: "Pending Requests",
              value: stats.pendingRequests,
              icon: <Clock className="w-5 h-5" />,
            },
            {
              label: "Rating",
              value: Number(stats.rating || 0).toFixed(1),
              icon: <TrendingUp className="w-5 h-5" />,
            },
          ]}
        />

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Consultations
          </h2>
          <DoctorConsultationsList
            consultations={
              consultations.map((c: any) => ({
                id: c.id,
                patientName: c.patientName || c.patient?.name || "Patient",
                time: new Date(c.createdAt).toLocaleTimeString(),
                date: new Date(c.createdAt).toLocaleDateString(),
                status: c.status,
                reason: c.symptoms || c.reason,
              })) as ConsultationItem[]
            }
            onSelect={(c) => {
              const original = consultations.find((x: any) => x.id === c.id);
              if (!original) return;
              if (original.status === "pending") {
                handleConsultationAction(original.id, "active");
              } else if (original.status === "active") {
                navigate(`/chat/${original.id}`);
              }
            }}
            onAccept={(id) => handleConsultationAction(String(id), "active")}
            onDecline={(id) =>
              handleConsultationAction(String(id), "cancelled")
            }
            onContinue={(id) => navigate(`/chat/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
