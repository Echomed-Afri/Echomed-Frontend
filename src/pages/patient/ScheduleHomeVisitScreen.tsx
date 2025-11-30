import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
];

const urgencyLevels = [
  { key: 'routine', label: 'Routine Visit', color: 'bg-green-100 text-green-800', fee: 100 },
  { key: 'urgent', label: 'Urgent Care', color: 'bg-yellow-100 text-yellow-800', fee: 150 },
  { key: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800', fee: 200 }
];

export default function ScheduleHomeVisitScreen() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: '',
    urgency: 'routine',
    preferredDate: '',
    preferredTime: '',
    address: '',
    landmark: '',
    phoneNumber: '',
    emergencyContact: '',
    specialInstructions: '',
    paymentMethod: 'momo'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedUrgency = () => {
    return urgencyLevels.find(level => level.key === formData.urgency) || urgencyLevels[0];
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Here you would submit to Firebase/backend
      console.log('Scheduling home visit:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a home visit object and add to context
      const homeVisit = {
        id: Date.now().toString(),
        patientId: 'current-patient',
        symptoms: formData.symptoms,
        preferredDate: new Date(formData.preferredDate),
        location: {
          address: formData.address,
          coordinates: [0, 0] as [number, number],
          directions: formData.landmark
        },
        status: 'pending' as const,
        cost: getSelectedUrgency().fee
      };
      
      dispatch({ type: 'ADD_HOME_VISIT', payload: homeVisit });
      
      // Navigate back to home with success
      navigate('/home');
    } catch (error) {
      console.error('Failed to schedule visit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/home');
    } else {
      setStep(step - 1);
    }
  };

  const renderSymptoms = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Describe Your Symptoms</h2>
        <p className="text-gray-600">Help us understand what medical care you need</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What symptoms are you experiencing?
          </label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => handleInputChange('symptoms', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Please describe your symptoms in detail..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Urgency Level
          </label>
          <div className="space-y-3">
            {urgencyLevels.map(level => (
              <label key={level.key} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value={level.key}
                  checked={formData.urgency === level.key}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-700">{level.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
                      GHS {level.fee}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            rows={2}
            placeholder="Any special instructions for the medical team..."
          />
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Date & Time</h2>
        <p className="text-gray-600">When would you like the medical team to visit?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Preferred Date
          </label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Clock className="w-4 h-4 inline mr-2" />
            Preferred Time
          </label>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => handleInputChange('preferredTime', time)}
                className={`p-3 border rounded-xl text-center transition-colors ${
                  formData.preferredTime === time
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Availability Note</h4>
              <p className="text-sm text-blue-700 mt-1">
                Our medical team operates 24/7 for emergencies. For routine visits, 
                we'll confirm your appointment within 2 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Details</h2>
        <p className="text-gray-600">Where should our medical team visit you?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Full Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="House number, street name, area, city..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Landmark (Optional)
          </label>
          <input
            type="text"
            value={formData.landmark}
            onChange={(e) => handleInputChange('landmark', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Near school, church, or any recognizable landmark"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Contact Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="+233 XX XXX XXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Emergency Contact (Optional)
          </label>
          <input
            type="tel"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="+233 XX XXX XXXX"
          />
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment & Confirmation</h2>
        <p className="text-gray-600">Review your booking and complete payment</p>
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-800">Booking Summary</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Type:</span>
            <span className="font-medium">{getSelectedUrgency().label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formData.preferredDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{formData.preferredTime}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Total Fee:</span>
            <span className="font-bold text-emerald-600">GHS {getSelectedUrgency().fee}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Payment Method
        </label>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="momo"
              checked={formData.paymentMethod === 'momo'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
            />
            <span className="text-gray-700">Mobile Money (MTN/Vodafone/AirtelTigo)</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
            />
            <span className="text-gray-700">Pay on Arrival (Cash)</span>
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Notes</h4>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• A medical professional will contact you to confirm the appointment</li>
              <li>• For emergencies, our team will arrive within 30 minutes</li>
              <li>• Cancellation is free up to 2 hours before the appointment</li>
            </ul>
          </div>
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
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Schedule Home Visit</h1>
              <p className="text-sm text-gray-600">Step {step} of 4</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full ${
                  stepNum <= step ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
          {step === 1 && renderSymptoms()}
          {step === 2 && renderSchedule()}
          {step === 3 && renderLocation()}
          {step === 4 && renderPayment()}

          {/* Navigation */}
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
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
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
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}