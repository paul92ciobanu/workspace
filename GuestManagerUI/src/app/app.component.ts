import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon class="brand-icon">groups</mat-icon>
      <span class="brand">Guest Manager</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/guests" routerLinkActive="active-link">
        <mat-icon>table_rows</mat-icon>
        Show guests
      </a>
      <a mat-button routerLink="/add" routerLinkActive="active-link">
        <mat-icon>person_add</mat-icon>
        Add guest
      </a>
    </mat-toolbar>

    <div class="app-content">
      <router-outlet />
    </div>
  `,
  styles: [
    `
      .app-toolbar {
        position: sticky;
        top: 0;
        z-index: 10;
        gap: 0.25rem;
        min-height: 52px;
        padding: 0 0.75rem;
        overflow: hidden;
      }

      .brand-icon {
        margin-right: 0.5rem;
      }

      .brand {
        font-weight: 500;
        letter-spacing: 0.2px;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .app-toolbar a[mat-button] {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .active-link {
        background: rgba(255, 255, 255, 0.18);
        border-radius: 8px;
      }

      .app-content {
        max-width: 100%;
        overflow-x: hidden;
        padding: 1rem 0.75rem 2rem;
      }
    `,
  ],
})
export class AppComponent {}
