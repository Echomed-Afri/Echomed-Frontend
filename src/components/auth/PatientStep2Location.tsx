import React from 'react';
import Input from '../../components/ui/Input';
import { MapPin, Globe } from 'lucide-react';

type Language = { code: string; name: string };

type Props = {
  location: string;
  preferredLanguage: string;
  languages: Language[];
  onChange: (field: string, value: any) => void;
};

const PatientStep2Location: React.FC<Props> = ({ location, preferredLanguage, languages, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="mx-auto w-12 h-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Location & Preferences</h2>
        <p className="text-gray-600 mt-2">Help us serve you better</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Location/Address"
          type="text"
          value={location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="Enter your city/address"
          required
          icon={MapPin}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Language <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={preferredLanguage}
              onChange={(e) => onChange('preferredLanguage', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientStep2Location;
