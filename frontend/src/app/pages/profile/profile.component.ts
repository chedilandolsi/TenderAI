import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { TranslationService } from '../../core/services/translation.service';
import { CaseStudy, CompanyProfile } from '../../models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="space-y-8 max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">{{ i18n.t('profile.title') }}</h1>
          <p class="text-xs text-slate-400 mt-1">
            {{ i18n.t('profile.subtitle') }}
          </p>
        </div>
        <button
          (click)="saveProfile()"
          [disabled]="isSaving()"
          class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all"
        >
          <app-icon *ngIf="isSaving()" name="loader" [size]="14" classNames="animate-spin"></app-icon>
          <span>{{ isSaving() ? i18n.t('profile.saving') : i18n.t('profile.saveBtn') }}</span>
        </button>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="saveSuccess()" class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center space-x-2">
        <app-icon name="check" [size]="16"></app-icon>
        <span>{{ i18n.t('profile.saveSuccess') }}</span>
      </div>

      <!-- General Agency Information Form -->
      <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <h2 class="text-base font-semibold text-white">{{ i18n.t('profile.coreTitle') }}</h2>

        <form [formGroup]="profileForm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('profile.agencyName') }}</label>
              <input
                type="text"
                formControlName="agencyName"
                [placeholder]="i18n.t('profile.agencyNamePlaceholder')"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('profile.website') }}</label>
              <input
                type="text"
                formControlName="website"
                [placeholder]="i18n.t('profile.websitePlaceholder')"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('profile.tagline') }}</label>
            <input
              type="text"
              formControlName="tagline"
              [placeholder]="i18n.t('profile.taglinePlaceholder')"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('profile.coreCompetencies') }}</label>
            <textarea
              rows="3"
              formControlName="coreCompetencies"
              [placeholder]="i18n.t('profile.coreCompetenciesPlaceholder')"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1.5">{{ i18n.t('profile.teamBios') }}</label>
            <textarea
              rows="3"
              formControlName="teamBios"
              [placeholder]="i18n.t('profile.teamBiosPlaceholder')"
              class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>
        </form>
      </div>

      <!-- Case Studies & Track Records Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-white">{{ i18n.t('profile.caseStudiesTitle') }}</h2>
            <p class="text-xs text-slate-400">{{ i18n.t('profile.caseStudiesSubtitle') }}</p>
          </div>
          <button
            (click)="showAddModal.set(true)"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <app-icon name="plus" [size]="14"></app-icon>
            <span>{{ i18n.t('profile.addCaseStudy') }}</span>
          </button>
        </div>

        <!-- Case Studies List -->
        <div *ngIf="caseStudies().length === 0" class="p-8 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
          <p class="text-xs text-slate-400">{{ i18n.t('profile.noCaseStudies') }}</p>
        </div>

        <div *ngIf="caseStudies().length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            *ngFor="let cs of caseStudies()"
            class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  {{ cs.client }}
                </span>
                <button
                  (click)="deleteCaseStudy(cs.id)"
                  [title]="i18n.t('profile.delete')"
                  class="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <app-icon name="trash" [size]="14"></app-icon>
                </button>
              </div>
              <h3 class="text-sm font-semibold text-white">{{ cs.title }}</h3>
              <p class="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{{ cs.summary }}</p>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{{ i18n.t('profile.contractValue') }}: <strong class="text-slate-200 font-semibold">{{ cs.budget }}</strong></span>
              <span>{{ cs.duration }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Case Study Modal -->
      <div *ngIf="showAddModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-sm font-semibold text-white">{{ i18n.t('profile.modalTitle') }}</h3>
            <button (click)="showAddModal.set(false)" class="text-slate-400 hover:text-white">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <form [formGroup]="caseStudyForm" (ngSubmit)="submitCaseStudy()" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">{{ i18n.t('profile.projectTitle') }}</label>
              <input
                type="text"
                formControlName="title"
                [placeholder]="i18n.t('profile.projectTitlePlaceholder')"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">{{ i18n.t('profile.clientName') }}</label>
                <input
                  type="text"
                  formControlName="client"
                  [placeholder]="i18n.t('profile.clientNamePlaceholder')"
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">{{ i18n.t('profile.contractValue') }}</label>
                <input
                  type="text"
                  formControlName="budget"
                  [placeholder]="i18n.t('profile.contractValuePlaceholder')"
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">{{ i18n.t('profile.year') }} / Duration</label>
              <input
                type="text"
                formControlName="duration"
                placeholder="12 months"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">{{ i18n.t('profile.outcomes') }}</label>
              <textarea
                rows="3"
                formControlName="summary"
                [placeholder]="i18n.t('profile.outcomesPlaceholder')"
                class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              ></textarea>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                (click)="showAddModal.set(false)"
                class="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {{ i18n.t('profile.cancel') }}
              </button>
              <button
                type="submit"
                [disabled]="caseStudyForm.invalid"
                class="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white"
              >
                {{ i18n.t('profile.saveCaseStudy') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  i18n = inject(TranslationService);

  isSaving = signal(false);
  saveSuccess = signal(false);
  showAddModal = signal(false);
  caseStudies = signal<CaseStudy[]>([]);

  profileForm = this.fb.group({
    agencyName: ['', Validators.required],
    tagline: [''],
    website: [''],
    coreCompetencies: [''],
    teamBios: ['']
  });

  caseStudyForm = this.fb.group({
    title: ['', Validators.required],
    client: ['', Validators.required],
    budget: ['€1,000,000', Validators.required],
    duration: ['12 months', Validators.required],
    summary: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          agencyName: profile.agencyName,
          tagline: profile.tagline || '',
          website: profile.website || '',
          coreCompetencies: profile.coreCompetencies || '',
          teamBios: profile.teamBios || ''
        });
        this.caseStudies.set(profile.caseStudies || []);
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSaving.set(true);

    const updated: CompanyProfile = {
      agencyName: this.profileForm.value.agencyName!,
      tagline: this.profileForm.value.tagline || '',
      website: this.profileForm.value.website || '',
      coreCompetencies: this.profileForm.value.coreCompetencies || '',
      teamBios: this.profileForm.value.teamBios || '',
      caseStudies: this.caseStudies()
    };

    this.profileService.updateProfile(updated).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: () => this.isSaving.set(false)
    });
  }

  submitCaseStudy(): void {
    if (this.caseStudyForm.invalid) return;

    const val = this.caseStudyForm.value;
    const newCase: CaseStudy = {
      id: 'cs-' + Math.random().toString(36).substring(2, 9),
      title: val.title!,
      client: val.client!,
      budget: val.budget!,
      duration: val.duration!,
      summary: val.summary!,
      technologies: ['EU Sovereign Cloud', 'Spring Boot', 'Angular']
    };

    this.profileService.addCaseStudy(newCase).subscribe({
      next: (profile) => {
        this.caseStudies.set(profile.caseStudies);
        this.showAddModal.set(false);
        this.caseStudyForm.reset({ budget: '€1,000,000', duration: '12 months' });
      }
    });
  }

  deleteCaseStudy(id: string): void {
    this.profileService.deleteCaseStudy(id).subscribe({
      next: (profile) => {
        this.caseStudies.set(profile.caseStudies);
      }
    });
  }
}
