import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminAuthGuard: CanActivateFn = () => {

  const router = inject(Router);

  const adminLoggedIn =
    localStorage.getItem('adminLoggedIn');

  if (adminLoggedIn === 'true') {
    return true;
  }

  alert('Please login as admin first.');

  return router.parseUrl('/admin-login');
};
