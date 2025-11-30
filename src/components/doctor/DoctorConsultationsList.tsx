import React from 'react';
import { Calendar, Clock, UserRound } from 'lucide-react';

export type ConsultationItem = {
  id: string | number;
  patientName: string;
  time: string;
  date?: string;
  status?: 'scheduled' | 'pending' | 'completed' | string;
  reason?: string;
};

type Props = {
  consultations: ConsultationItem[];
  onSelect?: (c: ConsultationItem) => void;
  onAccept?: (id: string | number) => void;
  onDecline?: (id: string | number) => void;
  onContinue?: (id: string | number) => void;
};

const DoctorConsultationsList: React.FC<Props> = ({ consultations, onSelect, onAccept, onDecline, onContinue }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!consultations?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        No consultations yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <ul className="divide-y">
        {consultations.map((c) => (
          <li key={c.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelect?.(c)}>
                <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                  <UserRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{c.patientName}</p>
                  <p className="text-sm text-gray-500">{c.reason || 'General consultation'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                  {((c.status || 'unknown')[0]?.toUpperCase() || 'U') + (c.status || 'unknown').slice(1)}
                </span>
                {c.date && (
                  <span className="hidden sm:flex items-center space-x-1 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" /> <span>{c.date}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" /> <span>{c.time}</span>
                </span>
                {c.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onAccept?.(c.id)}
                      className="px-3 py-1.5 bg-emerald-500 text-white rounded-md text-sm hover:bg-emerald-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onDecline?.(c.id)}
                      className="px-3 py-1.5 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {c.status === 'active' && (
                  <button
                    onClick={() => onContinue?.(c.id)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorConsultationsList;
