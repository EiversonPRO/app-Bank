import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user?: User;
  editForm: FormGroup;
  loading = true;
  saving = false;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', Validators.pattern(/^(\+?[0-9]{7,15})?$/)]
    });
  }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.user = res.data;
        this.editForm.patchValue({
          fullName: res.data.fullName,
          phone: res.data.phone ?? ''
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.user) {
      this.editForm.patchValue({
        fullName: this.user.fullName,
        phone: this.user.phone ?? ''
      });
    }
  }

  onSave(): void {
    if (this.editForm.invalid || this.saving) return;

    this.saving = true;
    this.userService.updateProfile(this.editForm.value).subscribe({
      next: (res) => {
        this.user = res.data;
        this.editMode = false;
        this.saving = false;
        this.snackBar.open('Perfil actualizado correctamente', '', { duration: 3000 });
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al actualizar el perfil';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        this.saving = false;
      }
    });
  }

  getInitials(): string {
    if (!this.user?.fullName) return '?';
    return this.user.fullName.split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}
