import React, { useState } from "react";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../services/api";
import { useApp } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

interface DoctorLoginFormProps {
  onSwitchMode: () => void;
}

export const DoctorLoginForm: React.FC<DoctorLoginFormProps> = ({
  onSwitchMode,
}) => {
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useApp();
  const navigate = useNavigate();

  // Doctor login with email/password
  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Supabase
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: doctorEmail,
          password: doctorPassword,
        });

      if (signInError) throw signInError;

      if (!data.user) {
        throw new Error("Authentication failed");
      }

      // Authenticate with backend
      const response = await authAPI.loginDoctor(
        data.user.id,
        data.user.email!
      );

      // Clear previous session to avoid conflicts (e.g., admin/patient)
      localStorage.clear();
      // Store token and user type
      localStorage.setItem("echomed_token", response.token);
      localStorage.setItem("echomed_user_type", "doctor");
      localStorage.setItem("echomed_user_id", response.doctor.id);

      // Store doctor information in context
      dispatch({ type: "SET_USER", payload: response.doctor });
      dispatch({ type: "SET_USER_TYPE", payload: "doctor" });
      dispatch({ type: "SET_AUTHENTICATED", payload: true });

      navigate("/doctor-dashboard");
    } catch (err: any) {
      if (err.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Please verify your email address.");
      } else if (err.response?.status === 404) {
        setError("Doctor account not found in database.");
      } else if (err.response?.status === 403) {
        setError(
          err.response?.data?.error ||
            "Your account is pending verification. Please wait for admin approval."
        );
      } else {
        setError(
          "Login failed: " +
            (err.response?.data?.error || err.message || "Please try again.")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Doctor Login</h2>
        <p className="text-gray-600 mt-2">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleDoctorLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="doctor@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={doctorPassword}
              onChange={(e) => setDoctorPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="text-center space-y-2">
        <button
          onClick={() => navigate("/doctor-registration")}
          className="text-green-600 font-medium hover:text-green-700 transition-colors block w-full"
        >
          Don't have an account? Register here
        </button>

        <button
          onClick={onSwitchMode}
          className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          Are you a patient? Login here
        </button>
      </div>
    </div>
  );
};
