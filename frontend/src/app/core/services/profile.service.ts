import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaseStudy, CompanyProfile } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = '/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<CompanyProfile> {
    return this.http.get<CompanyProfile>(this.apiUrl);
  }

  updateProfile(profile: CompanyProfile): Observable<CompanyProfile> {
    return this.http.put<CompanyProfile>(this.apiUrl, profile);
  }

  addCaseStudy(caseStudy: CaseStudy): Observable<CompanyProfile> {
    return this.http.post<CompanyProfile>(`${this.apiUrl}/case-studies`, caseStudy);
  }

  deleteCaseStudy(id: string): Observable<CompanyProfile> {
    return this.http.delete<CompanyProfile>(`${this.apiUrl}/case-studies/${id}`);
  }
}
