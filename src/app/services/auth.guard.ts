import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const session = localStorage.getItem('supabaseSession');
  if (session) {
    return true;
  } else {
    window.location.href = '/login';
    return false;
  }
};
