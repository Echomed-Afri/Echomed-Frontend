import React, { useEffect, useState } from 'react';
import { adminConsultationsAPI } from '../../../services/admin';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }>= ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

type Props = {
  consultationId: string | null;
  onClose: () => void;
};

const ConsultationDetails: React.FC<Props> = ({ consultationId, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!consultationId) return;
    (async () => {
      try {
        const res = await adminConsultationsAPI.get(consultationId);
        if (mounted) {
          setData(res);
          setStatus(res.status);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, [consultationId]);

  const updateStatus = async () => {
    if (!consultationId) return;
    try {
      setSaving(true);
      await adminConsultationsAPI.updateStatus(consultationId, status as any);
      setSaving(false);
      onClose();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={!!consultationId} onClose={onClose} title={`Consultation ${consultationId?.slice(-8)}`}>
      {!data ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Participants</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-md border">
                <div className="text-gray-500">Patient</div>
                <div className="font-medium">{data.patient?.name}</div>
                <div className="text-gray-500">{data.patient?.phone}</div>
              </div>
              <div className="p-3 rounded-md border">
                <div className="text-gray-500">Doctor</div>
                <div className="font-medium">{data.doctor?.name}</div>
                <div className="text-gray-500">{data.doctor?.specialty}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
            <div className="flex items-center gap-3">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-md px-3 py-2">
                <option value="PENDING">PENDING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <button disabled={saving} onClick={updateStatus} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Message Stats</h4>
            <div className="grid grid-cols-4 gap-4 text-center text-sm">
              <div className="p-3 rounded-md border">
                <div className="text-gray-500">Total</div>
                <div className="font-semibold">{data.messageStats?.totalMessages ?? 0}</div>
              </div>
              <div className="p-3 rounded-md border">
                <div className="text-gray-500">Patient</div>
                <div className="font-semibold">{data.messageStats?.patientMessages ?? 0}</div>
              </div>
              <div className="p-3 rounded-md border">
                <div className="text-gray-500">Doctor</div>
                <div className="font-semibold">{data.messageStats?.doctorMessages ?? 0}</div>
              </div>
              <div className="p-3 rounded-md border">
                <div className="text-gray-500">Last</div>
                <div className="font-semibold">{data.messageStats?.lastMessageAt ? new Date(data.messageStats.lastMessageAt).toLocaleString() : '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ConsultationDetails;
