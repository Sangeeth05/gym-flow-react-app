import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { DatePicker as AntDatePicker, Input as AntInput, Select as AntSelect } from 'antd';
import type { DatePickerProps as AntDatePickerProps, InputProps as AntInputProps, SelectProps as AntSelectProps } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

// ─── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, leftIcon, children, className = '', disabled, ...rest
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white',
    secondary: 'bg-dark-600 hover:bg-dark-500 text-white border border-dark-400',
    ghost: 'hover:bg-dark-700 text-slate-300 hover:text-white',
    danger: 'bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 border border-red-600/30',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...rest}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
    </button>
  );
};

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeColor = 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'gray';

interface BadgeProps {
  color: BadgeColor;
  children: React.ReactNode;
  dot?: boolean;
}

const badgeColors: Record<BadgeColor, string> = {
  green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  red: 'bg-red-500/15 text-red-400 border border-red-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  orange: 'bg-brand-500/15 text-brand-400 border border-brand-500/20',
  gray: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ color, children, dot }) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColors[color]}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-emerald-400' : color === 'red' ? 'bg-red-400' : color === 'yellow' ? 'bg-yellow-400' : 'bg-current'}`} />}
    {children}
  </span>
);

// ─── Modal ───────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const modalSizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box ${modalSizes[size]} animate-slide-up`} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h3 className="font-bold text-white text-base">{title}</h3>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends Omit<AntInputProps, 'prefix' | 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, className = '', ...rest }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="label">{label}</label>}
    <AntInput
      className={`gym-ant-input ${className}`}
      prefix={leftIcon ? <span className="text-slate-500">{leftIcon}</span> : undefined}
      status={error ? 'error' : undefined}
      {...rest}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

// ─── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends Omit<AntSelectProps<string>, 'options' | 'onChange' | 'className' | 'size' | 'status'> {
  label?: string;
  error?: string;
  options: { value: string; label: React.ReactNode }[];
  className?: string;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', onChange, ...rest }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="label">{label}</label>}
    <AntSelect
      className={`gym-ant-select ${className}`}
      popupClassName="gym-ant-select-dropdown"
      options={options}
      onChange={onChange}
      status={error ? 'error' : undefined}
      {...rest}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

// ─── Date Picker ─────────────────────────────────────────────────────────────
interface DatePickerProps extends Omit<AntDatePickerProps, 'value' | 'onChange' | 'className' | 'size' | 'status'> {
  label?: string;
  error?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, error, value, className = '', onChange, ...rest }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="label">{label}</label>}
    <AntDatePicker
      className={`gym-ant-picker ${className}`}
      value={value ? dayjs(value) : null}
      onChange={(date) => onChange?.(date ? (date as Dayjs).format('YYYY-MM-DD') : '')}
      format="DD MMM YYYY"
      status={error ? 'error' : undefined}
      {...rest}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

// ─── Textarea ────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...rest }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="label">{label}</label>}
    <textarea className={`input-field resize-none ${error ? 'border-red-500' : ''} ${className}`} {...rest} />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover, onClick }) => (
  <div
    className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, iconBg, subtext }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
      {change !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">{title}</p>
      {subtext && <p className="text-xs text-slate-500 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-slate-600 mb-4 opacity-60">{icon}</div>
    <h3 className="font-bold text-slate-300 text-base mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-xs mb-4">{description}</p>
    {action}
  </div>
);

// ─── Search Input ────────────────────────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-9"
    />
  </div>
);

// ─── Loading Spinner ─────────────────────────────────────────────────────────
export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
  </div>
);

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </>
    }
  >
    <p className="text-sm text-slate-400">{message}</p>
  </Modal>
);
