import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div class="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-w-sm w-full space-y-4">
        <app-icon name="loader" [size]="32" classNames="animate-spin text-brand-400 mx-auto"></app-icon>
        <h2 class="text-base font-semibold text-white">Completing Google Authentication</h2>
        <p class="text-xs text-slate-400">Verifying sovereign security credentials and loading your workspace...</p>
      </div>
    </div>
  `
})
export class OAuth2CallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      localStorage.setItem('tenderai_token', token);
      this.auth.tokenSignal.set(token);

      // Fetch user info from /api/auth/me
      this.http.get<any>('/api/auth/me').subscribe({
        next: (user) => {
          localStorage.setItem('tenderai_user', JSON.stringify(user));
          this.auth.currentUserSignal.set(user);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      this.router.navigate(['/auth/login'], { queryParams: { error: 'oauth2_failed' } });
    }
  }
}
