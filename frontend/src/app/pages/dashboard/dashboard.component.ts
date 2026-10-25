import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProposalService } from '../../core/services/proposal.service';
import { DashboardStats, Proposal } from '../../models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="space-y-8 max-w-7xl mx-auto">
      <!-- Welcome Hero Banner -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-slate-800 p-8 shadow-xl">
        <div class="relative z-10 sm:flex sm:items-center sm:justify-between">
          <div class="max-w-2xl">
            <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>EU Procurement AI Active</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Pan-European Tender Intelligence
            </h1>
            <p class="mt-2 text-sm text-slate-300 leading-relaxed">
              Generate fully compliant, winning public procurement bids adhering to Directive 2014/24/EU, EU PM² methodology, and sovereign cybersecurity standards.
            </p>
          </div>
          <div class="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <a
              routerLink="/proposals/wizard"
              class="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium shadow-lg shadow-brand-600/30 transition-all duration-150"
            >
              <app-icon name="sparkles" [size]="16"></app-icon>
              <span>Launch Wizard</span>
            </a>
          </div>
        </div>
      </div>

      <!-- KPI Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Metric 1 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Total Proposals</span>
            <app-icon name="file-text" [size]="18" classNames="text-slate-400"></app-icon>
          </div>
          <div class="text-2xl font-bold text-white">{{ stats()?.totalProposals ?? 0 }}</div>
          <div class="text-xs text-slate-500 mt-1">Generated tender bids</div>
        </div>

        <!-- Metric 2 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Completed Offers</span>
            <app-icon name="shield-check" [size]="18" classNames="text-emerald-400"></app-icon>
          </div>
          <div class="text-2xl font-bold text-white">{{ stats()?.completedProposals ?? 0 }}</div>
          <div class="text-xs text-emerald-400/90 mt-1">Ready for submission</div>
        </div>

        <!-- Metric 3 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Verified Case Studies</span>
            <app-icon name="building" [size]="18" classNames="text-brand-400"></app-icon>
          </div>
          <div class="text-2xl font-bold text-white">{{ stats()?.caseStudiesCount ?? 0 }}</div>
          <div class="text-xs text-slate-500 mt-1">Institutional track records</div>
        </div>

        <!-- Metric 4 -->
        <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Subscription Tier</span>
            <app-icon name="credit-card" [size]="18" classNames="text-brand-400"></app-icon>
          </div>
          <div class="text-2xl font-bold text-white">{{ stats()?.currentTier || 'PRO' }}</div>
          <div class="text-xs text-slate-500 mt-1">Unlimited tender exports</div>
        </div>
      </div>

      <!-- Recent Proposals Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-white">Recent Tender Proposals</h2>
            <p class="text-xs text-slate-400">All submissions generated across European institutions</p>
          </div>
          <a routerLink="/proposals" class="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1">
            <span>View All</span>
            <app-icon name="chevron-right" [size]="14"></app-icon>
          </a>
        </div>

        <!-- Loading Skeletons -->
        <div *ngIf="isLoading()" class="space-y-3">
          <div *ngFor="let item of [1,2,3]" class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse flex items-center justify-between">
            <div class="space-y-2 flex-1 max-w-md">
              <div class="h-4 bg-slate-800 rounded w-3/4"></div>
              <div class="h-3 bg-slate-800/70 rounded w-1/2"></div>
            </div>
            <div class="h-8 w-24 bg-slate-800 rounded-lg"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading() && proposals().length === 0" class="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
          <app-icon name="file-text" [size]="36" classNames="mx-auto text-slate-600 mb-3"></app-icon>
          <h3 class="text-sm font-semibold text-white">No proposals generated yet</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your first European tender PDF or RFP notice to generate an automated commercial proposal.
          </p>
          <a
            routerLink="/proposals/wizard"
            class="inline-flex items-center space-x-2 mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-medium text-white transition-colors"
          >
            <app-icon name="plus" [size]="14"></app-icon>
            <span>Start Proposal Wizard</span>
          </a>
        </div>

        <!-- Proposals List Table / Cards -->
        <div *ngIf="!isLoading() && proposals().length > 0" class="overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800">
          <div class="divide-y divide-slate-800/80">
            <div
              *ngFor="let p of proposals().slice(0, 5)"
              class="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-800/30 transition-colors"
            >
              <div class="space-y-1.5 flex-1 min-w-0 pr-4">
                <div class="flex items-center space-x-2.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {{ p.status }}
                  </span>
                  <span class="text-xs text-slate-400 flex items-center space-x-1">
                    <app-icon name="clock" [size]="12"></app-icon>
                    <span>{{ p.createdAt | date:'mediumDate' }}</span>
                  </span>
                </div>
                <h3 class="text-sm font-semibold text-white truncate hover:text-brand-300">
                  <a [routerLink]="['/proposals', p.id]">{{ p.tenderTitle }}</a>
                </h3>
                <div class="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Client: <strong class="text-slate-300 font-medium">{{ p.clientName }}</strong></span>
                  <span>•</span>
                  <span>Region: <span class="text-slate-300">{{ p.country || 'European Union' }}</span></span>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center space-x-2 shrink-0">
                <a
                  [routerLink]="['/proposals', p.id]"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Edit Offer
                </a>
                <button
                  (click)="proposalService.downloadPdf(p.id, p.tenderTitle)"
                  title="Export PDF"
                  class="p-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  <app-icon name="download" [size]="15"></app-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  proposalService = inject(ProposalService);

  stats = signal<DashboardStats | null>(null);
  proposals = signal<Proposal[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    this.proposalService.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => {}
    });

    this.proposalService.getProposals().subscribe({
      next: (list) => {
        this.proposals.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
