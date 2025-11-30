import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  // Filter, 
  Download, 
  Eye,
  Calendar,
  User,
  Pill,
  // Clock,
  AlertCircle
} from 'lucide-react';
// import { useApp } from '../../contexts/AppContext';
import { patientAPI } from '../../services/api';

interface Doctor {
  name: string;
  specialty: string;
}

interface Medications {
  medicine: string;
  quantity: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  id: string;
  doctor: Doctor
  createdAt: string;
  medications: Medications[];
  diagnosis: string;
  notes?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
}

export default function PrescriptionsScreen() {
  // const { dispatch } = useApp();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED'>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  useEffect(() => {
    loadPrescriptions()
  }, []);

  const loadPrescriptions = async () => {
    const patientId = localStorage.getItem('echomed_user_id')
    if (!patientId){
      navigate('/auth')
    }
    try {
      const data = await patientAPI.getAllPrescriptions(patientId!)
      console.log(data)
      setPrescriptions(data)
    } catch (error) {
      console.error("Error fetching prescription data", error)

    }
    
  }


  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications.some(med => 
                           med.medicine.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderPrescriptionDetail = () => {
    if (!selectedPrescription) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedPrescription(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Prescription Details</h2>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>

            {/* Doctor Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedPrescription.doctor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPrescription.doctor.specialty}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Prescribed on {formatDate(selectedPrescription.createdAt)}</span>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Diagnosis</h4>
              <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
            </div>

            {/* Medications */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-4">Medications</h4>
              <div className="space-y-4">
                {selectedPrescription.medications.map((medication, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Pill className="w-5 h-5 text-emerald-600" />
                      <h5 className="font-semibold text-gray-800">{medication.medicine}</h5>
                      <span className="text-sm text-gray-600">({medication.quantity})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <p className="font-medium">{medication.frequency}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{medication.duration}</p>
                      </div>
                    </div>
                    {medication.instructions && (
                      <div className="mt-2">
                        <span className="text-gray-600">Instructions:</span>
                        <p className="text-sm text-gray-700">{medication.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedPrescription.notes && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Doctor's Notes</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-blue-800">{selectedPrescription.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                Share
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Prescriptions</h1>
            <p className="text-sm text-gray-600">View and manage your medical prescriptions</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prescriptions..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Your prescriptions will appear here after consultations'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription, index) => (
              <motion.div
                key={prescription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{prescription.diagnosis}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Dr. {prescription.doctor.name} • {prescription.doctor.specialty}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(prescription.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedPrescription(prescription)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Medications Preview */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Medications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {prescription.medications.slice(0, 3).map((medication, medIndex) => (
                      <span
                        key={medIndex}
                        className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                      >
                        {medication.medicine} {medication.quantity}
                      </span>
                    ))}
                    {prescription.medications.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{prescription.medications.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      {renderPrescriptionDetail()}
    </div>
  );
}