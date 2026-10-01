import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GuestService } from '../../services/guest.service';
import { Guest } from '../../models/guest.model';

@Component({
  selector: 'app-edit-guest',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-guest.component.html',
  styleUrl: './edit-guest.component.css',
})
export class EditGuestComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly guestService = inject(GuestService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    nickname: [''],
    relationship: [''],
    speakingStyle: [''],
    memories: this.fb.nonNullable.array([this.createItemControl()]),
    personality: this.fb.nonNullable.array([this.createItemControl()]),
  });

  guestId: number | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';

  get memories(): FormArray {
    return this.form.controls.memories;
  }

  get personality(): FormArray {
    return this.form.controls.personality;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      this.errorMessage = 'Invalid guest id.';
      return;
    }

    this.guestId = id;
    this.loading = true;
    this.guestService.getById(id).subscribe({
      next: (guest) => {
        this.patchForm(guest);
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

  addMemory(): void {
    this.memories.push(this.createItemControl());
  }

  removeMemory(index: number): void {
    if (this.memories.length > 1) {
      this.memories.removeAt(index);
    }
  }

  addPersonality(): void {
    this.personality.push(this.createItemControl());
  }

  removePersonality(index: number): void {
    if (this.personality.length > 1) {
      this.personality.removeAt(index);
    }
  }

  submit(): void {
    if (this.guestId === null) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.form.controls.name.value.trim(),
      nickname: this.optionalText(this.form.controls.nickname.value),
      relationship: this.optionalText(this.form.controls.relationship.value),
      speakingStyle: this.optionalText(this.form.controls.speakingStyle.value),
      memories: this.toNonEmptyList(this.memories),
      personality: this.toNonEmptyList(this.personality),
    };

    this.submitting = true;
    this.guestService.update(this.guestId, payload).subscribe({
      next: (guest) => {
        this.snackBar.open(`Guest "${guest.name}" updated successfully.`, 'Dismiss', {
          duration: 4000,
        });
        this.submitting = false;
        this.router.navigate(['/guests']);
      },
      error: (error) => {
        this.snackBar.open(
          error.status === 404
            ? 'Guest not found.'
            : 'Could not update guest. Make sure the backend is running on http://localhost:8090.',
          'Dismiss',
          { duration: 6000 },
        );
        this.submitting = false;
      },
    });
  }

  private patchForm(guest: Guest): void {
    this.form.patchValue({
      name: guest.name ?? '',
      nickname: guest.nickname ?? '',
      relationship: guest.relationship ?? '',
      speakingStyle: guest.speakingStyle ?? '',
    });
    this.replaceList(this.memories, guest.memories);
    this.replaceList(this.personality, guest.personality);
  }

  private replaceList(array: FormArray, values: string[] | undefined): void {
    array.clear();
    const items = values?.length ? values : [''];
    for (const value of items) {
      array.push(this.fb.nonNullable.control(value));
    }
  }

  private createItemControl() {
    return this.fb.nonNullable.control('');
  }

  private toNonEmptyList(array: FormArray): string[] {
    return array.controls
      .map((control) => control.value.trim())
      .filter((value) => value.length > 0);
  }

  private optionalText(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
}
