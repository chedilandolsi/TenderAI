import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private i18n = inject(TranslationService);

  transform(key: string, fallback?: string): string {
    return this.i18n.t(key, fallback);
  }
}
