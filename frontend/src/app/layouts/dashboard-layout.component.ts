import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TranslationService } from '../core/services/translation.service';
import { IconComponent } from '../shared/components/icon.component';
import { LanguageSwitcherComponent } from '../shared/components/language-switcher.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent, LanguageSwitcherComponent],
  template: `
    <div class="min-h-screen bg-slate-950 flex font-sans antialiased text-slate-100">
      <!-- Mobile Backdrop -->
      <div
        *ngIf="sidebarOpen()"
        (click)="sidebarOpen.set(false)"
        class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
      ></div>

      <!-- Collapsible Sidebar -->
      <aside
        [ngClass]="{
          'translate-x-0': sidebarOpen(),
          '-translate-x-full lg:translate-x-0': !sidebarOpen()
        }"
        class="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:static"
      >
        <!-- Logo & Brand Header -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold text-lg">
              T
            </div>
            <div>
              <span class="font-semibold text-base tracking-tight text-white">Tender<span class="text-brand-400">AI</span></span>
              <span class="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                {{ i18n.t('brand.tagline') }}
              </span>
            </div>
          </div>

          <button
            (click)="sidebarOpen.set(false)"
            class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
          >
            <app-icon name="x" [size]="18"></app-icon>
          </button>
        </div>

        <!-- Quick Action Button -->
        <div class="p-4">
          <a
            routerLink="/proposals/wizard"
            class="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-medium text-sm rounded-lg shadow-md shadow-brand-600/20 transition-all duration-150 border border-brand-500/30"
          >
            <app-icon name="sparkles" [size]="16"></app-icon>
            <span>{{ i18n.t('nav.newProposal') }}</span>
          </a>
        </div>

        <!-- Nav Navigation Links -->
        <nav class="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-brand-500/10 text-brand-300 border-brand-500/30"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-colors"
          >
            <app-icon name="dashboard" [size]="18"></app-icon>
            <span>{{ i18n.t('nav.dashboard') }}</span>
          </a>

          <a
            routerLink="/proposals/wizard"
            routerLinkActive="bg-brand-500/10 text-brand-300 border-brand-500/30"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-colors"
          >
            <app-icon name="sparkles" [size]="18"></app-icon>
            <span>{{ i18n.t('nav.wizard') }}</span>
          </a>

          <a
            routerLink="/proposals"
            routerLinkActive="bg-brand-500/10 text-brand-300 border-brand-500/30"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-colors"
          >
            <app-icon name="file-text" [size]="18"></app-icon>
            <span>{{ i18n.t('nav.allProposals') }}</span>
          </a>

          <a
            routerLink="/profile"
            routerLinkActive="bg-brand-500/10 text-brand-300 border-brand-500/30"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-colors"
          >
            <app-icon name="building" [size]="18"></app-icon>
            <span>{{ i18n.t('nav.agencyProfile') }}</span>
          </a>

          <a
            routerLink="/billing"
            routerLinkActive="bg-brand-500/10 text-brand-300 border-brand-500/30"
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-colors"
          >
            <app-icon name="credit-card" [size]="18"></app-icon>
            <span>{{ i18n.t('nav.billing') }}</span>
          </a>
        </nav>

        <!-- European Compliance Badge -->
        <div class="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div class="flex items-center space-x-2 text-xs font-medium text-slate-300 mb-1">
            <app-icon name="shield-check" [size]="14" classNames="text-emerald-400"></app-icon>
            <span>{{ i18n.t('brand.compliance') }}</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-tight">
            {{ i18n.t('brand.complianceDesc') }}
          </p>
        </div>

        <!-- User Profile Card & Sign Out -->
        <div class="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 truncate">
              <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
                {{ userInitials() }}
              </div>
              <div class="truncate">
                <div class="text-xs font-medium text-slate-200 truncate">{{ auth.currentUserSignal()?.fullName || 'User' }}</div>
                <div class="flex items-center space-x-1.5 mt-0.5">
                  <span
                    [ngClass]="{
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': auth.userTier() === 'AGENCY',
                      'bg-brand-500/10 text-brand-400 border-brand-500/20': auth.userTier() === 'PRO',
                      'bg-slate-800 text-slate-400 border-slate-700': auth.userTier() === 'FREE'
                    }"
                    class="text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase"
                  >
                    {{ auth.userTier() }}
                  </span>
                </div>
              </div>
            </div>

            <button
              (click)="auth.logout()"
              title="Sign out"
              class="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <app-icon name="log-out" [size]="16"></app-icon>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top App Bar -->
        <header class="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-6 z-10">
          <div class="flex items-center space-x-4">
            <button
              (click)="sidebarOpen.set(!sidebarOpen())"
              class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            >
              <app-icon name="menu" [size]="20"></app-icon>
            </button>
            <div class="flex items-center space-x-2 text-xs text-slate-400">
              <span>TenderAI</span>
              <span>/</span>
              <span class="text-slate-200 font-medium capitalize">{{ currentRouteTitle() }}</span>
            </div>
          </div>

          <!-- Right Action Bar: Language Switcher, Plan badge, CTA -->
          <div class="flex items-center space-x-3">
            <!-- Language Switcher Dropdown -->
            <app-language-switcher></app-language-switcher>

            <a
              routerLink="/billing"
              class="hidden sm:inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 transition-colors"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{{ i18n.t('nav.plan') }}: <strong class="text-white">{{ auth.userTier() }}</strong></span>
            </a>

            <a
              routerLink="/proposals/wizard"
              class="inline-flex items-center space-x-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm"
            >
              <app-icon name="plus" [size]="14"></app-icon>
              <span>{{ i18n.t('nav.newProposal') }}</span>
            </a>
          </div>
        </header>

        <!-- Page View Outlet -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  auth = inject(AuthService);
  i18n = inject(TranslationService);
  router = inject(Router);
  sidebarOpen = signal(false);

  userInitials(): string {
    const name = this.auth.currentUserSignal()?.fullName || 'User';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  currentRouteTitle(): string {
    const url = this.router.url.split('?')[0];
    if (url.includes('/wizard')) return this.i18n.t('nav.wizard');
    if (url.includes('/proposals/')) return this.i18n.t('dashboard.editOffer');
    if (url.includes('/proposals')) return this.i18n.t('nav.allProposals');
    if (url.includes('/profile')) return this.i18n.t('nav.agencyProfile');
    if (url.includes('/billing')) return this.i18n.t('nav.billing');
    return this.i18n.t('nav.dashboard');
  }
}
