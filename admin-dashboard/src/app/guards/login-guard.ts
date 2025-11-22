import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../shared/services/auth';

export const LoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();

  // If not logged in, allow access to login page
  if (!isLoggedIn) {
    return true;
  }

  const currentUser = authService.getCurrentUser();

  // If logged in but profile not loaded yet
  if (!currentUser) {
    router.navigate(['/dashboard']);
    return false;
  }

  // If logged in and is admin, redirect to dashboard
  if (currentUser.role === 'admin') {
    router.navigate(['/dashboard']);
    return false;
  }

  // If logged in but not admin, logout and allow login
  authService.logout();
  return true;
};
