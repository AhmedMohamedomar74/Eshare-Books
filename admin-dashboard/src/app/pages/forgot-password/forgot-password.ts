// forgot-password.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ForgotPasswordService } from '../../shared/services/forget-password';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword implements OnInit, OnDestroy {
  currentStep = 1;

  emailForm!: FormGroup;
  codeForm!: FormGroup;
  passwordForm!: FormGroup;

  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  userEmail = '';
  resetToken = ''; // Store reset token from Step 2

  showAlert = false;
  alertType: 'success' | 'error' | 'warning' = 'success';
  alertMessage = '';

  private alertTimeout?: number;
  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.codeForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^\d+$/)
      ]],
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const errors: ValidationErrors = {};
    if (!/[a-z]/.test(password)) errors['lowercase'] = true;
    if (!/[A-Z]/.test(password)) errors['uppercase'] = true;
    if (!/[0-9]/.test(password)) errors['number'] = true;
    if (!/[@$!%*?&]/.test(password)) errors['special'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  getPasswordStrength(): { strength: number; label: string; color: string } {
    const password = this.passwordForm.get('newPassword')?.value || '';
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'strength-weak', 'strength-fair', 'strength-good', 'strength-strong'];

    return { strength, label: labels[strength], color: colors[strength] };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  markAsTouched(form: FormGroup, fieldName: string): void {
    const field = form.get(fieldName);
    if (field) field.markAsTouched();
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (fieldName === 'email') {
      if (field.errors['required']) return 'Email is required';
      if (field.errors['email']) return 'Please enter a valid email address';
    }

    if (fieldName === 'code') {
      if (field.errors['required']) return 'Verification code is required';
      if (field.errors['minlength'] || field.errors['maxlength']) return 'Code must be 6 digits';
      if (field.errors['pattern']) return 'Code must contain only numbers';
    }

    if (fieldName === 'newPassword') {
      if (field.errors['required']) return 'Password is required';
      if (field.errors['minlength']) return 'Password must be at least 8 characters';
      if (field.errors['lowercase']) return 'Password must contain a lowercase letter';
      if (field.errors['uppercase']) return 'Password must contain an uppercase letter';
      if (field.errors['number']) return 'Password must contain a number';
      if (field.errors['special']) return 'Password must contain a special character (@$!%*?&)';
    }

    if (fieldName === 'confirmPassword') {
      if (field.errors['required']) return 'Please confirm your password';
      if (form.errors?.['passwordMismatch']) return 'Passwords do not match';
    }

    return '';
  }

  showAlertMessage(type: 'success' | 'error' | 'warning', message: string): void {
    this.showAlert = true;
    this.alertType = type;
    this.alertMessage = message;

    if (this.alertTimeout) window.clearTimeout(this.alertTimeout);
    this.alertTimeout = window.setTimeout(() => this.closeAlert(), 5000);
  }

  closeAlert(): void {
    this.showAlert = false;
    if (this.alertTimeout) window.clearTimeout(this.alertTimeout);
  }

  // Step 1: Send verification code
  onSendCode(): void {
    Object.keys(this.emailForm.controls).forEach((key) => {
      this.emailForm.get(key)?.markAsTouched();
    });

    if (this.emailForm.invalid) {
      this.showAlertMessage('warning', 'Please enter a valid email address');
      return;
    }

    this.loading = true;
    this.closeAlert();
    this.userEmail = this.emailForm.value.email;

    const sub = this.forgotPasswordService.sendResetCode(this.userEmail).subscribe({
      next: (response) => {
        this.loading = false;
        this.showAlertMessage('success', response.message || 'Verification code sent to your email');
        this.currentStep = 2;
      },
      error: (err: any) => {
        this.loading = false;
        let message = 'Failed to send reset code. Please try again.';

        if (err.error?.message) {
          message = err.error.message;
        } else if (err.status === 0) {
          message = 'Network error. Please check your connection.';
        }

        this.showAlertMessage('error', message);
      }
    });

    this.subs.push(sub);
  }

  // Step 2: Verify code
  onVerifyCode(): void {
    Object.keys(this.codeForm.controls).forEach((key) => {
      this.codeForm.get(key)?.markAsTouched();
    });

    if (this.codeForm.invalid) {
      this.showAlertMessage('warning', 'Please enter a valid 6-digit code');
      return;
    }

    this.loading = true;
    this.closeAlert();

    const sub = this.forgotPasswordService.verifyResetCode(
      this.userEmail,
      this.codeForm.value.code
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.resetToken = response.data.resetToken; // Store token for Step 3
        this.showAlertMessage('success', response.message || 'Code verified successfully');
        this.currentStep = 3;
      },
      error: (err: any) => {
        this.loading = false;
        let message = 'Invalid or expired code. Please try again.';

        if (err.error?.message) {
          message = err.error.message;
        } else if (err.status === 400) {
          message = 'Invalid or expired reset code';
        } else if (err.status === 0) {
          message = 'Network error. Please check your connection.';
        }

        this.showAlertMessage('error', message);
      }
    });

    this.subs.push(sub);
  }

  // Step 3: Reset password
  onResetPassword(): void {
    Object.keys(this.passwordForm.controls).forEach((key) => {
      this.passwordForm.get(key)?.markAsTouched();
    });

    if (this.passwordForm.invalid) {
      this.showAlertMessage('warning', 'Please fill in all fields correctly');
      return;
    }

    this.loading = true;
    this.closeAlert();

    const sub = this.forgotPasswordService.resetPassword(
      this.resetToken,
      this.passwordForm.value.newPassword
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.showAlertMessage('success', response.message || 'Password reset successful! Redirecting to login...');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.loading = false;
        let message = 'Failed to reset password. Please try again.';

        if (err.error?.message) {
          message = err.error.message;
        } else if (err.status === 401) {
          message = 'Reset session expired. Please start over.';
          // Optionally reset to step 1
          setTimeout(() => {
            this.currentStep = 1;
            this.codeForm.reset();
            this.passwordForm.reset();
            this.resetToken = '';
          }, 2000);
        } else if (err.status === 0) {
          message = 'Network error. Please check your connection.';
        }

        this.showAlertMessage('error', message);
      }
    });

    this.subs.push(sub);
  }

  resendCode(): void {
    this.codeForm.reset();
    this.onSendCode(); // Resend code to the same email
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.alertTimeout) window.clearTimeout(this.alertTimeout);
    this.subs.forEach((s) => s.unsubscribe());
  }
}
