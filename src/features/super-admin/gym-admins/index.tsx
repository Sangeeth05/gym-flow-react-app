import React, { useState } from 'react';
import {
  UserCheck, Search, Mail, Phone, Building2,
  CheckCircle2, XCircle, MoreVertical,
} from 'lucide-react';
import { Badge, Card, StatCard } from '../../../components/ui';

interface GymAdminRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  gymName: string;
  gymCity: string;
  memberCount: number;
  status: 'Active' | 'Inactive';
  joinedAt: string;
}

const mockAdmins: GymAdminRecord[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@ironparadise.com', phone: '+91 98765 43210', gymName: 'Iron Paradise', gymCity: 'Mumbai', memberCount: 412, status: 'Active', joinedAt: '2024-01-15' },
  { id: '2', name: 'Priya Nair', email: 'priya@fitzone.in', phone: '+91 87654 32109', gymName: 'FitZone', gymCity: 'Bangalore', memberCount: 289, status: 'Active', joinedAt: '2024-03-22' },
  { id: '3', name: 'Arun Sharma', email: 'arun@apexfitness.com', phone: '+91 76543 21098', gymName: 'Apex Fitness', gymCity: 'Chennai', memberCount: 356, status: 'Active', joinedAt: '2024-02-10' },
  { id: '4', name: 'Meera Patel', email: 'meera@stronghouse.com', phone: '+91 65432 10987', gymName: 'Strong House', gymCity: 'Ahmedabad', memberCount: 178, status: 'Inactive', joinedAt: '2024-04-05' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@goldengym.in', phone: '+91 54321 09876', gymName: 'Golden Gym', gymCity: 'Delhi', memberCount: 523, status: 'Active', joinedAt: '2023-11-20' },
  { id: '6', name: 'Ananya Reddy', email: 'ananya@elitefit.com', phone: '+91 43210 98765', gymName: 'Elite Fitness', gymCity: 'Hyderabad', memberCount: 244, status: 'Active', joinedAt: '2024-05-01' },
  { id: '7', name: 'Suresh Menon', email: 'suresh@powerzone.in', phone: '+91 32109 87654', gymName: 'Power Zone', gymCity: 'Pune', memberCount: 312, status: 'Active', joinedAt: '2024-01-30' },
  { id: '8', name: 'Deepa Krishnan', email: 'deepa@sculpt.com', phone: '+91 21098 76543', gymName: 'Sculpt Studio', gymCity: 'Kochi', memberCount: 197, status: 'Inactive', joinedAt: '2024-06-15' },
];

const GymAdminsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = mockAdmins.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.gymName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: mockAdmins.length,
    active: mockAdmins.filter((a) => a.status === 'Active').length,
    inactive: mockAdmins.filter((a) => a.status === 'Inactive').length,
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="page-title">Gym Admins</h1>
        <p className="page-subtitle">All gym administrators on the platform</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Admins"
          value={counts.total}
          icon={<UserCheck className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-500/10"
        />
        <StatCard
          title="Active"
          value={counts.active}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Inactive"
          value={counts.inactive}
          icon={<XCircle className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-500/10"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or gym..."
              className="input-field pl-9 w-full"
            />
          </div>
          <div className="flex gap-2">
            {(['All', 'Active', 'Inactive'] as const).map((s) => (
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

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-semibold">No gym admins found</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gym</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Members</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filtered.map((admin) => (
                  <tr key={admin.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-sm flex-shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{admin.name}</p>
                          <p className="text-xs text-slate-500">Since {admin.joinedAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3 h-3" />{admin.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="w-3 h-3" />{admin.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-300">{admin.gymName}</p>
                          <p className="text-xs text-slate-600">{admin.gymCity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-300">{admin.memberCount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={admin.status === 'Active' ? 'green' : 'red'} dot>
                        {admin.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === admin.id ? null : admin.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuId === admin.id && (
                          <div className="absolute right-0 top-9 z-20 bg-dark-700 border border-dark-500 rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-dark-600 transition-colors"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-dark-600 transition-colors"
                            >
                              Send Message
                            </button>
                            {admin.status === 'Active' ? (
                              <button
                                onClick={() => setOpenMenuId(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-600 transition-colors"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => setOpenMenuId(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-dark-600 transition-colors"
                              >
                                Activate
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-dark-700">
            <p className="text-xs text-slate-500">Showing {filtered.length} of {mockAdmins.length} admins</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GymAdminsPage;
