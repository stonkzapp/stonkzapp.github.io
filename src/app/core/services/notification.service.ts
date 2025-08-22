import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface ToastAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface ToastOptions {
  title?: string;
  duration?: number;
  showProgressBar?: boolean;
  closeButton?: boolean;
  tapToDismiss?: boolean;
  actions?: ToastAction[];
  icon?: string;
  position?:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-full-width';
  customClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  private getDefaultPosition(): string {
    return this.isMobile() ? 'toast-bottom-full-width' : 'toast-top-right';
  }

  private getDefaultOptions(options: ToastOptions = {}): any {
    return {
      timeOut: options.duration || 6000,
      closeButton: options.closeButton !== false,
      progressBar: options.showProgressBar !== false,
      tapToDismiss: options.tapToDismiss !== false,
      positionClass: options.position || this.getDefaultPosition(),
      easeTime: 300,
      enableHtml: true,
      extendedTimeOut: 1000,
      preventDuplicates: true,
      newestOnTop: true,
      ...options,
    };
  }

  // ===== TOASTS BÁSICOS =====

  showSuccess(message: string, options: ToastOptions = {}) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || 'Sucesso',
      duration: 5000,
      ...options,
    });

    this.toastr.success(message, toastOptions.title, toastOptions);
  }

  showError(message: string, options: ToastOptions = {}) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || 'Erro',
      duration: 8000,
      ...options,
    });

    this.toastr.error(message, toastOptions.title, toastOptions);
  }

  showInfo(message: string, options: ToastOptions = {}) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || 'Informação',
      duration: 6000,
      ...options,
    });

    this.toastr.info(message, toastOptions.title, toastOptions);
  }

  showWarning(message: string, options: ToastOptions = {}) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || 'Aviso',
      duration: 7000,
      ...options,
    });

    this.toastr.warning(message, toastOptions.title, toastOptions);
  }

  // ===== TOASTS ESPECIAIS =====

  showPremium(message: string, options: ToastOptions = {}) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '🎉 PRO',
      duration: 8000,
      customClass: 'toast-premium',
      ...options,
    });

    this.toastr.info(message, toastOptions.title, toastOptions);
  }

  showAchievement(message: string, options: ToastOptions = {}) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '🏆 Conquista',
      duration: 10000,
      customClass: 'toast-achievement',
      ...options,
    });

    this.toastr.info(message, toastOptions.title, toastOptions);
  }

  showWelcome(
    message: string = 'Bem-vindo de volta!',
    options: ToastOptions = {}
  ) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '👋 Olá!',
      duration: 5000,
      customClass: 'toast-premium',
      ...options,
    });

    this.toastr.success(message, toastOptions.title, toastOptions);
  }

  // ===== TOASTS DE SISTEMA =====

  showSystemUpdate(
    message: string = 'Sistema atualizado com sucesso!',
    options: ToastOptions = {}
  ) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '🔄 Sistema',
      duration: 6000,
      customClass: 'toast-info',
      ...options,
    });

    this.toastr.info(message, toastOptions.title, toastOptions);
  }

  showDataSync(
    message: string = 'Dados sincronizados!',
    options: ToastOptions = {}
  ) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '📡 Sincronização',
      duration: 4000,
      customClass: 'toast-success',
      ...options,
    });

    this.toastr.success(message, toastOptions.title, toastOptions);
  }

  showConnectionStatus(isConnected: boolean, options: ToastOptions = {}) {
    if (isConnected) {
      this.showSuccess('Conexão restaurada!', {
        title: '🌐 Conectado',
        ...options,
      });
    } else {
      this.showWarning('Conexão perdida. Verificando...', {
        title: '🌐 Desconectado',
        ...options,
      });
    }
  }

  // ===== TOASTS DE VALIDAÇÃO =====

  showValidationError(
    field: string,
    message: string,
    options: ToastOptions = {}
  ) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '⚠️ Validação',
      duration: 6000,
      customClass: 'toast-warning',
      ...options,
    });

    this.toastr.warning(
      `${field}: ${message}`,
      toastOptions.title,
      toastOptions
    );
  }

  showFormSuccess(
    message: string = 'Formulário enviado com sucesso!',
    options: ToastOptions = {}
  ) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '✅ Formulário',
      duration: 5000,
      customClass: 'toast-success',
      ...options,
    });

    this.toastr.success(message, toastOptions.title, toastOptions);
  }

  // ===== TOASTS DE AÇÃO =====

  showActionRequired(
    message: string,
    actions: ToastAction[],
    options: ToastOptions = {}
  ) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || '⚡ Ação Necessária',
      duration: 15000,
      customClass: 'toast-with-actions',
      showProgressBar: false,
      ...options,
    });

    // Adicionar ações ao toast
    const messageWithActions = this.addActionsToMessage(message, actions);

    this.toastr.info(messageWithActions, toastOptions.title, toastOptions);
  }

  showConfirmation(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options: ToastOptions = {}
  ) {
    const actions: ToastAction[] = [
      {
        label: 'Confirmar',
        action: onConfirm,
        style: 'primary',
      },
    ];

    if (onCancel) {
      actions.push({
        label: 'Cancelar',
        action: onCancel,
        style: 'secondary',
      });
    }

    this.showActionRequired(message, actions, {
      title: options.title || '❓ Confirmação',
      duration: 12000,
      ...options,
    });
  }

  // ===== TOASTS DE PROGRESSO =====

  showProgress(message: string, progress: number, options: ToastOptions = {}) {
    const progressBar = `<div class="progress-bar" style="width: ${progress}%; height: 4px; background: rgba(255,255,255,0.8); border-radius: 2px; margin-top: 8px;"></div>`;
    const messageWithProgress = `${message} ${progressBar}`;

    const toastOptions = this.getDefaultOptions({
      title: options.title || '⏳ Progresso',
      duration: 0, // Não fecha automaticamente
      showProgressBar: false,
      ...options,
    });

    this.toastr.info(messageWithProgress, toastOptions.title, toastOptions);
  }

  // ===== TOASTS DE NOTIFICAÇÃO =====

  showNotification(
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    options: ToastOptions = {}
  ) {
    const toastOptions = this.getDefaultOptions({
      title: options.title || title,
      duration: 6000,
      ...options,
    });

    switch (type) {
      case 'success':
        this.toastr.success(message, toastOptions.title, toastOptions);
        break;
      case 'error':
        this.toastr.error(message, toastOptions.title, toastOptions);
        break;
      case 'warning':
        this.toastr.warning(message, toastOptions.title, toastOptions);
        break;
      default:
        this.toastr.info(message, toastOptions.title, toastOptions);
    }
  }

  // ===== TOASTS DE FEEDBACK =====

  showFeedback(message: string, rating?: number, options: ToastOptions = {}) {
    let title = '💬 Feedback';
    if (rating !== undefined) {
      title = rating >= 4 ? '😊 Ótimo!' : rating >= 3 ? '🙂 Bom' : '😐 Regular';
    }

    const toastOptions = this.getDefaultOptions({
      title: options.title || title,
      duration: 8000,
      customClass: 'toast-premium',
      ...options,
    });

    this.toastr.info(message, toastOptions.title, toastOptions);
  }

  // ===== MÉTODOS AUXILIARES =====

  private addActionsToMessage(message: string, actions: ToastAction[]): string {
    if (!actions || actions.length === 0) return message;

    let actionsHtml = '<div class="toast-actions">';
    actions.forEach(action => {
      const buttonClass = action.style || 'primary';
      actionsHtml += `<button class="toast-action-btn toast-action-${buttonClass}" onclick="this.dispatchEvent(new CustomEvent('toast-action', {detail: '${action.label}'}))">${action.label}</button>`;
    });
    actionsHtml += '</div>';

    return `${message}${actionsHtml}`;
  }

  // ===== MÉTODOS DE UTILIDADE =====

  clearAll() {
    this.toastr.clear();
  }

  clearByType(type: 'success' | 'error' | 'info' | 'warning') {
    // ngx-toastr não tem método clear por tipo, então vamos limpar todos
    this.toastr.clear();
  }

  // ===== TOASTS RÁPIDOS =====

  quickSuccess(message: string) {
    this.showSuccess(message, { duration: 3000 });
  }

  quickError(message: string) {
    this.showError(message, { duration: 4000 });
  }

  quickInfo(message: string) {
    this.showInfo(message, { duration: 3000 });
  }

  quickWarning(message: string) {
    this.showWarning(message, { duration: 4000 });
  }

  // ===== TOASTS DE TESTE =====

  showTestToast() {
    this.showSuccess('Este é um toast de teste!', { title: '🧪 Teste' });
  }

  showAllTypes() {
    setTimeout(() => this.showSuccess('Toast de sucesso!'), 100);
    setTimeout(() => this.showError('Toast de erro!'), 1000);
    setTimeout(() => this.showInfo('Toast de informação!'), 2000);
    setTimeout(() => this.showWarning('Toast de aviso!'), 3000);
    setTimeout(() => this.showPremium('Toast PRO!'), 4000);
    setTimeout(() => this.showAchievement('Toast de conquista!'), 5000);
  }
}
