// src/app/shared/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';
  private accessToken: string | null = null;
  private refreshTokenValue: string | null = null;

  // أضف ده: لإشعار الـ AuthGuard
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private refreshTokenInProgress = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshTokenValue = localStorage.getItem('refreshToken');
    this.isLoggedInSubject.next(!!this.accessToken); // تهيئة الحالة
  }

  loginAdmin(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.isLoggedInSubject.next(true); // أخبر الكل إنك logged in
      })
    );
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshTokenValue = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshTokenValue;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  logout(): void {
    this.accessToken = null;
    this.refreshTokenValue = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isLoggedInSubject.next(false); // أخبر الكل إنك logged out
    this.completeRefresh(null);
    this.router.navigate(['/login']);
  }

  // --- Refresh Token ---
  public startRefresh(): void {
    this.refreshTokenInProgress.next(null);
  }

  public completeRefresh(token: string | null): void {
    this.refreshTokenInProgress.next(token);
  }

  public getRefreshTokenInProgress(): BehaviorSubject<string | null> {
    return this.refreshTokenInProgress;
  }

  public performRefreshToken(): Observable<AuthResponse> {
    if (!this.refreshTokenValue) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<AuthResponse>(
        `${this.baseUrl}/refresh-token`,
        {},
        {
          headers: { Authorization: `user ${this.refreshTokenValue}` },
        }
      )
      .pipe(
        tap((res) => {
          this.setTokens(res.accessToken, res.refreshToken);
          this.isLoggedInSubject.next(true);
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  getProfile(): Observable<any> {
    return this.http.get('http://localhost:3000/user/profile');
  }
}
