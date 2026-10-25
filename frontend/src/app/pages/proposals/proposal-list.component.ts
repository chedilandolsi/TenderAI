import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProposalService } from '../../core/services/proposal.service';
import { TranslationService } from '../../core/services/translation.service';
import { Proposal } from '../../models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">{{ i18n.t('proposals.archiveTitle') }}</h1>
          <p class="text-xs text-slate-400 mt-1">{{ i18n.t('proposals.archiveSubtitle') }}</p>
        </div>
        <a
          routerLink="/proposals/wizard"
          class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <app-icon name="plus" [size]="14"></app-icon>
          <span>{{ i18n.t('proposals.generateNew') }}</span>
        </a>
      </div>

      <!-- Search & Filters -->
      <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
        <app-icon name="dashboard" [size]="16" classNames="text-slate-500"></app-icon>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          [placeholder]="i18n.t('proposals.searchPlaceholder')"
          class="bg-transparent w-full text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      <!-- Proposals List -->
      <div class="overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800">
        <div *ngIf="isLoading()" class="p-8 text-center text-slate-400 text-xs">
          {{ i18n.t('proposals.loading') }}
        </div>

        <div *ngIf="!isLoading() && filteredProposals().length === 0" class="p-12 text-center text-slate-400">
          <app-icon name="file-text" [size]="32" classNames="mx-auto text-slate-600 mb-2"></app-icon>
          <div class="text-xs font-medium text-slate-300">{{ i18n.t('proposals.emptyTitle') }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">{{ i18n.t('proposals.emptySubtitle') }}</div>
        </div>

        <div *ngIf="!isLoading() && filteredProposals().length > 0" class="divide-y divide-slate-800">
          <div
            *ngFor="let p of filteredProposals()"
            class="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-800/30 transition-colors"
          >
            <div class="space-y-1.5 flex-1 min-w-0 pr-4">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {{ i18n.t('status.' + p.status, p.status) }}
                </span>
                <span class="text-xs text-slate-400">{{ i18n.t('proposals.created') }}: {{ p.createdAt | date:'mediumDate' }}</span>
              </div>

              <h2 class="text-sm font-semibold text-white truncate hover:text-brand-300">
                <a [routerLink]="['/proposals', p.id]">{{ p.tenderTitle }}</a>
              </h2>

              <div class="flex items-center space-x-4 text-xs text-slate-400">
                <span>{{ i18n.t('proposals.client') }}: <strong class="text-slate-300">{{ p.clientName }}</strong></span>
                <span>•</span>
                <span>{{ i18n.t('proposals.jurisdiction') }}: {{ p.country || 'European Union' }}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center space-x-2 shrink-0">
              <a
                [routerLink]="['/proposals', p.id]"
                class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {{ i18n.t('proposals.openEditor') }}
              </a>

              <button
                (click)="proposalService.downloadPdf(p.id, p.tenderTitle)"
                [title]="i18n.t('proposals.downloadPdf')"
                class="p-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <app-icon name="download" [size]="15"></app-icon>
              </button>

              <button
                (click)="proposalService.downloadDocx(p.id, p.tenderTitle)"
                [title]="i18n.t('proposals.downloadDocx')"
                class="p-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <app-icon name="file-text" [size]="15"></app-icon>
              </button>

              <button
                (click)="deleteProposal(p.id)"
                [title]="i18n.t('proposals.delete')"
                class="p-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              >
                <app-icon name="trash" [size]="15"></app-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProposalListComponent implements OnInit {
  proposalService = inject(ProposalService);
  i18n = inject(TranslationService);

  proposals = signal<Proposal[]>([]);
  isLoading = signal(true);
  searchQuery = '';

  ngOnInit(): void {
    this.loadProposals();
  }

  loadProposals(): void {
    this.isLoading.set(true);
    this.proposalService.getProposals().subscribe({
      next: (list) => {
        this.proposals.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  filteredProposals(): Proposal[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.proposals();
    return this.proposals().filter(p =>
      p.tenderTitle.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q)
    );
  }

  deleteProposal(id: number): void {
    if (confirm('Are you sure you want to delete this proposal?')) {
      this.proposalService.deleteProposal(id).subscribe({
        next: () => {
          this.proposals.set(this.proposals().filter(p => p.id !== id));
        }
      });
    }
  }
}
