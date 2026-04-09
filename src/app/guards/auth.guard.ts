import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';


export const authGuard: CanActivateFn = (route, state) => {
  // Injection de services
  const authService = inject(AuthService)
  const router = inject(Router)

  const currentUser = authService.currentUser()
  if (currentUser) return true

  router.navigate(['/login'])
  return false
};
