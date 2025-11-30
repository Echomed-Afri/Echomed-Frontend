import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Check,
  User,
  Mail,
  Lock,
  Stethoscope,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
} from "lucide-react";
import { authAPI } from "../../services/api";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const specialties = [
  "General Medicine",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Cardiology",
  "Psychiatry",
  "Orthopedics",
  "Ophthalmology",
];

const languages = [
  { code: "en", name: "English" },
  { code: "tw", name: "Twi" },
  { code: "ee", name: "Ewe" },
  { code: "ga", name: "Ga" },
  { code: "ha", name: "Hausa" },
];

const hospitals = [
  "Korle Bu Teaching Hospital",
  "Ridge Hospital",
  "University of Ghana Hospital",
  "37 Military Hospital",
  "Tema General Hospital",
  "Komfo Anokye Teaching Hospital",
  "Private Practice",
  "Other",
];

export default function DoctorRegistrationScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // Professional Info
    specialty: "",
    licenseNumber: "",
    hospital: "",
    experience: "",
    consultationFee: "",

    // Languages
    spokenLanguages: ["en"],

    // Documents
    profilePhoto: null as File | null,
    licenseDocument: null as File | null,

    // Availability
    availability: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "09:00", end: "13:00", available: false },
      sunday: { start: "09:00", end: "13:00", available: false },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLanguageToggle = (langCode: string) => {
    setFormData((prev) => ({
      ...prev,
      spokenLanguages: prev.spokenLanguages.includes(langCode)
        ? prev.spokenLanguages.filter((l) => l !== langCode)
        : [...prev.spokenLanguages, langCode],
    }));
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!formData.phone) newErrors.phone = "Phone number is required";
    }

    if (stepNumber === 2) {
      if (!formData.specialty) newErrors.specialty = "Specialty is required";
      if (!formData.licenseNumber)
        newErrors.licenseNumber = "License number is required";
      if (!formData.hospital) newErrors.hospital = "Hospital is required";
      if (!formData.experience) newErrors.experience = "Experience is required";
      if (!formData.consultationFee)
        newErrors.consultationFee = "Consultation fee is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      // Create Firebase user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // Map form data to API payload
      const payload = {
        idToken,
        email: formData.email,
        name: formData.fullName,
        specialty: formData.specialty,
        licenseNumber: formData.licenseNumber,
        hospital: formData.hospital,
        experience: formData.experience
          ? Number(formData.experience)
          : undefined,
        languages: formData.spokenLanguages,
        consultationFee: formData.consultationFee
          ? Number(formData.consultationFee)
          : undefined,
      };

      await authAPI.registerDoctor(payload as any);

      // Optionally auto-login: store token and user
      // For now, keep original UX (navigate to auth). Uncomment below to auto-login.
      // localStorage.clear();
      // localStorage.setItem('echomed_token', token);
      // localStorage.setItem('echomed_user', JSON.stringify(doctor));

      navigate("/auth");
    } catch (error: any) {
      let message = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message =
          "Email already in use. Please use a different email or login.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }
      console.error("Registration failed:", error);
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Dr. Kwame Asante"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="doctor@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="••••••••"
          />
          {formData.password && formData.password.length < 6 && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 6 characters
            </p>
          )}
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="••••••••"
          />
          {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+233 XX XXX XXXX"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Professional Information
        </h2>
        <p className="text-gray-600">Tell us about your medical practice</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Stethoscope className="w-4 h-4 inline mr-2" />
            Medical Specialty
          </label>
          <select
            value={formData.specialty}
            onChange={(e) => handleInputChange("specialty", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.specialty ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select your specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          {errors.specialty && (
            <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical License Number
          </label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.licenseNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="GMA001234"
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Hospital/Clinic
          </label>
          <select
            value={formData.hospital}
            onChange={(e) => handleInputChange("hospital", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.hospital ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select your hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital} value={hospital}>
                {hospital}
              </option>
            ))}
          </select>
          {errors.hospital && (
            <p className="text-red-500 text-sm mt-1">{errors.hospital}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Years of Experience
          </label>
          <input
            type="number"
            value={formData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="5"
            min="0"
            max="50"
          />
          {errors.experience && (
            <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Consultation Fee (GHS)
          </label>
          <input
            type="number"
            value={formData.consultationFee}
            onChange={(e) =>
              handleInputChange("consultationFee", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              errors.consultationFee ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="50"
            min="0"
          />
          {errors.consultationFee && (
            <p className="text-red-500 text-sm mt-1">
              {errors.consultationFee}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Globe className="w-4 h-4 inline mr-2" />
            Languages Spoken
          </label>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <label
                key={lang.code}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.spokenLanguages.includes(lang.code)}
                  onChange={() => handleLanguageToggle(lang.code)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{lang.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Documents & Verification
        </h2>
        <p className="text-gray-600">
          Upload required documents for verification
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Medical License Document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Upload your medical license</p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, PNG, JPG up to 10MB
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-medium text-blue-800 mb-2">
            Verification Process
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Documents will be reviewed within 24-48 hours</li>
            <li>• You'll receive an email notification once approved</li>
            <li>• Additional documents may be requested if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/auth")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Doctor Registration
              </h1>
              <p className="text-sm text-gray-600">Step {step} of 3</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
          {step === 1 && renderPersonalInfo()}
          {step === 2 && renderProfessionalInfo()}
          {step === 3 && renderDocuments()}

          {/* Validation / Submit error */}
          {errors.submit && (
            <div className="mt-4 text-red-600 text-sm">{errors.submit}</div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}

            <div className="ml-auto">
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
