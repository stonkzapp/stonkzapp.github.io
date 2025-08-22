# Modo Mock - Stonkz Frontend

## Visão Geral

O projeto Stonkz Frontend agora inclui um sistema de **modo mock** que permite testar todas as funcionalidades sem necessidade de um backend funcionando. Isso é especialmente útil para:

- Desenvolvimento local
- Testes em dispositivos móveis
- Demonstrações
- Testes de UI/UX

## Como Funciona

### 1. Sistema de Autenticação Mock

- **Usuário único**: Apenas `appstonkz@gmail.com` com senha `Stonkz@1` é aceito
- **Login automático**: O sistema cria automaticamente um usuário de teste
- **Persistência**: Os dados do usuário são salvos no localStorage
- **Fallback inteligente**: Tenta primeiro o backend real, depois usa o mock

### 2. Proteção de Rotas

- Todas as rotas protegidas funcionam normalmente
- O `AuthGuard` verifica tanto tokens reais quanto usuários mock
- Redirecionamento automático para login quando necessário

### 3. Indicadores Visuais

- Badge "DEV" no header quando em modo mock
- Informações do usuário no menu dropdown
- Avatar com iniciais do usuário
- Credenciais mock visíveis na tela de login

## Configuração

### Arquivo de Configuração

```typescript
// src/app/core/config/mock.config.ts
export const MOCK_CONFIG = {
  ENABLE_MOCK_MODE: true, // Ativa/desativa o modo mock
  // ... outras configurações
};
```

### Usuário Padrão

```typescript
DEFAULT_MOCK_USER: {
  id: 'stonkz-user-001',
  email: 'appstonkz@gmail.com',
  name: 'App Stonkz',
  role: 'premium_user',
  subscription: {
    plan: 'premium',
    status: 'active',
    expiresAt: '...'
  }
}
```

### Credenciais de Acesso

- **Email**: `appstonkz@gmail.com`
- **Senha**: `Stonkz@1`
- **Nome**: App Stonkz
- **Plano**: Premium

## Como Usar

### 1. Desenvolvimento Local

```bash
# O modo mock já está ativado por padrão
npm start
```

### 2. Login no Modo Mock

1. Acesse a tela de login
2. Use as credenciais:
   - Email: `appstonkz@gmail.com`
   - Senha: `Stonkz@1`
3. O sistema tentará primeiro o backend real
4. Se falhar, ativará automaticamente o modo mock

### 3. Teste no Celular

```bash
# Build para produção
npm run build

# O modo mock continuará funcionando
# Deploy no GitHub Pages ou similar
```

### 4. Desativar Modo Mock

```typescript
// Em mock.config.ts
ENABLE_MOCK_MODE: false;
```

## Funcionalidades Disponíveis

### ✅ Autenticação

- Login/Logout com credenciais específicas
- Proteção de rotas
- Sessão persistente

### ✅ Perfil do Usuário (Mockado)

- **Informações básicas**: Nome, email, telefone, país, cidade
- **Assinatura**: Plano premium com 365 dias de validade
- **Carteira**: Saldo de R$ 15.420,75 com histórico de transações
- **Estatísticas**: Investimentos, retornos, valor do portfólio
- **Conexões**: 15 total, 12 ativas, 3 pendentes
- **Preferências**: Notificações, newsletter, modo escuro

### ✅ APIs Mockadas

- `auth/login` - Autenticação
- `auth/logout` - Logout
- `user/profile` - Perfil completo do usuário
- `user/wallet` - Informações da carteira
- `user/statistics` - Estatísticas de investimentos
- `user/connections` - Conexões e relacionamentos

### ✅ Navegação

- Dashboard completo com todas as rotas
- Todas as rotas protegidas funcionando
- Redirecionamentos automáticos

### ✅ Interface

- Indicadores visuais do modo mock
- Responsividade para mobile
- Animações e transições

## Estrutura dos Arquivos

```
src/app/core/
├── config/
│   └── mock.config.ts              # Configuração central
├── services/
│   ├── mock-auth.service.ts         # Serviço de autenticação mock
│   └── mock-user-profile.service.ts # Serviço de perfil mock
└── guards/
    └── auth.guard.ts                # Guard modificado para suportar mock
```

## Dados Simulados Disponíveis

### Perfil do Usuário

```typescript
{
  id: 'stonkz-user-001',
  email: 'appstonkz@gmail.com',
  name: 'App Stonkz',
  role: 'premium_user',
  subscription: {
    plan: 'premium',
    status: 'active',
    expiresAt: '2025-12-XX',
    features: [
      'unlimited_investments',
      'advanced_analytics',
      'priority_support',
      'exclusive_content',
      'mobile_app_access'
    ]
  }
}
```

### Carteira

```typescript
{
  balance: 15420.75,
  currency: 'BRL',
  transactions: [
    { type: 'credit', amount: 5000.00, description: 'Depósito inicial' },
    { type: 'credit', amount: 10000.00, description: 'Transferência bancária' },
    { type: 'debit', amount: 2500.00, description: 'Investimento em ações' },
    { type: 'credit', amount: 920.75, description: 'Retorno de investimento' }
  ]
}
```

### Estatísticas

```typescript
{
  totalInvestments: 25000.00,
  totalReturns: 420.75,
  portfolioValue: 25420.75,
  riskLevel: 'medium'
}
```

## Personalização

### 1. Usuário Padrão

```typescript
// Em mock.config.ts
DEFAULT_MOCK_USER: {
  name: 'Seu Nome',
  email: 'seu@email.com',
  // ... outras propriedades
}
```

### 2. Delays de Rede

```typescript
NETWORK_DELAY: {
  login: 2000,      // 2 segundos para login
  logout: 1000,     // 1 segundo para logout
  dataLoad: 1500    // 1.5 segundos para carregar dados
}
```

### 3. Mensagens

```typescript
MESSAGES: {
  mockModeEnabled: 'Sua mensagem personalizada',
  loginInstructions: 'Use: appstonkz@gmail.com / Stonkz@1',
  // ... outras mensagens
}
```

## Deploy e Teste

### 1. GitHub Pages

```bash
# Build do projeto
npm run build

# Deploy automático via GitHub Actions
# O modo mock continuará funcionando
```

### 2. Teste no Celular

- Acesse a URL do seu projeto
- Faça login com `appstonkz@gmail.com` / `Stonkz@1`
- Navegue por todas as funcionalidades
- Teste a responsividade

### 3. Verificação

- Badge "DEV" visível no header
- Usuário logado automaticamente
- Todas as rotas protegidas acessíveis
- Dados simulados funcionando
- Perfil completo disponível

## Troubleshooting

### Problema: Usuário não é criado automaticamente

**Solução**: Verifique se `ENABLE_MOCK_MODE: true` no arquivo de configuração

### Problema: Credenciais não funcionam

**Solução**: Use exatamente `appstonkz@gmail.com` / `Stonkz@1`

### Problema: Rotas protegidas não funcionam

**Solução**: Verifique se o `MockAuthService` está sendo injetado no `AuthGuard`

### Problema: Dados não persistem

**Solução**: Verifique se o localStorage está habilitado no navegador

### Problema: Perfil não carrega

**Solução**: Verifique se o `MockUserProfileService` está funcionando

## Próximos Passos

1. **Dados Mock Adicionais**: Criar serviços mock para outras funcionalidades
2. **Configuração Dinâmica**: Permitir ativar/desativar via interface
3. **Múltiplos Usuários**: Sistema de troca de usuários mock
4. **Dados Realistas**: Simular dados mais próximos da realidade

## Contribuição

Para melhorar o sistema de mock:

1. Adicione novos serviços mock conforme necessário
2. Mantenha a configuração centralizada
3. Documente novas funcionalidades
4. Teste em diferentes dispositivos

---

**Nota**: Este sistema é destinado apenas para desenvolvimento e testes. Não use em produção com dados reais.
