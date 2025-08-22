import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { BiometricAuthService } from '../../core/services/biometric-auth.service';
import { BiometricCapabilities } from '../../core/models/models';
import { NotificationService } from '../../core/services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-biometric-settings-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  template: `
    <div class="biometric-settings-modal">
      <!-- Header -->
      <div class="modal-header">
        <h2 mat-dialog-title>
          <mat-icon>fingerprint</mat-icon>
          Configurações de Biometria
        </h2>
        <button
          mat-icon-button
          mat-dialog-close
          class="close-button"
          aria-label="Fechar">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Conteúdo -->
      <div class="modal-content">
        @if (isLoading()) {
        <div class="loading-section">
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          <p>Verificando capacidades biométricas...</p>
        </div>
        } @else if (!biometricCapabilities?.isAvailable) {
        <div class="not-available-section">
          <mat-icon class="warning-icon">warning</mat-icon>
          <h3>Biometria Não Disponível</h3>
          <p>
            Este dispositivo não suporta autenticação biométrica ou não possui
            sensores configurados.
          </p>
          <div class="device-info">
            <mat-chip-set>
              <mat-chip>{{ detectPlatform() }}</mat-chip>
              <mat-chip>{{ detectBrowser() }}</mat-chip>
            </mat-chip-set>
          </div>
        </div>
        } @else {
        <!-- Status atual -->
        <div class="status-section">
          <h3>Status Atual</h3>
          <div class="status-grid">
            <div class="status-item">
              <mat-icon [class.available]="biometricCapabilities?.faceId">
                {{ biometricCapabilities?.faceId ? 'face' : 'face_off' }}
              </mat-icon>
              <span>Face ID</span>
              <mat-chip
                [class.available]="biometricCapabilities?.faceId"
                [class.not-available]="!biometricCapabilities?.faceId">
                {{
                  biometricCapabilities?.faceId
                    ? 'Disponível'
                    : 'Não disponível'
                }}
              </mat-chip>
            </div>

            <div class="status-item">
              <mat-icon [class.available]="biometricCapabilities?.touchId">
                {{
                  biometricCapabilities?.touchId
                    ? 'fingerprint'
                    : 'fingerprint_off'
                }}
              </mat-icon>
              <span>Touch ID</span>
              <mat-chip
                [class.available]="biometricCapabilities?.touchId"
                [class.not-available]="!biometricCapabilities?.touchId">
                {{
                  biometricCapabilities?.touchId
                    ? 'Disponível'
                    : 'Não disponível'
                }}
              </mat-chip>
            </div>

            <div class="status-item">
              <mat-icon [class.available]="biometricCapabilities?.fingerprint">
                {{
                  biometricCapabilities?.fingerprint
                    ? 'fingerprint'
                    : 'fingerprint_off'
                }}
              </mat-icon>
              <span>Digital</span>
              <mat-chip
                [class.available]="biometricCapabilities?.fingerprint"
                [class.not-available]="!biometricCapabilities?.fingerprint">
                {{
                  biometricCapabilities?.fingerprint
                    ? 'Disponível'
                    : 'Não disponível'
                }}
              </mat-chip>
            </div>

            <div class="status-item">
              <mat-icon [class.available]="biometricCapabilities?.iris">
                {{
                  biometricCapabilities?.iris ? 'visibility' : 'visibility_off'
                }}
              </mat-icon>
              <span>Íris</span>
              <mat-chip
                [class.available]="biometricCapabilities?.iris"
                [class.not-available]="!biometricCapabilities?.iris">
                {{
                  biometricCapabilities?.iris ? 'Disponível' : 'Não disponível'
                }}
              </mat-chip>
            </div>

            <div class="status-item">
              <mat-icon [class.available]="biometricCapabilities?.voice">
                {{ biometricCapabilities?.voice ? 'mic' : 'mic_off' }}
              </mat-icon>
              <span>Voz</span>
              <mat-chip
                [class.available]="biometricCapabilities?.voice"
                [class.not-available]="!biometricCapabilities?.voice">
                {{
                  biometricCapabilities?.voice ? 'Disponível' : 'Não disponível'
                }}
              </mat-chip>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Configuração -->
        <div class="configuration-section">
          <h3>Configuração</h3>
          @if (biometricEnrolled()) {
          <div class="enrolled-status">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <div class="enrolled-info">
              <h4>Biometria Configurada</h4>
              <p>
                Sua autenticação biométrica está ativa e funcionando. Você pode
                usar para fazer login rapidamente.
              </p>
            </div>
            <button
              mat-stroked-button
              color="warn"
              (click)="onRemoveBiometric()"
              [disabled]="isRemoving()">
              <mat-icon>delete</mat-icon>
              Remover
            </button>
          </div>
          } @else {
          <div class="not-enrolled-status">
            <mat-icon class="info-icon">info</mat-icon>
            <div class="not-enrolled-info">
              <h4>Biometria Não Configurada</h4>
              <p>
                Configure a autenticação biométrica para fazer login de forma
                rápida e segura.
              </p>
            </div>
            <button
              mat-raised-button
              color="primary"
              (click)="onSetupBiometric()"
              [disabled]="isSettingUp()">
              <mat-icon>add</mat-icon>
              Configurar
            </button>
          </div>
          }
        </div>

        <mat-divider></mat-divider>

        <!-- Informações do dispositivo -->
        <div class="device-section">
          <h3>Informações do Dispositivo</h3>
          <div class="device-info-grid">
            <div class="info-item">
              <span class="label">Plataforma:</span>
              <span class="value">{{ detectPlatform() }}</span>
            </div>
            <div class="info-item">
              <span class="label">Navegador:</span>
              <span class="value">{{ detectBrowser() }}</span>
            </div>
            <div class="info-item">
              <span class="label">WebAuthn:</span>
              <span class="value">{{
                isWebAuthnSupported() ? 'Suportado' : 'Não suportado'
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">ID do Dispositivo:</span>
              <span class="value device-id">{{ getDeviceId() }}</span>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button mat-button mat-dialog-close class="cancel-button">
          Fechar
        </button>
        @if (biometricCapabilities?.isAvailable && !biometricEnrolled()) {
        <button
          mat-raised-button
          color="primary"
          (click)="onSetupBiometric()"
          [disabled]="isSettingUp()">
          <mat-icon>fingerprint</mat-icon>
          Configurar Biometria
        </button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./biometric-settings-modal.component.scss'],
})
export class BiometricSettingsModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLoading = signal(false);
  isSettingUp = signal(false);
  isRemoving = signal(false);

  biometricCapabilities: BiometricCapabilities | null = null;
  biometricEnrolled = signal(false);

  constructor(
    private dialogRef: MatDialogRef<BiometricSettingsModalComponent>,
    private biometricAuthService: BiometricAuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkBiometricStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkBiometricStatus(): void {
    this.isLoading.set(true);

    // Verificar capacidades
    this.biometricAuthService
      .getBiometricCapabilities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: capabilities => {
          this.biometricCapabilities = capabilities;

          // Verificar se já está configurado
          this.biometricAuthService
            .isBiometricEnrolled()
            .pipe(takeUntil(this.destroy$))
            .subscribe(enrolled => {
              this.biometricEnrolled.set(enrolled);
              this.isLoading.set(false);
            });
        },
        error: error => {
          console.warn('Erro ao verificar capacidades biométricas:', error);
          this.isLoading.set(false);
        },
      });
  }

  onSetupBiometric(): void {
    this.isSettingUp.set(true);

    this.biometricAuthService
      .authenticate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: biometricRequest => {
          // Simular configuração bem-sucedida
          this.biometricAuthService.setBiometricEnrolled(true);
          this.biometricEnrolled.set(true);
          this.isSettingUp.set(false);

          this.notificationService.showSuccess(
            'Biometria configurada com sucesso! Agora você pode usar para fazer login.'
          );
        },
        error: error => {
          this.isSettingUp.set(false);
          this.notificationService.showError(
            `Erro ao configurar biometria: ${error.message}`
          );
        },
      });
  }

  onRemoveBiometric(): void {
    this.isRemoving.set(true);

    // Simular remoção
    setTimeout(() => {
      this.biometricAuthService.setBiometricEnrolled(false);
      this.biometricEnrolled.set(false);
      this.isRemoving.set(false);

      this.notificationService.showSuccess('Biometria removida com sucesso!');
    }, 1000);
  }

  // Métodos auxiliares
  detectPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/macintosh|mac os x/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    return 'Desconhecido';
  }

  detectBrowser(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/edge/i.test(userAgent)) return 'Edge';
    return 'Desconhecido';
  }

  isWebAuthnSupported(): boolean {
    return !!(
      window.PublicKeyCredential &&
      navigator.credentials &&
      navigator.credentials.create
    );
  }

  getDeviceId(): string {
    let deviceId = localStorage.getItem('stonkz_device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('stonkz_device_id', deviceId);
    }
    return deviceId;
  }

  // Método estático para abrir o modal
  static openModal(dialog: any): any {
    return dialog.open(BiometricSettingsModalComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      panelClass: 'biometric-settings-modal',
    });
  }
}
