import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BillingService } from '../../core/services/billing.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/components/icon.component';
import { SubscriptionTier } from '../../models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">{{ i18n.t('billing.title') }}</h1>
        <p class="text-xs text-slate-400 mt-1">
          {{ i18n.t('billing.subtitle') }}
        </p>
      </div>

      <!-- Success / Cancel Alert -->
      <div *ngIf="successMessage()" class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center space-x-2">
        <app-icon name="check" [size]="18" classNames="text-emerald-400"></app-icon>
        <span>{{ successMessage() }}</span>
      </div>

      <!-- Pricing Plans Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- FREE PLAN -->
        <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ i18n.t('billing.freeTitle') }}</span>
              <span *ngIf="auth.userTier() === 'FREE'" class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {{ i18n.t('billing.currentPlan') }}
              </span>
            </div>

            <div>
              <div class="text-3xl font-bold text-white">{{ i18n.t('billing.freePrice') }}</div>
              <div class="text-xs text-slate-500 mt-0.5">{{ i18n.t('billing.freeForever') }}</div>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed">
              {{ i18n.t('billing.freeDesc') }}
            </p>

            <ul class="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-brand-400"></app-icon>
                <span>{{ i18n.t('billing.freeFeat1') }}</span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-brand-400"></app-icon>
                <span>{{ i18n.t('billing.freeFeat2') }}</span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-brand-400"></app-icon>
                <span>{{ i18n.t('billing.freeFeat3') }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-6">
            <button
              disabled
              class="w-full py-2.5 rounded-xl text-xs font-medium bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50"
            >
              {{ auth.userTier() === 'FREE' ? i18n.t('billing.activePlan') : i18n.t('billing.freeTier') }}
            </button>
          </div>
        </div>

        <!-- PRO PLAN (€49/mo) -->
        <div class="p-6 rounded-2xl bg-gradient-to-b from-brand-950/40 via-slate-900 to-slate-900 border-2 border-brand-500 relative flex flex-col justify-between shadow-xl shadow-brand-500/10">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
            {{ i18n.t('billing.mostPopular') }}
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-brand-300 uppercase tracking-wider">{{ i18n.t('billing.proTitle') }}</span>
              <span *ngIf="auth.userTier() === 'PRO'" class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {{ i18n.t('billing.active') }}
              </span>
            </div>

            <div>
              <div class="text-3xl font-bold text-white">{{ i18n.t('billing.proPrice') }} <span class="text-xs text-slate-400 font-normal">{{ i18n.t('billing.proMonth') }}</span></div>
              <div class="text-xs text-brand-400 mt-0.5">{{ i18n.t('billing.proStripeNotice') }}</div>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed">
              {{ i18n.t('billing.proDesc') }}
            </p>

            <ul class="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-emerald-400"></app-icon>
                <span><strong>{{ i18n.t('billing.proFeat1') }}</strong></span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-emerald-400"></app-icon>
                <span>{{ i18n.t('billing.proFeat2') }}</span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-emerald-400"></app-icon>
                <span>{{ i18n.t('billing.proFeat3') }}</span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-emerald-400"></app-icon>
                <span>{{ i18n.t('billing.proFeat4') }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-6">
            <button
              (click)="upgradeTo('PRO')"
              [disabled]="auth.userTier() === 'PRO' || isLoading()"
              class="w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <app-icon *ngIf="isLoading() && targetTier() === 'PRO'" name="loader" [size]="14" classNames="animate-spin"></app-icon>
              <span>{{ auth.userTier() === 'PRO' ? i18n.t('billing.activePlan') : i18n.t('billing.upgradePro') }}</span>
            </button>
          </div>
        </div>

        <!-- AGENCY PLAN (€149/mo) -->
        <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ i18n.t('billing.agencyTitle') }}</span>
              <span *ngIf="auth.userTier() === 'AGENCY'" class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {{ i18n.t('billing.active') }}
              </span>
            </div>

            <div>
              <div class="text-3xl font-bold text-white">{{ i18n.t('billing.agencyPrice') }} <span class="text-xs text-slate-400 font-normal">{{ i18n.t('billing.agencyMonth') }}</span></div>
              <div class="text-xs text-slate-500 mt-0.5">{{ i18n.t('billing.agencyStripeNotice') }}</div>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed">
              {{ i18n.t('billing.agencyDesc') }}
            </p>

            <ul class="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-brand-400"></app-icon>
                <span>{{ i18n.t('billing.agencyFeat1') }}</span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-brand-400"></app-icon>
                <span>{{ i18n.t('billing.agencyFeat2') }}</span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-brand-400"></app-icon>
                <span>{{ i18n.t('billing.agencyFeat3') }}</span>
              </li>
              <li class="flex items-center space-x-2">
                <app-icon name="check" [size]="14" classNames="text-brand-400"></app-icon>
                <span>{{ i18n.t('billing.agencyFeat4') }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-6">
            <button
              (click)="upgradeTo('AGENCY')"
              [disabled]="auth.userTier() === 'AGENCY' || isLoading()"
              class="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 active:bg-slate-900 disabled:opacity-50 text-white border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <app-icon *ngIf="isLoading() && targetTier() === 'AGENCY'" name="loader" [size]="14" classNames="animate-spin"></app-icon>
              <span>{{ auth.userTier() === 'AGENCY' ? i18n.t('billing.activePlan') : i18n.t('billing.upgradeAgency') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Security / Compliance footer notice -->
      <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center space-x-3 text-xs text-slate-400">
        <app-icon name="shield-check" [size]="18" classNames="text-emerald-400 shrink-0"></app-icon>
        <span>{{ i18n.t('billing.securityNote') }}</span>
      </div>
    </div>
  `
})
export class BillingComponent implements OnInit {
  billingService = inject(BillingService);
  auth = inject(AuthService);
  i18n = inject(TranslationService);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  targetTier = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status'] === 'success') {
        const tier = (params['tier'] || 'PRO') as SubscriptionTier;
        this.auth.setTier(tier);
        this.successMessage.set(this.i18n.t('billing.successPayment'));
      } else if (params['status'] === 'cancelled') {
        this.successMessage.set(this.i18n.t('billing.cancelPayment'));
      }
    });
  }

  upgradeTo(tier: 'PRO' | 'AGENCY'): void {
    this.isLoading.set(true);
    this.targetTier.set(tier);

    this.billingService.createCheckoutSession(tier).subscribe({
      next: (res) => {
        if (res.checkoutUrl.startsWith('http')) {
          window.location.href = res.checkoutUrl;
        } else {
          this.auth.setTier(tier);
          this.successMessage.set(this.i18n.t('billing.successPayment'));
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.billingService.simulateUpgrade(tier).subscribe({
          next: () => {
            this.auth.setTier(tier);
            this.successMessage.set(this.i18n.t('billing.successPayment'));
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      }
    });
  }
}
