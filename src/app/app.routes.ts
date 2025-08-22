import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routing.module').then(m => m.routes),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./legal/terms/terms.component').then(m => m.TermsComponent),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./legal/privacy/privacy.component').then(m => m.PrivacyComponent),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard], // Protege toda a rota dashboard
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        canActivate: [AuthGuard], // Proteção adicional para cada rota filha
        loadComponent: () =>
          import('./dashboard/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'market',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/market/market.component').then(
            m => m.MarketComponent
          ),
      },
      {
        path: 'connections',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/connections/connections.component').then(
            m => m.ConnectionsComponent
          ),
      },
      {
        path: 'notifications',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/notifications/notifications-page.component').then(
            m => m.NotificationsPageComponent
          ),
      },
      {
        path: 'wallet',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/wallet/wallet.component').then(
            m => m.WalletComponent
          ),
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/profile/profile.component').then(
            m => m.ProfileComponent
          ),
      },
      {
        path: 'profile/details',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            './dashboard/profile/profile-details/profile-details.component'
          ).then(m => m.ProfileDetailsComponent),
      },
      {
        path: 'profile/change-password',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/change-password/change-password.component').then(
            m => m.ChangePasswordComponent
          ),
      },
      {
        path: 'profile/about',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/about/about.component').then(
            m => m.AboutComponent
          ),
      },
      {
        path: 'profile/help',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/help/help.component').then(m => m.HelpComponent),
      },
      {
        path: 'profile/subscription',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./dashboard/subscription/subscription.component').then(
            m => m.SubscriptionComponent
          ),
      },
      {
        path: 'profile/subscription/success',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            './dashboard/subscription/subscription-success/subscription-success.component'
          ).then(m => m.SubscriptionSuccessComponent),
      },
      {
        path: 'toast-demo',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./shared/toast-demo/toast-demo.component').then(
            m => m.ToastDemoComponent
          ),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard], // Protege toda a rota admin
    children: [
      {
        path: 'pricing',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./admin/plan-pricing/plan-pricing.component').then(
            m => m.PlanPricingComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
