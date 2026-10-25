import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/components/icon.component';
import { AuthResponse } from '../../models';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div class="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl max-w-md w-full space-y-5">
        <div *ngIf="isVerifying()" class="space-y-4">
          <app-icon name="loader" [size]="36" classNames="animate-spin text-brand-400 mx-auto"></app-icon>
          <h2 class="text-base font-semibold text-white">Verifying Email Address</h2>
          <p class="text-xs text-slate-400">Validating your verification token...</p>
        </div>

        <div *ngIf="!isVerifying() && isSuccess()" class="space-y-4">
          <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <app-icon name="shield-check" [size]="24"></app-icon>
          </div>
          <h2 class="text-lg font-bold text-white">Email Address Verified!</h2>
          <p class="text-xs text-slate-300">
            {{ message() || 'Your TenderAI agency workspace is now fully activated.' }}
          </p>
          <div class="pt-2">
            <a
              routerLink="/dashboard"
              class="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <span>Go to Dashboard</span>
              <app-icon name="arrow-right" [size]="14"></app-icon>
            </a>
          </div>
        </div>

        <div *ngIf="!isVerifying() && !isSuccess()" class="space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <app-icon name="x" [size]="24"></app-icon>
          </div>
          <h2 class="text-lg font-bold text-white">Verification Failed</h2>
          <p class="text-xs text-rose-400">
            {{ errorMessage() || 'The verification link is invalid or has expired.' }}
          </p>
          <div class="pt-2">
            <a
              routerLink="/auth/login"
              class="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
            >
              <span>Back to Login</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  i18n = inject(TranslationService);

  isVerifying = signal(true);
  isSuccess = signal(false);
  message = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.isVerifying.set(false);
      this.isSuccess.set(false);
      this.errorMessage.set('No verification token provided.');
      return;
    }

    this.http.get<AuthResponse>(`/api/auth/verify-email?token=${token}`).subscribe({
      next: (res) => {
        this.isVerifying.set(false);
        this.isSuccess.set(true);
        this.message.set(res.message || 'Email verified successfully.');

        if (res.token) {
          localStorage.setItem('tenderai_token', res.token);
          this.auth.tokenSignal.set(res.token);
          const user = {
            id: res.id,
            email: res.email,
            fullName: res.fullName,
            subscriptionTier: res.subscriptionTier,
            agencyName: res.agencyName
          };
          localStorage.setItem('tenderai_user', JSON.stringify(user));
          this.auth.currentUserSignal.set(user);
        }
      },
      error: (err) => {
        this.isVerifying.set(false);
        this.isSuccess.set(false);
        this.errorMessage.set(err.error?.message || 'Verification token is invalid or has expired.');
      }
    });
  }
}
