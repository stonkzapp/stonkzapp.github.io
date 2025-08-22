import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../core/services/theme.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { MobileMenuComponent } from '../shared/mobile-menu/mobile-menu.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../core/services/form-validation.service';
import { PasswordInputComponent } from '../shared/password-input/password-input.component';
import { UserService } from '../core/services/user.service';
import { UserProfile } from '../core/models/models';
import { RegistrationService } from '../core/services/registration.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
    FormsModule,
    MobileMenuComponent,
    HeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  form: any;
  userProfile: any;
  viaCep: any;
  currentPageTitle = signal('Dashboard');
  shouldShowBack = signal(false);

  constructor(
    private themeService: ThemeService,
    private formValidation: FormValidationService,
    private userService: UserService,
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageInfo(event.url);
      });
  }

  private updatePageInfo(url: string): void {
    // Mapear URLs para títulos de página
    const pageTitles: { [key: string]: string } = {
      '/dashboard/home': 'Dashboard',
      '/dashboard/wallet': 'Carteira',
      '/dashboard/connections': 'Conexões',
      '/dashboard/notifications': 'Notificações',
      '/dashboard/market': 'Mercado',
      '/dashboard/profile': 'Meu Perfil',
      '/dashboard/profile/details': 'Detalhes do Perfil',
      '/dashboard/profile/change-password': 'Alterar Senha',
      '/dashboard/profile/about': 'Sobre nós',
      '/dashboard/profile/help': 'Ajuda',
      '/dashboard/profile/subscription': 'Assinatura',
      '/dashboard/profilesubscription/success': 'Sucesso na Assinatura',
      '/dashboard/admin/pricing': 'Preços',
      '/dashboard/toast-demo': 'Demo Toast',
    };

    // Determinar se deve mostrar botão voltar
    const shouldShowBack = url.split('/').length > 3; // Mais de 3 níveis de rota

    this.currentPageTitle.set(pageTitles[url] || 'Dashboard');
    this.shouldShowBack.set(shouldShowBack);
  }

  getCurrentPageTitle(): string {
    return this.currentPageTitle();
  }

  shouldShowBackButton(): boolean {
    return this.shouldShowBack();
  }

  // Método para alternar o tema
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Verificar se o modo escuro está ativado
  isDarkMode(): boolean {
    return this.themeService.isDarkModeEnabled();
  }

  onSubmit() {
    if (this.form.valid) {
      alert('Formulário enviado com sucesso!');
    }
  }
}
