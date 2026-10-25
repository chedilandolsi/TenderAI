import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth routes
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/oauth2/callback',
    loadComponent: () => import('./pages/auth/oauth2-callback.component').then(m => m.OAuth2CallbackComponent)
  },
  {
    path: 'auth/verify-email',
    loadComponent: () => import('./pages/auth/verify-email.component').then(m => m.VerifyEmailComponent)
  },

  // Authenticated Dashboard Layout
  {
    path: '',
    loadComponent: () => import('./layouts/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'proposals',
        loadComponent: () => import('./pages/proposals/proposal-list.component').then(m => m.ProposalListComponent)
      },
      {
        path: 'proposals/wizard',
        loadComponent: () => import('./pages/proposals/wizard.component').then(m => m.WizardComponent)
      },
      {
        path: 'proposals/:id',
        loadComponent: () => import('./pages/proposals/proposal-detail.component').then(m => m.ProposalDetailComponent)
      },
      {
        path: 'billing',
        loadComponent: () => import('./pages/billing/billing.component').then(m => m.BillingComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
