import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { consultationsAPI, doctorsAPI } from "../../services/api";
import socketService from "../../services/socket";
import DoctorHeader from "../../components/doctor/DoctorHeader";
import DoctorStatsCards from "../../components/doctor/DoctorStatsCards";
import DoctorConsultationsList, {
  ConsultationItem,
} from "../../components/doctor/DoctorConsultationsList";

export default function DoctorDashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayConsultations: 0,
    pendingRequests: 0,
    rating: 4.5,
  });

  useEffect(() => {
    // loadDoctorInfo();
    loadConsultations();
    setupSocketListeners();

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

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
        navigate("/auth");
      }

      const data = await consultationsAPI.getConsultations(state.user!.id);
      // Normalize status to lowercase for frontend compatibility
      const normalizedData = data.map((c: any) => ({
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

  const setupSocketListeners = () => {
    socketService.connect();

    socketService.onNewConsultation((consultation) => {
      const normalized = {
        ...consultation,
        status: consultation.status?.toLowerCase(),
      };
      setConsultations((prev) => [normalized, ...prev]);
      setStats((prev) => ({
        ...prev,
        pendingRequests: prev.pendingRequests + 1,
      }));
    });

    socketService.onConsultationUpdated((consultation) => {
      const normalized = {
        ...consultation,
        status: consultation.status?.toLowerCase(),
      };
      setConsultations((prev) =>
        prev.map((c: any) => (c.id === normalized.id ? normalized : c))
      );
    });
  };

  const handleStatusToggle = async () => {
    const doctorUser = state.user as any;
    if (!doctorUser?.id) return;

    try {
      const newStatus = !isOnline;
      await doctorsAPI.updateDoctorStatus(doctorUser.id, newStatus);
      setIsOnline(newStatus);

      if (newStatus) {
        socketService.setDoctorOnline(doctorUser.id);
      } else {
        socketService.setDoctorOffline(doctorUser.id);
      }
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

  const handleLogout = () => {
    localStorage.clear();
    socketService.disconnect();
    dispatch({ type: "LOGOUT" });
    navigate("/auth");
  };

  // helpers now handled inside component

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <DoctorHeader
        name={(state.user as any)?.name}
        specialty={(state.user as any)?.specialty}
        isOnline={isOnline}
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
              value: stats.rating.toFixed(1),
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
