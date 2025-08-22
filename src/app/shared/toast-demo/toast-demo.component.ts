import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  NotificationService,
  ToastAction,
} from '../../core/services/notification.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'stz-toast-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ButtonComponent,
  ],
  templateUrl: './toast-demo.component.html',
  styleUrls: ['./toast-demo.component.scss'],
})
export class ToastDemoComponent {
  constructor(private notificationService: NotificationService) {}

  // ===== TOASTS BÁSICOS =====

  showSuccessToast() {
    this.notificationService.showSuccess('Operação realizada com sucesso!');
  }

  showErrorToast() {
    this.notificationService.showError('Ocorreu um erro inesperado!');
  }

  showInfoToast() {
    this.notificationService.showInfo('Nova funcionalidade disponível!');
  }

  showWarningToast() {
    this.notificationService.showWarning('Atenção: dados não salvos!');
  }

  // ===== TOASTS ESPECIAIS =====

  showPremiumToast() {
    this.notificationService.showPremium('Você desbloqueou recursos PRO!');
  }

  showAchievementToast() {
    this.notificationService.showAchievement(
      'Parabéns! Nova conquista desbloqueada!'
    );
  }

  showWelcomeToast() {
    this.notificationService.showWelcome('Bem-vindo ao Stonkz!');
  }

  // ===== TOASTS DE SISTEMA =====

  showSystemUpdate() {
    this.notificationService.showSystemUpdate('Nova versão disponível: v2.1.0');
  }

  showDataSync() {
    this.notificationService.showDataSync(
      'Portfólio sincronizado com sucesso!'
    );
  }

  showConnectionStatus() {
    this.notificationService.showConnectionStatus(true);
  }

  // ===== TOASTS DE VALIDAÇÃO =====

  showValidationError() {
    this.notificationService.showValidationError('Email', 'Formato inválido');
  }

  showFormSuccess() {
    this.notificationService.showFormSuccess('Perfil atualizado com sucesso!');
  }

  // ===== TOASTS DE AÇÃO =====

  showActionRequired() {
    const actions: ToastAction[] = [
      {
        label: 'Aceitar',
        action: () => this.notificationService.showSuccess('Ação aceita!'),
        style: 'primary',
      },
      {
        label: 'Recusar',
        action: () => this.notificationService.showInfo('Ação recusada'),
        style: 'secondary',
      },
    ];

    this.notificationService.showActionRequired(
      'Deseja continuar com esta operação?',
      actions
    );
  }

  showConfirmation() {
    this.notificationService.showConfirmation(
      'Tem certeza que deseja excluir este item?',
      () => this.notificationService.showSuccess('Item excluído!'),
      () => this.notificationService.showInfo('Operação cancelada')
    );
  }

  // ===== TOASTS DE PROGRESSO =====

  showProgressToast() {
    this.notificationService.showProgress('Sincronizando dados...', 75);
  }

  // ===== TOASTS DE NOTIFICAÇÃO =====

  showCustomNotification() {
    this.notificationService.showNotification(
      '🎯 Meta Atingida',
      'Você alcançou sua meta mensal de investimentos!',
      'success'
    );
  }

  // ===== TOASTS DE FEEDBACK =====

  showFeedbackToast() {
    this.notificationService.showFeedback('Como foi sua experiência hoje?', 5);
  }

  // ===== TOASTS RÁPIDOS =====

  showQuickToasts() {
    this.notificationService.quickSuccess('Sucesso rápido!');
    this.notificationService.quickInfo('Info rápida!');
    this.notificationService.quickWarning('Aviso rápido!');
  }

  // ===== TOASTS DE TESTE =====

  showTestToast() {
    this.notificationService.showTestToast();
  }

  showAllTypes() {
    this.notificationService.showAllTypes();
  }

  // ===== UTILIDADES =====

  clearAllToasts() {
    this.notificationService.clearAll();
  }
}
