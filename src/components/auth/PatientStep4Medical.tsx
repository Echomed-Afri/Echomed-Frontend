import React from 'react';
import Input from '../../components/ui/Input';
import { Heart } from 'lucide-react';

type Props = {
  allergies: string;
  chronicConditions: string;
  insuranceProvider: string;
  policyNumber: string;
  onChange: (field: string, value: any, nested?: string) => void;
};

const PatientStep4Medical: React.FC<Props> = ({ allergies, chronicConditions, insuranceProvider, policyNumber, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="mx-auto w-12 h-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>
        <p className="text-gray-600 mt-2">Optional information to help doctors provide better care</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Known Allergies
          </label>
          <textarea
            value={allergies}
            onChange={(e) => onChange('allergies', e.target.value, 'medicalHistory')}
            placeholder="List any known allergies (medications, food, environmental, etc.)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chronic Conditions
          </label>
          <textarea
            value={chronicConditions}
            onChange={(e) => onChange('chronicConditions', e.target.value, 'medicalHistory')}
            placeholder="List any chronic conditions or ongoing health issues"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Insurance Provider"
            type="text"
            value={insuranceProvider}
            onChange={(e) => onChange('provider', e.target.value, 'insuranceInfo')}
            placeholder="Insurance company name"
          />

          <Input
            label="Policy Number"
            type="text"
            value={policyNumber}
            onChange={(e) => onChange('policyNumber', e.target.value, 'insuranceInfo')}
            placeholder="Your policy number"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientStep4Medical;
