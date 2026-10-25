import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type LanguageCode = 'en' | 'fr' | 'de' | 'es' | 'it';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'tenderai_lang';

  readonly languages: LanguageOption[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' }
  ];

  currentLang = signal<LanguageCode>(this.getInitialLanguage());
  translations = signal<Record<string, any>>({});
  isLoaded = signal<boolean>(false);

  currentLanguageOption = computed(() => {
    return this.languages.find(l => l.code === this.currentLang()) || this.languages[0];
  });

  constructor(private http: HttpClient) {
    this.loadLanguage(this.currentLang());
  }

  async setLanguage(lang: LanguageCode): Promise<void> {
    if (this.currentLang() === lang && this.isLoaded()) return;
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    await this.loadLanguage(lang);
  }

  async loadLanguage(lang: LanguageCode): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`));
      this.translations.set(data);
      this.isLoaded.set(true);
    } catch (e) {
      console.warn(`Could not load translations for ${lang}, falling back to English`);
      if (lang !== 'en') {
        const fallback = await firstValueFrom(this.http.get<Record<string, any>>(`/assets/i18n/en.json`));
        this.translations.set(fallback);
      }
      this.isLoaded.set(true);
    }
  }

  t(path: string, fallback?: string): string {
    const keys = path.split('.');
    let current: any = this.translations();

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback || path;
      }
    }

    return typeof current === 'string' ? current : (fallback || path);
  }

  private getInitialLanguage(): LanguageCode {
    const saved = localStorage.getItem(this.STORAGE_KEY) as LanguageCode;
    if (saved && ['en', 'fr', 'de', 'es', 'it'].includes(saved)) {
      return saved;
    }

    const browserLang = (navigator.language || 'en').substring(0, 2).toLowerCase();
    if (['en', 'fr', 'de', 'es', 'it'].includes(browserLang)) {
      return browserLang as LanguageCode;
    }

    return 'en';
  }
}
