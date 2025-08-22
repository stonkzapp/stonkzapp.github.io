import {
  UserProfile,
  Wallet,
  WalletConnection,
  WalletSummary,
  SubscriptionPlan,
  SubscriptionSKU,
  UserSubscription,
  SubscriptionFeature,
} from '../models/models';

// ============================================================================
// MOCKS DE USUÁRIO
// ============================================================================

export const MOCK_USER_PROFILE: UserProfile = {
  firstName: 'João',
  lastName: 'Silva',
  document: '123.456.789-00',
  email: 'joao.silva@email.com',
  phoneNumber: '+55 11 99999-9999',
  phone: '+55 11 99999-9999',
  cpf: '123.456.789-00',
  birthDate: '1990-05-15',
  joinDate: '2024-01-01',
  address: {
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
};

// ============================================================================
// MOCKS DE ASSINATURA
// ============================================================================

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    type: 'free',
    description: 'Plano básico com funcionalidades essenciais',
    features: ['basic-portfolio', 'market-data', 'basic-reports'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pro',
    name: 'PRO',
    type: 'pro',
    description: 'Plano premium com funcionalidades avançadas',
    features: [
      'basic-portfolio',
      'market-data',
      'basic-reports',
      'multiple-wallets',
      'advanced-analytics',
      'priority-support',
      'custom-alerts',
      'api-access',
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const MOCK_SUBSCRIPTION_SKUS: SubscriptionSKU[] = [
  {
    id: 'pro-monthly',
    planId: 'pro',
    name: 'PRO Mensal',
    period: 'monthly',
    price: 29.9,
    originalPrice: 39.9,
    currency: 'BRL',
    isPopular: false,
    discountPercentage: 25,
    features: ['multiple-wallets', 'advanced-analytics', 'priority-support'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pro-semiannual',
    planId: 'pro',
    name: 'PRO Semestral',
    period: 'semiannual',
    price: 149.9,
    originalPrice: 239.4,
    currency: 'BRL',
    isPopular: true,
    discountPercentage: 37,
    features: ['multiple-wallets', 'advanced-analytics', 'priority-support'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'pro-annual',
    planId: 'pro',
    name: 'PRO Anual',
    period: 'annual',
    price: 269.9,
    originalPrice: 478.8,
    currency: 'BRL',
    isPopular: false,
    discountPercentage: 44,
    features: ['multiple-wallets', 'advanced-analytics', 'priority-support'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const MOCK_USER_SUBSCRIPTION: UserSubscription = {
  id: 'sub-123',
  userId: 'user-123',
  planId: 'pro',
  skuId: 'pro-semiannual',
  status: 'active',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-07-01'),
  nextPaymentDate: new Date('2024-07-01'),
  autoRenew: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const MOCK_SUBSCRIPTION_FEATURES: SubscriptionFeature[] = [
  {
    id: 'basic-portfolio',
    name: 'Carteira Básica',
    description: 'Gerencie uma carteira de investimentos',
    icon: 'account_balance_wallet',
    isAvailable: true,
    planType: 'free',
  },
  {
    id: 'market-data',
    name: 'Dados de Mercado',
    description: 'Acesso a dados básicos do mercado',
    icon: 'trending_up',
    isAvailable: true,
    planType: 'free',
  },
  {
    id: 'basic-reports',
    name: 'Relatórios Básicos',
    description: 'Relatórios simples de performance',
    icon: 'assessment',
    isAvailable: true,
    planType: 'free',
  },
  {
    id: 'multiple-wallets',
    name: 'Múltiplas Carteiras',
    description: 'Crie e gerencie múltiplas carteiras',
    icon: 'account_balance_wallet',
    isAvailable: true,
    planType: 'pro',
  },
  {
    id: 'advanced-analytics',
    name: 'Análises Avançadas',
    description: 'Análises detalhadas e insights',
    icon: 'analytics',
    isAvailable: true,
    planType: 'pro',
  },
  {
    id: 'priority-support',
    name: 'Suporte Prioritário',
    description: 'Suporte técnico com prioridade',
    icon: 'support_agent',
    isAvailable: true,
    planType: 'pro',
  },
  {
    id: 'custom-alerts',
    name: 'Alertas Personalizados',
    description: 'Configure alertas customizados',
    icon: 'notifications_active',
    isAvailable: true,
    planType: 'pro',
  },
  {
    id: 'api-access',
    name: 'Acesso à API',
    description: 'Integração via API REST',
    icon: 'api',
    isAvailable: true,
    planType: 'pro',
  },
];

// ============================================================================
// MOCKS DE CARTEIRAS
// ============================================================================

export const MOCK_WALLETS: Wallet[] = [
  {
    id: 'wallet-1',
    name: 'Carteira Principal',
    description: 'Minha carteira principal de investimentos',
    color: '#6366f1',
    isDefault: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    totalValue: 125000.0,
    totalInvested: 100000.0,
    totalReturn: 25000.0,
    returnPercentage: 25.0,
  },
  {
    id: 'wallet-2',
    name: 'Carteira Conservadora',
    description: 'Carteira focada em renda fixa',
    color: '#10b981',
    isDefault: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    totalValue: 75000.0,
    totalInvested: 70000.0,
    totalReturn: 5000.0,
    returnPercentage: 7.14,
  },
  {
    id: 'wallet-3',
    name: 'Carteira Agressiva',
    description: 'Carteira de alto risco e alto retorno',
    color: '#f59e0b',
    isDefault: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15'),
    totalValue: 50000.0,
    totalInvested: 45000.0,
    totalReturn: 5000.0,
    returnPercentage: 11.11,
  },
];

export const MOCK_WALLET_CONNECTIONS: WalletConnection[] = [
  {
    id: 'conn-1',
    walletId: 'wallet-1',
    brokerName: 'XP Investimentos',
    accountNumber: '12345-6',
    connectionStatus: 'active',
    lastSync: new Date('2024-01-15T10:30:00'),
    totalValue: 125000.0,
  },
  {
    id: 'conn-2',
    walletId: 'wallet-1',
    brokerName: 'Rico Investimentos',
    accountNumber: '78901-2',
    connectionStatus: 'active',
    lastSync: new Date('2024-01-15T09:15:00'),
    totalValue: 125000.0,
  },
  {
    id: 'conn-3',
    walletId: 'wallet-2',
    brokerName: 'Banco do Brasil',
    accountNumber: '34567-8',
    connectionStatus: 'active',
    lastSync: new Date('2024-01-15T08:45:00'),
    totalValue: 75000.0,
  },
  {
    id: 'conn-4',
    walletId: 'wallet-3',
    brokerName: 'BTG Pactual',
    accountNumber: '90123-4',
    connectionStatus: 'active',
    lastSync: new Date('2024-01-15T11:20:00'),
    totalValue: 50000.0,
  },
];

export const MOCK_WALLET_SUMMARIES: { [key: string]: WalletSummary } = {
  'wallet-1': {
    wallet: MOCK_WALLETS[0],
    connections: MOCK_WALLET_CONNECTIONS.filter(
      conn => conn.walletId === 'wallet-1'
    ),
    totalValue: 125000.0,
    totalInvested: 100000.0,
    totalReturn: 25000.0,
    returnPercentage: 25.0,
    assetCount: 15,
  },
  'wallet-2': {
    wallet: MOCK_WALLETS[1],
    connections: MOCK_WALLET_CONNECTIONS.filter(
      conn => conn.walletId === 'wallet-2'
    ),
    totalValue: 75000.0,
    totalInvested: 70000.0,
    totalReturn: 5000.0,
    returnPercentage: 7.14,
    assetCount: 8,
  },
  'wallet-3': {
    wallet: MOCK_WALLETS[2],
    connections: MOCK_WALLET_CONNECTIONS.filter(
      conn => conn.walletId === 'wallet-3'
    ),
    totalValue: 50000.0,
    totalInvested: 45000.0,
    totalReturn: 5000.0,
    returnPercentage: 11.11,
    assetCount: 12,
  },
};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

export function getMockWalletById(id: string): Wallet | undefined {
  return MOCK_WALLETS.find(wallet => wallet.id === id);
}

export function getMockWalletSummaryById(
  id: string
): WalletSummary | undefined {
  return MOCK_WALLET_SUMMARIES[id];
}

export function getMockWalletConnectionsByWalletId(
  walletId: string
): WalletConnection[] {
  return MOCK_WALLET_CONNECTIONS.filter(conn => conn.walletId === walletId);
}

export function getMockSubscriptionByUserId(
  userId: string
): UserSubscription | null {
  if (userId === 'user-123') {
    return MOCK_USER_SUBSCRIPTION;
  }
  return null;
}

export function isProUser(userId: string): boolean {
  const subscription = getMockSubscriptionByUserId(userId);
  return subscription?.status === 'active' && subscription?.planId === 'pro';
}
