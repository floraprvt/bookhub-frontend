import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)

  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    return false
  }
  return true;
};
