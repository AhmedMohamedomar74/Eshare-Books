import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);

  // Skip adding token for auth endpoints
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/signup') ||
    req.url.includes('/auth/verify');

  // Get token from localStorage directly
  const token = localStorage.getItem('accessToken');

  // Clone request and attach token if available
  let authReq = req;
  if (token && !isAuthEndpoint) {
    authReq = req.clone({
      setHeaders: { Authorization: `admin ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      // Only handle HTTP errors
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      // Handle 401 Unauthorized - Token expired or invalid
      if (error.status === 401) {
        logoutUser(router);
        return throwError(() => error);
      }

      // Handle 403 Forbidden - User doesn't have admin role
      if (error.status === 403) {
        logoutUser(router);
        return throwError(() => new Error('Access denied. Admin privileges required.'));
      }

      return throwError(() => error);
    })
  );
};

function logoutUser(router: Router) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  router.navigate(['/login']);
}
