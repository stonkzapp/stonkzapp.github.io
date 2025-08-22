import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { WalletService } from '../../../core/services/wallet.service';
import { CreateWalletRequest } from '../../../core/models/models';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-create-wallet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  template: `
    <div class="create-wallet-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>account_balance_wallet</mat-icon>
          Nova Carteira
        </h2>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form
        [formGroup]="walletForm"
        (ngSubmit)="onSubmit()"
        class="wallet-form">
        <!-- Nome da Carteira -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome da Carteira</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="Ex: Carteira Conservadora"
            maxlength="50" />
          <mat-hint
            >{{ walletForm.get('name')?.value?.length || 0 }}/50</mat-hint
          >
          <mat-error *ngIf="walletForm.get('name')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
          <mat-error *ngIf="walletForm.get('name')?.hasError('minlength')">
            Nome deve ter pelo menos 3 caracteres
          </mat-error>
        </mat-form-field>

        <!-- Descrição (Opcional) -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição (opcional)</mat-label>
          <textarea
            matInput
            formControlName="description"
            placeholder="Descreva o objetivo desta carteira"
            rows="3"
            maxlength="200"></textarea>
          <mat-hint
            >{{
              walletForm.get('description')?.value?.length || 0
            }}/200</mat-hint
          >
        </mat-form-field>

        <!-- Cor da Carteira -->
        <div class="color-selection">
          <label class="color-label">Cor da Carteira</label>
          <div class="color-grid">
            <div
              *ngFor="let color of availableColors"
              class="color-option"
              [class.selected]="walletForm.get('color')?.value === color"
              [style.background-color]="color"
              (click)="selectColor(color)">
              <mat-icon
                *ngIf="walletForm.get('color')?.value === color"
                class="check-icon">
                check
              </mat-icon>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div mat-dialog-actions class="dialog-actions">
          <button
            type="button"
            mat-button
            mat-dialog-close
            class="cancel-button">
            Cancelar
          </button>
          <button
            type="submit"
            mat-raised-button
            color="primary"
            [disabled]="walletForm.invalid || isLoading"
            class="create-button">
            <mat-icon *ngIf="isLoading" class="loading-icon">refresh</mat-icon>
            <mat-icon *ngIf="!isLoading">add</mat-icon>
            {{ isLoading ? 'Criando...' : 'Criar Carteira' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./create-wallet.component.scss'],
})
export class CreateWalletComponent implements OnDestroy {
  walletForm: FormGroup;
  availableColors: string[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogRef?: MatDialogRef<CreateWalletComponent>
  ) {
    this.availableColors = this.walletService.getAvailableColors();
    this.walletForm = this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: ['', [Validators.maxLength(200)]],
      color: [this.availableColors[0], [Validators.required]],
    });
  }

  selectColor(color: string): void {
    this.walletForm.patchValue({ color });
  }

  onSubmit(): void {
    if (this.walletForm.valid && !this.isLoading) {
      this.isLoading = true;

      const request: CreateWalletRequest = {
        name: this.walletForm.value.name.trim(),
        description: this.walletForm.value.description?.trim() || '',
        color: this.walletForm.value.color,
      };

      this.walletService
        .createWallet(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: wallet => {
            this.notificationService.showSuccess(
              `Carteira "${wallet.name}" criada com sucesso!`
            );

            // Definir como carteira ativa
            this.walletService.setCurrentWallet(wallet);

            // Fechar modal se estiver em modal
            if (this.dialogRef) {
              this.dialogRef.close(wallet);
            } else {
              // Navegar de volta se for página
              this.router.navigate(['/dashboard/wallet']);
            }
          },
          error: error => {
            console.error('Erro ao criar carteira:', error);
            this.notificationService.showError(
              error.message || 'Erro ao criar carteira. Tente novamente.'
            );
            this.isLoading = false;
          },
        });
    }
  }

  // Método para abrir como modal
  static openModal(dialog: any): any {
    return dialog.open(CreateWalletComponent, {
      width: '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      panelClass: 'create-wallet-dialog',
    });
  }
}
