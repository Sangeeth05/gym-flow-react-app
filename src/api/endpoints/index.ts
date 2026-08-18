import {
  Member,
  CreateMemberDto,
  Transaction,
  InventoryItem,
  Product,
  PromoCode,
  Staff,
  MembershipPlan,
  DashboardStats,
  RecentActivity,
  PaginatedResponse,
  QueryParams,
} from '../../types';
import * as mock from '../mockData';

import {
  getDashboardStats,
  getDashboardActivity,
  getDashboardRevenueChart,
  getDashboardSummary,
} from '../generated/dashboard/dashboard';
import {
  getAllMembers,
  getMemberById,
  createMember as genCreateMember,
  updateMember as genUpdateMember,
  deleteMember as genDeleteMember,
} from '../generated/members/members';
import { getAllMembershipPlans } from '../generated/membership-plans/membership-plans';
import { getTransactions, getFinanceSummary } from '../generated/finance/finance';
import { getAllInventory } from '../generated/inventory/inventory';
import { getAllProducts } from '../generated/products/products';
import { getAllPromoCodes } from '../generated/promo-codes/promo-codes';
import { getAllStaff } from '../generated/staff/staff';

const USE_MOCK = process.env.REACT_APP_USE_MOCK !== 'false';
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Generated functions are typed as Promise<void> but resolve to response.data at runtime.
const cast = <T>(p: Promise<unknown>): Promise<T> => p as Promise<T>;

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    if (USE_MOCK) {
      await delay(500);
      return mock.mockDashboardStats;
    }
    return cast<DashboardStats>(getDashboardStats());
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    if (USE_MOCK) {
      await delay(300);
      return mock.mockRecentActivity;
    }
    return cast<RecentActivity[]>(getDashboardActivity());
  },

  getRevenueChart: async () => {
    if (USE_MOCK) {
      await delay(400);
      return mock.mockRevenueChart;
    }
    return cast<{ month: string; revenue: number; expenses: number }[]>(getDashboardRevenueChart());
  },
};

// ─── Members ─────────────────────────────────────────────────────────────────
export const membersApi = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Member>> => {
    if (USE_MOCK) {
      await delay(400);
      let data = [...mock.mockMembers];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (m) =>
            m.firstName.toLowerCase().includes(q) ||
            m.lastName.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.memberId.toLowerCase().includes(q),
        );
      }
      if (params?.status) data = data.filter((m) => m.status === params.status);
      return { data, total: data.length, page: 1, pageSize: 20, totalPages: 1 };
    }
    return cast<PaginatedResponse<Member>>(getAllMembers(params));
  },

  getById: async (id: string): Promise<Member> => {
    if (USE_MOCK) {
      await delay(200);
      return mock.mockMembers.find((m) => m.id === id)!;
    }
    return cast<Member>(getMemberById(id));
  },

  create: async (data: CreateMemberDto): Promise<Member> => {
    if (USE_MOCK) {
      await delay(600);
      const newMember: Member = {
        ...data,
        id: String(Date.now()),
        memberId: 'GF-' + String(mock.mockMembers.length + 1).padStart(4, '0'),
        status: 'Active',
        totalPayments: 0,
        createdAt: new Date().toISOString(),
        membershipPlanName:
          mock.mockMembershipPlans.find((p) => p.id === data.membershipPlanId)?.name || '',
        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      };
      mock.mockMembers.push(newMember);
      return newMember;
    }
    return cast<Member>(genCreateMember(data));
  },

  update: async (id: string, data: Partial<Member>): Promise<Member> => {
    if (USE_MOCK) {
      await delay(500);
      const idx = mock.mockMembers.findIndex((m) => m.id === id);
      if (idx !== -1) mock.mockMembers[idx] = { ...mock.mockMembers[idx], ...data };
      return mock.mockMembers[idx];
    }
    return cast<Member>(genUpdateMember(id, data as any));
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      return;
    }
    await genDeleteMember(id);
  },
};

// ─── Membership Plans ─────────────────────────────────────────────────────────
export const plansApi = {
  getAll: async (): Promise<MembershipPlan[]> => {
    if (USE_MOCK) {
      await delay(300);
      return mock.mockMembershipPlans;
    }
    return cast<MembershipPlan[]>(getAllMembershipPlans());
  },
};

// ─── Finance ─────────────────────────────────────────────────────────────────
export const financeApi = {
  getTransactions: async (params?: QueryParams): Promise<PaginatedResponse<Transaction>> => {
    if (USE_MOCK) {
      await delay(400);
      let data = [...mock.mockTransactions];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (t) =>
            t.transactionId.toLowerCase().includes(q) ||
            t.memberName?.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q),
        );
      }
      if (params?.status) data = data.filter((t) => t.status === params.status);
      return { data, total: data.length, page: 1, pageSize: 20, totalPages: 1 };
    }
    return cast<PaginatedResponse<Transaction>>(getTransactions(params));
  },

  getSummary: async () => {
    if (USE_MOCK) {
      await delay(400);
      return {
        totalRevenue: 284500,
        monthlyRevenue: 284500,
        pendingPayments: 999,
        overduePayments: 999,
        revenueByMonth: mock.mockRevenueChart,
        revenueByType: [
          { type: 'Membership', amount: 198000 },
          { type: 'Products', amount: 54000 },
          { type: 'PT Sessions', amount: 24000 },
          { type: 'Other', amount: 8500 },
        ],
      };
    }
    return getFinanceSummary();
  },
};

// ─── Inventory ───────────────────────────────────────────────────────────────
export const inventoryApi = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<InventoryItem>> => {
    if (USE_MOCK) {
      await delay(400);
      let data = [...mock.mockInventory];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q),
        );
      }
      return { data, total: data.length, page: 1, pageSize: 20, totalPages: 1 };
    }
    return cast<PaginatedResponse<InventoryItem>>(getAllInventory(params));
  },
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Product>> => {
    if (USE_MOCK) {
      await delay(400);
      let data = [...mock.mockProducts];
      if (params?.search) {
        const q = params.search.toLowerCase();
        data = data.filter(
          (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
        );
      }
      return { data, total: data.length, page: 1, pageSize: 20, totalPages: 1 };
    }
    return cast<PaginatedResponse<Product>>(getAllProducts(params));
  },
};

// ─── Promo Codes ─────────────────────────────────────────────────────────────
export const promoApi = {
  getAll: async (): Promise<PromoCode[]> => {
    if (USE_MOCK) {
      await delay(400);
      return mock.mockPromoCodes;
    }
    return cast<PromoCode[]>(getAllPromoCodes());
  },
};

// ─── Staff ───────────────────────────────────────────────────────────────────
export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    if (USE_MOCK) {
      await delay(400);
      return mock.mockStaff;
    }
    return cast<Staff[]>(getAllStaff());
  },
};

// ─── Dashboard Summary ────────────────────────────────────────────────────────
export const dashboardSummaryApi = {
  getSummary: async () => {
    if (USE_MOCK) {
      await delay(300);
      return {
        revenueByType: [
          { type: 'Membership', amount: 198000 },
          { type: 'Products', amount: 54000 },
          { type: 'PT Sessions', amount: 24000 },
          { type: 'Other', amount: 8500 },
        ],
      };
    }
    return getDashboardSummary();
  },
};
