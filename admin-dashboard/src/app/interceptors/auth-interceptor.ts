// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, take } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../shared/services/auth';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService); // ← صحيح 100%
  const token = authService.getAccessToken(); // ← هيشتغل دلوقتي

  // إضافة الـ token لو موجود
  const authReq = token ? req.clone({ setHeaders: { Authorization: `admin ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error) => {
      // لو 401 ومش login أو refresh
      if (
        error.status === 401 &&
        !req.url.includes('/auth/refresh-token') &&
        !req.url.includes('/auth/login')
      ) {
        const refreshSubject = authService.getRefreshTokenInProgress();

        if (!refreshSubject.getValue()) {
          authService.startRefresh();
          return authService.performRefreshToken().pipe(
            switchMap((res: any) => {
              authService.completeRefresh(res.accessToken);
              return next(req.clone({ setHeaders: { Authorization: `admin ${res.accessToken}` } }));
            }),
            catchError((err) => {
              authService.completeRefresh(null);
              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return refreshSubject.pipe(
            take(1),
            switchMap((newToken) => {
              if (newToken) {
                return next(req.clone({ setHeaders: { Authorization: `admin ${newToken}` } }));
              }
              authService.logout();
              return throwError(() => error);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
