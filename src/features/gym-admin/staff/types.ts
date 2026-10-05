import { z } from 'zod';

export const STAFF_ROLES = ['Trainer', 'Receptionist', 'Manager', 'Cleaner', 'Security'] as const;
export type StaffRole = typeof STAFF_ROLES[number];

export const SPECIALIZATIONS = [
  'Strength Training', 'HIIT', 'Yoga', 'Zumba', 'CrossFit',
  'Nutrition', 'Cardio', 'Flexibility', 'Boxing', 'Swimming',
];

export const staffFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(200),
  phone: z.string().max(20, 'Phone max 20 characters'),
  role: z.enum(STAFF_ROLES),
  salary: z.number({ error: 'Enter a valid salary' }).min(0, 'Salary must be ≥ 0'),
  joinDate: z.string().min(1, 'Join date is required'),
  isActive: z.boolean(),
  specializations: z.array(z.string()),
  schedule: z.string().max(200),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;

export const DEFAULT_FORM_VALUES: StaffFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Trainer',
  salary: 0,
  joinDate: new Date().toISOString().split('T')[0],
  isActive: true,
  specializations: [],
  schedule: '',
};
