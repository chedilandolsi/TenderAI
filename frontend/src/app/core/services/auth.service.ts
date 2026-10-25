import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, SubscriptionTier, User } from '../../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly TOKEN_KEY = 'tenderai_token';
  private readonly USER_KEY = 'tenderai_user';

  // Signals for reactive modern state
  currentUserSignal = signal<User | null>(this.getStoredUser());
  tokenSignal = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  isAuthenticated = computed(() => !!this.tokenSignal());
  userTier = computed(() => this.currentUserSignal()?.subscriptionTier || 'FREE');

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  register(data: { email: string; password: string; fullName: string; agencyName?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  setTier(tier: SubscriptionTier): void {
    const user = this.currentUserSignal();
    if (user) {
      const updated = { ...user, subscriptionTier: tier };
      this.currentUserSignal.set(updated);
      localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
    }
  }

  private handleAuthSuccess(res: AuthResponse): void {
    const user: User = {
      id: res.id,
      email: res.email,
      fullName: res.fullName,
      subscriptionTier: res.subscriptionTier,
      agencyName: res.agencyName
    };

    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this.tokenSignal.set(res.token);
    this.currentUserSignal.set(user);
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }
}
