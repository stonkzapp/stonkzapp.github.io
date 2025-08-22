import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import {
  AdminAuthGuard,
  AdminLoginGuard,
} from './core/guards/admin-auth.guard';

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
        path: 'wallet/manage',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            './dashboard/wallet/manage-wallets/manage-wallets.component'
          ).then(m => m.ManageWalletsComponent),
      },
      {
        path: 'wallet/create',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            './dashboard/wallet/create-wallet/create-wallet.component'
          ).then(m => m.CreateWalletComponent),
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
  // ===== ÁREA ADMINISTRATIVA =====
  {
    path: 'admin/login',
    canActivate: [AdminLoginGuard],
    loadComponent: () =>
      import('./admin/login/admin-login.component').then(
        m => m.AdminLoginComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [AdminAuthGuard],
    loadComponent: () =>
      import('./admin/layout/admin-layout.component').then(
        m => m.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/dashboard/admin-dashboard.component').then(
            m => m.AdminDashboardComponent
          ),
        data: { permissions: ['view_metrics'] },
      },
      {
        path: 'users',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/users/admin-users.component').then(
            m => m.AdminUsersComponent
          ),
        data: { permissions: ['view_users'] },
      },
      {
        path: 'metrics',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/metrics/admin-metrics.component').then(
            m => m.AdminMetricsComponent
          ),
        data: { permissions: ['view_metrics'] },
      },
      {
        path: 'pricing',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/pricing/admin-pricing.component').then(
            m => m.AdminPricingComponent
          ),
        data: { permissions: ['manage_pricing'] },
      },
      {
        path: 'subscriptions',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/subscriptions/admin-subscriptions.component').then(
            m => m.AdminSubscriptionsComponent
          ),
        data: { permissions: ['view_subscriptions'] },
      },
      {
        path: 'transactions',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/transactions/admin-transactions.component').then(
            m => m.AdminTransactionsComponent
          ),
        data: { permissions: ['view_transactions'] },
      },
      {
        path: 'reports',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/reports/admin-reports.component').then(
            m => m.AdminReportsComponent
          ),
        data: { permissions: ['view_metrics'] },
      },
      {
        path: 'settings',
        canActivate: [AdminAuthGuard],
        loadComponent: () =>
          import('./admin/settings/admin-settings.component').then(
            m => m.AdminSettingsComponent
          ),
        data: { permissions: ['system_settings'] },
      },
    ],
  },
  // ===== PLAN PRICING (LEGACY) =====
  {
    path: 'plan-pricing',
    loadComponent: () =>
      import('./admin/plan-pricing/plan-pricing.component').then(
        m => m.PlanPricingComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        m => m.NotFoundComponent
      ),
  },
];
