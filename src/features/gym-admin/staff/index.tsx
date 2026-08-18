import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, Eye, Phone, Mail, DollarSign } from 'lucide-react';
import { Badge, StatCard, Spinner, EmptyState, Modal, Button, Input, Select, DatePicker, ConfirmDialog } from '../../../components/ui';
import { staffApi } from '../../../api/endpoints';
import { Staff, StaffRole } from '../../../types';
import { mockStaff } from '../../../api/mockData';
import toast from 'react-hot-toast';

const ROLES: StaffRole[] = ['Trainer','Receptionist','Manager','Cleaner','Security'];
const SPECIALIZATIONS = ['Strength Training','HIIT','Yoga','Zumba','CrossFit','Nutrition','Cardio','Flexibility','Boxing','Swimming'];

const roleColor = (r: string) => {
  if (r === 'Trainer') return 'orange';
  if (r === 'Manager') return 'purple';
  if (r === 'Receptionist') return 'blue';
  if (r === 'Security') return 'red';
  return 'gray';
};

const defaultForm = {
  firstName: '', lastName: '', email: '', phone: '',
  role: 'Trainer' as StaffRole, salary: '', joinDate: '',
  isActive: true, specializations: [] as string[], schedule: '',
};

/* ─── Form Modal ─────────────────────────────────────────────────────── */
const StaffFormModal: React.FC<{
  isOpen: boolean; onClose: () => void; staff?: Staff | null; onSave: () => void;
}> = ({ isOpen, onClose, staff, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setForm({
        firstName: staff.firstName, lastName: staff.lastName,
        email: staff.email, phone: staff.phone,
        role: staff.role, salary: String(staff.salary),
        joinDate: staff.joinDate, isActive: staff.status === 'Active',
        specializations: staff.specializations || [],
        schedule: staff.schedule || '',
      });
    } else {
      setForm({ ...defaultForm, joinDate: new Date().toISOString().split('T')[0] });
    }
  }, [staff, isOpen]);

  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const sv = (k: string) => (value: string) => setForm(f => ({ ...f, [k]: value }));

  const toggleSpec = (spec: string) =>
    setForm(f => ({
      ...f,
      specializations: f.specializations.includes(spec)
        ? f.specializations.filter(x => x !== spec)
        : [...f.specializations, spec],
    }));

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast.error('Fill all required fields'); return;
    }
    setLoading(true);
    try {
      const count = mockStaff.length;
      if (staff) {
        const idx = mockStaff.findIndex(s => s.id === staff.id);
        if (idx !== -1) mockStaff[idx] = {
          ...mockStaff[idx], ...form,
          salary: parseFloat(form.salary || '0'),
          status: form.isActive ? 'Active' : 'Inactive',
        };
        toast.success('Staff updated');
      } else {
        mockStaff.push({
          id: String(Date.now()),
          staffId: `STF-${String(count + 1).padStart(3, '0')}`,
          ...form,
          salary: parseFloat(form.salary || '0'),
          status: 'Active',
          createdAt: new Date().toISOString(),
        } as Staff);
        toast.success('Staff member added');
      }
      onSave(); onClose();
    } finally { setLoading(false); }
  };

  const showSpec = form.role === 'Trainer';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={staff ? 'Edit Staff Member' : 'Add Staff Member'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} loading={loading}>{staff ? 'Update' : 'Add Staff'}</Button></>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name *" value={form.firstName} onChange={s('firstName')} placeholder="Suresh" />
        <Input label="Last Name *" value={form.lastName} onChange={s('lastName')} placeholder="P" />
        <Input label="Email *" type="email" value={form.email} onChange={s('email')} placeholder="suresh@gymflow.com" />
        <Input label="Phone *" value={form.phone} onChange={s('phone')} placeholder="+91 9876543210" />
        <Select label="Role" value={form.role} onChange={sv('role')}
          options={ROLES.map(r => ({ value: r, label: r }))} />
        <Input label="Monthly Salary (₹)" type="number" value={form.salary} onChange={s('salary')} placeholder="30000" />
        <DatePicker label="Join Date" value={form.joinDate} onChange={sv('joinDate')} placeholder="Select join date" />
        <Input label="Schedule / Shift" value={form.schedule} onChange={s('schedule')} placeholder="e.g. Mon-Sat, 6AM-2PM" />
        <div className="md:col-span-2 flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 rounded accent-[var(--color-brand-500)]" />
            <span className="text-sm text-slate-300">Active (currently employed)</span>
          </label>
        </div>
        {showSpec && (
          <div className="md:col-span-2">
            <label className="label">Specializations (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map(spec => (
                <button key={spec} type="button"
                  onClick={() => toggleSpec(spec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.specializations.includes(spec)
                      ? 'bg-[var(--color-brand-500)]/20 border-[var(--color-brand-500)]/40 text-[var(--color-brand-400)]'
                      : 'bg-[var(--color-bg-700)] border-[var(--color-bg-500)] text-slate-400 hover:border-[var(--color-bg-400)]'
                  }`}>
                  {spec}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

/* ─── Detail Modal ───────────────────────────────────────────────────── */
const StaffDetailModal: React.FC<{
  staff: Staff | null; onClose: () => void; onEdit: () => void;
}> = ({ staff: s, onClose, onEdit }) => (
  <Modal isOpen={!!s} onClose={onClose} title="Staff Details" size="sm"
    footer={<><Button variant="secondary" onClick={onClose}>Close</Button><Button onClick={onEdit}><Edit className="w-4 h-4" />Edit</Button></>}>
    {s && (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">{s.firstName[0]}{s.lastName[0]}</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{s.firstName} {s.lastName}</h3>
            <p className="font-mono text-sm text-[var(--color-brand-400)]">{s.staffId}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={roleColor(s.role) as any}>{s.role}</Badge>
              <Badge color={s.status === 'Active' ? 'green' : 'gray'} dot>{s.status}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <a href={`mailto:${s.email}`} className="flex items-center gap-3 bg-[var(--color-bg-700)] rounded-lg p-3 hover:bg-[var(--color-bg-600)] transition-colors">
            <Mail className="w-4 h-4 text-[var(--color-brand-400)]" />
            <span className="text-sm text-slate-300">{s.email}</span>
          </a>
          <a href={`tel:${s.phone}`} className="flex items-center gap-3 bg-[var(--color-bg-700)] rounded-lg p-3 hover:bg-[var(--color-bg-600)] transition-colors">
            <Phone className="w-4 h-4 text-[var(--color-brand-400)]" />
            <span className="text-sm text-slate-300">{s.phone}</span>
          </a>
          <div className="flex items-center gap-3 bg-[var(--color-bg-700)] rounded-lg p-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-500">Monthly Salary</p>
              <p className="text-sm font-semibold text-white">₹{s.salary.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { l: 'Join Date', v: new Date(s.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
            { l: 'Schedule', v: s.schedule || '—' },
          ].map(({ l, v }) => (
            <div key={l} className="bg-[var(--color-bg-700)] rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-0.5">{l}</p>
              <p className="text-sm font-medium text-white">{v}</p>
            </div>
          ))}
        </div>

        {s.specializations && s.specializations.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1.5">
              {s.specializations.map(spec => (
                <span key={spec} className="text-xs bg-[var(--color-brand-500)]/15 text-[var(--color-brand-400)] border border-[var(--color-brand-500)]/20 px-2.5 py-1 rounded-full font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </Modal>
);

/* ─── Main Page ──────────────────────────────────────────────────────── */
const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);
  const [viewStaff, setViewStaff] = useState<Staff | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    staffApi.getAll().then(data => {
      const filtered = roleFilter ? (data as Staff[]).filter(s => s.role === roleFilter) : (data as Staff[]);
      setStaff(filtered);
      setLoading(false);
    });
  };
  useEffect(() => { setLoading(true); load(); }, [roleFilter]);

  const handleDelete = () => {
    const idx = mockStaff.findIndex(s => s.id === deleteId);
    if (idx !== -1) mockStaff.splice(idx, 1);
    toast.success('Staff member removed');
    setDeleteId(null); load();
  };

  const trainers = staff.filter(s => s.role === 'Trainer').length;
  const active = staff.filter(s => s.status === 'Active').length;
  const payroll = staff.reduce((a, s) => a + s.salary, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div><h1 className="page-title">Staff</h1><p className="page-subtitle">Manage gym staff, trainers and schedules</p></div>
        <button className="btn-primary" onClick={() => { setEditStaff(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" />Add Staff
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staff.length} icon={<UserCheck className="w-5 h-5 text-[var(--color-brand-400)]" />} iconBg="bg-[var(--color-brand-500)]/10" />
        <StatCard title="Active" value={active} icon={<UserCheck className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" />
        <StatCard title="Trainers" value={trainers} icon={<UserCheck className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10" />
        <StatCard title="Monthly Payroll" value={`₹${payroll.toLocaleString('en-IN')}`} icon={<DollarSign className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {['', ...ROLES].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              roleFilter === r
                ? 'bg-[var(--color-brand-500)]/20 border-[var(--color-brand-500)]/40 text-[var(--color-brand-400)]'
                : 'bg-[var(--color-bg-700)] border-[var(--color-bg-500)] text-slate-400 hover:border-[var(--color-bg-400)]'
            }`}>
            {r || 'All Roles'}
          </button>
        ))}
      </div>

      {loading ? <Spinner className="py-16" /> : staff.length === 0 ? (
        <EmptyState icon={<UserCheck className="w-12 h-12" />} title="No staff members"
          description="Add your first staff member"
          action={<button className="btn-primary" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" />Add Staff</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map(s => (
            <div key={s.id} className="card p-5 hover:border-[var(--color-bg-400)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-white text-lg">{s.firstName[0]}{s.lastName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-slate-500 font-mono">{s.staffId}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <Badge color={roleColor(s.role) as any}>{s.role}</Badge>
                <Badge color={s.status === 'Active' ? 'green' : 'gray'} dot>{s.status}</Badge>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                <p className="flex items-center gap-1.5"><Mail className="w-3 h-3" /><span className="truncate">{s.email}</span></p>
                <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{s.phone}</p>
                <p className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400 font-semibold">₹{s.salary.toLocaleString('en-IN')}/mo</span></p>
              </div>

              {s.specializations && s.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {s.specializations.slice(0, 3).map(spec => (
                    <span key={spec} className="text-xs bg-[var(--color-bg-700)] text-slate-400 px-2 py-0.5 rounded-full">{spec}</span>
                  ))}
                  {s.specializations.length > 3 && (
                    <span className="text-xs text-slate-500">+{s.specializations.length - 3} more</span>
                  )}
                </div>
              )}

              <div className="flex gap-1 pt-3 border-t border-[var(--color-bg-600)]">
                <button onClick={() => setViewStaff(s)} className="flex-1 btn-ghost text-xs py-1.5 justify-center"><Eye className="w-3.5 h-3.5" />View</button>
                <button onClick={() => { setEditStaff(s); setShowForm(true); }} className="flex-1 btn-ghost text-xs py-1.5 justify-center"><Edit className="w-3.5 h-3.5" />Edit</button>
                <button onClick={() => setDeleteId(s.id)} className="flex-1 btn-ghost text-xs py-1.5 justify-center text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" />Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <StaffFormModal isOpen={showForm} onClose={() => setShowForm(false)} staff={editStaff} onSave={load} />
      <StaffDetailModal staff={viewStaff} onClose={() => setViewStaff(null)}
        onEdit={() => { setEditStaff(viewStaff); setViewStaff(null); setShowForm(true); }} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Remove Staff Member" message="This will permanently remove the staff member. Are you sure?" />
    </div>
  );
};

export default StaffPage;
