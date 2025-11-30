import React from 'react';
import Input from '../../components/ui/Input';
import { Users, User, Phone } from 'lucide-react';

type Props = {
  contactName: string;
  contactPhone: string;
  relationship: string;
  relationships: string[];
  onChange: (field: string, value: any, nested?: string) => void;
};

const PatientStep3Emergency: React.FC<Props> = ({ contactName, contactPhone, relationship, relationships, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="mx-auto w-12 h-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Emergency Contact</h2>
        <p className="text-gray-600 mt-2">Someone we can contact in case of emergency</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Emergency Contact Name"
          type="text"
          value={contactName}
          onChange={(e) => onChange('name', e.target.value, 'emergencyContact')}
          placeholder="Enter contact person's name"
          required
          icon={User}
        />

        <Input
          label="Emergency Contact Phone"
          type="tel"
          value={contactPhone}
          onChange={(e) => onChange('phone', e.target.value, 'emergencyContact')}
          placeholder="+1 234 567 8900"
          required
          icon={Phone}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship
          </label>
          <select
            value={relationship}
            onChange={(e) => onChange('relationship', e.target.value, 'emergencyContact')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select relationship</option>
            {relationships.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PatientStep3Emergency;
