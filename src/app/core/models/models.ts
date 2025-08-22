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

export interface Authentication {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  scope?: string;
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
