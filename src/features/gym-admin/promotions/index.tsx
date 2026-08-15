import React, { useState, useEffect } from 'react';
import { Tag, Plus, Copy, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Badge, StatCard, Spinner, EmptyState, Modal, Button, Input, Select, DatePicker, Textarea, ConfirmDialog } from '../../../components/ui';
import { promoApi } from '../../../api/endpoints';
import { PromoCode, PromoStatus } from '../../../types';
import { mockPromoCodes } from '../../../api/mockData';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusColor = (s: PromoStatus) =>
  s === 'Active' ? 'green' : s === 'Expired' ? 'red' : s === 'Scheduled' ? 'blue' : 'gray';

const defaultForm = {
  code: '', description: '', discountType: 'Percentage', discountValue: '',
  minPurchase: '0', maxUses: '100', validFrom: '', validTo: '', applicableFor: 'All',
};

/* ── Form Modal ────────────────────────────────────────────────────────── */
const PromoFormModal: React.FC<{ isOpen: boolean; onClose: () => void; promo?: PromoCode | null; onSave: () => void }> = ({ isOpen, onClose, promo, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promo) {
      setForm({
        code: promo.code, description: promo.description,
        discountType: promo.discountType, discountValue: String(promo.discountValue),
        minPurchase: String(promo.minPurchase), maxUses: String(promo.maxUses),
        validFrom: promo.validFrom.split('T')[0], validTo: promo.validTo.split('T')[0],
        applicableFor: promo.applicableFor,
      });
    } else { setForm(defaultForm); }
    setErrors({});
  }, [promo, isOpen]);

  const clearError = (k: string) => setErrors(prev => {
    const next = { ...prev };
    delete next[k];
    return next;
  });
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    clearError(k);
    setForm(f => ({ ...f, [k]: e.target.value }));
  };
  const sv = (k: string) => (value: string) => {
    clearError(k);
    setForm(f => ({ ...f, [k]: value }));
  };

  const genCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setForm(f => ({ ...f, code }));
  };

  const handleSave = async () => {
    const nextErrors = {
      code: form.code.trim() ? '' : 'Promo code is required.',
      discountValue: form.discountValue.trim() ? '' : 'Discount value is required.',
      validFrom: form.validFrom ? '' : 'Start date is required.',
      validTo: form.validTo ? '' : 'End date is required.',
    };
    const activeErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, v]) => v));
    setErrors(activeErrors);
    if (Object.keys(activeErrors).length) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const vf = new Date(form.validFrom).toISOString();
      const vt = new Date(form.validTo).toISOString();
      const nowDate = new Date();
      const status: PromoStatus = nowDate < new Date(form.validFrom) ? 'Scheduled'
        : nowDate > new Date(form.validTo) ? 'Expired' : 'Active';

      if (promo) {
        const idx = mockPromoCodes.findIndex(p => p.id === promo.id);
        if (idx !== -1) (mockPromoCodes as any[])[idx] = {
          ...mockPromoCodes[idx], ...form,
          discountValue: parseFloat(form.discountValue), minPurchase: parseFloat(form.minPurchase),
          maxUses: parseInt(form.maxUses), validFrom: vf, validTo: vt, status,
        };
        toast.success('Promo updated');
      } else {
        (mockPromoCodes as any[]).unshift({
          id: String(Date.now()),
          code: form.code, description: form.description,
          discountType: form.discountType as 'Percentage' | 'FixedAmount',
          discountValue: parseFloat(form.discountValue),
          minPurchase: parseFloat(form.minPurchase),
          maxUses: parseInt(form.maxUses), usedCount: 0,
          validFrom: vf, validTo: vt,
          applicableFor: form.applicableFor as 'All'|'NewMembers'|'RenewalOnly'|'ProductsOnly',
          status, createdAt: now,
        });
        toast.success('Promo code created');
      }
      onSave(); onClose();
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={promo ? 'Edit Promo Code' : 'Create Promo Code'} size="md"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} loading={loading}>{promo ? 'Update' : 'Create'}</Button></>}>
      <div className="space-y-4">
        <div>
          <label className="label">Promo Code *</label>
          <div className="flex gap-2">
            <Input className="font-mono uppercase tracking-widest" value={form.code}
              onChange={s('code')} error={errors.code} placeholder="WELCOME50" maxLength={20} />
            <button type="button" onClick={genCode} className="btn-secondary whitespace-nowrap text-xs px-3">Auto Generate</button>
          </div>
        </div>
        <Textarea label="Description" rows={2} value={form.description} onChange={s('description')} placeholder="e.g. Welcome offer for new members" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Discount Type *"
            value={form.discountType}
            onChange={sv('discountType')}
            options={[
              { value: 'Percentage', label: 'Percentage (%)' },
              { value: 'FixedAmount', label: 'Fixed Amount (Rs)' },
            ]}
          />
          <div>
            <label className="label">{form.discountType === 'Percentage' ? 'Discount % *' : 'Discount Amount (₹) *'}</label>
            <Input type="number" value={form.discountValue} onChange={s('discountValue')} error={errors.discountValue}
              placeholder={form.discountType === 'Percentage' ? '10' : '500'} max={form.discountType === 'Percentage' ? '100' : undefined} />
          </div>
          <div>
            <label className="label">Min Purchase (₹)</label>
            <Input type="number" value={form.minPurchase} onChange={s('minPurchase')} placeholder="0" />
          </div>
          <div>
            <label className="label">Max Uses *</label>
            <Input type="number" value={form.maxUses} onChange={s('maxUses')} placeholder="100" />
          </div>
          <div>
            <DatePicker label="Valid From *" value={form.validFrom} onChange={sv('validFrom')} error={errors.validFrom} placeholder="Select start date" />
          </div>
          <div>
            <DatePicker label="Valid To *" value={form.validTo} onChange={sv('validTo')} error={errors.validTo} placeholder="Select end date" />
          </div>
        </div>
        <Select
          label="Applicable For"
          value={form.applicableFor}
          onChange={sv('applicableFor')}
          options={[
            { value: 'All', label: 'All Members' },
            { value: 'NewMembers', label: 'New Members Only' },
            { value: 'RenewalOnly', label: 'Renewal Only' },
            { value: 'ProductsOnly', label: 'Products Only' },
          ]}
        />
      </div>
    </Modal>
  );
};

/* ── Detail Modal ──────────────────────────────────────────────────────── */
const PromoDetailModal: React.FC<{ promo: PromoCode | null; onClose: () => void; onEdit: () => void }> = ({ promo: p, onClose, onEdit }) => {
  const copyCode = () => { if (p) { navigator.clipboard.writeText(p.code); toast.success(`Copied: ${p.code}`); } };
  return (
    <Modal isOpen={!!p} onClose={onClose} title="Promo Code Details" size="sm"
      footer={<><Button variant="secondary" onClick={onClose}>Close</Button><Button onClick={onEdit}><Edit className="w-4 h-4" />Edit</Button></>}>
      {p && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-[var(--color-bg-700)] border border-[var(--color-bg-500)] rounded-xl px-5 py-3 mb-2">
              <span className="font-mono font-bold text-[var(--color-brand-400)] text-2xl tracking-widest">{p.code}</span>
              <button onClick={copyCode} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-[var(--color-brand-400)] transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-400">{p.description}</p>
            <div className="mt-2"><Badge color={statusColor(p.status)} dot>{p.status}</Badge></div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { l: 'Discount', v: p.discountType === 'Percentage' ? `${p.discountValue}%` : `₹${p.discountValue}` },
              { l: 'Min Purchase', v: `₹${p.minPurchase}` },
              { l: 'Uses', v: `${p.usedCount} / ${p.maxUses}` },
              { l: 'Applicable', v: p.applicableFor },
              { l: 'Valid From', v: format(new Date(p.validFrom), 'dd MMM yyyy') },
              { l: 'Valid To', v: format(new Date(p.validTo), 'dd MMM yyyy') },
            ].map(({ l, v }) => (
              <div key={l} className="bg-[var(--color-bg-700)] rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-0.5">{l}</p>
                <p className="font-semibold text-white">{v}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Usage progress</span><span>{Math.round((p.usedCount / p.maxUses) * 100)}%</span>
            </div>
            <div className="h-2 bg-[var(--color-bg-600)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-brand-500)] rounded-full transition-all"
                style={{ width: `${(p.usedCount / p.maxUses) * 100}%` }} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ── Main Page ────────────────────────────────────────────────────────── */
const PromotionsPage: React.FC = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPromo, setEditPromo] = useState<PromoCode | null>(null);
  const [viewPromo, setViewPromo] = useState<PromoCode | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => { promoApi.getAll().then(p => { setPromos(p); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleDelete = () => {
    const idx = mockPromoCodes.findIndex(p => p.id === deleteId);
    if (idx !== -1) mockPromoCodes.splice(idx, 1);
    toast.success('Promo code deleted');
    setDeleteId(null); load();
  };

  const copyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const active = promos.filter(p => p.status === 'Active').length;
  const scheduled = promos.filter(p => p.status === 'Scheduled').length;
  const totalUses = promos.reduce((a, p) => a + p.usedCount, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div><h1 className="page-title">Promotions</h1><p className="page-subtitle">Manage promo codes and discount campaigns</p></div>
        <button className="btn-primary" onClick={() => { setEditPromo(null); setShowForm(true); }}><Plus className="w-4 h-4" />Create Promo</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Codes" value={promos.length} icon={<Tag className="w-5 h-5 text-[var(--color-brand-400)]" />} iconBg="bg-[var(--color-brand-500)]/10" />
        <StatCard title="Active" value={active} icon={<CheckCircle className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Scheduled" value={scheduled} icon={<Tag className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" />
        <StatCard title="Total Uses" value={totalUses} icon={<Tag className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10" />
      </div>

      {loading ? <Spinner className="py-16" /> : promos.length === 0 ? (
        <EmptyState icon={<Tag className="w-12 h-12" />} title="No promo codes" description="Create your first discount campaign"
          action={<button className="btn-primary" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" />Create Promo</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promos.map(p => (
            <div key={p.id} className="card p-5 hover:border-[var(--color-bg-400)] transition-all cursor-pointer" onClick={() => setViewPromo(p)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-[var(--color-brand-500)]/15 border border-[var(--color-brand-500)]/20 rounded-xl px-3 py-1.5">
                    <span className="font-mono font-bold text-[var(--color-brand-400)] text-base tracking-widest">{p.code}</span>
                  </div>
                  <button onClick={e => copyCode(p.code, e)} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-[var(--color-brand-400)] transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Badge color={statusColor(p.status)} dot>{p.status}</Badge>
              </div>
              <p className="text-sm text-slate-300 mb-3 line-clamp-1">{p.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-[var(--color-bg-700)] rounded-lg p-2">
                  <p className="text-slate-500 mb-0.5">Discount</p>
                  <p className="font-bold text-white text-sm">{p.discountType === 'Percentage' ? `${p.discountValue}%` : `₹${p.discountValue}`}</p>
                </div>
                <div className="bg-[var(--color-bg-700)] rounded-lg p-2">
                  <p className="text-slate-500 mb-0.5">Usage</p>
                  <p className="font-bold text-white text-sm">{p.usedCount}/{p.maxUses}</p>
                </div>
              </div>
              <div className="h-1.5 bg-[var(--color-bg-600)] rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[var(--color-brand-500)] rounded-full" style={{ width: `${(p.usedCount / p.maxUses) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{format(new Date(p.validFrom), 'dd MMM')} – {format(new Date(p.validTo), 'dd MMM yyyy')}</span>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setEditPromo(p); setShowForm(true); }} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-[var(--color-brand-400)] transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1.5 hover:bg-[var(--color-bg-600)] rounded-lg text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PromoFormModal isOpen={showForm} onClose={() => setShowForm(false)} promo={editPromo} onSave={load} />
      <PromoDetailModal promo={viewPromo} onClose={() => setViewPromo(null)} onEdit={() => { setEditPromo(viewPromo); setViewPromo(null); setShowForm(true); }} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Promo Code" message="This will permanently delete the promo code. Are you sure?" />
    </div>
  );
};

export default PromotionsPage;
