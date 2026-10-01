import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GuestService } from '../../services/guest.service';
import { Guest } from '../../models/guest.model';

@Component({
  selector: 'app-view-guest',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './view-guest.component.html',
  styleUrl: './view-guest.component.css',
})
export class ViewGuestComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly guestService = inject(GuestService);

  guestJson = '';
  guestName = '';
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.errorMessage = 'Invalid guest id.';
      return;
    }

    this.loading = true;
    this.guestService.getById(id).subscribe({
      next: (guest: Guest) => {
        this.guestName = guest.name;
        this.guestJson = JSON.stringify(guest, null, 2);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.status === 404
            ? 'Guest not found.'
            : 'Could not load guest. Make sure the backend is running on http://localhost:8090.';
        this.loading = false;
      },
    });
  }
}
