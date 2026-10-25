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

  private cache = new Map<LanguageCode, Record<string, any>>();
  private fallbackCache: Record<string, any> = {};

  currentLang = signal<LanguageCode>(this.getInitialLanguage());
  translations = signal<Record<string, any>>({});
  isLoaded = signal<boolean>(false);

  currentLanguageOption = computed(() => {
    return this.languages.find(l => l.code === this.currentLang()) || this.languages[0];
  });

  constructor(private http: HttpClient) {
    this.initTranslations();
  }

  private async initTranslations(): Promise<void> {
    const initial = this.currentLang();
    await this.loadLanguage(initial);
    // Pre-cache English as primary fallback
    if (initial !== 'en') {
      this.fetchLanguage('en').then(enData => {
        this.fallbackCache = enData;
        this.cache.set('en', enData);
      }).catch(() => {});
    } else {
      this.fallbackCache = this.translations();
    }

    // Pre-cache other languages in background for zero-latency switching
    const others = this.languages.map(l => l.code).filter(c => c !== initial && c !== 'en');
    for (const code of others) {
      this.fetchLanguage(code).then(data => {
        this.cache.set(code, data);
      }).catch(() => {});
    }
  }

  async setLanguage(lang: LanguageCode): Promise<void> {
    if (this.currentLang() === lang && this.isLoaded()) return;

    localStorage.setItem(this.STORAGE_KEY, lang);

    if (this.cache.has(lang)) {
      this.currentLang.set(lang);
      this.translations.set(this.cache.get(lang)!);
      this.isLoaded.set(true);
      return;
    }

    this.currentLang.set(lang);
    await this.loadLanguage(lang);
  }

  private async fetchLanguage(lang: LanguageCode): Promise<Record<string, any>> {
    return await firstValueFrom(this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`));
  }

  async loadLanguage(lang: LanguageCode): Promise<void> {
    try {
      const data = await this.fetchLanguage(lang);
      this.cache.set(lang, data);
      this.translations.set(data);
      this.isLoaded.set(true);
    } catch (e) {
      console.warn(`Could not load translations for ${lang}, falling back to English`, e);
      if (lang !== 'en') {
        try {
          const fallback = await this.fetchLanguage('en');
          this.cache.set('en', fallback);
          this.fallbackCache = fallback;
          this.translations.set(fallback);
        } catch {
          // ignore
        }
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
        current = null;
        break;
      }
    }

    if (typeof current === 'string' && current.length > 0) {
      return current;
    }

    // Check English fallback dictionary
    let fb: any = this.fallbackCache;
    for (const key of keys) {
      if (fb && typeof fb === 'object' && key in fb) {
        fb = fb[key];
      } else {
        fb = null;
        break;
      }
    }

    if (typeof fb === 'string' && fb.length > 0) {
      return fb;
    }

    return fallback || path;
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
