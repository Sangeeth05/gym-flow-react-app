import React, { useState } from 'react';
import { TrendingUp, Building2, Users, CreditCard, Download } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Button, Card, StatCard } from '../../../components/ui';
import toast from 'react-hot-toast';

const monthlyRevenue = [
  { month: 'Jan', revenue: 280000, gyms: 22 },
  { month: 'Feb', revenue: 320000, gyms: 24 },
  { month: 'Mar', revenue: 420000, gyms: 26 },
  { month: 'Apr', revenue: 510000, gyms: 27 },
  { month: 'May', revenue: 480000, gyms: 28 },
  { month: 'Jun', revenue: 620000, gyms: 29 },
  { month: 'Jul', revenue: 710000, gyms: 30 },
  { month: 'Aug', revenue: 830000, gyms: 31 },
];

const memberGrowth = [
  { month: 'Jan', members: 6200 },
  { month: 'Feb', members: 7100 },
  { month: 'Mar', members: 7800 },
  { month: 'Apr', members: 8400 },
  { month: 'May', members: 8900 },
  { month: 'Jun', members: 9300 },
  { month: 'Jul', members: 9900 },
  { month: 'Aug', members: 10482 },
];

const planDistribution = [
  { name: 'Starter', value: 8, color: '#60a5fa' },
  { name: 'Growth', value: 15, color: '#a855f7' },
  { name: 'Pro', value: 6, color: '#f97316' },
  { name: 'Enterprise', value: 2, color: '#22c55e' },
];

const topGyms = [
  { name: 'Golden Gym', city: 'Delhi', members: 523, revenue: 7999 },
  { name: 'Iron Paradise', city: 'Mumbai', members: 412, revenue: 3999 },
  { name: 'Apex Fitness', city: 'Chennai', members: 356, revenue: 7999 },
  { name: 'Power Zone', city: 'Pune', members: 312, revenue: 3999 },
  { name: 'FitZone', city: 'Bangalore', members: 289, revenue: 3999 },
];

const SuperAdminReports: React.FC = () => {
  const [range, setRange] = useState<'3M' | '6M' | '1Y'>('6M');

  const filteredRevenue = range === '3M'
    ? monthlyRevenue.slice(-3)
    : range === '6M'
    ? monthlyRevenue.slice(-6)
    : monthlyRevenue;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-dark-700 border border-dark-500 rounded-lg p-3 text-xs shadow-xl">
        <p className="font-semibold text-white mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.name === 'Revenue' ? `₹${(p.value / 1000).toFixed(0)}k` : p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Platform Reports</h1>
          <p className="page-subtitle">Platform-wide analytics and performance</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => toast.success('Report export coming soon')}
        >
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="₹41.7L" change={16.8} icon={<TrendingUp className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10" subtext="This year" />
        <StatCard title="Active Gyms" value="28" change={8.6} icon={<Building2 className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Total Members" value="10,482" change={12.4} icon={<Users className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" />
        <StatCard title="Avg Revenue/Gym" value="₹29.6k" change={4.2} icon={<CreditCard className="w-5 h-5 text-brand-400" />} iconBg="bg-brand-500/10" />
      </div>

      {/* Revenue chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white">Revenue Over Time</h3>
            <p className="text-xs text-slate-500 mt-0.5">Monthly platform subscription revenue</p>
          </div>
          <div className="flex gap-2">
            {(['3M', '6M', '1Y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  range === r ? 'bg-purple-600 text-white' : 'bg-dark-700 text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={filteredRevenue} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="rptRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
            <XAxis dataKey="month" stroke="#5a5a78" tick={{ fontSize: 11, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#a855f7" strokeWidth={2} fill="url(#rptRevGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Member growth */}
        <Card className="lg:col-span-2 p-5">
          <div className="mb-5">
            <h3 className="font-bold text-white">Member Growth</h3>
            <p className="text-xs text-slate-500 mt-0.5">Total members across all gyms</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={memberGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
              <XAxis dataKey="month" stroke="#5a5a78" tick={{ fontSize: 11, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="members" name="Members" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Plan distribution */}
        <Card className="p-5">
          <h3 className="font-bold text-white mb-1">Plan Distribution</h3>
          <p className="text-xs text-slate-500 mb-3">Gyms by subscription tier</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={planDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {planDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {planDistribution.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="text-white font-semibold">{p.value} gyms</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top gyms */}
      <Card className="p-5">
        <h3 className="font-bold text-white mb-4">Top Performing Gyms</h3>
        <div className="space-y-3">
          {topGyms.map((gym, i) => (
            <div key={gym.name} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-600 w-5 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-white">{gym.name}</p>
                  <p className="text-xs text-slate-400">{gym.members} members</p>
                </div>
                <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(gym.members / topGyms[0].members) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-300 w-16 text-right">₹{gym.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminReports;
