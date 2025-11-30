import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';

type Props = {
  name?: string;
  specialty?: string;
  isOnline: boolean;
  onToggleOnline: () => void;
  onLogout: () => void;
};

const DoctorHeader: React.FC<Props> = ({ name, specialty, isOnline, onToggleOnline, onLogout }) => {
  return (
    <div className="bg-white shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{name || 'Doctor Dashboard'}</h1>
          <p className="text-gray-600">{specialty || 'General Medicine'}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
            <button
              onClick={onToggleOnline}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isOnline ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isOnline ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={onLogout} className="p-2 bg-red-100 rounded-full hover:bg-red-200">
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeader;
