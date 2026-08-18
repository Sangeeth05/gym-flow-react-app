import React, { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  Package,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatCard, Spinner, Card } from "../../../components/ui";
import { dashboardApi, dashboardSummaryApi } from "../../../api/endpoints";
import { DashboardStats, RecentActivity } from "../../../types";
import { useAuthStore } from "../../../store/authStore";

const PIE_COLORS = ["#f97316", "#3b82f6", "#8b5cf6", "#22c55e"];

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [revenueByType, setRevenueByType] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, a, r, summary] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentActivity(),
          dashboardApi.getRevenueChart(),
          dashboardSummaryApi.getSummary(),
        ]);
        setStats(s);
        setActivity(a);
        setRevenue(r);
        if (summary?.revenueByType) setRevenueByType(summary.revenueByType);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-dark-700 border border-dark-500 rounded-lg p-3 text-xs shadow-xl">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  if (loading) return <Spinner className="h-96" />;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="page-title">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="page-subtitle">
          {user?.gymName} — Here's what's happening today
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Members"
          value={stats?.activeMembers.toLocaleString() ?? 0}
          change={8.2}
          icon={<Users className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-500/10"
          subtext={`+${stats?.newMembersThisMonth} this month`}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.monthlyRevenue ?? 0)}
          change={stats?.revenueGrowth}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Today's Check-ins"
          value={stats?.todayCheckIns ?? 0}
          icon={<CheckCircle2 className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-500/10"
          subtext={`${stats?.occupancyRate}% occupancy`}
        />
        <StatCard
          title="Expiring Soon"
          value={stats?.expiringSoon ?? 0}
          icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-500/10"
          subtext="Members in 7 days"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers.toLocaleString() ?? 0}
          icon={<Users className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-500/10"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(stats?.pendingPayments ?? 0)}
          icon={<CreditCard className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-500/10"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockItems ?? 0}
          icon={<Package className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-500/10"
        />
        <StatCard
          title="Total Staff"
          value={stats?.totalStaff ?? 0}
          icon={<UserCheck className="w-5 h-5 text-teal-400" />}
          iconBg="bg-teal-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white">Revenue Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Expenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={revenue}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
              <XAxis
                dataKey="month"
                stroke="#5a5a78"
                tick={{ fontSize: 11, fill: "#5a5a78" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#5a5a78"
                tick={{ fontSize: 10, fill: "#5a5a78" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#f97316" }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#expGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-white mb-1">Revenue Split</h3>
          <p className="text-xs text-slate-500 mb-4">By category</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={
                  revenueByType.length
                    ? revenueByType
                    : [
                        { type: "Membership", amount: 198000 },
                        { type: "Products", amount: 54000 },
                        { type: "PT Sessions", amount: 24000 },
                        { type: "Other", amount: 8500 },
                      ]
                }
                dataKey="amount"
                nameKey="type"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
              >
                {PIE_COLORS.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => formatCurrency(v)}
                contentStyle={{
                  backgroundColor: "#1a1a24",
                  border: "1px solid #2d2d3d",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {["Membership", "Products", "PT Sessions", "Other"].map(
              (label, i) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-2 text-slate-400">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    {label}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {i === 0
                      ? "69.7%"
                      : i === 1
                        ? "19%"
                        : i === 2
                          ? "8.4%"
                          : "3%"}
                  </span>
                </div>
              ),
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Activity</h3>
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-tight">
                    {item.message}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">Quick Overview</h3>
          <div className="space-y-3">
            {[
              {
                label: "Active Members",
                value: stats?.activeMembers ?? 0,
                total: stats?.totalMembers ?? 1,
                color: "bg-brand-500",
              },
              {
                label: "Paid This Month",
                value: 89,
                total: 100,
                color: "bg-emerald-500",
              },
              {
                label: "Occupancy Today",
                value: stats?.occupancyRate ?? 0,
                total: 100,
                color: "bg-blue-500",
              },
              {
                label: "Products In Stock",
                value: 148,
                total: stats?.totalProducts ?? 156,
                color: "bg-purple-500",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-semibold">
                    {Math.round((item.value / (item.total || 1)) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{
                      width: `${Math.min(100, Math.round((item.value / (item.total || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="divider my-4" />

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "New Today", value: "4", icon: "👤" },
              {
                label: "Check-ins",
                value: stats?.todayCheckIns?.toString() ?? "0",
                icon: "✅",
              },
              { label: "Revenue Today", value: "₹9,840", icon: "💰" },
              { label: "Active Promos", value: "2", icon: "🎟️" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-dark-700 rounded-lg p-3 flex items-center gap-2"
              >
                <span>{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
