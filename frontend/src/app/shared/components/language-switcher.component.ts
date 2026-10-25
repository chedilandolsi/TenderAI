import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageCode, LanguageOption, TranslationService } from '../../core/services/translation.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative inline-block text-left">
      <!-- Trigger Button -->
      <button
        type="button"
        (click)="isOpen.set(!isOpen())"
        class="inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
        aria-haspopup="true"
        [attr.aria-expanded]="isOpen()"
      >
        <span class="text-sm leading-none">{{ i18n.currentLanguageOption().flag }}</span>
        <span class="uppercase tracking-wider font-semibold text-[11px] text-slate-300">
          {{ i18n.currentLang() }}
        </span>
        <app-icon name="chevron-right" [size]="12" classNames="rotate-90 text-slate-400"></app-icon>
      </button>

      <!-- Dropdown Menu -->
      <div
        *ngIf="isOpen()"
        class="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 divide-y divide-slate-800/60"
      >
        <div class="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          European Languages
        </div>
        <div class="py-1">
          <button
            *ngFor="let lang of i18n.languages"
            type="button"
            (click)="selectLanguage(lang.code)"
            [ngClass]="{
              'bg-brand-500/10 text-brand-300 font-semibold': i18n.currentLang() === lang.code,
              'text-slate-300 hover:bg-slate-800 hover:text-white': i18n.currentLang() !== lang.code
            }"
            class="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors"
          >
            <div class="flex items-center space-x-2.5">
              <span class="text-sm">{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </div>
            <span *ngIf="i18n.currentLang() === lang.code" class="text-brand-400 text-xs">✓</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class LanguageSwitcherComponent {
  i18n = inject(TranslationService);
  isOpen = signal(false);

  constructor(private elementRef: ElementRef) {}

  selectLanguage(code: LanguageCode): void {
    this.i18n.setLanguage(code);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
