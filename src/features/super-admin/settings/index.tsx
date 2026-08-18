import React, { useState } from 'react';
import {
  Globe, Bell, Shield, Mail, Sliders,
  Save, ChevronRight,
} from 'lucide-react';
import { Button, Card, Input } from '../../../components/ui';
import toast from 'react-hot-toast';

interface ToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      enabled ? 'bg-purple-600' : 'bg-dark-500'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
        enabled ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

const sections = [
  { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  { id: 'email', label: 'Email & SMTP', icon: <Mail className="w-4 h-4" /> },
  { id: 'platform', label: 'Platform', icon: <Sliders className="w-4 h-4" /> },
];

const SuperAdminSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  const [general, setGeneral] = useState({
    platformName: 'GymFlow',
    supportEmail: 'support@gymflow.in',
    contactPhone: '+91 98765 00000',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [notifications, setNotifications] = useState({
    newGymAlert: true,
    paymentFailAlert: true,
    suspensionAlert: true,
    weeklyDigest: true,
    memberMilestone: false,
  });

  const [security, setSecurity] = useState({
    mfaRequired: false,
    sessionTimeout: '60',
    loginAuditLog: true,
    ipWhitelist: false,
  });

  const [platform, setPlatform] = useState({
    allowNewRegistrations: true,
    maintenanceMode: false,
    autoSuspendOnOverdue: true,
    trialDays: '14',
    maxGymsPerAdmin: '1',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Platform Settings</h1>
          <p className="page-subtitle">Configure global platform behaviour and preferences</p>
        </div>
        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === s.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span className="flex items-center gap-2.5">{s.icon}{s.label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* General */}
          {activeSection === 'general' && (
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white">General Settings</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Platform Name"
                  value={general.platformName}
                  onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
                />
                <Input
                  label="Support Email"
                  value={general.supportEmail}
                  onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                />
                <Input
                  label="Contact Phone"
                  value={general.contactPhone}
                  onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })}
                />
                <div className="flex flex-col gap-1">
                  <label className="label">Currency</label>
                  <select
                    className="input-field"
                    value={general.currency}
                    onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                  >
                    <option value="INR">INR — Indian Rupee</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="label">Timezone</label>
                  <select
                    className="input-field"
                    value={general.timezone}
                    onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white">Notification Preferences</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'newGymAlert', label: 'New Gym Registration', desc: 'Alert when a new gym joins the platform' },
                  { key: 'paymentFailAlert', label: 'Payment Failure', desc: 'Alert when a gym payment fails' },
                  { key: 'suspensionAlert', label: 'Gym Suspension', desc: 'Alert when a gym is auto-suspended' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a weekly platform summary report' },
                  { key: 'memberMilestone', label: 'Member Milestones', desc: 'Alert for platform member count milestones' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={notifications[item.key as keyof typeof notifications]}
                      onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white">Security Settings</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'mfaRequired', label: 'Require MFA for Admins', desc: 'Force multi-factor authentication for all admin accounts' },
                  { key: 'loginAuditLog', label: 'Login Audit Log', desc: 'Record all login events for security auditing' },
                  { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict super admin access to approved IP ranges' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={security[item.key as keyof typeof security] as boolean}
                      onChange={(v) => setSecurity({ ...security, [item.key]: v })}
                    />
                  </div>
                ))}
                <div className="pt-1">
                  <Input
                    label="Session Timeout (minutes)"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Email */}
          {activeSection === 'email' && (
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white">Email & SMTP Configuration</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="SMTP Host" placeholder="smtp.gmail.com" />
                <Input label="SMTP Port" placeholder="587" />
                <Input label="SMTP Username" placeholder="no-reply@gymflow.in" />
                <Input label="SMTP Password" type="password" placeholder="••••••••" />
                <Input label="From Name" placeholder="GymFlow Platform" />
                <Input label="From Email" placeholder="no-reply@gymflow.in" />
              </div>
              <Button variant="secondary" size="sm" onClick={() => toast.success('Test email sent!')}>
                Send Test Email
              </Button>
            </Card>
          )}

          {/* Platform */}
          {activeSection === 'platform' && (
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white">Platform Configuration</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'allowNewRegistrations', label: 'Allow New Gym Registrations', desc: 'New gyms can sign up and onboard themselves' },
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put the platform in maintenance mode — only super admins can log in' },
                  { key: 'autoSuspendOnOverdue', label: 'Auto-Suspend on Overdue', desc: 'Automatically suspend gyms with overdue payments after 7 days' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      enabled={platform[item.key as keyof typeof platform] as boolean}
                      onChange={(v) => setPlatform({ ...platform, [item.key]: v })}
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <Input
                    label="Trial Period (days)"
                    value={platform.trialDays}
                    onChange={(e) => setPlatform({ ...platform, trialDays: e.target.value })}
                  />
                  <Input
                    label="Max Gyms per Admin"
                    value={platform.maxGymsPerAdmin}
                    onChange={(e) => setPlatform({ ...platform, maxGymsPerAdmin: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
