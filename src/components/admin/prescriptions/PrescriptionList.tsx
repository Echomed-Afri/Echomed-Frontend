import React, { useEffect, useState } from 'react';
import { adminPrescriptionsAPI } from '../../../services/admin';

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
    {label}
  </span>
);

type Props = {
  onOpen: (id: string) => void;
};

const PrescriptionList: React.FC<Props> = ({ onOpen }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await adminPrescriptionsAPI.list({ status: status || undefined });
        const list = res.prescriptions || res;
        if (mounted) setItems(list);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [status]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No prescriptions found.</td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{p.id.slice(-8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.patient?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.doctor?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      label={p.status}
                      color={
                        p.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        p.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        p.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onOpen(p.id)} className="text-blue-600 hover:text-blue-900">Open</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionList;
