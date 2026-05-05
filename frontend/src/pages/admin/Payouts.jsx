import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import { api, errorMessage } from '../../services/api';
import { toast } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminPayouts() {
  const qc = useQueryClient();
  const [exporting, setExporting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payouts'],
    queryFn: () => api.get('/payouts/all').then(r => r.data.data.items),
  });

  const exportMasav = async () => {
    setExporting(true);
    try {
      const token = useAuthStore.getState().accessToken;
      const r = await axios.post((import.meta.env.VITE_API_URL || '') + '/api/payouts/masav/export', {}, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true, responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `masav-${Date.now()}.csv`; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('הקובץ הופק והורד. העלו אותו לבנק.');
      qc.invalidateQueries({ queryKey: ['admin-payouts'] });
    } catch (e) { toast.error(errorMessage(e)); } finally { setExporting(false); }
  };

  const markPaid = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/payouts/${id}/paid`);
      toast.success('סומן כשולם');
      qc.invalidateQueries({ queryKey: ['admin-payouts'] });
    } catch (e) { toast.error(errorMessage(e)); } finally { setBusyId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">תשלומים למשווקים</h1>
          <p className="text-ink-600 mt-1">ניהול בקשות תשלום והפקת קובץ מס"ב</p>
        </div>
        <button onClick={exportMasav} disabled={exporting} className="btn-primary btn-md">
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <><Download className="size-4" />הפק קובץ מס"ב</>}
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-right text-ink-500 border-b border-ink-200">
            <tr>
              <th className="py-2 px-3">תאריך</th>
              <th className="py-2 px-3">משווק</th>
              <th className="py-2 px-3">סכום</th>
              <th className="py-2 px-3">פרטי בנק</th>
              <th className="py-2 px-3">סטטוס</th>
              <th className="py-2 px-3">פעולה</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="py-8 text-center text-ink-500">טוען...</td></tr>}
            {data?.map(p => (
              <tr key={p._id} className="border-b border-ink-100">
                <td className="py-2 px-3">{new Date(p.createdAt).toLocaleDateString('he-IL')}</td>
                <td className="py-2 px-3">
                  <div className="font-semibold">{p.marketer?.fullName}</div>
                  <div className="text-xs text-ink-400">@{p.marketer?.username}</div>
                </td>
                <td className="py-2 px-3 font-bold">₪{p.amount.toLocaleString('he-IL')}</td>
                <td className="py-2 px-3 text-xs">
                  <div>{p.bankSnapshot?.accountHolder}</div>
                  <div className="text-ink-400">בנק {p.bankSnapshot?.bankCode} סניף {p.bankSnapshot?.branchCode} · חשבון {p.bankSnapshot?.accountNumber}</div>
                </td>
                <td className="py-2 px-3"><span className={`badge ${p.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                <td className="py-2 px-3">
                  {p.status === 'processing' && (
                    <button onClick={() => markPaid(p._id)} disabled={busyId === p._id} className="text-emerald-700 hover:underline inline-flex items-center gap-1">
                      {busyId === p._id ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />}
                      סמן שולם
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!isLoading && data?.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-ink-500">אין בקשות תשלום</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
