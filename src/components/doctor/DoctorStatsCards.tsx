import React from 'react';
import { CalendarCheck, Clock, MessageSquareText, UsersRound } from 'lucide-react';

type Stat = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
};

type Props = {
  stats: Stat[];
};

const Card: React.FC<Stat> = ({ label, value, icon, trend }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {trend && <p className="text-xs text-emerald-600 mt-1">{trend}</p>}
      </div>
      <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
        {icon}
      </div>
    </div>
  </div>
);

const DoctorStatsCards: React.FC<Props> = ({ stats }) => {
  const defaultStats: Stat[] = [
    { label: 'Today\'s Appointments', value: 0, icon: <CalendarCheck className="w-5 h-5" /> },
    { label: 'Pending', value: 0, icon: <Clock className="w-5 h-5" /> },
    { label: 'New Messages', value: 0, icon: <MessageSquareText className="w-5 h-5" /> },
    { label: 'Patients', value: 0, icon: <UsersRound className="w-5 h-5" /> },
  ];

  const items = stats?.length ? stats : defaultStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((s, idx) => (
        <Card key={idx} {...s} />
      ))}
    </div>
  );
};

export default DoctorStatsCards;
