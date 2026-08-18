import React, { useState } from 'react';
import {
  CreditCard, Check, Building2, TrendingUp,
  Users, MoreVertical, Star,
} from 'lucide-react';
import { Badge, Button, Card, StatCard, Modal } from '../../../components/ui';
import toast from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
  maxMembers: number;
  maxStaff: number;
  features: string[];
  isPopular: boolean;
  activeGyms: number;
  status: 'Active' | 'Inactive';
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Starter',
    price: 1999,
    billingCycle: 'Monthly',
    maxMembers: 200,
    maxStaff: 5,
    features: ['Member management', 'Basic reports', 'Email support', 'Mobile app'],
    isPopular: false,
    activeGyms: 8,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Growth',
    price: 3999,
    billingCycle: 'Monthly',
    maxMembers: 750,
    maxStaff: 15,
    features: ['Everything in Starter', 'Advanced analytics', 'Inventory management', 'Promotions', 'Priority support'],
    isPopular: true,
    activeGyms: 15,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Pro',
    price: 7999,
    billingCycle: 'Monthly',
    maxMembers: 2000,
    maxStaff: 50,
    features: ['Everything in Growth', 'Multi-branch support', 'Custom branding', 'API access', 'Dedicated manager', 'SLA guarantee'],
    isPopular: false,
    activeGyms: 6,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Enterprise',
    price: 0,
    billingCycle: 'Yearly',
    maxMembers: -1,
    maxStaff: -1,
    features: ['Unlimited members', 'Unlimited staff', 'White-label solution', 'Custom integrations', '24/7 dedicated support'],
    isPopular: false,
    activeGyms: 2,
    status: 'Active',
  },
];

interface GymSubscription {
  id: string;
  gymName: string;
  plan: string;
  status: 'Active' | 'Overdue' | 'Cancelled';
  nextBilling: string;
  amount: number;
}

const mockGymSubs: GymSubscription[] = [
  { id: '1', gymName: 'Iron Paradise', plan: 'Growth', status: 'Active', nextBilling: '2026-09-01', amount: 3999 },
  { id: '2', gymName: 'FitZone', plan: 'Growth', status: 'Active', nextBilling: '2026-09-15', amount: 3999 },
  { id: '3', gymName: 'Apex Fitness', plan: 'Pro', status: 'Active', nextBilling: '2026-09-05', amount: 7999 },
  { id: '4', gymName: 'Strong House', plan: 'Starter', status: 'Overdue', nextBilling: '2026-08-01', amount: 1999 },
  { id: '5', gymName: 'Golden Gym', plan: 'Pro', status: 'Active', nextBilling: '2026-09-20', amount: 7999 },
  { id: '6', gymName: 'Elite Fitness', plan: 'Growth', status: 'Active', nextBilling: '2026-09-10', amount: 3999 },
  { id: '7', gymName: 'Power Zone', plan: 'Starter', status: 'Active', nextBilling: '2026-09-25', amount: 1999 },
  { id: '8', gymName: 'Sculpt Studio', plan: 'Starter', status: 'Cancelled', nextBilling: '—', amount: 0 },
];

const subStatusColor = (s: GymSubscription['status']) =>
  s === 'Active' ? 'green' : s === 'Overdue' ? 'yellow' : 'red';

const SubscriptionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions'>('plans');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const totalMRR = mockGymSubs
    .filter((s) => s.status === 'Active')
    .reduce((sum, s) => sum + s.amount, 0);

  const handleViewPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Manage gym subscription plans and billing</p>
        </div>
        <Button
          size="sm"
          leftIcon={<CreditCard className="w-4 h-4" />}
          onClick={() => toast.success('Plan editor coming soon')}
        >
          New Plan
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue" value={`₹${(totalMRR / 1000).toFixed(1)}k`} change={14.2} icon={<TrendingUp className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10" />
        <StatCard title="Active Subs" value={mockGymSubs.filter((s) => s.status === 'Active').length} icon={<Building2 className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Overdue" value={mockGymSubs.filter((s) => s.status === 'Overdue').length} icon={<CreditCard className="w-5 h-5 text-yellow-400" />} iconBg="bg-yellow-500/10" />
        <StatCard title="Total Gyms" value={mockGymSubs.length} icon={<Users className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 rounded-lg p-1 w-fit border border-dark-600">
        {(['plans', 'subscriptions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-dark-600 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'plans' ? 'Plans' : 'Gym Subscriptions'}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-dark-800 border rounded-xl p-5 flex flex-col gap-4 transition-all ${
                plan.isPopular ? 'border-purple-500/60' : 'border-dark-600'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div>
                <p className="font-bold text-white text-base">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  {plan.price === 0 ? (
                    <span className="text-2xl font-bold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-white">₹{plan.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-500">/mo</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{plan.billingCycle} billing</p>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p><span className="text-white font-semibold">{plan.maxMembers === -1 ? 'Unlimited' : plan.maxMembers.toLocaleString()}</span> members</p>
                <p><span className="text-white font-semibold">{plan.maxStaff === -1 ? 'Unlimited' : plan.maxStaff}</span> staff</p>
              </div>

              <ul className="space-y-1.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="border-t border-dark-600 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">{plan.activeGyms} active gyms</span>
                <button
                  onClick={() => handleViewPlan(plan)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Edit Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gym</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Billing</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {mockGymSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <p className="text-sm font-semibold text-white">{sub.gymName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-300">{sub.plan}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={subStatusColor(sub.status)} dot>{sub.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{sub.nextBilling}</td>
                    <td className="px-5 py-4 text-sm text-slate-300 font-semibold">
                      {sub.amount > 0 ? `₹${sub.amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-dark-600 text-slate-400 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Plan Edit Modal */}
      <Modal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} title={`Edit Plan — ${selectedPlan?.name}`} size="md">
        <div className="space-y-3 py-2">
          <p className="text-sm text-slate-400">Plan editing will be available in the next release. Currently showing plan details for <span className="text-white font-semibold">{selectedPlan?.name}</span>.</p>
          <div className="bg-dark-700 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="text-white">₹{selectedPlan?.price.toLocaleString()}/mo</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Max Members</span><span className="text-white">{selectedPlan?.maxMembers === -1 ? 'Unlimited' : selectedPlan?.maxMembers}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Max Staff</span><span className="text-white">{selectedPlan?.maxStaff === -1 ? 'Unlimited' : selectedPlan?.maxStaff}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Active Gyms</span><span className="text-white">{selectedPlan?.activeGyms}</span></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionsPage;
