import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [ngClass]="classNames"
    >
      <!-- Layout / Dashboard -->
      <ng-container *ngIf="name === 'dashboard'">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </ng-container>

      <!-- File / Proposal -->
      <ng-container *ngIf="name === 'file-text'">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </ng-container>

      <!-- Building / Agency Profile -->
      <ng-container *ngIf="name === 'building'">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </ng-container>

      <!-- Sparkles / AI Wizard -->
      <ng-container *ngIf="name === 'sparkles'">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </ng-container>

      <!-- Credit Card / Billing -->
      <ng-container *ngIf="name === 'credit-card'">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </ng-container>

      <!-- Check -->
      <ng-container *ngIf="name === 'check'">
        <path d="M20 6 9 17l-5-5" />
      </ng-container>

      <!-- Plus -->
      <ng-container *ngIf="name === 'plus'">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </ng-container>

      <!-- Trash -->
      <ng-container *ngIf="name === 'trash'">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
      </ng-container>

      <!-- Upload -->
      <ng-container *ngIf="name === 'upload'">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </ng-container>

      <!-- Download -->
      <ng-container *ngIf="name === 'download'">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </ng-container>

      <!-- Chevron Right -->
      <ng-container *ngIf="name === 'chevron-right'">
        <path d="m9 18 6-6-6-6" />
      </ng-container>

      <!-- Arrow Right -->
      <ng-container *ngIf="name === 'arrow-right'">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </ng-container>

      <!-- Arrow Left -->
      <ng-container *ngIf="name === 'arrow-left'">
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </ng-container>

      <!-- Loader / Spinner -->
      <ng-container *ngIf="name === 'loader'">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </ng-container>

      <!-- Shield Check -->
      <ng-container *ngIf="name === 'shield-check'">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
      </ng-container>

      <!-- Clock -->
      <ng-container *ngIf="name === 'clock'">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </ng-container>

      <!-- Log Out -->
      <ng-container *ngIf="name === 'log-out'">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </ng-container>

      <!-- User -->
      <ng-container *ngIf="name === 'user'">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </ng-container>

      <!-- External Link -->
      <ng-container *ngIf="name === 'external-link'">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
      </ng-container>

      <!-- Menu -->
      <ng-container *ngIf="name === 'menu'">
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </ng-container>

      <!-- Close / X -->
      <ng-container *ngIf="name === 'x'">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  @Input() name = 'dashboard';
  @Input() size = 18;
  @Input() classNames = '';
}
