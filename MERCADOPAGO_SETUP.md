# Configuração do Mercado Pago - Sistema de Assinaturas

## 📋 Pré-requisitos

- Conta no Mercado Pago (https://www.mercadopago.com.br)
- Acesso ao painel de desenvolvedores
- Domínio HTTPS para webhooks (em produção)

## 🔑 Configuração das Credenciais

### 1. Obter Credenciais de Teste

1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Faça login na sua conta
3. Selecione "Teste" para obter credenciais de sandbox
4. Copie o **Access Token** e **Public Key**

### 2. Configurar Environment

Atualize o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  mercadopago: {
    accessToken: 'TEST-SEU_ACCESS_TOKEN_AQUI',
    publicKey: 'TEST-SUA_PUBLIC_KEY_AQUI',
    sandbox: true, // true para teste, false para produção
    webhookUrl: 'http://localhost:8080/webhooks/mercadopago',
  },
};
```

### 3. Configurar Environment de Produção

Crie/atualize o arquivo `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://seu-dominio.com/api',
  mercadopago: {
    accessToken: 'APP-SEU_ACCESS_TOKEN_PRODUCAO',
    publicKey: 'APP-SUA_PUBLIC_KEY_PRODUCAO',
    sandbox: false,
    webhookUrl: 'https://seu-dominio.com/api/webhooks/mercadopago',
  },
};
```

## 🚀 Configuração do Backend

### 1. Endpoint para Criar Preferências

```typescript
// POST /api/mercadopago/preferences
export interface CreatePreferenceRequest {
  planId: string;
  skuId: string;
  userId: string;
  planName: string;
  period: string;
  price: number;
  currency: string;
}

export interface CreatePreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  external_reference: string;
}
```

### 2. Endpoint para Webhooks

```typescript
// POST /api/webhooks/mercadopago
export interface WebhookData {
  type: string;
  data: {
    id: string;
    external_reference: string;
    status: string;
    status_detail: string;
    transaction_amount: number;
    payment_method_id: string;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
    };
  };
}
```

### 3. Implementação do Webhook

```typescript
@Post('/webhooks/mercadopago')
async handleWebhook(@Body() data: WebhookData, @Headers('x-signature') signature: string) {
  try {
    // Validar assinatura do webhook
    if (!this.validateWebhookSignature(data, signature)) {
      throw new UnauthorizedException('Assinatura inválida');
    }

    // Processar notificação
    if (data.type === 'payment') {
      const payment = data.data;

      if (payment.status === 'approved') {
        // Ativar assinatura
        await this.subscriptionService.activateSubscription(payment.external_reference);
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        // Cancelar assinatura
        await this.subscriptionService.cancelSubscription(payment.external_reference);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erro no webhook:', error);
    throw new InternalServerErrorException('Erro ao processar webhook');
  }
}
```

## 🔧 Configuração do Frontend

### 1. Instalar Dependências

```bash
npm install @mercadopago/sdk-js
```

### 2. Configurar SDK

```typescript
// src/app/services/mercadopago.service.ts
import { MercadoPago } from '@mercadopago/sdk-js';

export class MercadoPagoService {
  private mp: MercadoPago;

  constructor() {
    this.mp = new MercadoPago(environment.mercadopago.publicKey);
  }

  // ... resto da implementação
}
```

### 3. Integrar com Componente de Assinatura

```typescript
// src/app/dashboard/profile/subscription/subscription.component.ts
async onSubscribe(plan: SubscriptionPlan, sku: SubscriptionSKU): Promise<void> {
  try {
    this.isProcessingPayment = true;

    // Criar preferência no backend
    const preference = await this.subscriptionService.createSubscription({
      userId: this.authService.getCurrentUserId(),
      planId: plan.id,
      skuId: sku.id
    }).toPromise();

    // Redirecionar para checkout
    this.subscriptionService.redirectToCheckout(preference.id);
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    this.showError('Erro ao processar pagamento');
  } finally {
    this.isProcessingPayment = false;
  }
}
```

## 🧪 Testando em Sandbox

### 1. Cartões de Teste

- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 4332 1540 6351
- **Elo**: 6363 6800 0000 0006

### 2. Dados de Teste

- **CVV**: 123
- **Data de Vencimento**: Qualquer data futura
- **Nome**: Qualquer nome
- **CPF**: 12345678901

### 3. Fluxo de Teste

1. Selecionar plano Premium
2. Escolher periodicidade (Mensal/Semestral/Anual)
3. Clicar em "Assinar"
4. Será redirecionado para o checkout do Mercado Pago
5. Usar cartão de teste
6. Após pagamento, será redirecionado para `/subscription/success`

## 🌐 Configuração de Produção

### 1. Alterar Credenciais

- Trocar `TEST-` por `APP-` nas credenciais
- Definir `sandbox: false` no environment
- Configurar webhook URL com HTTPS

### 2. Configurar Webhook

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Adicione URL: `https://seu-dominio.com/api/webhooks/mercadopago`
3. Selecionar eventos: `payment.created`, `payment.updated`

### 3. Configurar URLs de Retorno

No painel do Mercado Pago, configure:

- **Success URL**: `https://seu-dominio.com/dashboard/profile/subscription/success`
- **Failure URL**: `https://seu-dominio.com/dashboard/profile/subscription/failure`
- **Pending URL**: `https://seu-dominio.com/dashboard/profile/subscription/pending`

## 📱 Funcionalidades Implementadas

### ✅ Sistema Completo

- [x] Criação de preferências de pagamento
- [x] Checkout integrado com Mercado Pago
- [x] Processamento de webhooks
- [x] Ativação automática de assinaturas
- [x] Páginas de retorno (success/failure/pending)
- [x] Gestão de assinaturas (cancelar/renovar)
- [x] Suporte a múltiplos planos e SKUs
- [x] Integração com sistema de usuários
- [x] Notificações e feedback visual

### 🔄 Fluxo de Pagamento

1. **Usuário seleciona plano** → Componente de assinatura
2. **Sistema cria preferência** → Backend + Mercado Pago
3. **Redirecionamento para checkout** → Mercado Pago
4. **Usuário realiza pagamento** → Mercado Pago
5. **Webhook recebe notificação** → Backend
6. **Assinatura é ativada** → Sistema interno
7. **Usuário é redirecionado** → Página de sucesso

## 🚨 Tratamento de Erros

### 1. Erros de Pagamento

- Pagamento rejeitado
- Cartão sem limite
- Dados inválidos
- Timeout de sessão

### 2. Erros de Sistema

- Falha na criação de preferência
- Erro no webhook
- Falha na ativação de assinatura
- Problemas de conectividade

### 3. Logs e Monitoramento

```typescript
// Implementar logging estruturado
logger.log('Pagamento processado', {
  paymentId: payment.id,
  status: payment.status,
  amount: payment.transaction_amount,
  userId: payment.external_reference,
});
```

## 🔒 Segurança

### 1. Validação de Webhooks

- Verificar assinatura do webhook
- Validar dados recebidos
- Implementar rate limiting
- Logs de auditoria

### 2. Proteção de Dados

- Não armazenar dados sensíveis
- Criptografar informações críticas
- Implementar HTTPS obrigatório
- Validação de entrada

## 📊 Monitoramento

### 1. Métricas Importantes

- Taxa de conversão
- Tempo de processamento
- Taxa de erro
- Volume de transações

### 2. Alertas

- Falhas no webhook
- Erros de pagamento
- Timeouts de checkout
- Problemas de conectividade

## 🆘 Suporte

### 1. Documentação Oficial

- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [API Reference](https://www.mercadopago.com.br/developers/reference)
- [Webhooks](https://www.mercadopago.com.br/developers/docs/webhooks)

### 2. Comunidade

- [Stack Overflow](https://stackoverflow.com/questions/tagged/mercadopago)
- [GitHub Issues](https://github.com/mercadopago/sdk-nodejs/issues)

### 3. Contato

- **Email**: developers@mercadopago.com
- **Suporte**: https://www.mercadopago.com.br/developers/support

---

**⚠️ Importante**: Sempre teste em sandbox antes de ir para produção. As credenciais de teste não processam pagamentos reais.
