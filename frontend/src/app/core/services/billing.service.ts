import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutResponse } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private readonly apiUrl = '/api/billing';

  constructor(private http: HttpClient) {}

  createCheckoutSession(planTier: 'PRO' | 'AGENCY'): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, {
      planTier,
      successUrl: window.location.origin + '/billing?status=success&session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: window.location.origin + '/billing?status=cancelled'
    });
  }

  getSubscription(): Observable<{ tier: string; stripeCustomerId: string; stripeSubscriptionId: string }> {
    return this.http.get<{ tier: string; stripeCustomerId: string; stripeSubscriptionId: string }>(`${this.apiUrl}/subscription`);
  }

  simulateUpgrade(tier: 'PRO' | 'AGENCY'): Observable<{ success: boolean; tier: string; message: string }> {
    return this.http.post<{ success: boolean; tier: string; message: string }>(`${this.apiUrl}/simulate-upgrade`, { tier });
  }
}
