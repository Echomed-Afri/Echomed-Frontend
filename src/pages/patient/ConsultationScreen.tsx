import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Mic, 
  ArrowLeft,
  Star,
  Clock,
  Globe
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';
import { Doctor, ConsultationCategory } from '../../types';
import { doctorsAPI, consultationsAPI } from '../../services/api';

const consultationTypes = [
  { key: 'videoCall', icon: Video, color: 'bg-emerald-500', type: 'video' },
  { key: 'voiceCall', icon: Phone, color: 'bg-blue-500', type: 'voice' },
  { key: 'textChat', icon: MessageCircle, color: 'bg-purple-500', type: 'chat' },
  { key: 'voiceNote', icon: Mic, color: 'bg-orange-500', type: 'voice-note' }
];

const categories = [
  { key: 'general', color: 'bg-gray-500' },
  { key: 'womensHealth', color: 'bg-pink-500' },
  { key: 'pediatrics', color: 'bg-blue-500' },
  { key: 'dermatology', color: 'bg-green-500' },
  { key: 'mentalHealth', color: 'bg-indigo-500' }
];

export default function ConsultationScreen() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ConsultationCategory>('general');
  const [step, setStep] = useState<'type' | 'category' | 'doctors'>('type');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    if (step === 'doctors') {
      loadDoctors();
    }
  }, [step, selectedCategory]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorsAPI.getAvailableDoctors(selectedCategory, true);
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'type') {
      // Navigate back to home screen
      navigate('/home');
    } else if (step === 'category') {
      // Go back to type selection
      setStep('type');
    } else if (step === 'doctors') {
      // Go back to category selection
      setStep('category');
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setStep('category');
  };

  const handleCategorySelect = (category: ConsultationCategory) => {
    setSelectedCategory(category);
    setStep('doctors');
  };

  const handleDoctorSelect = async (doctor: Doctor) => {
    try {
      setLoading(true);
      
      const consultationData = {
        doctorId: doctor.id,
        type: selectedType,
        category: selectedCategory,
        symptoms
      };

      const consultation = await consultationsAPI.createConsultation(consultationData);
      
      // Store consultation in context and navigate to chat
      dispatch({ type: 'ADD_CONSULTATION', payload: consultation });
      navigate(`/chat/${consultation.id}`);
    } catch (error) {
      console.error('Failed to create consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Consultation Type
        </h2>
        <p className="text-gray-600">
          How would you like to consult with a doctor?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {consultationTypes.map((type, index) => (
          <motion.button
            key={type.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTypeSelect(type.type)}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
              <type.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">
              {t(type.key, state.currentLanguage)}
            </h3>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Select Category
        </h2>
        <p className="text-gray-600">
          What type of consultation do you need?
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.button
            key={category.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategorySelect(category.key as ConsultationCategory)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
              selectedCategory === category.key
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-white text-gray-800 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                selectedCategory === category.key ? 'bg-white' : category.color
              }`} />
              <span className="font-medium">
                {t(category.key, state.currentLanguage)}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms (optional)"
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>
    </div>
  );

  const renderDoctorSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Available Doctors
        </h2>
        <p className="text-gray-600">
          Choose a doctor for your consultation
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No doctors available at the moment.</p>
          <button
            onClick={loadDoctors}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor, index) => (
            <motion.button
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDoctorSelect(doctor)}
              disabled={loading}
              className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                    doctor.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{doctor.rating}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{doctor.experience}y exp</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {doctor.languages.length} languages
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doctor.isOnline 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {doctor.isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {t('consultNow', state.currentLanguage)}
            </h1>
            <p className="text-sm text-gray-600">
              Step {step === 'type' ? '1' : step === 'category' ? '2' : '3'} of 3
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 'type' && renderTypeSelection()}
        {step === 'category' && renderCategorySelection()}
        {step === 'doctors' && renderDoctorSelection()}
      </div>
    </div>
  );
}