import React, { useState } from "react";
import { Mail, User, AlertCircle, Lock } from "lucide-react";
import { authAPI } from "../../services/api";
import { useApp } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

interface PatientLoginFormProps {
  onSwitchMode: () => void;
}

export const PatientLoginForm: React.FC<PatientLoginFormProps> = ({
  onSwitchMode,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [patientName, setPatientName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let supabaseUser;

      if (isNewPatient) {
        // Create Supabase user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        supabaseUser = data.user;
      } else {
        // Sign in Supabase user
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;
        supabaseUser = data.user;
      }

      if (!supabaseUser) {
        throw new Error("Authentication failed");
      }

      let response;
      if (isNewPatient) {
        const patientData = {
          supabaseUserId: supabaseUser.id,
          email: supabaseUser.email,
          name: patientName,
          gender: "other",
          age: 25,
          location: "",
          preferredLanguage: "en",
        };
        response = await authAPI.registerPatient(patientData);
      } else {
        response = await authAPI.loginPatient(
          supabaseUser.id,
          supabaseUser.email!
        );
      }

      // Clear previous session
      localStorage.clear();
      // Store token and user info
      localStorage.setItem("echomed_token", response.token);
      localStorage.setItem("echomed_user_type", "patient");
      localStorage.setItem("echomed_user_id", response.user.id);

      // Store patient information in context
      dispatch({ type: "SET_USER", payload: response.user });
      dispatch({ type: "SET_USER_TYPE", payload: "patient" });
      dispatch({ type: "SET_AUTHENTICATED", payload: true });
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password.");
      } else if (err.message?.includes("User already registered")) {
        setError("Email already in use. Please login instead.");
      } else if (
        err.message?.includes("Password should be at least 6 characters")
      ) {
        setError("Password should be at least 6 characters.");
      } else if (err.response?.status === 404) {
        setError("User not found in database. Please complete registration.");
      } else {
        setError(
          "Authentication failed: " + (err.response?.data?.error || err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isNewPatient ? "Register as Patient" : "Patient Login"}
        </h2>
        <p className="text-gray-600 mt-2">
          {isNewPatient
            ? "Create your patient account"
            : "Enter your credentials to continue"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isNewPatient && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="patient@example.com"
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          {isNewPatient && password && password.length < 6 && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 6 characters
            </p>
          )}
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
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Please wait..."
            : isNewPatient
            ? "Create Account"
            : "Login"}
        </button>

        {isNewPatient && (
          <button
            type="button"
            onClick={() => {
              setIsNewPatient(false);
              setError("");
              setPatientName("");
            }}
            className="w-full text-blue-600 py-2 font-medium hover:text-blue-700 transition-colors"
          >
            Back to Login
          </button>
        )}
      </form>

      <div className="text-center space-y-3">
        <button
          onClick={onSwitchMode}
          className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          Are you a doctor? Login here
        </button>

        {!isNewPatient && (
          <div>
            <button
              onClick={() => navigate("/patient-registration")}
              className="text-green-600 font-medium hover:text-green-700 transition-colors text-sm"
            >
              New here? Create an account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
