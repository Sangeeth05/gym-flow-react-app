import React, { useState, useEffect } from 'react';
import { BarChart2, Download, TrendingUp, Users, CreditCard, Package } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Card, StatCard, Spinner } from '../../components/ui';
import { dashboardApi, financeApi, membersApi } from '../../api/services';

const COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#22c55e', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-lg p-3 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="mb-0.5">
          {p.name}: {typeof p.value === 'number' && p.value > 1000
            ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
        </p>
      ))}
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [memberGrowth] = useState([
    { month: 'Nov', new: 28, churned: 8, net: 20 },
    { month: 'Dec', new: 35, churned: 12, net: 23 },
    { month: 'Jan', new: 52, churned: 9, net: 43 },
    { month: 'Feb', new: 41, churned: 14, net: 27 },
    { month: 'Mar', new: 47, churned: 11, net: 36 },
    { month: 'Apr', new: 43, churned: 10, net: 33 },
  ]);
  const [planDist] = useState([
    { name: 'Basic', value: 312 },
    { name: 'Premium', value: 489 },
    { name: 'Gold', value: 156 },
    { name: 'Elite Annual', value: 25 },
  ]);
  const [peakHours] = useState([
    { hour: '6AM', visits: 45 }, { hour: '7AM', visits: 82 }, { hour: '8AM', visits: 94 },
    { hour: '9AM', visits: 67 }, { hour: '10AM', visits: 48 }, { hour: '11AM', visits: 39 },
    { hour: '12PM', visits: 52 }, { hour: '1PM', visits: 31 }, { hour: '2PM', visits: 28 },
    { hour: '3PM', visits: 35 }, { hour: '4PM', visits: 58 }, { hour: '5PM', visits: 89 },
    { hour: '6PM', visits: 97 }, { hour: '7PM', visits: 85 }, { hour: '8PM', visits: 61 },
    { hour: '9PM', visits: 34 },
  ]);

  useEffect(() => {
    Promise.all([dashboardApi.getRevenueChart()]).then(([rev]) => {
      setRevenueData(rev);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner className="h-96" />;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Business intelligence and performance insights</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Revenue Growth" value="+12.4%" change={12.4}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10"
          subtext="vs last month" />
        <StatCard title="Retention Rate" value="87.2%"
          icon={<Users className="w-5 h-5 text-brand-400" />} iconBg="bg-brand-500/10"
          subtext="Last 90 days" />
        <StatCard title="Avg Revenue/Member" value="₹2,290"
          icon={<CreditCard className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10"
          subtext="Per month" />
        <StatCard title="Inventory Turnover" value="4.2x"
          icon={<Package className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10"
          subtext="Annual rate" />
      </div>

      {/* Revenue vs Expenses */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white">Revenue vs Expenses</h3>
            <p className="text-xs text-slate-500 mt-0.5">Last 6 months comparison</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-brand-500" />Revenue</span>
            <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-full bg-blue-500" />Expenses</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
            <XAxis dataKey="month" stroke="#5a5a78" tick={{ fontSize: 11, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" name="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Member Growth + Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-bold text-white mb-1">Member Growth</h3>
          <p className="text-xs text-slate-500 mb-4">New vs churned members per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
              <XAxis dataKey="month" stroke="#5a5a78" tick={{ fontSize: 11, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Line type="monotone" dataKey="new" name="New" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} />
              <Line type="monotone" dataKey="churned" name="Churned" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
              <Line type="monotone" dataKey="net" name="Net" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-white mb-1">Plan Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Members by membership plan</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={planDist} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {planDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2d2d3d', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {planDist.map((item, i) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-2 text-slate-400">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {item.name}
                    </span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                  <div className="h-1 bg-dark-600 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      backgroundColor: COLORS[i],
                      width: `${(item.value / planDist.reduce((a, p) => a + p.value, 0)) * 100}%`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Peak Hours */}
      <Card className="p-5">
        <h3 className="font-bold text-white mb-1">Peak Hours Analysis</h3>
        <p className="text-xs text-slate-500 mb-4">Average daily check-ins by hour</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={peakHours} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222f" vertical={false} />
            <XAxis dataKey="hour" stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#5a5a78" tick={{ fontSize: 10, fill: '#5a5a78' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visits" name="Check-ins" radius={[3, 3, 0, 0]}
              fill="#f97316"
              label={false}
            >
              {peakHours.map((entry, index) => (
                <Cell key={index} fill={entry.visits >= 80 ? '#ea580c' : entry.visits >= 60 ? '#f97316' : '#9a3412'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-600" />High traffic</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-500" />Medium traffic</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-900" />Low traffic</span>
        </div>
      </Card>

      {/* Summary table */}
      <Card className="p-5">
        <h3 className="font-bold text-white mb-4">Monthly Summary</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Expenses</th>
              <th>Profit</th>
              <th>Margin</th>
              <th>New Members</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((row, i) => {
              const profit = row.revenue - row.expenses;
              const margin = ((profit / row.revenue) * 100).toFixed(1);
              return (
                <tr key={i}>
                  <td className="font-semibold text-white">{row.month}</td>
                  <td className="text-emerald-400 font-semibold">₹{row.revenue.toLocaleString('en-IN')}</td>
                  <td className="text-red-400">₹{row.expenses.toLocaleString('en-IN')}</td>
                  <td className="text-white font-bold">₹{profit.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${parseFloat(margin) > 55 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                      {margin}%
                    </span>
                  </td>
                  <td>{memberGrowth[i]?.new ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ReportsPage;
