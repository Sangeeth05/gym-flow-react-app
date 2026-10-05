import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, Plus, Edit, Trash2, Eye, Phone, Mail, DollarSign, Lock } from 'lucide-react';
import { Select as AntSelect, Pagination } from 'antd';
import type { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Badge, StatCard, Spinner, EmptyState, Modal, Button, Input,
  Select, DatePicker, ConfirmDialog, SearchInput,
} from '../../../components/ui';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useGetStaffList, useCreateStaff, useUpdateStaff, useDeleteStaff,
  getGetStaffListQueryKey,
} from '../../../api/generated/staff/staff';
import type {
  StaffDto, CreateStaffRequest, UpdateStaffRequest,
  GetStaffListParams, ProblemDetails,
} from '../../../api/generated/models';
import {
  STAFF_ROLES, SPECIALIZATIONS, staffFormSchema,
  type StaffFormValues, DEFAULT_FORM_VALUES,
} from './types';

const PAGE_SIZE = 12;

const FIELD_MAP: Record<string, keyof StaffFormValues> = {
  FirstName: 'firstName', LastName: 'lastName', Email: 'email',
  Phone: 'phone', Role: 'role', Salary: 'salary', JoinDate: 'joinDate',
  IsActive: 'isActive', Specializations: 'specializations', Schedule: 'schedule',
};

const roleColor = (r: string) => {
  if (r === 'Trainer') return 'orange';
  if (r === 'Manager') return 'purple';
  if (r === 'Receptionist') return 'blue';
  if (r === 'Security') return 'red';
  return 'gray';
};

function buildUpdatePayload(values: StaffFormValues, original: StaffDto): UpdateStaffRequest {
  const p: UpdateStaffRequest = {};
  if (values.firstName !== (original.firstName ?? '')) p.firstName = values.firstName;
  if (values.lastName !== (original.lastName ?? '')) p.lastName = values.lastName;
  if (values.email !== (original.email ?? '')) p.email = values.email;
  const origPhone = original.phone ?? '';
  if (values.phone !== origPhone) p.phone = values.phone;
  if (values.role !== original.role) p.role = values.role;
  if (values.salary !== (original.salary ?? 0)) p.salary = values.salary;
  if (values.joinDate !== (original.joinDate ?? '')) p.joinDate = values.joinDate;
  const origActive = original.status === 'Active';
  if (values.isActive !== origActive) p.isActive = values.isActive;
  const origSpecs = [...(original.specializations ?? [])].sort().join('\0');
  const newSpecs = [...values.specializations].sort().join('\0');
  if (newSpecs !== origSpecs) p.specializations = values.specializations;
  const origSchedule = original.schedule ?? '';
  if (values.schedule !== origSchedule) p.schedule = values.schedule;
  return p;
}

/* ─── Form Modal ──────────────────────────────────────────────────────────── */
const StaffFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffDto | null;
}> = ({ isOpen, onClose, staff }) => {
  const queryClient = useQueryClient();
  const isEdit = !!staff;

  const {
    register, handleSubmit, control, reset, setError,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (!isOpen) return;
    if (staff) {
      reset({
        firstName: staff.firstName ?? '',
        lastName: staff.lastName ?? '',
        email: staff.email ?? '',
        phone: staff.phone ?? '',
        role: (STAFF_ROLES.includes(staff.role as StaffFormValues['role'])
          ? staff.role : 'Trainer') as StaffFormValues['role'],
        salary: staff.salary ?? 0,
        joinDate: staff.joinDate ?? '',
        isActive: staff.status === 'Active',
        specializations: staff.specializations ?? [],
        schedule: staff.schedule ?? '',
      });
    } else {
      reset({ ...DEFAULT_FORM_VALUES, joinDate: new Date().toISOString().split('T')[0] });
    }
  }, [isOpen, staff, reset]);

  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleApiError = useCallback((rawError: ProblemDetails) => {
    const err = rawError as unknown as AxiosError<ProblemDetails & { errors?: Record<string, string[]> }>;
    const status = err.response?.status;
    const body = err.response?.data;
    if (status === 400 && body?.errors) {
      Object.entries(body.errors).forEach(([key, msgs]) => {
        const field = FIELD_MAP[key];
        if (field) setError(field, { message: msgs[0] });
        else toast.error(msgs[0]);
      });
    } else if (status === 409) {
      setError('email', { message: body?.detail ?? 'Email already in use' });
    } else {
      toast.error(body?.detail ?? body?.title ?? 'An error occurred. Please try again.');
    }
  }, [setError]);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: getGetStaffListQueryKey() }),
    [queryClient],
  );

  const onSubmit = (values: StaffFormValues) => {
    if (isEdit && staff?.id) {
      const payload = buildUpdatePayload(values, staff);
      if (Object.keys(payload).length === 0) { onClose(); return; }
      updateMutation.mutate({ id: staff.id, data: payload }, {
        onSuccess: () => { toast.success('Staff member updated'); invalidate(); onClose(); },
        onError: handleApiError,
      });
    } else {
      const req: CreateStaffRequest = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        salary: values.salary,
        joinDate: values.joinDate,
        isActive: values.isActive,
        ...(values.phone && { phone: values.phone }),
        ...(values.schedule && { schedule: values.schedule }),
        ...(values.specializations.length > 0 && { specializations: values.specializations }),
      };
      createMutation.mutate({ data: req }, {
        onSuccess: () => { toast.success('Staff member added'); invalidate(); onClose(); },
        onError: handleApiError,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Staff Member' : 'Add Staff Member'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={isPending}>
            {isEdit ? 'Update' : 'Add Staff'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          {...register('firstName')}
          error={errors.firstName?.message}
          placeholder="Suresh"
        />
        <Input
          label="Last Name *"
          {...register('lastName')}
          error={errors.lastName?.message}
          placeholder="P"
        />
        <Input
          label="Email *"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="suresh@gymflow.com"
        />
        <Input
          label="Phone"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+91 9876543210"
        />
        <Controller
          control={control}
          name="role"
          render={({ field, fieldState }) => (
            <Select
              label="Role *"
              value={field.value}
              onChange={field.onChange}
              options={STAFF_ROLES.map(r => ({ value: r, label: r }))}
              error={fieldState.error?.message}
            />
          )}
        />
        <Input
          label="Monthly Salary (₹)"
          type="number"
          {...register('salary', { valueAsNumber: true })}
          error={errors.salary?.message}
          placeholder="30000"
        />
        <Controller
          control={control}
          name="joinDate"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Join Date *"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <Input
          label="Schedule / Shift"
          {...register('schedule')}
          error={errors.schedule?.message}
          placeholder="Mon–Sat, 6AM–2PM"
        />
        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="label">Specializations</label>
          <Controller
            control={control}
            name="specializations"
            render={({ field }) => (
              <AntSelect
                mode="tags"
                className="gym-ant-select w-full"
                popupClassName="gym-ant-select-dropdown"
                value={field.value}
                onChange={field.onChange}
                options={SPECIALIZATIONS.map(s => ({ value: s, label: s }))}
                placeholder="Select or type specializations"
              />
            )}
          />
        </div>
        <div className="md:col-span-2">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--color-brand-500)]"
                />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Active (currently employed)
                </span>
              </label>
            )}
          />
        </div>
      </div>
    </Modal>
  );
};

/* ─── Detail Modal ────────────────────────────────────────────────────────── */
const StaffDetailModal: React.FC<{
  staff: StaffDto | null;
  onClose: () => void;
  onEdit: () => void;
}> = ({ staff: s, onClose, onEdit }) => (
  <Modal
    isOpen={!!s}
    onClose={onClose}
    title="Staff Details"
    size="sm"
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button onClick={onEdit}><Edit className="w-4 h-4" />Edit</Button>
      </>
    }
  >
    {s && (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">{s.firstName?.[0]}{s.lastName?.[0]}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
              {s.firstName} {s.lastName}
            </h3>
            <p className="font-mono text-sm" style={{ color: 'var(--color-brand-400)' }}>{s.staffId}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={roleColor(s.role ?? '') as any}>{s.role}</Badge>
              <Badge color={s.status === 'Active' ? 'green' : 'gray'} dot>{s.status}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <a
            href={`mailto:${s.email}`}
            className="flex items-center gap-3 rounded-lg p-3 transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--color-bg-700)' }}
          >
            <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-brand-400)' }} />
            <span className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>{s.email}</span>
          </a>
          {s.phone && (
            <a
              href={`tel:${s.phone}`}
              className="flex items-center gap-3 rounded-lg p-3 transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--color-bg-700)' }}
            >
              <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-brand-400)' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{s.phone}</span>
            </a>
          )}
          <div className="flex items-center gap-3 rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-700)' }}>
            <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Monthly Salary</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                ₹{(s.salary ?? 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {([
            {
              l: 'Join Date',
              v: s.joinDate
                ? new Date(s.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : '—',
            },
            { l: 'Schedule', v: s.schedule || '—' },
          ] as const).map(({ l, v }) => (
            <div key={l} className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-700)' }}>
              <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{l}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{v}</p>
            </div>
          ))}
        </div>

        {s.specializations && s.specializations.length > 0 && (
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Specializations</p>
            <div className="flex flex-wrap gap-1.5">
              {s.specializations.map(spec => (
                <span
                  key={spec}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-brand-500) 15%, transparent)',
                    color: 'var(--color-brand-400)',
                    border: '1px solid color-mix(in srgb, var(--color-brand-500) 20%, transparent)',
                  }}
                >
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

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const StaffPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffDto | null>(null);
  const [viewStaff, setViewStaff] = useState<StaffDto | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search);
  const queryClient = useQueryClient();

  const mainParams: GetStaffListParams = {
    Page: page,
    PageSize: PAGE_SIZE,
    ...(debouncedSearch && { Search: debouncedSearch }),
    ...(roleFilter && { Role: roleFilter }),
    ...(statusFilter && { Status: statusFilter }),
  };

  const { data, isLoading, isError, error } = useGetStaffList(mainParams, {
    query: {
      retry: (count, rawErr) => {
        const status = (rawErr as unknown as AxiosError)?.response?.status;
        return status !== 403 && count < 2;
      },
    },
  });

  // Separate count queries — read .total only, pageSize:1 minimises payload
  const { data: activeData } = useGetStaffList({ Status: 'Active', PageSize: 1 });
  const { data: trainerData } = useGetStaffList({ Role: 'Trainer', PageSize: 1 });

  const deleteMutation = useDeleteStaff({
    mutation: {
      onSuccess: () => {
        toast.success('Staff member removed');
        setDeleteId(null);
        queryClient.invalidateQueries({ queryKey: getGetStaffListQueryKey() });
      },
      onError: (rawError) => {
        const err = rawError as unknown as AxiosError<ProblemDetails>;
        if (err.response?.status === 409) {
          toast.error('This staff member has a linked login account and cannot be deleted.');
        } else {
          toast.error(
            err.response?.data?.detail ?? err.response?.data?.title ?? 'Failed to remove staff member',
          );
        }
        setDeleteId(null);
      },
    },
  });

  // Reset to page 1 whenever filters or debounced search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, statusFilter]);

  // 403 — frontend "Staff" role can reach this route but backend only allows GymAdmin.
  // Handled here to avoid a toast loop; routing fix is a separate task.
  if (isError) {
    const status = (error as unknown as AxiosError)?.response?.status;
    if (status === 403) {
      return (
        <div className="animate-slide-up">
          <EmptyState
            icon={<Lock className="w-12 h-12" />}
            title="Access restricted"
            description="You don't have access to staff management"
          />
        </div>
      );
    }
  }

  const staff = data?.data ?? [];
  const total = data?.total ?? 0;

  const statusFilters: [string, string][] = [['', 'All'], ['Active', 'Active'], ['Inactive', 'Inactive']];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Staff</h1>
          <p className="page-subtitle">Manage gym staff, trainers and schedules</p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => { setEditStaff(null); setShowForm(true); }}
        >
          Add Staff
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Staff"
          value={isLoading ? '—' : total}
          icon={<UserCheck className="w-5 h-5 text-[var(--color-brand-400)]" />}
          iconBg="bg-[var(--color-brand-500)]/10"
        />
        <StatCard
          title="Active"
          value={activeData?.total ?? '—'}
          icon={<UserCheck className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Trainers"
          value={trainerData?.total ?? '—'}
          icon={<UserCheck className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, phone or staff ID…"
          className="max-w-sm"
        />
        <div className="flex items-center gap-2 flex-wrap">
          {(['', ...STAFF_ROLES] as string[]).map(r => (
            <button
              key={r || '__all__'}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                roleFilter === r
                  ? 'bg-[var(--color-brand-500)]/20 border-[var(--color-brand-500)]/40 text-[var(--color-brand-400)]'
                  : 'bg-dark-700 border-dark-500 text-slate-400 hover:border-dark-400'
              }`}
            >
              {r || 'All Roles'}
            </button>
          ))}
          <div className="h-5 w-px mx-1" style={{ backgroundColor: 'var(--color-bg-500)' }} />
          {statusFilters.map(([v, l]) => (
            <button
              key={v || '__all_status__'}
              onClick={() => setStatusFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                statusFilter === v
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-dark-700 border-dark-500 text-slate-400 hover:border-dark-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      {isLoading ? (
        <Spinner className="py-16" />
      ) : staff.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="w-12 h-12" />}
          title="No staff members"
          description={
            debouncedSearch || roleFilter || statusFilter
              ? 'No staff match your current filters'
              : 'Add your first staff member'
          }
          action={
            !debouncedSearch && !roleFilter && !statusFilter ? (
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
                Add Staff
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map(s => (
            <div key={s.id} className="card p-5 hover:border-[var(--color-bg-400)] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-white text-lg">{s.firstName?.[0]}{s.lastName?.[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{s.staffId}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <Badge color={roleColor(s.role ?? '') as any}>{s.role}</Badge>
                <Badge color={s.status === 'Active' ? 'green' : 'gray'} dot>{s.status}</Badge>
              </div>

              <div className="space-y-1.5 text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{s.email}</span>
                </p>
                {s.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 flex-shrink-0" />{s.phone}
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-400 font-semibold">
                    ₹{(s.salary ?? 0).toLocaleString('en-IN')}/mo
                  </span>
                </p>
              </div>

              {s.specializations && s.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {s.specializations.slice(0, 3).map(spec => (
                    <span
                      key={spec}
                      className="text-xs rounded-full px-2 py-0.5"
                      style={{ backgroundColor: 'var(--color-bg-700)', color: 'var(--color-text-muted)' }}
                    >
                      {spec}
                    </span>
                  ))}
                  {s.specializations.length > 3 && (
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      +{s.specializations.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-1 pt-3" style={{ borderTop: '1px solid var(--color-bg-600)' }}>
                <button
                  onClick={() => setViewStaff(s)}
                  className="flex-1 btn-ghost text-xs py-1.5 justify-center"
                >
                  <Eye className="w-3.5 h-3.5" />View
                </button>
                <button
                  onClick={() => { setEditStaff(s); setShowForm(true); }}
                  className="flex-1 btn-ghost text-xs py-1.5 justify-center"
                >
                  <Edit className="w-3.5 h-3.5" />Edit
                </button>
                <button
                  onClick={() => setDeleteId(s.id ?? null)}
                  className="flex-1 btn-ghost text-xs py-1.5 justify-center text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex justify-center pt-2">
          <Pagination
            current={page}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            showSizeChanger={false}
            showTotal={t => `${t} staff members`}
          />
        </div>
      )}

      {/* Modals */}
      <StaffFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditStaff(null); }}
        staff={editStaff}
      />
      <StaffDetailModal
        staff={viewStaff}
        onClose={() => setViewStaff(null)}
        onEdit={() => { setEditStaff(viewStaff); setViewStaff(null); setShowForm(true); }}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        title="Remove Staff Member"
        message="This will remove the staff member from your gym. Are you sure?"
      />
    </div>
  );
};

export default StaffPage;
