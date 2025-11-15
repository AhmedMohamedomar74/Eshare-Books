// src/app/pages/login/login.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  showPassword: boolean = false;
  loading: boolean = false;

  showAlert: boolean = false;
  alertType: 'success' | 'error' | 'warning' = 'success';
  alertMessage: string = '';
  private alertTimeout: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();

    // لو كان اليوزر مسجل دخول قبل كده → روح للـ dashboard فورًا
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
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
      return field.errors['required'] ? 'Email is required' : 'Please enter a valid email address';
    }

    if (fieldName === 'password') {
      return field.errors['required'] ? 'Password is required' : '';
    }

    return '';
  }

  showAlertMessage(type: 'success' | 'error' | 'warning', message: string): void {
    this.showAlert = true;
    this.alertType = type;
    this.alertMessage = message;

    if (this.alertTimeout) clearTimeout(this.alertTimeout);

    this.alertTimeout = setTimeout(() => this.closeAlert(), 5000);
  }

  closeAlert(): void {
    this.showAlert = false;
    if (this.alertTimeout) clearTimeout(this.alertTimeout);
  }

  onSubmit(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });

    if (this.loginForm.invalid) return;

    this.loading = true;
    this.closeAlert();

    const { email, password } = this.loginForm.value;

    this.authService.loginAdmin({ email, password }).subscribe({
      next: () => {
        this.loading = false;
        this.showAlertMessage('success', 'Login successful!');

        // احذف setTimeout → الـ AuthGuard هيوديك فورًا
        // لأن isLoggedInSubject بيتحدث داخل loginAdmin()
        // والـ AuthGuard بيشوف التغيير من isLoggedIn$
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err.error?.message || 'Login failed. Please check your credentials.';
        this.showAlertMessage('error', msg);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.alertTimeout) clearTimeout(this.alertTimeout);
  }
}
