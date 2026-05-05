import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      documentNumber: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]]
    });
  }

  private extractError(err: any, fallback: string): string {
    if (!err.error) return fallback;
    if (err.error.message) return err.error.message;
    // Backend validation returns a field-error map (400)
    if (typeof err.error === 'object') {
      const msgs = Object.values(err.error).filter(v => typeof v === 'string');
      if (msgs.length) return (msgs as string[]).join(' | ');
    }
    return fallback;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading) return;

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open('¡Cuenta creada exitosamente!', '', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = this.extractError(err, 'Error al registrarse. Intente nuevamente.');
        this.snackBar.open(msg, 'Cerrar', { duration: 5000, panelClass: 'snack-error' });
        this.loading = false;
      }
    });
  }
}
