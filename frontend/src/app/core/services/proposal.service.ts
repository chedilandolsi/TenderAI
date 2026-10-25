import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, Proposal, ProposalContent, ProposalRequest } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private readonly apiUrl = '/api/proposals';

  constructor(private http: HttpClient) {}

  parsePdf(file: File): Observable<{ fileName: string; text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileName: string; text: string }>(`${this.apiUrl}/parse-pdf`, formData);
  }

  generateProposal(request: ProposalRequest): Observable<Proposal> {
    return this.http.post<Proposal>(`${this.apiUrl}/generate`, request);
  }

  getProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(this.apiUrl);
  }

  getProposal(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${this.apiUrl}/${id}`);
  }

  updateProposal(id: number, content: ProposalContent): Observable<Proposal> {
    return this.http.put<Proposal>(`${this.apiUrl}/${id}`, content);
  }

  deleteProposal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  downloadPdf(id: number, filename = 'TenderAI_Proposal.pdf'): void {
    this.http.get(`${this.apiUrl}/${id}/export/pdf`, { responseType: 'blob' }).subscribe(blob => {
      this.triggerDownload(blob, filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    });
  }

  downloadDocx(id: number, filename = 'TenderAI_Proposal.docx'): void {
    this.http.get(`${this.apiUrl}/${id}/export/docx`, { responseType: 'blob' }).subscribe(blob => {
      this.triggerDownload(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
    });
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
