import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProposalService } from '../../core/services/proposal.service';
import { TranslationService } from '../../core/services/translation.service';
import { Proposal, ProposalContent } from '../../models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-proposal-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto" *ngIf="proposal()">
      <!-- Top Bar -->
      <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {{ i18n.t('status.' + proposal()?.status, proposal()?.status) }}
            </span>
            <span class="text-xs text-slate-400">{{ proposal()?.clientName }}</span>
          </div>
          <h1 class="text-xl font-bold text-white">{{ proposal()?.tenderTitle }}</h1>
        </div>

        <div class="flex items-center flex-wrap gap-2">
          <button
            (click)="saveEdits()"
            [disabled]="isSaving()"
            class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <app-icon *ngIf="isSaving()" name="loader" [size]="14" classNames="animate-spin"></app-icon>
            <span>{{ isSaving() ? i18n.t('wizard.saving') : i18n.t('wizard.saveDraft') }}</span>
          </button>

          <button
            (click)="proposalService.downloadPdf(proposal()!.id, proposal()!.tenderTitle)"
            class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <app-icon name="download" [size]="14"></app-icon>
            <span>{{ i18n.t('wizard.exportPdf') }}</span>
          </button>

          <button
            (click)="proposalService.downloadDocx(proposal()!.id, proposal()!.tenderTitle)"
            class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <app-icon name="file-text" [size]="14"></app-icon>
            <span>{{ i18n.t('wizard.exportDocx') }}</span>
          </button>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="showToast()" class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center space-x-2">
        <app-icon name="check" [size]="16"></app-icon>
        <span>{{ i18n.t('proposals.savedSuccess') }}</span>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex overflow-x-auto space-x-2 pb-2">
        <button
          *ngFor="let tab of getTabs()"
          (click)="activeTab = tab.id"
          [ngClass]="{
            'bg-brand-500/15 text-brand-300 border-brand-500/30': activeTab === tab.id,
            'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white': activeTab !== tab.id
          }"
          class="px-3.5 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-colors"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Editor Section -->
      <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <!-- 1. Executive Summary -->
        <div *ngIf="activeTab === 'summary'" class="space-y-3">
          <label class="text-sm font-semibold text-white">1. {{ i18n.t('wizard.tabExecSummary') }}</label>
          <textarea
            rows="8"
            [(ngModel)]="content.executiveSummary"
            class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <!-- 2. Proposed Methodology -->
        <div *ngIf="activeTab === 'methodology'" class="space-y-3">
          <label class="text-sm font-semibold text-white">2. {{ i18n.t('wizard.tabTechSolution') }}</label>
          <textarea
            rows="10"
            [(ngModel)]="content.proposedMethodology"
            class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <!-- 3. Team Qualifications -->
        <div *ngIf="activeTab === 'team'" class="space-y-3">
          <label class="text-sm font-semibold text-white">3. {{ i18n.t('profile.teamBios') }}</label>
          <textarea
            rows="8"
            [(ngModel)]="content.teamQualifications"
            class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <!-- 4. Timeline & Milestones -->
        <div *ngIf="activeTab === 'timeline'" class="space-y-3">
          <label class="text-sm font-semibold text-white">4. {{ i18n.t('wizard.tabImplementation') }}</label>
          <textarea
            rows="8"
            [(ngModel)]="content.timeline"
            class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <!-- 5. Pricing Structure -->
        <div *ngIf="activeTab === 'pricing'" class="space-y-3">
          <label class="text-sm font-semibold text-white">5. {{ i18n.t('wizard.tabCommercial') }}</label>
          <textarea
            rows="8"
            [(ngModel)]="content.pricingStructure"
            class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <!-- 6. Regulatory & Security Compliance -->
        <div *ngIf="activeTab === 'compliance'" class="space-y-3">
          <label class="text-sm font-semibold text-white">6. {{ i18n.t('wizard.tabCompliance') }}</label>
          <textarea
            rows="8"
            [(ngModel)]="content.complianceAndStandards"
            class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>
      </div>

      <div class="flex justify-between items-center pt-2">
        <a
          routerLink="/proposals"
          class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
        >
          <app-icon name="arrow-left" [size]="14"></app-icon>
          <span>{{ i18n.t('proposals.backToArchive') }}</span>
        </a>
      </div>
    </div>
  `
})
export class ProposalDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  proposalService = inject(ProposalService);
  i18n = inject(TranslationService);

  proposal = signal<Proposal | null>(null);
  content: ProposalContent = {
    executiveSummary: '',
    proposedMethodology: '',
    teamQualifications: '',
    timeline: '',
    pricingStructure: '',
    complianceAndStandards: ''
  };

  isSaving = signal(false);
  showToast = signal(false);
  activeTab = 'summary';

  getTabs() {
    return [
      { id: 'summary', label: '1. ' + this.i18n.t('wizard.tabExecSummary') },
      { id: 'methodology', label: '2. ' + this.i18n.t('wizard.tabTechSolution') },
      { id: 'team', label: '3. ' + this.i18n.t('profile.teamBios') },
      { id: 'timeline', label: '4. ' + this.i18n.t('wizard.tabImplementation') },
      { id: 'pricing', label: '5. ' + this.i18n.t('wizard.tabCommercial') },
      { id: 'compliance', label: '6. ' + this.i18n.t('wizard.tabCompliance') }
    ];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.proposalService.getProposal(Number(id)).subscribe({
        next: (p) => {
          this.proposal.set(p);
          this.content = { ...p.generatedContent };
        }
      });
    }
  }

  saveEdits(): void {
    const p = this.proposal();
    if (!p) return;

    this.isSaving.set(true);
    this.proposalService.updateProposal(p.id, this.content).subscribe({
      next: (updated) => {
        this.proposal.set(updated);
        this.isSaving.set(false);
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3000);
      },
      error: () => this.isSaving.set(false)
    });
  }
}
