import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 shadow-xl shadow-brand-500/20 mb-4">
          <span class="text-white font-bold text-xl">T</span>
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-white">
          Create Agency Account
        </h2>
        <p class="mt-2 text-sm text-slate-400">
          Start generating compliant European tender proposals with AI
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-slate-900/90 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10 backdrop-blur-sm">
          <div *ngIf="errorMessage()" class="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center space-x-2">
            <span>{{ errorMessage() }}</span>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label for="fullName" class="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                formControlName="fullName"
                placeholder="Dr. Elena Vance"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label for="agencyName" class="block text-xs font-medium text-slate-300 mb-1.5">
                Agency / Consultancy Name
              </label>
              <input
                id="agencyName"
                type="text"
                formControlName="agencyName"
                placeholder="Aethelgard Digital Solutions"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label for="email" class="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="elena@aethelgard.eu"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label for="password" class="block text-xs font-medium text-slate-300 mb-1.5">
                Password (min. 6 characters)
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="registerForm.invalid || isLoading()"
                class="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-lg shadow-brand-600/25 transition-all duration-150"
              >
                <app-icon *ngIf="isLoading()" name="loader" [size]="16" classNames="animate-spin"></app-icon>
                <span>{{ isLoading() ? 'Creating account...' : 'Create Account' }}</span>
              </button>
            </div>
          </form>

          <div class="mt-6 text-center text-xs text-slate-400">
            Already have an account?
            <a routerLink="/auth/login" class="font-medium text-brand-400 hover:text-brand-300 transition-colors ml-1">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    agencyName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { fullName, agencyName, email, password } = this.registerForm.value;

    this.auth.register({
      fullName: fullName!,
      agencyName: agencyName!,
      email: email!,
      password: password!
    }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || err.error?.error || 'Registration failed. Email might already exist.');
      }
    });
  }
}
