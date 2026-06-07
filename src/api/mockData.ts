import {
  DashboardStats, Member, Transaction, InventoryItem,
  Product, PromoCode, MembershipPlan, Staff, RecentActivity
} from '../types';

export const mockDashboardStats: DashboardStats = {
  totalMembers: 1247,
  activeMembers: 982,
  newMembersThisMonth: 43,
  expiringSoon: 28,
  monthlyRevenue: 284500,
  revenueGrowth: 12.4,
  pendingPayments: 34200,
  totalProducts: 156,
  lowStockItems: 8,
  totalStaff: 18,
  todayCheckIns: 94,
  occupancyRate: 67,
};

export const mockRecentActivity: RecentActivity[] = [
  { id: '1', type: 'new_member', message: 'Arun Kumar joined Premium Plan', time: '5 min ago', icon: '👤' },
  { id: '2', type: 'payment', message: 'Priya Nair paid ₹2,999 for renewal', time: '12 min ago', icon: '💳' },
  { id: '3', type: 'checkin', message: '23 members checked in today morning', time: '1 hr ago', icon: '🏋️' },
  { id: '4', type: 'expiry', message: 'Rahul Menon membership expires in 3 days', time: '2 hr ago', icon: '⚠️' },
  { id: '5', type: 'product_sale', message: 'Whey Protein x2 sold — ₹3,600', time: '3 hr ago', icon: '🛒' },
  { id: '6', type: 'new_member', message: 'Deepika S joined Basic Plan', time: '4 hr ago', icon: '👤' },
  { id: '7', type: 'payment', message: 'Vijay Kumar paid ₹5,999 — Yearly Plan', time: '5 hr ago', icon: '💳' },
];

export const mockRevenueChart = [
  { month: 'Nov', revenue: 218000, expenses: 89000 },
  { month: 'Dec', revenue: 241000, expenses: 94000 },
  { month: 'Jan', revenue: 258000, expenses: 91000 },
  { month: 'Feb', revenue: 247000, expenses: 88000 },
  { month: 'Mar', revenue: 271000, expenses: 96000 },
  { month: 'Apr', revenue: 284500, expenses: 99000 },
];

export const mockMembers: Member[] = [
  {
    id: '1', memberId: 'GF-0001', firstName: 'Arun', lastName: 'Kumar',
    email: 'arun.kumar@example.com', phone: '+91 9876543210', gender: 'Male',
    dateOfBirth: '1992-05-14', address: '42 MG Road', city: 'Thiruvananthapuram',
    status: 'Active', membershipPlanId: '2', membershipPlanName: 'Premium',
    joinDate: '2024-01-15', expiryDate: '2025-01-14',
    emergencyContact: 'Sunitha Kumar', emergencyPhone: '+91 9876543299',
    totalPayments: 35988, lastVisit: '2024-04-28', createdAt: '2024-01-15',
  },
  {
    id: '2', memberId: 'GF-0002', firstName: 'Priya', lastName: 'Nair',
    email: 'priya.nair@example.com', phone: '+91 9876543211', gender: 'Female',
    dateOfBirth: '1995-08-22', address: '15 Pattom', city: 'Thiruvananthapuram',
    status: 'Active', membershipPlanId: '3', membershipPlanName: 'Gold',
    joinDate: '2024-02-01', expiryDate: '2024-05-01',
    emergencyContact: 'Sajan Nair', emergencyPhone: '+91 9876543298',
    totalPayments: 8997, lastVisit: '2024-04-30', createdAt: '2024-02-01',
  },
  {
    id: '3', memberId: 'GF-0003', firstName: 'Rahul', lastName: 'Menon',
    email: 'rahul.menon@example.com', phone: '+91 9876543212', gender: 'Male',
    dateOfBirth: '1988-11-30', address: '8 Kowdiar', city: 'Thiruvananthapuram',
    status: 'Expired', membershipPlanId: '1', membershipPlanName: 'Basic',
    joinDate: '2023-05-01', expiryDate: '2024-04-30',
    emergencyContact: 'Lakshmi Menon', emergencyPhone: '+91 9876543297',
    totalPayments: 11988, lastVisit: '2024-04-25', createdAt: '2023-05-01',
  },
  {
    id: '4', memberId: 'GF-0004', firstName: 'Deepika', lastName: 'S',
    email: 'deepika.s@example.com', phone: '+91 9876543213', gender: 'Female',
    dateOfBirth: '1998-03-18', address: '5 Vellayambalam', city: 'Thiruvananthapuram',
    status: 'Active', membershipPlanId: '1', membershipPlanName: 'Basic',
    joinDate: '2024-04-01', expiryDate: '2024-06-30',
    emergencyContact: 'Suresh S', emergencyPhone: '+91 9876543296',
    totalPayments: 2997, lastVisit: '2024-05-01', createdAt: '2024-04-01',
  },
  {
    id: '5', memberId: 'GF-0005', firstName: 'Vijay', lastName: 'Kumar',
    email: 'vijay.kumar@example.com', phone: '+91 9876543214', gender: 'Male',
    dateOfBirth: '1990-07-07', address: '22 Karamana', city: 'Thiruvananthapuram',
    status: 'Active', membershipPlanId: '4', membershipPlanName: 'Elite Annual',
    joinDate: '2024-01-01', expiryDate: '2024-12-31',
    emergencyContact: 'Meena Kumar', emergencyPhone: '+91 9876543295',
    totalPayments: 5999, lastVisit: '2024-04-29', createdAt: '2024-01-01',
  },
  {
    id: '6', memberId: 'GF-0006', firstName: 'Anitha', lastName: 'R',
    email: 'anitha.r@example.com', phone: '+91 9876543215', gender: 'Female',
    dateOfBirth: '1993-12-25', address: '33 Kesavadasapuram', city: 'Thiruvananthapuram',
    status: 'Suspended', membershipPlanId: '2', membershipPlanName: 'Premium',
    joinDate: '2023-11-01', expiryDate: '2024-10-31',
    emergencyContact: 'Rajan R', emergencyPhone: '+91 9876543294',
    totalPayments: 17994, lastVisit: '2024-03-15', createdAt: '2023-11-01',
  },
];

export const mockMembershipPlans: MembershipPlan[] = [
  {
    id: '1', name: 'Basic', description: 'Perfect for beginners', price: 999,
    billingCycle: 'Monthly', features: ['Gym Access', 'Locker Room', 'Basic Equipment'],
    isActive: true, color: '#3b82f6', currentMembers: 312, createdAt: '2023-01-01',
  },
  {
    id: '2', name: 'Premium', description: 'Most popular plan', price: 1999,
    billingCycle: 'Monthly', features: ['All Basic Features', 'Group Classes', 'Sauna', '1 PT Session/Month'],
    isActive: true, color: '#f97316', currentMembers: 489, createdAt: '2023-01-01',
  },
  {
    id: '3', name: 'Gold', description: 'Quarterly commitment', price: 2999,
    billingCycle: 'Quarterly', features: ['All Premium Features', '4 PT Sessions', 'Nutrition Consultation', 'Body Analysis'],
    isActive: true, color: '#eab308', currentMembers: 156, createdAt: '2023-01-01',
  },
  {
    id: '4', name: 'Elite Annual', description: 'Best value yearly plan', price: 5999,
    billingCycle: 'Yearly', features: ['All Gold Features', 'Unlimited PT', 'Meal Planning', 'Priority Booking', 'Guest Passes'],
    isActive: true, color: '#8b5cf6', currentMembers: 25, createdAt: '2023-01-01',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1', transactionId: 'TXN-20240501-001', memberId: '2', memberName: 'Priya Nair',
    type: 'MembershipFee', description: 'Gold Plan - Q2 Renewal',
    amount: 2999, paymentMethod: 'UPI', status: 'Paid', paidAt: '2024-05-01', createdAt: '2024-05-01',
  },
  {
    id: '2', transactionId: 'TXN-20240430-002', memberId: '5', memberName: 'Vijay Kumar',
    type: 'ProductSale', description: 'Whey Protein 1kg x2',
    amount: 3600, paymentMethod: 'Card', status: 'Paid', paidAt: '2024-04-30', createdAt: '2024-04-30',
  },
  {
    id: '3', transactionId: 'TXN-20240429-003', memberId: '1', memberName: 'Arun Kumar',
    type: 'PersonalTraining', description: 'PT Session - 5 Pack',
    amount: 4500, paymentMethod: 'Cash', status: 'Paid', paidAt: '2024-04-29', createdAt: '2024-04-29',
  },
  {
    id: '4', transactionId: 'TXN-20240428-004', memberId: '3', memberName: 'Rahul Menon',
    type: 'MembershipFee', description: 'Basic Plan - Monthly',
    amount: 999, paymentMethod: 'Cash', status: 'Pending', dueDate: '2024-05-05', createdAt: '2024-04-28',
  },
  {
    id: '5', transactionId: 'TXN-20240427-005', memberId: '4', memberName: 'Deepika S',
    type: 'MembershipFee', description: 'Basic Plan - Renewal',
    amount: 999, paymentMethod: 'UPI', status: 'Overdue', dueDate: '2024-04-27', createdAt: '2024-04-27',
  },
  {
    id: '6', transactionId: 'TXN-20240426-006',
    type: 'Other', description: 'Equipment Maintenance',
    amount: 8500, paymentMethod: 'BankTransfer', status: 'Paid', paidAt: '2024-04-26', createdAt: '2024-04-26',
  },
];

export const mockInventory: InventoryItem[] = [
  {
    id: '1', sku: 'EQ-DUMB-001', name: 'Rubber Dumbbell Set (5-50kg)',
    category: 'Equipment', description: 'Heavy-duty rubber coated dumbbells',
    quantity: 8, minQuantity: 5, unit: 'sets', purchasePrice: 15000, sellingPrice: 0,
    supplier: 'FitGear India', location: 'Weights Area', status: 'InStock',
    lastRestocked: '2024-03-10', createdAt: '2023-01-01',
  },
  {
    id: '2', sku: 'SUP-WHEY-001', name: 'Whey Protein 1kg',
    category: 'Supplements', description: 'Premium whey protein concentrate',
    quantity: 3, minQuantity: 10, unit: 'units', purchasePrice: 1200, sellingPrice: 1800,
    supplier: 'MuscleBlaze', location: 'Store Room', status: 'LowStock',
    lastRestocked: '2024-04-01', createdAt: '2023-06-01',
  },
  {
    id: '3', sku: 'ACC-GLOVE-001', name: 'Workout Gloves',
    category: 'Accessories', description: 'Non-slip workout gloves',
    quantity: 0, minQuantity: 10, unit: 'pairs', purchasePrice: 250, sellingPrice: 450,
    supplier: 'SportMax', location: 'Counter', status: 'OutOfStock',
    createdAt: '2023-06-01',
  },
  {
    id: '4', sku: 'CARE-TOW-001', name: 'Gym Towels',
    category: 'Facilities', description: 'Microfiber gym towels',
    quantity: 45, minQuantity: 20, unit: 'pieces', purchasePrice: 150, sellingPrice: 250,
    supplier: 'CleanPro', location: 'Locker Room', status: 'InStock',
    lastRestocked: '2024-04-15', createdAt: '2023-01-01',
  },
  {
    id: '5', sku: 'SUP-BCAA-001', name: 'BCAA Powder 250g',
    category: 'Supplements', description: 'Branched-chain amino acids',
    quantity: 5, minQuantity: 8, unit: 'units', purchasePrice: 800, sellingPrice: 1200,
    supplier: 'MuscleBlaze', location: 'Store Room', status: 'LowStock',
    lastRestocked: '2024-03-20', createdAt: '2023-06-01',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1', name: 'Whey Protein Isolate 2kg', brand: 'MuscleBlaze', category: 'Supplements',
    description: 'Ultra-pure whey protein isolate for lean muscle building.',
    price: 3599, originalPrice: 4199, stock: 24, images: [], sku: 'MB-WPI-2KG',
    isActive: true, isFeatured: true, rating: 4.7, reviewCount: 234, tags: ['protein', 'isolate'],
    createdAt: '2023-06-01',
  },
  {
    id: '2', name: 'Pre-Workout Energy Blast', brand: 'Dymatize', category: 'Pre-Workout',
    description: 'Explosive energy and focus for intense training sessions.',
    price: 1899, stock: 12, images: [], sku: 'DY-PW-300G',
    isActive: true, isFeatured: false, rating: 4.3, reviewCount: 89, tags: ['pre-workout', 'energy'],
    createdAt: '2023-08-01',
  },
  {
    id: '3', name: 'Resistance Band Set', brand: 'Decathlon', category: 'Equipment',
    description: 'Set of 5 resistance bands for home and gym workouts.',
    price: 999, stock: 30, images: [], sku: 'DEC-RBS-001',
    isActive: true, isFeatured: false, rating: 4.5, reviewCount: 156, tags: ['bands', 'resistance'],
    createdAt: '2023-09-01',
  },
  {
    id: '4', name: 'Compression Shorts', brand: 'Reebok', category: 'Apparel',
    description: 'High-performance compression shorts for maximum support.',
    price: 1499, originalPrice: 1999, stock: 18, images: [], sku: 'RBK-CS-M',
    isActive: true, isFeatured: true, rating: 4.2, reviewCount: 67, tags: ['shorts', 'compression'],
    createdAt: '2023-10-01',
  },
];

export const mockPromoCodes: PromoCode[] = [
  {
    id: '1', code: 'WELCOME50', description: 'Welcome offer for new members',
    discountType: 'Percentage', discountValue: 50, minPurchase: 999,
    maxUses: 100, usedCount: 67, validFrom: '2024-01-01', validTo: '2024-12-31',
    status: 'Active', applicableFor: 'NewMembers', createdAt: '2024-01-01',
  },
  {
    id: '2', code: 'RENEW20', description: '20% off on plan renewals',
    discountType: 'Percentage', discountValue: 20, minPurchase: 0,
    maxUses: 200, usedCount: 134, validFrom: '2024-03-01', validTo: '2024-05-31',
    status: 'Active', applicableFor: 'RenewalOnly', createdAt: '2024-03-01',
  },
  {
    id: '3', code: 'FLAT500', description: 'Flat ₹500 off on premium plans',
    discountType: 'FixedAmount', discountValue: 500, minPurchase: 1999,
    maxUses: 50, usedCount: 50, validFrom: '2024-02-01', validTo: '2024-03-31',
    status: 'Expired', applicableFor: 'All', createdAt: '2024-02-01',
  },
  {
    id: '4', code: 'SUMMER30', description: 'Summer sale - 30% off everything',
    discountType: 'Percentage', discountValue: 30, minPurchase: 0,
    maxUses: 150, usedCount: 0, validFrom: '2024-06-01', validTo: '2024-08-31',
    status: 'Scheduled', applicableFor: 'All', createdAt: '2024-05-01',
  },
];

export const mockStaff: Staff[] = [
  {
    id: '1', staffId: 'STF-001', firstName: 'Suresh', lastName: 'P',
    email: 'suresh.p@gymflow.com', phone: '+91 9876500001', role: 'Trainer',
    salary: 35000, joinDate: '2023-01-01', status: 'Active',
    specializations: ['Strength Training', 'HIIT', 'Nutrition'],
    createdAt: '2023-01-01',
  },
  {
    id: '2', staffId: 'STF-002', firstName: 'Meera', lastName: 'K',
    email: 'meera.k@gymflow.com', phone: '+91 9876500002', role: 'Receptionist',
    salary: 22000, joinDate: '2023-03-01', status: 'Active',
    createdAt: '2023-03-01',
  },
  {
    id: '3', staffId: 'STF-003', firstName: 'Binesh', lastName: 'M',
    email: 'binesh.m@gymflow.com', phone: '+91 9876500003', role: 'Manager',
    salary: 55000, joinDate: '2022-06-01', status: 'Active',
    createdAt: '2022-06-01',
  },
  {
    id: '4', staffId: 'STF-004', firstName: 'Lakshmi', lastName: 'S',
    email: 'lakshmi.s@gymflow.com', phone: '+91 9876500004', role: 'Trainer',
    salary: 32000, joinDate: '2023-06-01', status: 'Active',
    specializations: ['Yoga', 'Zumba', 'Flexibility'],
    createdAt: '2023-06-01',
  },
];
