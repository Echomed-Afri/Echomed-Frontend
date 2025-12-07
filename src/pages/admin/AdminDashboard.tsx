import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  MessageSquare,
  Calendar,
  TrendingUp,
  Shield,
  LogOut,
  FileText,
  Clock,
} from "lucide-react";
import { adminSystemAPI, adminConsultationsAPI } from "../../services/admin";
import UserList from "../../components/admin/users/UserList";
import UserForm from "../../components/admin/users/UserForm";
import PendingDoctorsList from "../../components/admin/users/PendingDoctorsList";
import ConsultationList from "../../components/admin/consultations/ConsultationList";
import ConsultationDetails from "../../components/admin/consultations/ConsultationDetails";
import PrescriptionList from "../../components/admin/prescriptions/PrescriptionList";
import PrescriptionDetails from "../../components/admin/prescriptions/PrescriptionDetails";
import { User, Consultation } from "../../types";

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalConsultations: number;
  activeConsultations: number;
  onlineDoctors: number;
  verifiedDoctors: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalConsultations: 0,
    activeConsultations: 0,
    onlineDoctors: 0,
    verifiedDoctors: 0,
  });
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "pending-doctors" | "consultations" | "prescriptions"
  >("overview");

  // UI state for modals
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [usersKey, setUsersKey] = useState(0);
  const [openConsultationId, setOpenConsultationId] = useState<string | null>(
    null
  );
  const [openPrescriptionId, setOpenPrescriptionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Stats via admin service
      const statsResponse = await adminSystemAPI.stats();
      // Backend returns { stats: {...} }, extract the stats object
      const statsData = statsResponse.stats || statsResponse;
      setStats(statsData);

      // Fetch consultations
      const consultationsData = await adminConsultationsAPI.list();
      const list = (consultationsData.consultations ||
        consultationsData) as any[];
      setConsultations(list);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all storage to avoid stale admin/user data conflicts
    localStorage.clear();
    // Use navigate instead of window.location.href to avoid loading state issues
    navigate("/admin/login", { replace: true });
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {(value || 0).toLocaleString()}
        </div>
        <div className="text-3xl" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                EchoMed Admin Dashboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "overview", label: "Overview", icon: TrendingUp },
              { key: "pending-doctors", label: "Pending Doctors", icon: Clock },
              { key: "users", label: "All Users", icon: Users },
              {
                key: "consultations",
                label: "Consultations",
                icon: MessageSquare,
              },
              { key: "prescriptions", label: "Prescriptions", icon: FileText },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Patients"
                value={stats.totalPatients}
                icon={<Users />}
                color="#10b981"
              />
              <StatCard
                title="Total Doctors"
                value={stats.totalDoctors}
                icon={<UserCheck />}
                color="#3b82f6"
              />
              <StatCard
                title="Total Consultations"
                value={stats.totalConsultations}
                icon={<MessageSquare />}
                color="#8b5cf6"
              />
              <StatCard
                title="Active Consultations"
                value={stats.activeConsultations}
                icon={<Calendar />}
                color="#f59e0b"
              />
              <StatCard
                title="Online Doctors"
                value={stats.onlineDoctors}
                icon={<TrendingUp />}
                color="#ef4444"
              />
              <StatCard
                title="Verified Doctors"
                value={stats.verifiedDoctors}
                icon={<Shield />}
                color="#06b6d4"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Consultations
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {consultations.slice(0, 5).map((consultation) => (
                      <tr key={consultation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consultation.patientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consultation.doctorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              consultation.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : consultation.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {consultation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            consultation.createdAt
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <UserList
              key={usersKey}
              onEdit={(user) => {
                setEditingUser(user);
                setShowUserForm(true);
              }}
              onCreate={() => {
                setEditingUser(null);
                setShowUserForm(true);
              }}
            />
            {showUserForm && (
              <UserForm
                user={editingUser}
                onClose={() => setShowUserForm(false)}
                onSaved={() => {
                  setShowUserForm(false);
                  setUsersKey((k) => k + 1);
                }}
              />
            )}
          </div>
        )}

        {activeTab === "pending-doctors" && (
          <div className="space-y-4">
            <PendingDoctorsList />
          </div>
        )}

        {activeTab === "consultations" && (
          <div className="space-y-4">
            <ConsultationList onOpen={(id) => setOpenConsultationId(id)} />
            <ConsultationDetails
              consultationId={openConsultationId}
              onClose={() => setOpenConsultationId(null)}
            />
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="space-y-4">
            <PrescriptionList onOpen={(id) => setOpenPrescriptionId(id)} />
            <PrescriptionDetails
              prescriptionId={openPrescriptionId}
              onClose={() => setOpenPrescriptionId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
