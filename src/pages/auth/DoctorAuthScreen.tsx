import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { authAPI } from '../../services/api';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

export default function DoctorAuthScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Form states for doctor authentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [step, setStep] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Doctor login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.loginDoctor(email, password);
      
  // Clear previous session to avoid conflicts
  localStorage.clear();
  // Store token and user info
  localStorage.setItem('echomed_token', response.token);
      localStorage.setItem('echomed_user_type', 'doctor');
      
      // Store doctor information in context
      dispatch({ type: 'SET_USER', payload: response.doctor });
      dispatch({ type: 'SET_USER_TYPE', payload: 'doctor' });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      // navigate('/doctor-dashboard');
      console.log(state)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Doctor registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const doctorData = {
        email,
        password,
        name,
        specialty,
        hospital,
        licenseNumber,
        experience: 0, // Default value
        languages: ['English'], // Default value
        consultationFee: 0 // Default value
      };

      const response = await authAPI.registerDoctor(doctorData);
      
  // Clear previous session to avoid conflicts
  localStorage.clear();
  // Store token and user info
  localStorage.setItem('echomed_token', response.token);
      localStorage.setItem('echomed_user_type', 'doctor');
      
      // Store doctor information in context
      dispatch({ type: 'SET_USER', payload: response.doctor });
      dispatch({ type: 'SET_USER_TYPE', payload: 'doctor' });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      navigate('/doctor-dashboard');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <button
          className="text-blue-600 hover:underline flex items-center gap-2"
          onClick={() => navigate('/home')}
        >
          ← Back to Home
        </button>

        <div className="text-center">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Stethoscope className="h-12 w-12 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Portal</h2>
          <p className="text-gray-600 mb-6">
            {step === 'login' ? 'Sign in to your account' : 'Create your doctor account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === 'login' && (
          <motion.form 
            onSubmit={handleLogin}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="doctor@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('register')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Don't have an account? Register here
              </button>
            </div>
          </motion.form>
        )}

        {step === 'register' && (
          <motion.form 
            onSubmit={handleRegister}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Dr. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="doctor@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Specialty
              </label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Cardiology, Pediatrics, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital/Clinic
              </label>
              <input
                type="text"
                required
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="General Hospital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="MD123456"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Already have an account? Sign in here
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
}