import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage } from '../../services/api';
import { toast } from '../../store/toastStore';
import { Input, Select } from '../../components/ui/FormField';
import { Search } from 'lucide-react';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ role: '', status: '', q: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => api.get('/admin/users', { params: filters }).then(r => r.data.data.items),
  });

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      toast.success('הסטטוס עודכן');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (e) { toast.error(errorMessage(e)); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ניהול משתמשים</h1>

      <div className="card grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-ink-400" />
          <Input className="pe-10" placeholder="חיפוש לפי שם / אימייל" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </div>
        <Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">כל התפקידים</option>
          <option value="producer">מפיק</option>
          <option value="marketer">משווק</option>
          <option value="customer">לקוח</option>
          <option value="admin">אדמין</option>
        </Select>
        <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">כל הסטטוסים</option>
          <option value="pending">ממתין</option>
          <option value="active">פעיל</option>
          <option value="blocked">חסום</option>
          <option value="rejected">נדחה</option>
        </Select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-right text-ink-500 border-b border-ink-200">
            <tr><th className="py-2 px-3">שם</th><th className="py-2 px-3">אימייל</th><th className="py-2 px-3">תפקיד</th><th className="py-2 px-3">סטטוס</th><th className="py-2 px-3">פעולה</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="py-8 text-center text-ink-500">טוען...</td></tr>}
            {data?.map(u => (
              <tr key={u._id} className="border-b border-ink-100">
                <td className="py-2 px-3">
                  <div className="font-semibold">{u.fullName}</div>
                  {u.username && <div className="text-xs text-ink-400">@{u.username}</div>}
                </td>
                <td className="py-2 px-3" dir="ltr">{u.email}</td>
                <td className="py-2 px-3">{u.role}</td>
                <td className="py-2 px-3"><span className={`badge ${u.status === 'active' ? 'badge-success' : u.status === 'blocked' ? 'badge-danger' : 'badge-warning'}`}>{u.status}</span></td>
                <td className="py-2 px-3">
                  {u.status !== 'blocked' && <button onClick={() => setStatus(u._id, 'blocked')} className="text-red-600 hover:underline text-xs">חסום</button>}
                  {u.status === 'blocked' && <button onClick={() => setStatus(u._id, 'active')} className="text-emerald-700 hover:underline text-xs">הפעל</button>}
                </td>
              </tr>
            ))}
            {!isLoading && data?.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-ink-500">לא נמצאו משתמשים</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
