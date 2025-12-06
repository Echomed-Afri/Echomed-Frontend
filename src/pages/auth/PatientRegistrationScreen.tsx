import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { authAPI } from "../../services/api";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import StepIndicator from "../../components/auth/StepIndicator";
import PatientStep1Personal from "../../components/auth/PatientStep1Personal";
import PatientStep2Location from "../../components/auth/PatientStep2Location";
import PatientStep3Emergency from "../../components/auth/PatientStep3Emergency";
import PatientStep4Medical from "../../components/auth/PatientStep4Medical";
import { supabase } from "../../supabase";

interface PatientData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  location: string;
  preferredLanguage: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    allergies: string;
    // currentMedications: string;
    chronicConditions: string;
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
  };
}

export default function PatientRegistrationScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const [patientData, setPatientData] = useState<PatientData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "OTHER",
    age: 18,
    location: "",
    preferredLanguage: "en",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: {
      allergies: "",
      //   currentMedications: '',
      chronicConditions: "",
    },
    insuranceInfo: {
      provider: "",
      policyNumber: "",
    },
  });

  const languages = [
    { code: "en", name: "English" },
    { code: "tw", name: "Twi" },
    { code: "ee", name: "Ewe" },
    { code: "ga", name: "Ga" },
    { code: "ha", name: "Hausa" },
  ];

  const relationships = [
    "Spouse",
    "Parent",
    "Child",
    "Sibling",
    "Friend",
    "Other",
  ];

  const handleInputChange = (field: string, value: any, nested?: string) => {
    if (nested) {
      setPatientData((prev) => ({
        ...prev,
        [nested]: {
          ...(prev[nested as keyof typeof prev] as any),
          [field]: value,
        },
      }));
    } else {
      setPatientData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Create Supabase user with email and password
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: patientData.email,
        password: patientData.password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("User creation failed");

      // Register patient in backend (but don't store the returned token)
      await authAPI.registerPatient({
        ...patientData,
        supabaseUserId: data.user.id,
      });

      // Sign out from Supabase to ensure user must verify email
      await supabase.auth.signOut();

      // Clear all session data to prevent auto-login
      localStorage.clear();
      sessionStorage.clear();

      // Store success message temporarily before reload
      sessionStorage.setItem("registration_success", "true");

      // Hard reload to /auth to completely reset app state
      window.location.href = "/auth";
    } catch (err: any) {
      setError(
        "Registration failed: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          patientData.email &&
          patientData.password &&
          patientData.password.length >= 6 &&
          patientData.confirmPassword &&
          patientData.password === patientData.confirmPassword &&
          patientData.name &&
          patientData.age >= 18
        );
      case 2:
        return patientData.location && patientData.preferredLanguage;
      case 3:
        return (
          patientData.emergencyContact.name &&
          patientData.emergencyContact.phone
        );
      case 4:
        return true; // Medical history is optional
      default:
        return false;
    }
  };

  const renderStepIndicator = () => <StepIndicator step={step} total={4} />;

  const renderStep1 = () => (
    <div className="space-y-4">
      <PatientStep1Personal
        name={patientData.name}
        email={patientData.email}
        password={patientData.password}
        confirmPassword={patientData.confirmPassword}
        gender={patientData.gender}
        age={patientData.age}
        onChange={(field, value) => {
          handleInputChange(field, value);
        }}
      />
    </div>
  );

  const renderStep2 = () => (
    <PatientStep2Location
      location={patientData.location}
      preferredLanguage={patientData.preferredLanguage}
      languages={languages}
      onChange={(field, value) => handleInputChange(field, value)}
    />
  );

  const renderStep3 = () => (
    <PatientStep3Emergency
      contactName={patientData.emergencyContact.name}
      contactPhone={patientData.emergencyContact.phone}
      relationship={patientData.emergencyContact.relationship}
      relationships={relationships}
      onChange={handleInputChange}
    />
  );

  const renderStep4 = () => (
    <PatientStep4Medical
      allergies={patientData.medicalHistory.allergies}
      chronicConditions={patientData.medicalHistory.chronicConditions}
      insuranceProvider={patientData.insuranceInfo.provider}
      policyNumber={patientData.insuranceInfo.policyNumber}
      onChange={handleInputChange}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card padding="lg">
          {renderStepIndicator()}

          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg mt-6">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={prevStep}
                    icon={ArrowLeft}
                    iconPosition="left"
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/auth")}
                >
                  Cancel
                </Button>

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!isStepValid()}
                  >
                    Complete Registration
                  </Button>
                )}
              </div>
            </div>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/auth")}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
