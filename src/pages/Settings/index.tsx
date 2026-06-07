import React, { useState } from 'react';
import { Building, Bell, Shield, Palette, Save, Check } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore, AccentColor, ThemeVariant, SidebarWidth, applyTheme } from '../../store/themeStore';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'gym',          label: 'Gym Profile',    icon: Building },
  { id: 'notifications',label: 'Notifications',  icon: Bell },
  { id: 'security',     label: 'Security',        icon: Shield },
  { id: 'appearance',   label: 'Appearance',      icon: Palette },
];

/* ─── Accent colour options ───────────────────────────────────────────── */
const ACCENTS: { id: AccentColor; hex: string; label: string }[] = [
  { id: 'orange', hex: '#f97316', label: 'Orange' },
  { id: 'blue',   hex: '#3b82f6', label: 'Blue'   },
  { id: 'purple', hex: '#8b5cf6', label: 'Purple' },
  { id: 'green',  hex: '#10b981', label: 'Green'  },
  { id: 'pink',   hex: '#ec4899', label: 'Pink'   },
];

/* ─── Theme variant options ───────────────────────────────────────────── */
const VARIANTS: { id: ThemeVariant; label: string; desc: string; bg: string; border: string }[] = [
  { id: 'dark',     label: 'Dark',     desc: 'Classic dark theme',   bg: '#111118', border: '#3d3d52' },
  { id: 'midnight', label: 'Midnight', desc: 'Deeper black theme',   bg: '#0a0a12', border: '#2d2d50' },
];

/* ─── Sidebar width options ───────────────────────────────────────────── */
const SIDEBAR_WIDTHS: { id: SidebarWidth; label: string; w: string }[] = [
  { id: 'compact', label: 'Compact', w: '48' },
  { id: 'default', label: 'Default', w: '60' },
  { id: 'wide',    label: 'Wide',    w: '72' },
];

/* ─── Toggle switch component ─────────────────────────────────────────── */
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
    <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-[var(--color-brand-500)]' : 'bg-[var(--color-bg-500)]'} relative`}>
      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </div>
  </label>
);

/* ─── Main Page ──────────────────────────────────────────────────────── */
const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { accent, variant, sidebarWidth, setAccent, setVariant, setSidebarWidth } = useThemeStore();

  const [activeTab, setActiveTab] = useState('gym');
  const [saving, setSaving] = useState(false);

  const [gymForm, setGymForm] = useState({
    name: user?.gymName || 'GymFlow Fitness Center',
    address: '42 MG Road, Pattom', city: 'Thiruvananthapuram',
    state: 'Kerala', country: 'India',
    phone: '+91 471 2345678', email: 'info@gymflow.com',
    website: 'www.gymflow.com',
    openingTime: '05:30', closingTime: '22:00',
    capacity: '200', currency: 'INR',
    description: 'State-of-the-art fitness facility with world-class equipment and expert trainers.',
  });

  const [notif, setNotif] = useState({
    membershipExpiry: true, paymentReminders: true,
    newMemberAlert: true, lowStockAlert: true,
    dailySummary: false, emailNotifications: true,
    smsNotifications: false, expiryDaysBefore: '7',
  });

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });

  const sg = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setGymForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast.success('Settings saved');
  };

  const handlePasswordChange = async () => {
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { toast.error('Fill all fields'); return; }
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setPwForm({ current: '', newPw: '', confirm: '' });
    toast.success('Password updated');
  };

  /* Live theme preview + persist */
  const handleAccentChange = (a: AccentColor) => {
    setAccent(a);
    applyTheme(a, variant);
    toast.success(`Accent changed to ${a}`);
  };
  const handleVariantChange = (v: ThemeVariant) => {
    setVariant(v);
    applyTheme(accent, v);
    toast.success(`Theme changed to ${v}`);
  };
  const handleSidebarChange = (w: SidebarWidth) => {
    setSidebarWidth(w);
    toast.success(`Sidebar set to ${w}`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Configure your gym portal preferences</p></div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`sidebar-item w-full ${activeTab === id ? 'active' : ''}`}>
              <Icon className="w-4 h-4" /><span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* ── Gym Profile ─────────────────────────────────────────── */}
          {activeTab === 'gym' && (
            <>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--color-bg-600)]">
                  <Building className="w-5 h-5 text-[var(--color-brand-400)]" />
                  <h3 className="font-bold text-white">Gym Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><Input label="Gym Name" value={gymForm.name} onChange={sg('name')} /></div>
                  <Input label="Phone" value={gymForm.phone} onChange={sg('phone')} />
                  <Input label="Email" value={gymForm.email} onChange={sg('email')} />
                  <Input label="Website" value={gymForm.website} onChange={sg('website')} />
                  <Input label="Capacity (members)" type="number" value={gymForm.capacity} onChange={sg('capacity')} />
                  <div className="col-span-2"><Input label="Address" value={gymForm.address} onChange={sg('address')} /></div>
                  <Input label="City" value={gymForm.city} onChange={sg('city')} />
                  <Input label="State" value={gymForm.state} onChange={sg('state')} />
                  <div>
                    <label className="label">Country</label>
                    <select className="input-field" value={gymForm.country} onChange={sg('country')}>
                      {['India','UAE','USA','UK','Singapore','Malaysia','Australia'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Currency</label>
                    <select className="input-field" value={gymForm.currency} onChange={sg('currency')}>
                      <option value="INR">₹ INR — Indian Rupee</option>
                      <option value="USD">$ USD — US Dollar</option>
                      <option value="AED">AED — UAE Dirham</option>
                      <option value="GBP">£ GBP — British Pound</option>
                      <option value="SGD">SGD — Singapore Dollar</option>
                    </select>
                  </div>
                  <Input label="Opening Time" type="time" value={gymForm.openingTime} onChange={sg('openingTime')} />
                  <Input label="Closing Time" type="time" value={gymForm.closingTime} onChange={sg('closingTime')} />
                  <div className="col-span-2">
                    <label className="label">Description</label>
                    <textarea className="input-field" rows={3} value={gymForm.description} onChange={sg('description')} />
                  </div>
                </div>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSave} loading={saving} leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
              </div>
            </>
          )}

          {/* ── Notifications ────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--color-bg-600)]">
                  <Bell className="w-5 h-5 text-[var(--color-brand-400)]" />
                  <h3 className="font-bold text-white">Notification Preferences</h3>
                </div>
                <div className="space-y-1">
                  {[
                    { k: 'membershipExpiry',  l: 'Membership Expiry Alerts',    d: 'Notify when memberships are about to expire' },
                    { k: 'paymentReminders',  l: 'Payment Reminders',           d: 'Reminders for pending and overdue payments' },
                    { k: 'newMemberAlert',    l: 'New Member Alerts',           d: 'Notify when new members join' },
                    { k: 'lowStockAlert',     l: 'Low Stock Alerts',            d: 'Alert when inventory falls below minimum' },
                    { k: 'dailySummary',      l: 'Daily Summary Email',         d: 'Receive a daily summary each morning' },
                    { k: 'emailNotifications',l: 'Email Notifications',         d: 'Send all notifications via email' },
                    { k: 'smsNotifications',  l: 'SMS Notifications',           d: 'Send notifications via SMS (charges may apply)' },
                  ].map(({ k, l, d }) => (
                    <div key={k} className="flex items-center justify-between py-3.5 border-b border-[var(--color-bg-700)] last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-white">{l}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{d}</p>
                      </div>
                      <Toggle checked={(notif as any)[k]} onChange={v => setNotif(n => ({ ...n, [k]: v }))} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-bg-600)]">
                  <label className="label">Expiry warning — days before</label>
                  <input type="number" className="input-field w-28" value={notif.expiryDaysBefore}
                    onChange={e => setNotif(n => ({ ...n, expiryDaysBefore: e.target.value }))} min="1" max="30" />
                </div>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSave} loading={saving} leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
              </div>
            </>
          )}

          {/* ── Security ─────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--color-bg-600)]">
                <Shield className="w-5 h-5 text-[var(--color-brand-400)]" />
                <h3 className="font-bold text-white">Security Settings</h3>
              </div>
              <div className="space-y-5">
                <div className="bg-[var(--color-bg-700)] rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-0.5">Logged in as</p>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-slate-400">{user?.email}</p>
                  <p className="text-xs text-slate-500 mt-1">Role: <span className="text-[var(--color-brand-400)] font-semibold">{user?.role}</span></p>
                </div>

                <div className="border-t border-[var(--color-bg-600)] pt-5">
                  <p className="font-bold text-white mb-4">Change Password</p>
                  <div className="space-y-3">
                    <Input label="Current Password" type="password" value={pwForm.current}
                      onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="••••••••" />
                    <Input label="New Password" type="password" value={pwForm.newPw}
                      onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} placeholder="Min 8 characters" />
                    <Input label="Confirm New Password" type="password" value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" />
                    <Button onClick={handlePasswordChange} loading={saving} variant="secondary">Update Password</Button>
                  </div>
                </div>

                <div className="border-t border-[var(--color-bg-600)] pt-5">
                  <p className="font-bold text-white mb-3">Active Sessions</p>
                  <div className="bg-[var(--color-bg-700)] rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Current Session</p>
                      <p className="text-xs text-slate-500">Chrome · Thiruvananthapuram, IN · Active now</p>
                    </div>
                    <span className="badge-green">Current</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* ── Appearance ────────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[var(--color-bg-600)]">
                <Palette className="w-5 h-5 text-[var(--color-brand-400)]" />
                <h3 className="font-bold text-white">Appearance</h3>
              </div>

              <div className="space-y-8">

                {/* ── Theme Variant ───────────────────────────────────── */}
                <div>
                  <p className="label">Theme</p>
                  <p className="text-xs text-slate-500 mb-3">Changes the background darkness. Applied instantly.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {VARIANTS.map(v => (
                      <button key={v.id} onClick={() => handleVariantChange(v.id)}
                        className={`relative rounded-xl p-4 border-2 text-left transition-all duration-200 ${
                          variant === v.id
                            ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/5'
                            : 'border-[var(--color-bg-500)] hover:border-[var(--color-bg-400)]'
                        }`}>
                        {/* Mini preview */}
                        <div className="w-full h-14 rounded-lg mb-3 overflow-hidden border border-white/10"
                          style={{ background: v.bg }}>
                          <div className="flex h-full">
                            <div className="w-10 h-full flex flex-col gap-1 p-1.5" style={{ background: v.bg, borderRight: `1px solid ${v.border}` }}>
                              {[...Array(4)].map((_, i) => <div key={i} className="h-1.5 rounded-full" style={{ background: v.border, width: i === 0 ? '100%' : '70%' }} />)}
                            </div>
                            <div className="flex-1 p-2 space-y-1">
                              {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 rounded-full" style={{ background: v.border, width: ['100%','80%','60%'][i] }} />)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">{v.label}</p>
                            <p className="text-xs text-slate-500">{v.desc}</p>
                          </div>
                          {variant === v.id && (
                            <div className="w-5 h-5 rounded-full bg-[var(--color-brand-500)] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Accent Colour ───────────────────────────────────── */}
                <div>
                  <p className="label">Accent Colour</p>
                  <p className="text-xs text-slate-500 mb-3">Changes buttons, active states, and highlights. Applied instantly.</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {ACCENTS.map(a => (
                      <button key={a.id} onClick={() => handleAccentChange(a.id)}
                        title={a.label}
                        className={`w-10 h-10 rounded-full border-4 transition-all duration-200 flex items-center justify-center ${
                          accent === a.id ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105 hover:border-white/40'
                        }`}
                        style={{ backgroundColor: a.hex }}>
                        {accent === a.id && <Check className="w-4 h-4 text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-3">
                    {ACCENTS.map(a => (
                      <p key={a.id} className={`text-xs text-center w-10 transition-all ${accent === a.id ? 'text-white font-semibold' : 'text-slate-600'}`}>
                        {a.label}
                      </p>
                    ))}
                  </div>
                </div>

                {/* ── Live preview strip ──────────────────────────────── */}
                <div>
                  <p className="label">Live Preview</p>
                  <div className="rounded-xl border border-[var(--color-bg-500)] p-4 space-y-3" style={{ background: 'var(--color-bg-700)' }}>
                    <div className="flex items-center gap-3">
                      <button className="btn-primary text-xs px-3 py-1.5">Primary Button</button>
                      <button className="btn-secondary text-xs px-3 py-1.5">Secondary</button>
                      <span className="badge bg-[var(--color-brand-500)]/15 text-[var(--color-brand-400)] border border-[var(--color-brand-500)]/20">Badge</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-500)' }}>
                      <div className="h-full rounded-full w-2/3 transition-all duration-500" style={{ background: 'var(--color-brand-500)' }} />
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-brand-400)' }}>
                      Accent text · Active link colour preview
                    </p>
                  </div>
                </div>

                {/* ── Sidebar Width ───────────────────────────────────── */}
                <div>
                  <p className="label">Sidebar Width</p>
                  <p className="text-xs text-slate-500 mb-3">Takes effect on next page load.</p>
                  <div className="flex gap-3">
                    {SIDEBAR_WIDTHS.map(w => (
                      <button key={w.id} onClick={() => handleSidebarChange(w.id)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                          sidebarWidth === w.id
                            ? 'border-[var(--color-brand-500)] text-[var(--color-brand-400)] bg-[var(--color-brand-500)]/10'
                            : 'border-[var(--color-bg-500)] text-slate-400 hover:border-[var(--color-bg-400)]'
                        }`}>
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
