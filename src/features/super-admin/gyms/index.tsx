import React, { useEffect, useState } from 'react';
import {
  Building2, Search, CheckCircle2, XCircle,
  MapPin, Users, RefreshCw, MoreVertical,
} from 'lucide-react';
import { Button, Badge, Spinner, Card, StatCard } from '../../../components/ui';
import { gymsApi, Gym } from '../../../api/endpoints/superAdmin';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

type StatusFilter = 'All' | 'Active' | 'Suspended' | 'Pending';

const statusBadgeColor = (status: Gym['status']) => {
  if (status === 'Active') return 'green';
  if (status === 'Suspended') return 'red';
  return 'yellow';
};

const GymsPage: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await gymsApi.getAll();
      setGyms(data);
    } catch {
      toast.error('Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleActivate = async (gym: Gym) => {
    setActionLoading(gym.id);
    setOpenMenuId(null);
    try {
      await gymsApi.activate(gym.id);
      setGyms((prev) => prev.map((g) => g.id === gym.id ? { ...g, status: 'Active' } : g));
      toast.success(`${gym.name} activated`);
    } catch {
      toast.error('Failed to activate gym');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (gym: Gym) => {
    setActionLoading(gym.id);
    setOpenMenuId(null);
    try {
      await gymsApi.suspend(gym.id);
      setGyms((prev) => prev.map((g) => g.id === gym.id ? { ...g, status: 'Suspended' } : g));
      toast.success(`${gym.name} suspended`);
    } catch {
      toast.error('Failed to suspend gym');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = gyms.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.city?.toLowerCase().includes(search.toLowerCase()) ||
      g.adminName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: gyms.length,
    active: gyms.filter((g) => g.status === 'Active').length,
    suspended: gyms.filter((g) => g.status === 'Suspended').length,
    pending: gyms.filter((g) => g.status === 'Pending').length,
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Gyms</h1>
          <p className="page-subtitle">Manage all gyms on the platform</p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gyms"
          value={counts.total}
          icon={<Building2 className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-500/10"
        />
        <StatCard
          title="Active"
          value={counts.active}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Suspended"
          value={counts.suspended}
          icon={<XCircle className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-500/10"
        />
        <StatCard
          title="Pending"
          value={counts.pending}
          icon={<Building2 className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-500/10"
        />
      </div>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gyms by name, city, or admin..."
              className="input-field pl-9 w-full"
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Active', 'Suspended', 'Pending'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-700 text-slate-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <Spinner className="h-60" />
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-semibold">No gyms found</p>
          <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gym</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Members</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filtered.map((gym) => (
                  <tr key={gym.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{gym.name}</p>
                          {gym.email && <p className="text-xs text-slate-500">{gym.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{[gym.city, gym.state].filter(Boolean).join(', ') || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-slate-300">{gym.adminName || '—'}</p>
                        {gym.adminEmail && <p className="text-xs text-slate-600">{gym.adminEmail}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-300">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {gym.memberCount ?? '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={statusBadgeColor(gym.status)} dot>
                        {gym.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {gym.createdAt ? format(new Date(gym.createdAt), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        {actionLoading === gym.id ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setOpenMenuId(openMenuId === gym.id ? null : gym.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {openMenuId === gym.id && (
                              <div className="absolute right-0 top-9 z-20 bg-dark-700 border border-dark-500 rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                                {gym.status !== 'Active' && (
                                  <button
                                    onClick={() => handleActivate(gym)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-dark-600 transition-colors"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Activate
                                  </button>
                                )}
                                {gym.status !== 'Suspended' && (
                                  <button
                                    onClick={() => handleSuspend(gym)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-600 transition-colors"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Suspend
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-dark-700 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filtered.length} of {gyms.length} gyms
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GymsPage;
