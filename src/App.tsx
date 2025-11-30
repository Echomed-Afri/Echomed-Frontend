import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import SplashScreen from './pages/shared/SplashScreen';
import OnboardingScreen from './pages/shared/OnboardingScreen';
import AuthScreen from './pages/auth/AuthScreen';
// import DoctorAuthScreen from './pages/auth/DoctorAuthScreen';
import DoctorRegistrationScreen from './pages/auth/DoctorRegistrationScreen';
import PatientRegistrationScreen from './pages/auth/PatientRegistrationScreen';
import HomeScreen from './pages/patient/HomeScreen';
import ConsultationScreen from './pages/patient/ConsultationScreen';
import ChatScreen from './pages/patient/ChatScreen';
import ScheduleHomeVisitScreen from './pages/patient/ScheduleHomeVisitScreen';
import PrescriptionsScreen from './pages/patient/PrescriptionsScreen';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import socketService from './services/socket';
import { doctorsAPI } from './services/api';

// Protected Route Component
function ProtectedRoute({ children, requireAuth = true }: { children: React.ReactNode; requireAuth?: boolean }) {
  const { state } = useApp();
  
  if (requireAuth && !state.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!requireAuth && state.isAuthenticated) {
    const userType = localStorage.getItem('echomed_user_type');
    return <Navigate to={userType === 'doctor' ? '/doctor-dashboard' : '/home'} replace />;
  }
  
  return <>{children}</>;
}

// Admin Protected Route Component
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const adminToken = localStorage.getItem('echomed_admin_token');

  // No token at all -> go to login
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // Decode JWT payload safely (base64url)
  const decodeJwtPayload = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const payload = decodeJwtPayload(adminToken);

  // Invalid token structure/payload
  if (!payload) {
    localStorage.removeItem('echomed_admin_token');
    return <Navigate to="/admin/login" replace />;
  }

  // Check expiration if present (exp is seconds since epoch)
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    localStorage.removeItem('echomed_admin_token');
    return <Navigate to="/admin/login" replace />;
  }

  // Accept either explicit ADMIN role or an isAdmin flag on a doctor
  const hasAdminPrivilege = payload.role === 'ADMIN' || payload.isAdmin === true;
  if (!hasAdminPrivilege) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const initializeApp = async () => {
      // Check for existing auth token
      const token = localStorage.getItem('echomed_token');
      const userType = localStorage.getItem('echomed_user_type');
      const userId = localStorage.getItem('echomed_user_id')
      
      if (token && userType) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        dispatch({ type: 'SET_USER_TYPE', payload: userType as 'patient' | 'doctor' });
        
        // Load user data based on type
        try {
          if (userType === 'doctor' && userId) {
            const doctorProfile = await doctorsAPI.getDoctorProfile(userId);
            dispatch({ type: 'SET_USER', payload: doctorProfile });
          }
          // For patients, we could add similar logic here
        } catch (error) {
          console.error('Failed to load user data:', error);
          // If API fails, clear all to avoid stale keys
          localStorage.clear();
        }
        
        // Only redirect if we're on a public route or root
        const publicRoutes = ['/', '/splash', '/onboarding', '/auth', '/doctor-auth', '/doctor-registration', '/patient-registration'];
        const isOnPublicRoute = publicRoutes.includes(location.pathname);
        
        if (isOnPublicRoute) {
          // Navigate to the appropriate page based on userType
          if (userType === 'doctor') {
            navigate('/doctor-dashboard', { replace: true });
          } else {
            navigate('/home', { replace: true });
          }
        }
        
        // Connect to socket
        socketService.connect();
      } else {
        // If no auth token, start from splash screen
        if (location.pathname === '/') {
          navigate('/splash', { replace: true });
        }
      }
    };

    initializeApp();

    return () => {
      socketService.disconnect();
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="font-sans antialiased">
      <Routes>
        {/* Public Routes */}
        <Route path="/splash" element={
          <ProtectedRoute requireAuth={false}>
            <SplashScreen />
          </ProtectedRoute>
        } />
        
        <Route path="/onboarding" element={
          <ProtectedRoute requireAuth={false}>
            <OnboardingScreen />
          </ProtectedRoute>
        } />
        
        <Route path="/auth" element={
          <ProtectedRoute requireAuth={false}>
            <AuthScreen />
          </ProtectedRoute>
        } />
        
        {/* <Route path="/doctor-auth" element={
          <ProtectedRoute requireAuth={false}>
            <DoctorAuthScreen />
          </ProtectedRoute>
        } /> */}
        
        <Route path="/doctor-registration" element={
          <ProtectedRoute requireAuth={false}>
            <DoctorRegistrationScreen />
          </ProtectedRoute>
        } />

        <Route path="/patient-registration" element={
          <ProtectedRoute requireAuth={false}>
            <PatientRegistrationScreen />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Require Authentication */}
        <Route path="/home" element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        } />
        
        <Route path="/consultation" element={
          <ProtectedRoute>
            <ConsultationScreen />
          </ProtectedRoute>
        } />
        
        <Route path="/chat/:consultationId" element={
          <ProtectedRoute>
            <ChatScreen
              consultationId="sample-consultation-id"
              doctorInfo={{
                id: 'doc1',
                name: 'Dr. Akosua Mensah',
                avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
                specialty: 'General Medicine',
                isOnline: true
              }}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/home-visit" element={
          <ProtectedRoute>
            <ScheduleHomeVisitScreen />
          </ProtectedRoute>
        } />
        
        <Route path="/prescriptions" element={
          <ProtectedRoute>
            <PrescriptionsScreen />
          </ProtectedRoute>
        } />
        
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes - No authentication check needed as AdminLogin handles it */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/splash" replace />} />
        
        {/* Catch all - redirect to splash */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;