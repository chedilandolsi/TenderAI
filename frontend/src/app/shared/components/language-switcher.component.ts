import { Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageCode, LanguageOption, TranslationService } from '../../core/services/translation.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative inline-flex items-center" #container>
      <!-- Styled European Language Select with Native Change Event Support -->
      <div class="relative inline-flex items-center">
        <select
          id="language-select"
          aria-label="Language Selector"
          [value]="i18n.currentLang()"
          (change)="onLanguageChange($event)"
          class="appearance-none bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors shadow-sm"
        >
          <option *ngFor="let lang of i18n.languages" [value]="lang.code" class="bg-slate-900 text-slate-200 py-1">
            {{ lang.flag }} {{ lang.label }} ({{ lang.code | uppercase }})
          </option>
        </select>

        <!-- Flag Indicator on Left -->
        <span class="absolute left-2.5 text-sm pointer-events-none select-none">
          {{ i18n.currentLanguageOption().flag }}
        </span>

        <!-- Chevron Indicator on Right -->
        <app-icon
          name="chevron-right"
          [size]="12"
          classNames="absolute right-2 rotate-90 text-slate-400 pointer-events-none"
        ></app-icon>
      </div>
    </div>
  `
})
export class LanguageSwitcherComponent {
  i18n = inject(TranslationService);

  constructor(private elementRef: ElementRef) {}

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select && select.value) {
      const code = select.value as LanguageCode;
      this.i18n.setLanguage(code);
    }
  }

  selectLanguage(code: LanguageCode): void {
    this.i18n.setLanguage(code);
  }
}
