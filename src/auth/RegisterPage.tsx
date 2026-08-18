import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Dumbbell, Eye, EyeOff, Building2, Mail, Phone,
  MapPin, User, Lock, CheckCircle2, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { Button, FormField, Select } from '../components/ui';
import { useRegisterGym } from '../api/generated/auth/auth';
import type { GymSignupRequest } from '../api/generated/models';

type Step = 'gym' | 'admin' | 'success';

const STEPS = ['Gym Details', 'Admin Account'];

const initialForm: GymSignupRequest & { confirmPassword: string } = {
  gymName: '',
  gymEmail: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  adminName: '',
  adminEmail: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('gym');
  const [form, setForm] = useState(initialForm);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const { mutate: registerGym, isPending } = useRegisterGym({
    mutation: {
      onSuccess: () => setStep('success'),
      onError: (err: any) => {
        setError(err?.response?.data?.message || 'Registration failed. Please try again.');
      },
    },
  });

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validateGym = () => {
    if (!form.gymName) return 'Gym name is required';
    if (!form.gymEmail) return 'Gym email is required';
    if (!form.phone) return 'Phone is required';
    if (!form.address) return 'Address is required';
    if (!form.city) return 'City is required';
    if (!form.country) return 'Country is required';
    return '';
  };

  const validateAdmin = () => {
    if (!form.adminName) return 'Admin name is required';
    if (!form.adminEmail) return 'Admin email is required';
    if (!form.password || form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleGymNext = () => {
    const err = validateGym();
    if (err) { setError(err); return; }
    setError('');
    setStep('admin');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateAdmin();
    if (err) { setError(err); return; }
    setError('');
    const { confirmPassword, ...payload } = form;
    registerGym({ data: payload });
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-800/5 rounded-full blur-3xl" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="w-full max-w-lg relative animate-slide-up">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="p-8 pb-6 border-b border-dark-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg leading-none">GymFlow</h1>
                <p className="text-xs text-slate-500 mt-0.5">Gym Management Platform</p>
              </div>
            </div>

            {step !== 'success' && (
              <>
                <h2 className="text-2xl font-bold text-white">Register your gym</h2>
                <p className="text-sm text-slate-400 mt-1">Set up your gym and admin account</p>

                <div className="flex items-center gap-2 mt-5">
                  {STEPS.map((label, i) => {
                    const idx = step === 'gym' ? 0 : 1;
                    const done = i < idx;
                    const active = i === idx;
                    return (
                      <React.Fragment key={label}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            done ? 'bg-brand-500 text-white' :
                            active ? 'bg-brand-500/20 text-brand-400 border border-brand-500/50' :
                            'bg-dark-600 text-slate-600'
                          }`}>
                            {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                          </div>
                          <span className={`text-xs font-medium ${active ? 'text-white' : done ? 'text-brand-400' : 'text-slate-600'}`}>
                            {label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-px ${done ? 'bg-brand-500/50' : 'bg-dark-600'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {error && step !== 'success' && (
            <div className="mx-8 mt-5 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Step 1 — Gym Details */}
          {step === 'gym' && (
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormField label="Gym Name" icon={<Building2 className="w-4 h-4" />} value={form.gymName!} onChange={set('gymName')} placeholder="Iron Paradise Fitness" />
                </div>
                <FormField label="Gym Email" icon={<Mail className="w-4 h-4" />} type="email" value={form.gymEmail!} onChange={set('gymEmail')} placeholder="hello@mygym.com" />
                <FormField label="Phone" icon={<Phone className="w-4 h-4" />} type="tel" value={form.phone!} onChange={set('phone')} placeholder="+91 98765 43210" />
                <div className="sm:col-span-2">
                  <FormField label="Address" icon={<MapPin className="w-4 h-4" />} value={form.address!} onChange={set('address')} placeholder="123 Fitness Street" />
                </div>
                <FormField label="City" icon={<MapPin className="w-4 h-4" />} value={form.city!} onChange={set('city')} placeholder="Mumbai" />
                <Select
                  label="Country"
                  value={form.country || undefined}
                  onChange={(value) => setForm((f) => ({ ...f, country: value }))}
                  placeholder="Select country"
                  options={[
                    { value: 'India', label: 'India' },
                    { value: 'United States', label: 'United States' },
                    { value: 'United Kingdom', label: 'United Kingdom' },
                    { value: 'Canada', label: 'Canada' },
                    { value: 'Australia', label: 'Australia' },
                    { value: 'UAE', label: 'UAE' },
                    { value: 'Singapore', label: 'Singapore' },
                  ]}
                />
              </div>

              <Button onClick={handleGymNext} className="w-full mt-2" size="lg">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2 — Admin Account */}
          {step === 'admin' && (
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <FormField label="Your Full Name" icon={<User className="w-4 h-4" />} value={form.adminName!} onChange={set('adminName')} placeholder="Rajesh Kumar" />
              <FormField label="Admin Email" icon={<Mail className="w-4 h-4" />} type="email" value={form.adminEmail!} onChange={set('adminEmail')} placeholder="you@mygym.com" />
              <FormField
                label="Password"
                icon={<Lock className="w-4 h-4" />}
                type={showPass ? 'text' : 'password'}
                value={form.password!}
                onChange={set('password')}
                placeholder="Min. 8 characters"
                rightIcon={
                  <button type="button" onClick={() => setShowPass((s) => !s)} className="text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <FormField
                label="Confirm Password"
                icon={<Lock className="w-4 h-4" />}
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Re-enter password"
                rightIcon={
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="text-slate-500 hover:text-slate-300">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="secondary" onClick={() => { setStep('gym'); setError(''); }} className="flex-1">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                <Button type="submit" loading={isPending} className="flex-1" size="lg">
                  Register Gym
                </Button>
              </div>
            </form>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Registration Submitted!</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                  Your gym <span className="text-white font-semibold">{form.gymName}</span> has been registered. You'll receive a confirmation email at <span className="text-white font-semibold">{form.adminEmail}</span> once your account is approved.
                </p>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full" size="lg">
                Go to Login
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
