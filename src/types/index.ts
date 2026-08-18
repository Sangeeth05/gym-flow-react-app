// ─── Auth ───────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AdminUser;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'GymAdmin' | 'Staff';
  gymId: string;
  gymName: string;
  avatar?: string;
}

// ─── Gym ────────────────────────────────────────────────────────────────────
export interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  logo?: string;
  openingHours: string;
  capacity: number;
  createdAt: string;
}

// ─── Members ────────────────────────────────────────────────────────────────
export type MemberStatus = 'Active' | 'Inactive' | 'Suspended' | 'Expired';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  city: string;
  profilePhoto?: string;
  status: MemberStatus;
  membershipPlanId: string;
  membershipPlanName: string;
  joinDate: string;
  expiryDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes?: string;
  totalPayments: number;
  lastVisit?: string;
  createdAt: string;
}

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  address: string;
  city: string;
  membershipPlanId: string;
  joinDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes?: string;
}

// ─── Membership Plans ───────────────────────────────────────────────────────
export type BillingCycle = 'Monthly' | 'Quarterly' | 'HalfYearly' | 'Yearly';

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: BillingCycle;
  features: string[];
  isActive: boolean;
  color: string;
  maxMembers?: number;
  currentMembers: number;
  createdAt: string;
}

// ─── Finance ────────────────────────────────────────────────────────────────
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Refunded';
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'BankTransfer' | 'Cheque';
export type TransactionType = 'MembershipFee' | 'ProductSale' | 'PersonalTraining' | 'LockerRental' | 'Other';

export interface Transaction {
  id: string;
  transactionId: string;
  memberId?: string;
  memberName?: string;
  type: TransactionType;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  dueDate?: string;
  paidAt?: string;
  invoiceUrl?: string;
  createdAt: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  revenueByMonth: { month: string; revenue: number; expenses: number }[];
  revenueByType: { type: string; amount: number }[];
}

// ─── Inventory ──────────────────────────────────────────────────────────────
export type StockStatus = 'InStock' | 'LowStock' | 'OutOfStock';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  status: StockStatus;
  lastRestocked?: string;
  image?: string;
  createdAt: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  count: number;
}

// ─── Products ───────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

// ─── Promotions ─────────────────────────────────────────────────────────────
export type DiscountType = 'Percentage' | 'FixedAmount';
export type PromoStatus = 'Active' | 'Inactive' | 'Expired' | 'Scheduled';

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  status: PromoStatus;
  applicableFor: 'All' | 'NewMembers' | 'RenewalOnly' | 'ProductsOnly';
  createdAt: string;
}

// ─── Staff ──────────────────────────────────────────────────────────────────
export type StaffRole = 'Trainer' | 'Receptionist' | 'Manager' | 'Cleaner' | 'Security';

export interface Staff {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  salary: number;
  joinDate: string;
  status: 'Active' | 'Inactive';
  specializations?: string[];
  schedule?: string;
  profilePhoto?: string;
  createdAt: string;
}

// ─── Dashboard ──────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  expiringSoon: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  pendingPayments: number;
  totalProducts: number;
  lowStockItems: number;
  totalStaff: number;
  todayCheckIns: number;
  occupancyRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'new_member' | 'payment' | 'expiry' | 'product_sale' | 'checkin';
  message: string;
  time: string;
  icon: string;
}

// ─── Pagination ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  [key: string]: string | number | undefined;
}
