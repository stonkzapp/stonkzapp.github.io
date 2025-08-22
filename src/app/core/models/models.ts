export interface UserRegistration {
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Novos tipos de autenticação
export type AuthProvider =
  | 'email'
  | 'google'
  | 'apple'
  | 'facebook'
  | 'microsoft'
  | 'github'
  | 'keycloak'
  | 'biometric'
  | 'sso';

export interface SocialLoginRequest {
  provider: AuthProvider;
  token?: string;
  code?: string;
  redirectUri?: string;
  state?: string;
}

export interface BiometricLoginRequest {
  biometricType: 'face_id' | 'touch_id' | 'fingerprint' | 'iris' | 'voice';
  deviceId: string;
  challenge?: string;
  signature?: string;
  publicKey?: string;
}

export interface SSOLoginRequest {
  provider: 'android' | 'ios' | 'windows' | 'macos';
  deviceId: string;
  token: string;
  deviceInfo?: DeviceInfo;
}

export interface DeviceInfo {
  platform: string;
  version: string;
  model?: string;
  manufacturer?: string;
  appVersion: string;
  fingerprint?: string;
}

export interface Authentication {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  scope?: string;
  provider?: AuthProvider;
  userId?: string;
  userProfile?: UserProfile;
}

export interface AuthSession {
  id: string;
  userId: string;
  provider: AuthProvider;
  deviceId?: string;
  deviceInfo?: DeviceInfo;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
  expiresAt?: Date;
}

export interface BiometricCapabilities {
  faceId: boolean;
  touchId: boolean;
  fingerprint: boolean;
  iris: boolean;
  voice: boolean;
  isAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface UserAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  phoneNumber: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  joinDate?: string;
  address?: UserAddress;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword: string;
}

// Novos modelos para assinaturas
export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'pro';
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionSKU {
  id: string;
  planId: string;
  name: string;
  period: 'monthly' | 'semiannual' | 'annual';
  price: number;
  originalPrice?: number;
  currency: string;
  isPopular?: boolean;
  discountPercentage?: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  skuId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  isAvailable: boolean;
  planType: 'free' | 'pro';
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface RecoverPasswordTokenRequest {
  token: number;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: number;
  email: string;
  password: string;
}

export interface OTPRequest {
  token: number;
  email: string;
}

export interface ResendConfirmationRequest {
  email: string;
}

export interface ErrorModel {
  code?: string;
  field?: string;
  traceId?: string;
  message: string;
}

export interface Wallet {
  id: string;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalValue?: number;
  totalInvested?: number;
  totalReturn?: number;
  returnPercentage?: number;
}

export interface WalletConnection {
  id: string;
  walletId: string;
  brokerName: string;
  accountNumber: string;
  connectionStatus: 'active' | 'inactive' | 'error';
  lastSync?: Date;
  totalValue?: number;
}

export interface WalletSummary {
  wallet: Wallet;
  connections: WalletConnection[];
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  returnPercentage: number;
  assetCount: number;
}

export interface CreateWalletRequest {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateWalletRequest {
  name?: string;
  description?: string;
  color?: string;
}

// ===== ADMIN SYSTEM =====
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  lastLogin?: Date;
  createdAt: Date;
  isActive: boolean;
}

export type AdminRole = 'super_admin' | 'admin' | 'analyst';

export type AdminPermission =
  | 'view_users'
  | 'manage_users'
  | 'view_metrics'
  | 'manage_pricing'
  | 'view_subscriptions'
  | 'manage_subscriptions'
  | 'view_transactions'
  | 'manage_transactions'
  | 'system_settings';

export interface AdminLoginRequest {
  email: string;
  password: string;
  securityCode?: string;
}

export interface AdminAuthentication {
  accessToken: string;
  refreshToken: string;
  adminUser: AdminUser;
  expiresIn: number;
  permissions: AdminPermission[];
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  proUsers: number;
  freeUsers: number;
  userGrowthRate: number;
  churnRate: number;
  averageSessionDuration: number;
  usersByCountry: CountryMetric[];
  usersByPlan: PlanMetric[];
  userRegistrationTrend: TrendData[];
}

export interface CountryMetric {
  country: string;
  countryCode: string;
  userCount: number;
  percentage: number;
}

export interface PlanMetric {
  planName: string;
  userCount: number;
  percentage: number;
  revenue: number;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  revenueGrowthRate: number;
  subscriptionRevenue: number;
  oneTimeRevenue: number;
  refunds: number;
  chargeback: number;
  netRevenue: number;
  revenueByPlan: PlanRevenue[];
  revenueTrend: TrendData[];
  conversionRate: number;
}

export interface PlanRevenue {
  planId: string;
  planName: string;
  revenue: number;
  subscriptions: number;
  averageValue: number;
}

export interface SystemMetrics {
  serverUptime: number;
  responseTime: number;
  errorRate: number;
  apiCalls: number;
  activeConnections: number;
  databaseSize: number;
  backupStatus: string;
  lastBackup: Date;
  securityAlerts: SecurityAlert[];
}

export interface SecurityAlert {
  id: string;
  type:
    | 'login_attempt'
    | 'data_breach'
    | 'suspicious_activity'
    | 'system_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  userId?: string;
}

export interface AdminDashboardData {
  userMetrics: UserMetrics;
  financialMetrics: FinancialMetrics;
  systemMetrics: SystemMetrics;
  lastUpdated: Date;
}

export interface AdminPricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'one_time';
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  maxWallets: number;
  maxConnections: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePricingPlanRequest {
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'one_time';
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  maxWallets: number;
  maxConnections: number;
  priority: number;
}

export interface UpdatePricingPlanRequest
  extends Partial<CreatePricingPlanRequest> {
  id: string;
}
