import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  showPassword = false;
  loading = false;

  showAlert = false;
  alertType: 'success' | 'error' | 'warning' = 'success';
  alertMessage = '';

  private alertTimeout?: number;
  private subs: Subscription[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  markAsTouched(fieldName: string): void {
    const field = this.loginForm.get(fieldName);
    if (field) field.markAsTouched();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (fieldName === 'email') {
      if (field.errors['required']) return 'Email is required';
      if (field.errors['email']) return 'Please enter a valid email address';
    }

    if (fieldName === 'password') {
      if (field.errors['required']) return 'Password is required';
      if (field.errors['minlength']) return 'Password must be at least 6 characters';
    }

    return '';
  }

  showAlertMessage(type: 'success' | 'error' | 'warning', message: string): void {
    this.showAlert = true;
    this.alertType = type;
    this.alertMessage = message;

    if (this.alertTimeout) {
      window.clearTimeout(this.alertTimeout);
    }

    this.alertTimeout = window.setTimeout(() => this.closeAlert(), 5000);
  }

  closeAlert(): void {
    this.showAlert = false;
    if (this.alertTimeout) {
      window.clearTimeout(this.alertTimeout);
    }
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.invalid) {
      this.showAlertMessage('warning', 'Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    this.closeAlert();

    const { email, password } = this.loginForm.value;

    const sub = this.authService.loginAdmin({ email, password }).subscribe({
      next: (response) => {
        this.loading = false;
        this.showAlertMessage('success', 'Login successful! Redirecting...');

        this.router.navigate(['/dashboard']).then((success) => {
          if (!success) {
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 500);
          }
        });
      },
      error: (err: any) => {
        this.loading = false;

        let message = 'Login failed. Please check your credentials.';

        if (err.message === 'Access denied. Admin privileges required.') {
          message = 'Access denied. This dashboard is for admins only.';
        } else if (err.status === 401) {
          message = 'Invalid email or password';
        } else if (err.status === 404) {
          message = 'User not found or not confirmed';
        } else if (err.status === 400) {
          message = 'Please provide valid email and password';
        } else if (err.error?.message) {
          message = err.error.message;
        } else if (err.error?.errors) {
          message = Array.isArray(err.error.errors)
            ? err.error.errors.join(', ')
            : err.error.errors;
        }

        this.showAlertMessage('error', message);
      },
    });

    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    if (this.alertTimeout) {
      window.clearTimeout(this.alertTimeout);
    }
    this.subs.forEach((s) => s.unsubscribe());
  }
}
