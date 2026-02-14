import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthResponse {
  status?: string;
  message?: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  _id: string;
  firstName: string;
  secondName: string;
  email: string;
  role: 'admin' | 'user';
  profilePic?: string;
  address?: string;
  isConfirmed: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';
  private userUrl = 'http://localhost:3000/user';

  private accessToken: string | null = null;
  private refreshTokenValue: string | null = null;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshTokenValue = localStorage.getItem('refreshToken');
    const hasTokens = !!this.accessToken && !!this.refreshTokenValue;
    this.isLoggedInSubject.next(hasTokens);

    if (hasTokens) {
      this.loadUserProfile().subscribe({
        error: (err) => {
          if (err.status === 401 || err.status === 403) {
            this.logout();
          }
        },
      });
    }
  }

  public loadUserProfile(): Observable<UserProfile> {
    const token = this.getAccessToken();

    return this.http
      .get<any>(`${this.userUrl}/profile`, {
        headers: {
          Authorization: `admin ${token}`,
        },
      })
      .pipe(
        map((response) => {
          const profile = response.data || response;
          return profile;
        }),
        tap((profile) => {
          this.currentUserSubject.next(profile);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  loginAdmin(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      map((response) => {
        if (response.data) {
          return response;
        }
        return {
          status: 'success',
          message: 'Login successful',
          data: response as any,
        };
      }),
      switchMap((res) => {
        this.setTokens(res.data.accessToken, res.data.refreshToken);

        return this.loadUserProfile().pipe(
          map((profile) => {
            if (profile.role !== 'admin') {
              this.logout();
              throw new Error('ACCESS_DENIED_NOT_ADMIN');
            }
            return res;
          })
        );
      }),
      catchError((error) => {
        if (error.message === 'ACCESS_DENIED_NOT_ADMIN') {
          this.logout();
          return throwError(() => new Error('Access denied. Admin privileges required.'));
        }
        return throwError(() => error);
      })
    );
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshTokenValue = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.isLoggedInSubject.next(true);
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken');
    }
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    if (!this.refreshTokenValue) {
      this.refreshTokenValue = localStorage.getItem('refreshToken');
    }
    return this.refreshTokenValue;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.accessToken = null;
    this.refreshTokenValue = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
