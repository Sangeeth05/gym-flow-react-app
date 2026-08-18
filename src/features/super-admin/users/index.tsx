import React, { useState } from 'react';
import { Users, Search, Mail, Building2, MoreVertical, Shield } from 'lucide-react';
import { Badge, Card, StatCard } from '../../../components/ui';

type UserRole = 'Member' | 'Trainer' | 'GymAdmin' | 'SuperAdmin';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gymName?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinedAt: string;
  lastLogin: string;
}

const mockUsers: PlatformUser[] = [
  { id: '1', name: 'Arjun Mehta', email: 'arjun@example.com', role: 'Member', gymName: 'Iron Paradise', status: 'Active', joinedAt: '2024-05-10', lastLogin: '2 hours ago' },
  { id: '2', name: 'Sita Raman', email: 'sita@example.com', role: 'Member', gymName: 'FitZone', status: 'Active', joinedAt: '2024-03-18', lastLogin: '1 day ago' },
  { id: '3', name: 'Karthik Iyer', email: 'karthik@example.com', role: 'Trainer', gymName: 'Apex Fitness', status: 'Active', joinedAt: '2023-12-01', lastLogin: '3 hours ago' },
  { id: '4', name: 'Lakshmi Dev', email: 'lakshmi@example.com', role: 'Member', gymName: 'FitZone', status: 'Suspended', joinedAt: '2024-01-22', lastLogin: '10 days ago' },
  { id: '5', name: 'Rahul Gupta', email: 'rahul@example.com', role: 'Trainer', gymName: 'Golden Gym', status: 'Active', joinedAt: '2024-02-14', lastLogin: '5 hours ago' },
  { id: '6', name: 'Pooja Sharma', email: 'pooja@example.com', role: 'Member', gymName: 'Strong House', status: 'Inactive', joinedAt: '2024-04-30', lastLogin: '1 month ago' },
  { id: '7', name: 'Naveen Pillai', email: 'naveen@example.com', role: 'Member', gymName: 'Elite Fitness', status: 'Active', joinedAt: '2024-06-01', lastLogin: '6 hours ago' },
  { id: '8', name: 'Divya Nair', email: 'divya@example.com', role: 'Trainer', gymName: 'Iron Paradise', status: 'Active', joinedAt: '2023-10-15', lastLogin: '1 day ago' },
  { id: '9', name: 'Aditya Kumar', email: 'aditya@example.com', role: 'Member', gymName: 'Power Zone', status: 'Active', joinedAt: '2024-07-12', lastLogin: '45 minutes ago' },
  { id: '10', name: 'Sneha Kulkarni', email: 'sneha@example.com', role: 'Member', gymName: 'Apex Fitness', status: 'Active', joinedAt: '2024-08-01', lastLogin: 'Just now' },
];

const roleBadge: Record<UserRole, { color: 'green' | 'blue' | 'orange' | 'gray'; label: string }> = {
  Member: { color: 'blue', label: 'Member' },
  Trainer: { color: 'green', label: 'Trainer' },
  GymAdmin: { color: 'orange', label: 'Gym Admin' },
  SuperAdmin: { color: 'gray', label: 'Super Admin' },
};

const statusColor = (s: PlatformUser['status']) =>
  s === 'Active' ? 'green' : s === 'Suspended' ? 'yellow' : 'red';

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.gymName?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="page-title">Platform Users</h1>
        <p className="page-subtitle">All users across all gyms on the platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={mockUsers.length} icon={<Users className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10" />
        <StatCard title="Members" value={mockUsers.filter((u) => u.role === 'Member').length} icon={<Users className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" />
        <StatCard title="Trainers" value={mockUsers.filter((u) => u.role === 'Trainer').length} icon={<Shield className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Active" value={mockUsers.filter((u) => u.status === 'Active').length} icon={<Users className="w-5 h-5 text-brand-400" />} iconBg="bg-brand-500/10" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, or gym..."
              className="input-field pl-9 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['All', 'Member', 'Trainer', 'GymAdmin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleFilter === r
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-700 text-slate-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                {r === 'GymAdmin' ? 'Gym Admin' : r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gym</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-dark-700/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-sm flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{u.name}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />{u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={roleBadge[u.role].color}>{roleBadge[u.role].label}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    {u.gymName ? (
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-slate-600" />{u.gymName}
                      </div>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={statusColor(u.status)} dot>{u.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{u.lastLogin}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-600 text-slate-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === u.id && (
                        <div className="absolute right-0 top-9 z-20 bg-dark-700 border border-dark-500 rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                          <button onClick={() => setOpenMenuId(null)} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-dark-600 transition-colors">View Details</button>
                          <button onClick={() => setOpenMenuId(null)} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-dark-600 transition-colors">Suspend</button>
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
          <p className="text-xs text-slate-500">Showing {filtered.length} of {mockUsers.length} users</p>
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;
