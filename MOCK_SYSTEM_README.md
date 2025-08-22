# Sistema de Mocks - Stonkz Frontend

## Visão Geral

Este sistema de mocks foi criado para facilitar o desenvolvimento e testes da aplicação Stonkz, simulando todas as APIs necessárias antes da integração com o backend real.

## Estrutura dos Mocks

### 📁 Arquivo Principal: `src/app/core/config/mock-data.ts`

Este arquivo centraliza todos os dados mockados e funções auxiliares:

- **Mocks de Usuário**: Perfil completo do usuário
- **Mocks de Assinatura**: Planos, SKUs, funcionalidades e assinatura atual
- **Mocks de Carteiras**: Carteiras, conexões e resumos
- **Funções Auxiliares**: Helpers para buscar dados mockados

### 🔧 Serviços Atualizados

Os seguintes serviços foram atualizados para usar os mocks:

- `UserService` - Todos os métodos GET retornam dados mockados
- `SubscriptionService` - Usuário configurado como PRO por padrão
- `WalletService` - Operações CRUD simuladas com dados mockados

## Configuração do Usuário

### 👤 Usuário Padrão (PRO)

```typescript
// ID: user-123
// Nome: João Silva
// Email: joao.silva@email.com
// Plano: PRO (Semestral - R$ 149,90)
// Status: Ativo
```

### 💳 Assinatura PRO

- **Plano**: PRO
- **SKU**: Semestral (R$ 149,90)
- **Funcionalidades**: Múltiplas carteiras, análises avançadas, suporte prioritário
- **Status**: Ativa até 01/07/2024

### 🎯 Carteiras Disponíveis

1. **Carteira Principal** (Padrão)

   - Valor: R$ 125.000,00
   - Retorno: 25%
   - Conexões: XP Investimentos, Rico Investimentos

2. **Carteira Conservadora**

   - Valor: R$ 75.000,00
   - Retorno: 7,14%
   - Conexões: Banco do Brasil

3. **Carteira Agressiva**
   - Valor: R$ 50.000,00
   - Retorno: 11,11%
   - Conexões: BTG Pactual

## Como Usar

### 1. Importar Mocks

```typescript
import {
  MOCK_USER_PROFILE,
  MOCK_WALLETS,
  MOCK_USER_SUBSCRIPTION,
} from '../config/mock-data';
```

### 2. Usar em Serviços

```typescript
// Exemplo: retornar dados mockados
getUserProfile(): Observable<UserProfile> {
  return of(MOCK_USER_PROFILE);
}
```

### 3. Funções Auxiliares

```typescript
import { isProUser, getMockWalletById } from '../config/mock-data';

// Verificar se usuário é PRO
const isPro = isProUser('user-123'); // true

// Buscar carteira por ID
const wallet = getMockWalletById('wallet-1');
```

## Funcionalidades Simuladas

### ✅ Operações Suportadas

- **Usuário**: Perfil, estatísticas, histórico de atividades
- **Assinatura**: Verificação de plano PRO, funcionalidades
- **Carteiras**: CRUD completo, troca de carteira ativa
- **Conexões**: Listagem de conexões por carteira

### 🔄 Comportamento Realista

- Troca de carteira atualiza o contexto da aplicação
- Criação de carteira apenas para usuários PRO
- Validações de permissões funcionando
- Dados persistentes durante a sessão

## Transição para Backend Real

### 🔄 Passos para Migração

1. **Remover imports dos mocks**
2. **Substituir `of()` por chamadas HTTP reais**
3. **Atualizar URLs das APIs**
4. **Implementar tratamento de erros real**
5. **Configurar interceptors de autenticação**

### 📝 Exemplo de Migração

```typescript
// ANTES (Mock)
getUserProfile(): Observable<UserProfile> {
  return of(MOCK_USER_PROFILE);
}

// DEPOIS (Backend Real)
getUserProfile(): Observable<UserProfile> {
  return this.http.get<UserProfile>(`${this.baseUrl}/user-profile`);
}
```

## Vantagens do Sistema

### 🚀 Desenvolvimento

- **Desenvolvimento independente** do backend
- **Testes rápidos** de funcionalidades
- **Demonstrações** sem dependências externas
- **Debugging** simplificado

### 🧪 Testes

- **Dados consistentes** entre execuções
- **Cenários controlados** para testes
- **Isolamento** de componentes
- **Validação** de lógica de negócio

### 📱 UX/UI

- **Interface completa** desde o início
- **Fluxos de usuário** testáveis
- **Responsividade** verificável
- **Acessibilidade** testável

## Troubleshooting

### ❌ Problemas Comuns

1. **Erro de Build**: Verificar imports dos mocks
2. **Dados não aparecem**: Verificar se o serviço está usando mocks
3. **Funcionalidade não funciona**: Verificar permissões do usuário PRO

### 🔍 Debug

```typescript
// Adicionar logs para debug
console.log('Dados mockados:', MOCK_USER_PROFILE);
console.log('Usuário é PRO:', isProUser('user-123'));
```

## Manutenção

### 🔄 Atualizações

- **Dados mockados**: Atualizar em `mock-data.ts`
- **Novos campos**: Adicionar nas interfaces e mocks
- **Novos serviços**: Seguir o padrão estabelecido

### 📊 Monitoramento

- **Uso dos mocks**: Verificar console logs
- **Performance**: Monitorar tamanho do bundle
- **Consistência**: Validar dados entre componentes

---

## 📞 Suporte

Para dúvidas sobre o sistema de mocks, consulte:

- Este arquivo README
- Comentários no código
- Documentação das interfaces
- Logs do console durante execução

---

**Última atualização**: Janeiro 2024  
**Versão**: 1.0.0  
**Status**: ✅ Ativo e Funcionando
