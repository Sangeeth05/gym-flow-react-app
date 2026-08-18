import React, { useEffect, useState } from 'react';
import {
  Building2, Users, UserCheck, TrendingUp, Activity,
  CheckCircle2, XCircle, AlertCircle, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { StatCard, Card, Spinner } from '../../../components/ui';
import { useAuthStore } from '../../../store/authStore';

const revenueData = [
  { month: 'Mar', revenue: 420000 },
  { month: 'Apr', revenue: 510000 },
  { month: 'May', revenue: 480000 },
  { month: 'Jun', revenue: 620000 },
  { month: 'Jul', revenue: 710000 },
  { month: 'Aug', revenue: 830000 },
];

const gymGrowthData = [
  { month: 'Mar', gyms: 12 },
  { month: 'Apr', gyms: 15 },
  { month: 'May', gyms: 18 },
  { month: 'Jun', gyms: 22 },
  { month: 'Jul', gyms: 26 },
  { month: 'Aug', gyms: 31 },
];

const recentActivity = [
  { id: 1, icon: '🏋️', message: 'Iron Paradise Gym joined the platform', time: '2 hours ago' },
  { id: 2, icon: '👤', message: 'New gym admin registered — Priya Nair', time: '4 hours ago' },
  { id: 3, icon: '✅', message: 'FitZone gym subscription renewed', time: '6 hours ago' },
  { id: 4, icon: '⚠️', message: 'Apex Fitness payment overdue (3 days)', time: 'Yesterday' },
  { id: 5, icon: '🚫', message: 'StrongHouse gym suspended due to non-payment', time: 'Yesterday' },
  { id: 6, icon: '🏅', message: 'Platform crossed 10,000 total members milestone', time: '2 days ago' },
];

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-dark-700 border border-dark-500 rounded-lg p-3 text-xs shadow-xl">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.name === 'Revenue'
              ? `₹${(p.value / 1000).toFixed(0)}k`
              : p.value}
          </p>
        ))}
      </div>
    );
  };

  if (loading) return <Spinner className="h-96" />;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="page-subtitle">Platform overview — here's what's happening across all gyms</p>
      </div>

      {/* Stats Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Gyms"
          value="31"
          change={8.6}
          icon={<Building2 className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-500/10"
          subtext="+2 this month"
        />
        <StatCard
          title="Active Gyms"
          value="28"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
          subtext="3 suspended"
        />
        <StatCard
          title="Total Members"
          value="10,482"
          change={12.4}
          icon={<Users className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-500/10"
          subtext="+384 this month"
        />
        <StatCard
          title="Platform Revenue"
          value="₹8.3L"
          change={16.8}
          icon={<TrendingUp className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-500/10"
          subtext="This month"
        />
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gym Admins"
          value="31"
          icon={<UserCheck className="w-5 h-5 text-teal-400" />}
          iconBg="bg-teal-500/10"
        />
        <StatCard
          title="Suspended Gyms"
          value="3"
          icon={<XCircle className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-500/10"
        />
        <StatCard
          title="Pending Approvals"
          value="2"
          icon={<AlertCircle className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-500/10"
        />
        <StatCard
          title="Avg Members/Gym"
          value="338"
          icon={<BarChart3 className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-5">
            <h3 className="font-bold text-white">Platform Revenue</h3>
            <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="superRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
              <XAxis dataKey="month" stroke="#5a5a78" tick={{ fontSize: 11, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#a855f7" strokeWidth={2} fill="url(#superRevGrad)" dot={false} activeDot={{ r: 4, fill: '#a855f7' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-5">
            <h3 className="font-bold text-white">Gym Growth</h3>
            <p className="text-xs text-slate-500 mt-0.5">Total gyms over time</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gymGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
              <XAxis dataKey="month" stroke="#5a5a78" tick={{ fontSize: 11, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gyms" name="Gyms" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Activity + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Activity</h3>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-tight">{item.message}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">Platform Health</h3>
          <div className="space-y-4">
            {[
              { label: 'Active Gyms', value: 28, total: 31, color: 'bg-emerald-500' },
              { label: 'Paying Gyms', value: 25, total: 31, color: 'bg-purple-500' },
              { label: 'Member Retention', value: 87, total: 100, color: 'bg-blue-500' },
              { label: 'Platform Uptime', value: 99, total: 100, color: 'bg-brand-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-semibold">
                    {Math.round((item.value / item.total) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.round((item.value / item.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="divider my-2" />

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Gyms Today', value: '1', icon: '🏋️' },
                { label: 'New Members', value: '47', icon: '👥' },
                { label: "Today's Revenue", value: '₹28.4k', icon: '💰' },
                { label: 'Support Tickets', value: '3', icon: '🎫' },
              ].map((item) => (
                <div key={item.label} className="bg-dark-700 rounded-lg p-3 flex items-center gap-2">
                  <span>{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{item.value}</p>
                    <p className="text-xs text-slate-500">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
