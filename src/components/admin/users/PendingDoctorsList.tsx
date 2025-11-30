import { useState, useEffect } from "react";
import { adminDoctorsAPI } from "../../../services/admin";
import { Check, X, Eye, Mail, Briefcase, Award, MapPin } from "lucide-react";

interface PendingDoctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  hospital: string;
  experience: number;
  languages: string[];
  consultationFee: number;
  isVerified: boolean;
  createdAt: string;
}

export default function PendingDoctorsList() {
  const [doctors, setDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<PendingDoctor | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await adminDoctorsAPI.getPending({ limit: 50 });
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleVerify = async (doctorId: string) => {
    if (!confirm("Are you sure you want to approve this doctor?")) return;

    setActionLoading(true);
    try {
      await adminDoctorsAPI.verify(doctorId);
      alert("Doctor verified successfully! An approval email has been sent.");
      fetchPendingDoctors(); // Refresh list
      setSelectedDoctor(null);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to verify doctor");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (doctorId: string) => {
    setActionLoading(true);
    try {
      await adminDoctorsAPI.reject(doctorId, rejectReason);
      alert("Doctor rejected. A notification email has been sent.");
      fetchPendingDoctors(); // Refresh list
      setSelectedDoctor(null);
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to reject doctor");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Doctor Verifications
          </h2>
          <p className="text-gray-600 mt-1">
            Review and approve doctor applications
          </p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
          {doctors.length} Pending
        </div>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No pending verifications
          </h3>
          <p className="mt-2 text-gray-600">
            All doctor applications have been reviewed.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-sm text-indigo-600">{doctor.specialty}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>License: {doctor.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.experience} years experience</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Applied: {new Date(doctor.createdAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4" />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Doctor Application Details
                </h2>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900">Dr. {selectedDoctor.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Specialty
                    </label>
                    <p className="text-gray-900">{selectedDoctor.specialty}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedDoctor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      License Number
                    </label>
                    <p className="text-gray-900">
                      {selectedDoctor.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Hospital/Clinic
                    </label>
                    <p className="text-gray-900">{selectedDoctor.hospital}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Years of Experience
                    </label>
                    <p className="text-gray-900">
                      {selectedDoctor.experience} years
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Consultation Fee
                    </label>
                    <p className="text-gray-900">
                      ${selectedDoctor.consultationFee}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Languages
                    </label>
                    <p className="text-gray-900">
                      {selectedDoctor.languages?.join(", ") || "Not specified"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-600">
                      Application Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedDoctor.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6 flex gap-3">
                  <button
                    onClick={() => handleVerify(selectedDoctor.id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Check className="h-5 w-5" />
                    {actionLoading ? "Processing..." : "Approve & Send Email"}
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="h-5 w-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Application
            </h3>
            <p className="text-gray-600 mb-4">
              Provide a reason for rejecting Dr. {selectedDoctor.name}'s
              application (optional):
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 mb-4 h-32"
              placeholder="e.g., Invalid license number, incomplete information..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedDoctor.id)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Sending..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
