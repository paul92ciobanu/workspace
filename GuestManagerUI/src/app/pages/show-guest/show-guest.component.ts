import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GuestService } from '../../services/guest.service';
import { Guest } from '../../models/guest.model';

@Component({
  selector: 'app-show-guest',
  imports: [
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './show-guest.component.html',
  styleUrl: './show-guest.component.css',
})
export class ShowGuestComponent implements OnInit {
  private readonly guestService = inject(GuestService);

  guests: Guest[] = [];
  loading = false;
  errorMessage = '';
  readonly displayedColumns = [
    'id',
    'name',
    'relationship',
    'speakingStyle',
    'memories',
    'personality',
    'actions',
  ];

  ngOnInit(): void {
    this.loadGuests();
  }

  loadGuests(): void {
    this.loading = true;
    this.errorMessage = '';
    this.guestService.getAll().subscribe({
      next: (guests) => {
        this.guests = guests;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'Could not load guests. Make sure the backend is running on http://localhost:8090.';
        this.loading = false;
      },
    });
  }
}
