import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProposalService } from '../../core/services/proposal.service';
import { ProfileService } from '../../core/services/profile.service';
import { TranslationService } from '../../core/services/translation.service';
import { CaseStudy, Proposal, ProposalContent, ProposalRequest } from '../../models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="space-y-8 max-w-5xl mx-auto">
      <!-- Stepper Indicator -->
      <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div class="grid grid-cols-4 gap-2 sm:gap-4">
          <!-- Step 1 Tab -->
          <div
            [ngClass]="{
              'text-brand-400 border-brand-500': currentStep() === 1,
              'text-emerald-400 border-emerald-500': currentStep() > 1,
              'text-slate-500 border-slate-800': currentStep() < 1
            }"
            class="pb-2 border-b-2 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
              [ngClass]="{
                'border-brand-500 bg-brand-500/10': currentStep() === 1,
                'border-emerald-500 bg-emerald-500/10': currentStep() > 1,
                'border-slate-800': currentStep() < 1
              }"
            >
              {{ currentStep() > 1 ? '✓' : '1' }}
            </span>
            <span class="hidden sm:inline">{{ i18n.t('wizard.step1') }}</span>
          </div>

          <!-- Step 2 Tab -->
          <div
            [ngClass]="{
              'text-brand-400 border-brand-500': currentStep() === 2,
              'text-emerald-400 border-emerald-500': currentStep() > 2,
              'text-slate-500 border-slate-800': currentStep() < 2
            }"
            class="pb-2 border-b-2 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
              [ngClass]="{
                'border-brand-500 bg-brand-500/10': currentStep() === 2,
                'border-emerald-500 bg-emerald-500/10': currentStep() > 2,
                'border-slate-800': currentStep() < 2
              }"
            >
              {{ currentStep() > 2 ? '✓' : '2' }}
            </span>
            <span class="hidden sm:inline">{{ i18n.t('wizard.step2') }}</span>
          </div>

          <!-- Step 3 Tab -->
          <div
            [ngClass]="{
              'text-brand-400 border-brand-500': currentStep() === 3,
              'text-emerald-400 border-emerald-500': currentStep() > 3,
              'text-slate-500 border-slate-800': currentStep() < 3
            }"
            class="pb-2 border-b-2 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
              [ngClass]="{
                'border-brand-500 bg-brand-500/10': currentStep() === 3,
                'border-emerald-500 bg-emerald-500/10': currentStep() > 3,
                'border-slate-800': currentStep() < 3
              }"
            >
              {{ currentStep() > 3 ? '✓' : '3' }}
            </span>
            <span class="hidden sm:inline">{{ i18n.t('wizard.step3') }}</span>
          </div>

          <!-- Step 4 Tab -->
          <div
            [ngClass]="{
              'text-brand-400 border-brand-500': currentStep() === 4,
              'text-slate-500 border-slate-800': currentStep() < 4
            }"
            class="pb-2 border-b-2 text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border"
              [ngClass]="{
                'border-brand-500 bg-brand-500/10': currentStep() === 4,
                'border-slate-800': currentStep() < 4
              }"
            >
              4
            </span>
            <span class="hidden sm:inline">{{ i18n.t('wizard.step4') }}</span>
          </div>
        </div>
      </div>

      <!-- ================= STEP 1: Tender & Client Info ================= -->
      <div *ngIf="currentStep() === 1" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-white">{{ i18n.t('wizard.step1Title') }}</h1>
            <p class="text-xs text-slate-400 mt-1">
              {{ i18n.t('wizard.step1Subtitle') }}
            </p>
          </div>
          <button
            type="button"
            (click)="fillSampleTender()"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 border border-brand-500/30 text-xs font-semibold transition-colors"
          >
            <app-icon name="sparkles" [size]="14"></app-icon>
            <span>{{ i18n.t('wizard.prefillSample') }}</span>
          </button>
        </div>

        <!-- Document Parser Drag & Drop Zone -->
        <div class="p-6 rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 text-center hover:border-brand-500 transition-colors">
          <input
            #fileInput
            type="file"
            accept=".pdf,.txt,.md"
            (change)="onFileSelected($event)"
            class="hidden"
          />
          <div class="space-y-2">
            <app-icon name="upload" [size]="32" classNames="mx-auto text-brand-400"></app-icon>
            <div class="text-xs font-medium text-slate-200">
              <button
                type="button"
                (click)="fileInput.click()"
                class="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2"
              >
                {{ i18n.t('wizard.uploadPdf') }}
              </button>
              {{ i18n.t('wizard.orDrag') }}
            </div>
            <p class="text-[11px] text-slate-500">
              {{ i18n.t('wizard.pdfboxNotice') }}
            </p>
            <div *ngIf="isParsingPdf()" class="pt-2 flex items-center justify-center space-x-2 text-xs text-brand-300">
              <app-icon name="loader" [size]="14" classNames="animate-spin"></app-icon>
              <span>{{ i18n.t('wizard.parsingPdf') }}</span>
            </div>
            <div *ngIf="uploadedFileName()" class="pt-2 text-xs text-emerald-400 flex items-center justify-center space-x-1.5">
              <app-icon name="check" [size]="14"></app-icon>
              <span>Loaded: {{ uploadedFileName() }}</span>
            </div>
          </div>
        </div>

        <!-- Form fields -->
        <form [formGroup]="tenderForm" class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('wizard.tenderTitle') }} *</label>
              <input
                type="text"
                formControlName="tenderTitle"
                [placeholder]="i18n.t('wizard.tenderTitlePlaceholder')"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('wizard.clientName') }} *</label>
              <input
                type="text"
                formControlName="clientName"
                [placeholder]="i18n.t('wizard.clientNamePlaceholder')"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('wizard.country') }}</label>
              <input
                type="text"
                formControlName="country"
                [placeholder]="i18n.t('wizard.countryPlaceholder')"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('wizard.deadline') }}</label>
              <input
                type="date"
                formControlName="submissionDeadline"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">
              {{ i18n.t('wizard.specs') }} *
            </label>
            <textarea
              rows="6"
              formControlName="rawTenderText"
              [placeholder]="i18n.t('wizard.specsPlaceholder')"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed font-mono text-[11px]"
            ></textarea>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              (click)="goToStep(2)"
              [disabled]="tenderForm.invalid"
              class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all"
            >
              <span>{{ i18n.t('wizard.nextStep2') }}</span>
              <app-icon name="arrow-right" [size]="14"></app-icon>
            </button>
          </div>
        </form>
      </div>

      <!-- ================= STEP 2: Case Studies Matching ================= -->
      <div *ngIf="currentStep() === 2" class="space-y-6">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">{{ i18n.t('wizard.step2Title') }}</h1>
          <p class="text-xs text-slate-400 mt-1">
            {{ i18n.t('wizard.step2Subtitle') }}
          </p>
        </div>

        <div class="space-y-4">
          <div *ngIf="availableCaseStudies().length === 0" class="p-8 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
            <p class="text-xs text-slate-400">{{ i18n.t('wizard.noCaseStudiesFound') }}</p>
            <a routerLink="/profile" class="inline-block text-xs text-brand-400 hover:underline">
              {{ i18n.t('wizard.manageProfile') }}
            </a>
          </div>

          <div *ngIf="availableCaseStudies().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              *ngFor="let cs of availableCaseStudies()"
              (click)="toggleCaseStudy(cs.id)"
              [ngClass]="{
                'border-brand-500 bg-brand-950/20 ring-1 ring-brand-500': isCaseStudySelected(cs.id),
                'border-slate-800 bg-slate-900/80 hover:border-slate-700': !isCaseStudySelected(cs.id)
              }"
              class="p-5 rounded-2xl border cursor-pointer transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    {{ cs.client }}
                  </span>
                  <div
                    [ngClass]="{
                      'bg-brand-600 border-brand-500 text-white': isCaseStudySelected(cs.id),
                      'border-slate-700 bg-slate-800 text-transparent': !isCaseStudySelected(cs.id)
                    }"
                    class="w-5 h-5 rounded-md border flex items-center justify-center text-xs"
                  >
                    ✓
                  </div>
                </div>
                <h3 class="text-sm font-semibold text-white">{{ cs.title }}</h3>
                <p class="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{{ cs.summary }}</p>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Budget: <strong class="text-slate-200">{{ cs.budget }}</strong></span>
                <span>{{ cs.duration }}</span>
              </div>
            </div>
          </div>

          <!-- Custom Strategic Prompt Directive -->
          <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <label class="block text-xs font-semibold text-white">
              {{ i18n.t('wizard.strategicDirectives') }}
            </label>
            <input
              type="text"
              [(ngModel)]="customInstructions"
              [placeholder]="i18n.t('wizard.directivesPlaceholder')"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div class="flex items-center justify-between pt-4">
            <button
              type="button"
              (click)="goToStep(1)"
              class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              <app-icon name="arrow-left" [size]="14"></app-icon>
              <span>{{ i18n.t('wizard.back') }}</span>
            </button>
            <button
              type="button"
              (click)="startAiGeneration()"
              class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 transition-all"
            >
              <app-icon name="sparkles" [size]="15"></app-icon>
              <span>{{ i18n.t('wizard.synthesizeBtn') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ================= STEP 3: AI Generation Progress ================= -->
      <div *ngIf="currentStep() === 3" class="p-12 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
          <app-icon name="sparkles" [size]="32" classNames="animate-pulse"></app-icon>
        </div>

        <div class="space-y-2 max-w-md mx-auto">
          <h2 class="text-xl font-bold text-white">{{ i18n.t('wizard.synthesizingTitle') }}</h2>
          <p class="text-xs text-slate-400">
            {{ i18n.t('wizard.synthesizingSub') }}
          </p>
        </div>

        <!-- Animated Progress Indicator -->
        <div class="w-full max-w-md mx-auto bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 relative">
          <div class="h-full bg-gradient-to-r from-brand-600 to-indigo-400 animate-shimmer w-1/2 rounded-full"></div>
        </div>

        <!-- Sequential Milestones Status -->
        <div class="space-y-2 text-xs text-left max-w-sm mx-auto font-mono text-slate-400">
          <div class="flex items-center space-x-2 text-emerald-400">
            <span>✓</span>
            <span>{{ i18n.t('wizard.analyzingSpecs') }}</span>
          </div>
          <div class="flex items-center space-x-2 text-emerald-400">
            <span>✓</span>
            <span>{{ i18n.t('wizard.aligningDirectives') }}</span>
          </div>
          <div class="flex items-center space-x-2 text-brand-300">
            <app-icon name="loader" [size]="12" classNames="animate-spin"></app-icon>
            <span>{{ i18n.t('wizard.matchingExperience') }}</span>
          </div>
          <div class="flex items-center space-x-2 text-slate-600">
            <span>○</span>
            <span>{{ i18n.t('wizard.generatingProposal') }}</span>
          </div>
        </div>
      </div>

      <!-- ================= STEP 4: Interactive Proposal Editor & Export ================= -->
      <div *ngIf="currentStep() === 4 && generatedProposal()" class="space-y-6">
        <!-- Header Banner & Export Actions -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {{ i18n.t('wizard.ready') }}
              </span>
              <span class="text-xs text-slate-400">{{ generatedProposal()?.clientName }}</span>
            </div>
            <h1 class="text-xl font-bold text-white">{{ generatedProposal()?.tenderTitle }}</h1>
          </div>

          <div class="flex items-center flex-wrap gap-2">
            <button
              (click)="saveEdits()"
              [disabled]="isSavingEdits()"
              class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <app-icon *ngIf="isSavingEdits()" name="loader" [size]="14" classNames="animate-spin"></app-icon>
              <span>{{ isSavingEdits() ? i18n.t('wizard.saving') : i18n.t('wizard.saveDraft') }}</span>
            </button>

            <!-- Export PDF -->
            <button
              (click)="proposalService.downloadPdf(generatedProposal()!.id, generatedProposal()!.tenderTitle)"
              class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <app-icon name="download" [size]="14"></app-icon>
              <span>{{ i18n.t('wizard.exportPdf') }}</span>
            </button>

            <!-- Export DOCX -->
            <button
              (click)="proposalService.downloadDocx(generatedProposal()!.id, generatedProposal()!.tenderTitle)"
              class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <app-icon name="file-text" [size]="14"></app-icon>
              <span>{{ i18n.t('wizard.exportDocx') }}</span>
            </button>
          </div>
        </div>

        <!-- Section Navigation Tabs -->
        <div class="flex overflow-x-auto space-x-2 pb-2">
          <button
            *ngFor="let tab of getEditorTabs()"
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

        <!-- Active Section Editor -->
        <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <!-- 1. Executive Summary -->
          <div *ngIf="activeTab === 'summary'" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-white">{{ i18n.t('wizard.tabExecSummary') }}</label>
              <span class="text-[11px] text-slate-400">Directive 2014/24/EU</span>
            </div>
            <textarea
              rows="8"
              [(ngModel)]="proposalContent.executiveSummary"
              class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <!-- 2. Proposed Methodology -->
          <div *ngIf="activeTab === 'methodology'" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-white">{{ i18n.t('wizard.tabTechSolution') }}</label>
              <span class="text-[11px] text-slate-400">EU PM² + Agile Framework</span>
            </div>
            <textarea
              rows="10"
              [(ngModel)]="proposalContent.proposedMethodology"
              class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <!-- 3. Team Qualifications -->
          <div *ngIf="activeTab === 'team'" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-white">{{ i18n.t('profile.teamBios') }}</label>
              <span class="text-[11px] text-slate-400">EU Security Clearance</span>
            </div>
            <textarea
              rows="8"
              [(ngModel)]="proposalContent.teamQualifications"
              class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <!-- 4. Timeline & Milestones -->
          <div *ngIf="activeTab === 'timeline'" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-white">{{ i18n.t('wizard.tabImplementation') }}</label>
              <span class="text-[11px] text-slate-400">M1 to M5</span>
            </div>
            <textarea
              rows="8"
              [(ngModel)]="proposalContent.timeline"
              class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <!-- 5. Pricing Structure -->
          <div *ngIf="activeTab === 'pricing'" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-white">{{ i18n.t('wizard.tabCommercial') }}</label>
              <span class="text-[11px] text-slate-400">EUR / VAT</span>
            </div>
            <textarea
              rows="8"
              [(ngModel)]="proposalContent.pricingStructure"
              class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <!-- 6. Regulatory & Security Compliance -->
          <div *ngIf="activeTab === 'compliance'" class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-white">{{ i18n.t('wizard.tabCompliance') }}</label>
              <span class="text-[11px] text-slate-400">GDPR Art. 32, NIS2, ISO 27001</span>
            </div>
            <textarea
              rows="8"
              [(ngModel)]="proposalContent.complianceAndStandards"
              class="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4">
          <button
            type="button"
            (click)="goToStep(1)"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            {{ i18n.t('wizard.anotherProposal') }}
          </button>
          <a
            routerLink="/proposals"
            class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            {{ i18n.t('wizard.toArchive') }}
          </a>
        </div>
      </div>
    </div>
  `
})
export class WizardComponent implements OnInit {
  private fb = inject(FormBuilder);
  proposalService = inject(ProposalService);
  private profileService = inject(ProfileService);
  i18n = inject(TranslationService);
  private router = inject(Router);

  currentStep = signal<number>(1);
  isParsingPdf = signal<boolean>(false);
  uploadedFileName = signal<string | null>(null);
  availableCaseStudies = signal<CaseStudy[]>([]);
  selectedCaseStudyIds = signal<string[]>([]);
  customInstructions = '';

  generatedProposal = signal<Proposal | null>(null);
  proposalContent: ProposalContent = {
    executiveSummary: '',
    proposedMethodology: '',
    teamQualifications: '',
    timeline: '',
    pricingStructure: '',
    complianceAndStandards: ''
  };

  isSavingEdits = signal<boolean>(false);
  activeTab = 'summary';

  getEditorTabs() {
    return [
      { id: 'summary', label: '1. ' + this.i18n.t('wizard.tabExecSummary') },
      { id: 'methodology', label: '2. ' + this.i18n.t('wizard.tabTechSolution') },
      { id: 'team', label: '3. ' + this.i18n.t('profile.teamBios') },
      { id: 'timeline', label: '4. ' + this.i18n.t('wizard.tabImplementation') },
      { id: 'pricing', label: '5. ' + this.i18n.t('wizard.tabCommercial') },
      { id: 'compliance', label: '6. ' + this.i18n.t('wizard.tabCompliance') }
    ];
  }

  tenderForm = this.fb.group({
    tenderTitle: ['', Validators.required],
    clientName: ['', Validators.required],
    country: ['European Union'],
    submissionDeadline: ['2026-11-30'],
    rawTenderText: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadCaseStudies();
  }

  loadCaseStudies(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        const studies = profile.caseStudies || [];
        this.availableCaseStudies.set(studies);
        if (studies.length > 0) {
          this.selectedCaseStudyIds.set(studies.slice(0, 2).map(cs => cs.id));
        }
      }
    });
  }

  fillSampleTender(): void {
    this.tenderForm.patchValue({
      tenderTitle: 'TED 2026/S 088-219482: Cloud-Native Public Health Interoperability Portal',
      clientName: 'European Centre for Disease Prevention and Control (ECDC)',
      country: 'Sweden / European Union',
      submissionDeadline: '2026-12-15',
      rawTenderText: `The European Centre for Disease Prevention and Control (ECDC) hereby publishes this call for tenders to procure technical modernization, API engineering, and sovereign European cloud hosting for the pan-European Epidemic Intelligence Information System.

Key Requirements:
1. Architecture & Security: Full compliance with Gaia-X standards, GDPR Article 32 data pseudonymization, and NIS2 Directive risk mitigation.
2. Interoperability: HL7 FHIR and RESTful microservices integration across 27 EU member state national health authorities.
3. Delivery Methodology: Agile delivery following European Commission PM² governance with quarterly release milestones.
4. Support & SLA: 24/7 Tier 1 incident support and continuous accessibility audit against WCAG 2.1 AA.`
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.isParsingPdf.set(true);
    this.uploadedFileName.set(file.name);

    this.proposalService.parsePdf(file).subscribe({
      next: (res) => {
        this.isParsingPdf.set(false);
        this.tenderForm.patchValue({
          rawTenderText: res.text,
          tenderTitle: this.tenderForm.value.tenderTitle || file.name.replace(/\.[^/.]+$/, "")
        });
      },
      error: () => {
        this.isParsingPdf.set(false);
      }
    });
  }

  toggleCaseStudy(id: string): void {
    const current = [...this.selectedCaseStudyIds()];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    this.selectedCaseStudyIds.set(current);
  }

  isCaseStudySelected(id: string): boolean {
    return this.selectedCaseStudyIds().includes(id);
  }

  goToStep(step: number): void {
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startAiGeneration(): void {
    this.goToStep(3);

    const request: ProposalRequest = {
      tenderTitle: this.tenderForm.value.tenderTitle!,
      clientName: this.tenderForm.value.clientName!,
      country: this.tenderForm.value.country || 'European Union',
      submissionDeadline: this.tenderForm.value.submissionDeadline || '',
      rawTenderText: this.tenderForm.value.rawTenderText!,
      selectedCaseStudyIds: this.selectedCaseStudyIds(),
      customInstructions: this.customInstructions
    };

    setTimeout(() => {
      this.proposalService.generateProposal(request).subscribe({
        next: (proposal) => {
          this.generatedProposal.set(proposal);
          this.proposalContent = { ...proposal.generatedContent };
          this.goToStep(4);
        },
        error: () => {
          this.goToStep(2);
        }
      });
    }, 1200);
  }

  saveEdits(): void {
    const p = this.generatedProposal();
    if (!p) return;

    this.isSavingEdits.set(true);
    this.proposalService.updateProposal(p.id, this.proposalContent).subscribe({
      next: (updated) => {
        this.generatedProposal.set(updated);
        this.isSavingEdits.set(false);
      },
      error: () => this.isSavingEdits.set(false)
    });
  }
}
