import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../shared/services/auth';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  const isLoggedIn = authService.isLoggedIn();

  // Check if user is logged in
  if (!isLoggedIn || !accessToken) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return true;
  }

  // Check if user has admin role
  if (currentUser.role !== 'admin') {
    alert('Access denied. This dashboard is for admins only.');
    authService.logout();
    return false;
  }

  return true;
};
