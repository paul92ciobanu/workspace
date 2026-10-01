import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-add-guest',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './add-guest.component.html',
  styleUrl: './add-guest.component.css',
})
export class AddGuestComponent {
  private readonly fb = inject(FormBuilder);
  private readonly guestService = inject(GuestService);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    nickname: [''],
    relationship: [''],
    speakingStyle: [''],
    memories: this.fb.nonNullable.array([this.createItemControl()]),
    personality: this.fb.nonNullable.array([this.createItemControl()]),
  });

  submitting = false;

  get memories(): FormArray {
    return this.form.controls.memories;
  }

  get personality(): FormArray {
    return this.form.controls.personality;
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
    this.guestService.create(payload).subscribe({
      next: (guest) => {
        this.snackBar.open(`Guest "${guest.name}" saved successfully.`, 'Dismiss', {
          duration: 4000,
        });
        this.resetForm();
        this.submitting = false;
      },
      error: () => {
        this.snackBar.open(
          'Could not save guest. Make sure the backend is running on http://localhost:8090.',
          'Dismiss',
          { duration: 6000 },
        );
        this.submitting = false;
      },
    });
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

  private resetForm(): void {
    this.form.reset({ name: '', nickname: '', relationship: '', speakingStyle: '' });
    this.memories.clear();
    this.personality.clear();
    this.memories.push(this.createItemControl());
    this.personality.push(this.createItemControl());
  }
}
