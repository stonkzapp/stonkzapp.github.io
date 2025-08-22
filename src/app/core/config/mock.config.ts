export const MOCK_CONFIG = {
  // Ativa o modo mock para desenvolvimento
  ENABLE_MOCK_MODE: true,

  // Configurações do usuário mock padrão
  DEFAULT_MOCK_USER: {
    id: 'stonkz-user-001',
    email: 'appstonkz@gmail.com',
    name: 'App Stonkz',
    role: 'premium_user',
    subscription: {
      plan: 'premium',
      status: 'active',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },

  // Configurações de delay para simular rede
  NETWORK_DELAY: {
    login: 1000,
    logout: 500,
    dataLoad: 800,
  },

  // Mensagens de feedback
  MESSAGES: {
    mockModeEnabled: 'Modo de desenvolvimento ativado - Dados simulados',
    mockModeDisabled: 'Modo de desenvolvimento desativado',
    usingMockData: 'Usando dados simulados (modo desenvolvimento)',
    loginInstructions: 'Use: appstonkz@gmail.com / Stonkz@1',
  },

  // Configurações específicas do modo mock
  MOCK_SPECIFIC: {
    // Apenas este usuário é permitido no modo mock
    allowedCredentials: {
      email: 'appstonkz@gmail.com',
      password: 'Stonkz@1',
    },
    // APIs mockadas
    mockedApis: [
      'auth/login',
      'auth/logout',
      'user/profile',
      'user/wallet',
      'user/statistics',
      'user/connections',
    ],
    // Dados simulados disponíveis
    availableData: [
      'Perfil completo do usuário',
      'Carteira com transações',
      'Estatísticas de investimentos',
      'Conexões e relacionamentos',
      'Preferências e configurações',
    ],
  },
};
