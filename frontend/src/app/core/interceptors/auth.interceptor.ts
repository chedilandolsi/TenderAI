import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Never intercept static translation asset requests
  if (req.url.includes('/assets/i18n/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();
  // Read language directly from localStorage to prevent circular DI with TranslationService
  const currentLang = (typeof localStorage !== 'undefined' ? localStorage.getItem('tenderai_lang') : null) || 'en';

  const headers: Record<string, string> = {
    'Accept-Language': currentLang
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const clonedReq = req.clone({
    setHeaders: headers
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/auth/login')) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
