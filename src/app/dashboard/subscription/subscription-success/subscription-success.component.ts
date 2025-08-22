import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'stz-subscription-success',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ButtonComponent,
  ],
  templateUrl: './subscription-success.component.html',
  styleUrls: ['./subscription-success.component.scss'],
})
export class SubscriptionSuccessComponent implements OnInit {
  paymentId: string | null = null;
  isLoading = true;
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    // Obter parâmetros da URL
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment_id'] || params['preference_id'];

      if (this.paymentId) {
        this.processPayment();
      } else {
        this.isLoading = false;
        this.isSuccess = false;
      }
    });
  }

  private processPayment(): void {
    if (!this.paymentId) return;

    // Processar pagamento aprovado
    this.subscriptionService.processApprovedPayment(this.paymentId).subscribe({
      next: subscription => {
        this.isLoading = false;
        this.isSuccess = true;

        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 5000);
      },
      error: error => {
        console.error('Erro ao processar pagamento:', error);
        this.isLoading = false;
        this.isSuccess = false;
      },
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToProfile(): void {
    this.router.navigate(['/dashboard/profile']);
  }

  getNextPaymentDate(): Date {
    // Retorna a data do próximo pagamento (30 dias a partir de hoje)
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
}
