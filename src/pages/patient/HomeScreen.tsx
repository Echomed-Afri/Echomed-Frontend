// no default React import needed with react-jsx runtime
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Home,
  FileText,
  Heart,
  Calendar,
  Brain,
  Shield,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { t } from "../../utils/translations";

import PatientHeaderActions from "../../components/patient/PatientHeaderActions";
import PromoBanner from "../../components/patient/PromoBanner";
import QuickActionsGrid from "../../components/patient/QuickActionsGrid";

const quickActions = [
  {
    key: "consultNow",
    icon: Video,
    color: "bg-emerald-500",
    screen: "consultation",
  },
  {
    key: "scheduleVisit",
    icon: Home,
    color: "bg-blue-500",
    screen: "home-visit",
  },
  {
    key: "myPrescriptions",
    icon: FileText,
    color: "bg-purple-500",
    screen: "prescriptions",
  },
  {
    key: "healthRecords",
    icon: Heart,
    color: "bg-red-500",
    screen: "records",
  },
  {
    key: "menstrualTracker",
    icon: Calendar,
    color: "bg-pink-500",
    screen: "menstrual",
  },
  {
    key: "psychConsult",
    icon: Brain,
    color: "bg-indigo-500",
    screen: "psychology",
  },
];

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // ProtectedRoute already handles authentication
  // No need for additional redirect logic here

  if (!state.user) return null;

  const handleActionClick = (screen: string) => {
    // Map the screen names to routes
    const routeMap: { [key: string]: string } = {
      consultation: "/consultation",
      "home-visit": "/home-visit",
      prescriptions: "/prescriptions",
      chat: "/chat/sample",
      psychology: "/psychology",
    };

    const route = routeMap[screen] || `/${screen}`;
    navigate(route);
  };

  const handleLanguageToggle = () => {
    const languages = ["en", "tw", "ee", "ga", "ha"];
    const currentIndex = languages.indexOf(state.currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    dispatch({ type: "SET_LANGUAGE", payload: languages[nextIndex] as any });
  };

  const handleLogout = () => {
    // Clear all storage to avoid any stale session keys
    localStorage.clear();

    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {state.user?.name}
            </h1>
            <p className="text-gray-600">How can we help you today?</p>
          </div>

          <PatientHeaderActions
            onLanguageToggle={handleLanguageToggle}
            onProfile={() => handleActionClick("profile")}
            onLogout={handleLogout}
          />
        </div>

        {/* Promotion Banner */}
        <PromoBanner
          title={t("freeConsultPromo", state.currentLanguage)}
          subtitle="Valid for first-time users"
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>

        <QuickActionsGrid
          actions={quickActions}
          onActionClick={handleActionClick}
          translate={(key) => t(key, state.currentLanguage)}
        />

        {/* Recovery Programs */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleActionClick("recovery")}
          className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 mb-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">
                {t("recoveryPrograms", state.currentLanguage)}
              </h3>
              <p className="text-sm text-gray-600">
                Support for addiction recovery
              </p>
            </div>
          </div>
        </motion.button>

        {/* Health Tips Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">
            {t("dailyTip", state.currentLanguage)}
          </h3>
          <div className="flex items-start space-x-4">
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Health tip"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-gray-700 mb-2">
                Drink at least 8 glasses of water daily to stay hydrated and
                maintain good health.
              </p>
              <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                {t("learnMore", state.currentLanguage)} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
