import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  Router,
  NavigationEnd,
  RouterModule,
} from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Services
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { NotificationService } from '../../core/services/notification.service';

// Models
import { AdminUser, AdminPermission } from '../../core/models/models';

interface AdminMenuItem {
  label: string;
  icon: string;
  route: string;
  permissions?: AdminPermission[];
  badge?: number;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  template: `
    <div class="admin-layout">
      <mat-sidenav-container class="admin-container">
        <!-- Sidebar -->
        <mat-sidenav
          #sidenav
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="!isMobile()"
          class="admin-sidenav">
          <!-- Logo -->
          <div class="admin-logo" (click)="navigateTo('/admin/dashboard')">
            <mat-icon class="logo-icon">admin_panel_settings</mat-icon>
            <span class="logo-text">Stonkz Admin</span>
          </div>

          <!-- User Info -->
          <div class="admin-user-info" *ngIf="currentUser()">
            <div class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser()?.name }}</span>
              <span class="user-role">{{
                getRoleDisplayName(currentUser()?.role)
              }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Navigation Menu -->
          <nav class="admin-nav">
            <ul class="nav-list">
              <li *ngFor="let item of menuItems" class="nav-item">
                <a
                  *ngIf="hasPermissionForMenuItem(item)"
                  [routerLink]="item.route"
                  routerLinkActive="active"
                  class="nav-link"
                  [matTooltip]="item.label"
                  matTooltipPosition="right"
                  (click)="onMenuItemClick()">
                  <mat-icon>{{ item.icon }}</mat-icon>
                  <span class="nav-text">{{ item.label }}</span>
                  <span
                    *ngIf="item.badge"
                    class="nav-badge"
                    [matBadge]="item.badge"
                    matBadgeColor="warn"></span>
                </a>
              </li>
            </ul>
          </nav>

          <mat-divider></mat-divider>

          <!-- Footer -->
          <div class="admin-footer">
            <button mat-button class="footer-button" (click)="goToUserApp()">
              <mat-icon>launch</mat-icon>
              <span>Ir para App</span>
            </button>
          </div>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="admin-content">
          <!-- Top Toolbar -->
          <mat-toolbar class="admin-toolbar">
            <!-- Menu Button (Mobile) -->
            <button
              *ngIf="isMobile()"
              mat-icon-button
              (click)="sidenav.toggle()"
              class="menu-button">
              <mat-icon>menu</mat-icon>
            </button>

            <!-- Page Title -->
            <span class="page-title">{{ pageTitle() }}</span>

            <!-- Spacer -->
            <span class="toolbar-spacer"></span>

            <!-- Notifications -->
            <button
              mat-icon-button
              class="notification-button"
              [matBadge]="notificationCount()"
              [matBadgeHidden]="notificationCount() === 0"
              matBadgeColor="warn"
              matTooltip="Notificações">
              <mat-icon>notifications</mat-icon>
            </button>

            <!-- User Menu -->
            <button
              mat-icon-button
              [matMenuTriggerFor]="userMenu"
              class="user-menu-button">
              <mat-icon>account_circle</mat-icon>
            </button>

            <!-- User Dropdown Menu -->
            <mat-menu #userMenu="matMenu" class="user-menu">
              <div class="user-menu-header">
                <div class="user-info">
                  <strong>{{ currentUser()?.name }}</strong>
                  <small>{{ currentUser()?.email }}</small>
                </div>
              </div>

              <mat-divider></mat-divider>

              <button mat-menu-item (click)="onProfileClick()">
                <mat-icon>person</mat-icon>
                <span>Perfil</span>
              </button>

              <button mat-menu-item (click)="onSettingsClick()">
                <mat-icon>settings</mat-icon>
                <span>Configurações</span>
              </button>

              <mat-divider></mat-divider>

              <button mat-menu-item (click)="onLogout()" class="logout-item">
                <mat-icon>logout</mat-icon>
                <span>Sair</span>
              </button>
            </mat-menu>
          </mat-toolbar>

          <!-- Page Content -->
          <div class="page-content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isMobile = signal(false);
  currentUser = signal<AdminUser | null>(null);
  pageTitle = signal('Dashboard');
  notificationCount = signal(3); // Mock

  menuItems: AdminMenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard',
    },
    {
      label: 'Usuários',
      icon: 'people',
      route: '/admin/users',
      permissions: ['view_users'],
    },
    {
      label: 'Métricas',
      icon: 'analytics',
      route: '/admin/metrics',
      permissions: ['view_metrics'],
    },
    {
      label: 'Preços',
      icon: 'attach_money',
      route: '/admin/pricing',
      permissions: ['manage_pricing'],
    },
    {
      label: 'Assinaturas',
      icon: 'card_membership',
      route: '/admin/subscriptions',
      permissions: ['view_subscriptions'],
    },
    {
      label: 'Transações',
      icon: 'payment',
      route: '/admin/transactions',
      permissions: ['view_transactions'],
    },
    {
      label: 'Relatórios',
      icon: 'assessment',
      route: '/admin/reports',
      permissions: ['view_metrics'],
    },
    {
      label: 'Configurações',
      icon: 'settings',
      route: '/admin/settings',
      permissions: ['system_settings'],
    },
  ];

  private readonly routes: { [key: string]: string } = {
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'Gerenciar Usuários',
    '/admin/metrics': 'Métricas Detalhadas',
    '/admin/pricing': 'Gerenciar Preços',
    '/admin/subscriptions': 'Gerenciar Assinaturas',
    '/admin/transactions': 'Gerenciar Transações',
    '/admin/reports': 'Relatórios',
    '/admin/settings': 'Configurações do Sistema',
  };

  constructor(
    private adminAuthService: AdminAuthService,
    private notificationService: NotificationService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // Monitorar usuário atual
    this.adminAuthService.currentAdminUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser.set(user);
      });

    // Monitorar mudanças de breakpoint
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });

    // Monitorar mudanças de rota para atualizar título
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle(event.url);
      });

    // Definir título inicial
    this.updatePageTitle(this.router.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePageTitle(url: string): void {
    this.pageTitle.set(this.routes[url] || 'Painel Administrativo');
  }

  hasPermissionForMenuItem(item: AdminMenuItem): boolean {
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }
    return this.adminAuthService.hasPermissions(item.permissions);
  }

  getRoleDisplayName(role: string | undefined): string {
    const roleNames = {
      super_admin: 'Super Administrador',
      admin: 'Administrador',
      analyst: 'Analista',
    };
    return roleNames[role as keyof typeof roleNames] || 'Usuário';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onMenuItemClick(): void {
    // Fechar sidebar no mobile após clicar
    if (this.isMobile()) {
      // Implementar fechamento do sidenav se necessário
    }
  }

  goToUserApp(): void {
    window.open('/', '_blank');
  }

  onProfileClick(): void {
    this.notificationService.showInfo(
      'Perfil administrativo em desenvolvimento'
    );
  }

  onSettingsClick(): void {
    this.router.navigate(['/admin/settings']);
  }

  onLogout(): void {
    this.adminAuthService.logout().subscribe({
      next: () => {
        this.notificationService.showSuccess('Logout realizado com sucesso');
        this.router.navigate(['/admin/login']);
      },
      error: error => {
        console.error('Erro no logout:', error);
        this.notificationService.showError('Ocorreu um erro ao fazer logout');
      },
    });
  }
}
