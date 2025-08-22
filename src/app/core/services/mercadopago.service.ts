import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  external_reference: string;
  items: MercadoPagoItem[];
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  notification_url?: string;
  expires: boolean;
  expiration_date_to: string;
}

export interface MercadoPagoItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
  category_id: string;
}

export interface MercadoPagoPayment {
  id: number;
  status: string;
  status_detail: string;
  external_reference: string;
  transaction_amount: number;
  payment_method_id: string;
  payment_type_id: string;
  date_created: string;
  date_approved?: string;
  date_last_modified: string;
  payer: {
    id: number;
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface SubscriptionPayment {
  id: string;
  preferenceId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  amount: number;
  currency: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private readonly API_BASE_URL = 'https://api.mercadopago.com';
  private readonly ACCESS_TOKEN = environment.mercadopago?.accessToken || '';

  constructor() {}

  // Criar preferência de pagamento
  createPreference(subscriptionData: {
    planId: string;
    skuId: string;
    userId: string;
    planName: string;
    period: string;
    price: number;
    currency: string;
  }): Observable<MercadoPagoPreference> {
    const preference = {
      items: [
        {
          id: subscriptionData.skuId,
          title: `Plano ${subscriptionData.planName} - ${subscriptionData.period}`,
          description: `Assinatura do plano ${subscriptionData.planName} por ${subscriptionData.period}`,
          quantity: 1,
          unit_price: subscriptionData.price,
          currency_id: subscriptionData.currency,
          category_id: 'subscription',
        },
      ],
      back_urls: {
        success: `${window.location.origin}/dashboard/profile/subscription/success`,
        failure: `${window.location.origin}/dashboard/profile/subscription/failure`,
        pending: `${window.location.origin}/dashboard/profile/subscription/pending`,
      },
      auto_return: 'approved',
      external_reference: `${subscriptionData.userId}_${
        subscriptionData.skuId
      }_${Date.now()}`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      notification_url: `${environment.apiUrl}/webhooks/mercadopago`,
    };

    // Em produção, isso seria uma chamada para o backend
    // Por enquanto, simulamos a resposta
    return of({
      id: `pref_${Date.now()}`,
      init_point: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref_${Date.now()}`,
      sandbox_init_point: `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=pref_${Date.now()}`,
      external_reference: preference.external_reference,
      items: preference.items,
      back_urls: preference.back_urls,
      auto_return: preference.auto_return,
      expires: preference.expires,
      expiration_date_to: preference.expiration_date_to,
    });
  }

  // Processar pagamento aprovado
  processPayment(paymentId: string): Observable<SubscriptionPayment> {
    // Em produção, isso seria uma chamada para o backend
    const payment: SubscriptionPayment = {
      id: paymentId,
      preferenceId: `pref_${Date.now()}`,
      status: 'approved',
      amount: 29.9,
      currency: 'BRL',
      paymentMethod: 'credit_card',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return of(payment);
  }

  // Verificar status do pagamento
  getPaymentStatus(paymentId: string): Observable<MercadoPagoPayment> {
    // Em produção, isso seria uma chamada para o backend
    const payment: MercadoPagoPayment = {
      id: parseInt(paymentId),
      status: 'approved',
      status_detail: 'accredited',
      external_reference: `user_123_pro_monthly_${Date.now()}`,
      transaction_amount: 29.9,
      payment_method_id: 'credit_card',
      payment_type_id: 'credit_card',
      date_created: new Date().toISOString(),
      date_approved: new Date().toISOString(),
      date_last_modified: new Date().toISOString(),
      payer: {
        id: 123456,
        email: 'user@example.com',
        identification: {
          type: 'CPF',
          number: '12345678901',
        },
      },
    };

    return of(payment);
  }

  // Cancelar assinatura
  cancelSubscription(subscriptionId: string): Observable<boolean> {
    // Em produção, isso seria uma chamada para o backend
    return of(true);
  }

  // Renovar assinatura
  renewSubscription(subscriptionId: string): Observable<boolean> {
    // Em produção, isso seria uma chamada para o backend
    return of(true);
  }

  // Obter histórico de pagamentos
  getPaymentHistory(userId: string): Observable<SubscriptionPayment[]> {
    // Em produção, isso seria uma chamada para o backend
    const payments: SubscriptionPayment[] = [
      {
        id: 'pay_001',
        preferenceId: 'pref_001',
        status: 'approved',
        amount: 29.9,
        currency: 'BRL',
        paymentMethod: 'credit_card',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'pay_002',
        preferenceId: 'pref_002',
        status: 'approved',
        amount: 29.9,
        currency: 'BRL',
        paymentMethod: 'credit_card',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
    ];

    return of(payments);
  }

  // Redirecionar para checkout
  redirectToCheckout(preferenceId: string, isSandbox: boolean = false): void {
    const url = isSandbox
      ? `https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`
      : `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;

    window.location.href = url;
  }

  // Abrir checkout em modal (se disponível)
  openCheckoutModal(preferenceId: string): void {
    // Em produção, isso usaria o SDK do Mercado Pago
    console.log('Abrindo checkout modal para preferência:', preferenceId);
  }

  // Validar webhook
  validateWebhook(data: any, signature: string): boolean {
    // Em produção, isso validaria a assinatura do webhook
    return true;
  }

  // Processar notificação de webhook
  processWebhook(data: any): Observable<boolean> {
    // Em produção, isso processaria a notificação do Mercado Pago
    console.log('Processando webhook:', data);
    return of(true);
  }
}
