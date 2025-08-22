import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { UserProfile, UserSubscription } from '../../core/models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stz-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userProfile: UserProfile | null = null;
  hasActiveSubscription = false;
  private subscription = new Subscription();

  constructor(
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.checkSubscriptionStatus();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadUserProfile(): void {
    this.subscription.add(
      this.userService.getUserProfile().subscribe({
        next: (profile: UserProfile) => {
          this.userProfile = profile;
        },
        error: (error: any) => {
          console.error('Erro ao carregar perfil:', error);
        },
      })
    );
  }

  private checkSubscriptionStatus(): void {
    // Simular verificação de assinatura ativa
    this.subscription.add(
      this.subscriptionService.getCurrentSubscription('user-123').subscribe({
        next: (subscription: UserSubscription | null) => {
          this.hasActiveSubscription = subscription?.status === 'active';
        },
        error: (error: any) => {
          console.error('Erro ao verificar assinatura:', error);
        },
      })
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
