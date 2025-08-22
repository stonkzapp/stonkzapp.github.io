import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'wallet',
        loadComponent: () =>
          import('./wallet/wallet.component').then(m => m.WalletComponent),
      },
      {
        path: 'market',
        loadComponent: () =>
          import('./market/market.component').then(m => m.MarketComponent),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./help/help.component').then(m => m.HelpComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./about/about.component').then(m => m.AboutComponent),
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/details', component: ProfileDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
