import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Clock, AlertCircle, Plus, X, Eye } from 'lucide-react';
import { Badge, SearchInput, StatCard, Spinner, EmptyState, Modal, Button, Input, Select, DatePicker } from '../../../components/ui';
import { financeApi, membersApi } from '../../../api/endpoints';
import { Transaction, PaymentStatus, Member } from '../../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusColor = (s: PaymentStatus) =>
  s === 'Paid' ? 'green' : s === 'Pending' ? 'yellow' : s === 'Overdue' ? 'red' : 'gray';

const TYPES = ['MembershipFee','ProductSale','PersonalTraining','LockerRental','Other'];
const METHODS = ['Cash','Card','UPI','BankTransfer','Cheque'];
const STATUSES = ['Paid','Pending','Overdue','Refunded'];

/* ── Add Payment Modal ─────────────────────────────────────────────────── */
const AddPaymentModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: () => void }> = ({ isOpen, onClose, onSave }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    memberId: '', type: 'MembershipFee', description: '', amount: '',
    paymentMethod: 'Cash', status: 'Paid', dueDate: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) membersApi.getAll().then(r => setMembers(r.data));
  }, [isOpen]);

  const clearError = (k: string) => setErrors(prev => {
    const next = { ...prev };
    delete next[k];
    return next;
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearError(k);
    setForm(f => ({ ...f, [k]: e.target.value }));
  };
  const setValue = (k: string) => (value: string) => {
    clearError(k);
    setForm(f => ({ ...f, [k]: value }));
  };

  const handleSave = async () => {
    const nextErrors = {
      amount: form.amount.trim() ? '' : 'Amount is required.',
      description: form.description.trim() ? '' : 'Description is required.',
    };
    const activeErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, v]) => v));
    setErrors(activeErrors);
    if (Object.keys(activeErrors).length) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      // Mock: push to mockTransactions
      const { mockTransactions } = await import('../../../api/mockData');
      const newTxn: Transaction = {
        id: String(Date.now()),
        transactionId: `TXN-${Date.now()}`,
        memberId: form.memberId || undefined,
        memberName: members.find(m => m.id === form.memberId)
          ? `${members.find(m => m.id === form.memberId)!.firstName} ${members.find(m => m.id === form.memberId)!.lastName}` : undefined,
        type: form.type as any,
        description: form.description,
        amount: parseFloat(form.amount),
        paymentMethod: form.paymentMethod as any,
        status: form.status as any,
        dueDate: form.dueDate || undefined,
        paidAt: form.status === 'Paid' ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
      };
      mockTransactions.unshift(newTxn);
      toast.success('Payment recorded');
      onSave(); onClose();
    } catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment" size="md"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} loading={loading}>Record Payment</Button></>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Select
            label="Member (optional)"
            value={form.memberId}
            onChange={setValue('memberId')}
            showSearch
            optionFilterProp="label"
            options={[
              { value: '', label: 'Walk-in / No member' },
              ...members.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName} (${m.memberId})` })),
            ]}
          />
        </div>
        <Select label="Type *" value={form.type} onChange={setValue('type')}
          options={TYPES.map(t => ({ value: t, label: t.replace(/([A-Z])/g,' $1').trim() }))} />
        <Input label="Amount (₹) *" type="number" value={form.amount} onChange={set('amount')} error={errors.amount} placeholder="0.00" />
        <div className="md:col-span-2">
          <Input label="Description *" value={form.description} onChange={set('description')} error={errors.description} placeholder="e.g. Premium Plan - May 2024" />
        </div>
        <Select label="Payment Method" value={form.paymentMethod} onChange={setValue('paymentMethod')}
          options={METHODS.map(m => ({ value: m, label: m }))} />
        <Select label="Status" value={form.status} onChange={setValue('status')}
          options={STATUSES.map(s => ({ value: s, label: s }))} />
        {form.status !== 'Paid' && (
          <div className="md:col-span-2">
            <DatePicker label="Due Date" value={form.dueDate} onChange={setValue('dueDate')} placeholder="Select due date" />
          </div>
        )}
      </div>
    </Modal>
  );
};

/* ── Transaction Detail Modal ─────────────────────────────────────────── */
const TxnDetailModal: React.FC<{ txn: Transaction | null; onClose: () => void }> = ({ txn, onClose }) => (
  <Modal isOpen={!!txn} onClose={onClose} title="Transaction Details" size="sm">
    {txn && (
      <div className="space-y-3">
        <div className="bg-[var(--color-bg-700)] rounded-xl p-4 text-center">
          <p className={`text-3xl font-bold ${txn.status === 'Paid' ? 'text-emerald-400' : 'text-white'}`}>
            ₹{txn.amount.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-400 mt-1">{txn.description}</p>
        </div>
        {[
          { l: 'Transaction ID', v: txn.transactionId },
          { l: 'Member', v: txn.memberName || '—' },
          { l: 'Type', v: txn.type.replace(/([A-Z])/g,' $1').trim() },
          { l: 'Payment Method', v: txn.paymentMethod },
          { l: 'Status', v: <Badge color={statusColor(txn.status)} dot>{txn.status}</Badge> },
          { l: 'Paid At', v: txn.paidAt ? format(new Date(txn.paidAt), 'dd MMM yyyy, hh:mm a') : '—' },
          { l: 'Due Date', v: txn.dueDate ? format(new Date(txn.dueDate), 'dd MMM yyyy') : '—' },
          { l: 'Created', v: format(new Date(txn.createdAt), 'dd MMM yyyy') },
        ].map(({ l, v }) => (
          <div key={l} className="flex justify-between items-center text-sm py-1.5 border-b border-[var(--color-bg-600)] last:border-0">
            <span className="text-slate-500">{l}</span>
            <span className="text-white font-medium">{v as any}</span>
          </div>
        ))}
      </div>
    )}
  </Modal>
);

/* ── Main Page ────────────────────────────────────────────────────────── */
const FinancePage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [viewTxn, setViewTxn] = useState<Transaction | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [t, s] = await Promise.all([
        financeApi.getTransactions({ search, status: statusFilter || undefined }),
        financeApi.getSummary(),
      ]);
      setTransactions(t.data);
      setSummary(s);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, statusFilter]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div><h1 className="page-title">Finance</h1><p className="page-subtitle">Track revenue, payments and financial health</p></div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Record Payment</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue" value={fmt(summary?.monthlyRevenue ?? 0)} change={12.4} icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Total Revenue" value={fmt(summary?.totalRevenue ?? 0)} icon={<CreditCard className="w-5 h-5 text-[var(--color-brand-400)]" />} iconBg="bg-[var(--color-brand-500)]/10" />
        <StatCard title="Pending" value={fmt(summary?.pendingPayments ?? 0)} icon={<Clock className="w-5 h-5 text-yellow-400" />} iconBg="bg-yellow-500/10" />
        <StatCard title="Overdue" value={fmt(summary?.overduePayments ?? 0)} icon={<AlertCircle className="w-5 h-5 text-red-400" />} iconBg="bg-red-500/10" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search transactions..." className="flex-1 max-w-sm" />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-48"
          options={[{ value: '', label: 'All Status' }, ...STATUSES.map(s => ({ value: s, label: s }))]}
        />
      </div>

      <div className="table-wrapper">
        {loading ? <Spinner className="py-16" /> : transactions.length === 0 ? (
          <EmptyState icon={<CreditCard className="w-12 h-12" />} title="No transactions found"
            description="Record your first payment" action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" />Record Payment</button>} />
        ) : (
          <table className="data-table">
            <thead><tr><th>Transaction</th><th>Member</th><th>Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <span className="font-mono text-xs text-[var(--color-brand-400)]">{t.transactionId}</span>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-[180px] truncate">{t.description}</p>
                  </td>
                  <td><span className="text-sm">{t.memberName || '—'}</span></td>
                  <td><span className="text-xs text-slate-400 bg-[var(--color-bg-700)] px-2 py-1 rounded-full">{t.type.replace(/([A-Z])/g,' $1').trim()}</span></td>
                  <td><span className={`font-bold text-sm ${t.status === 'Paid' ? 'text-emerald-400' : 'text-white'}`}>₹{t.amount.toLocaleString('en-IN')}</span></td>
                  <td><span className="text-xs text-slate-400">{t.paymentMethod}</span></td>
                  <td><Badge color={statusColor(t.status)} dot>{t.status}</Badge></td>
                  <td><span className="text-xs text-slate-500">{format(new Date(t.paidAt || t.dueDate || t.createdAt), 'dd MMM yyyy')}</span></td>
                  <td>
                    <button onClick={() => setViewTxn(t)} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-blue-400 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddPaymentModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSave={load} />
      <TxnDetailModal txn={viewTxn} onClose={() => setViewTxn(null)} />
    </div>
  );
};

export default FinancePage;
