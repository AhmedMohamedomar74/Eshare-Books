// forgot-password.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
  data: {
    resetToken: string;
  };
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  /**
   * Step 1: Send reset code to email
   * POST /auth/forgot-password
   */
  sendResetCode(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/auth/forgot-password`,
      { email }
    );
  }

  /**
   * Step 2: Verify the reset code
   * POST /auth/verify-reset-code
   */
  verifyResetCode(email: string, resetCode: string): Observable<VerifyResetCodeResponse> {
    return this.http.post<VerifyResetCodeResponse>(
      `${this.apiUrl}/auth/verify-reset-code`,
      { email, resetCode }
    );
  }

  /**
   * Step 3: Reset password with token
   * POST /auth/reset-password
   */
  resetPassword(resetToken: string, newPassword: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/auth/reset-password`,
      { resetToken, newPassword }
    );
  }
}
