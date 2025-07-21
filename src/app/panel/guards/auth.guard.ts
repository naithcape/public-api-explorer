import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';

  if (!isAuthenticated) {
    router.navigate(['/panel/login']);
    return false;
  }

  return true;
};
