import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const librarianGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  
  if ((!authService.isAuthenticated() || !authService.isLibrarian()) && (!authService.isAuthenticated() || !authService.isAdmin())) {
    return false
  }
  return true;
};
