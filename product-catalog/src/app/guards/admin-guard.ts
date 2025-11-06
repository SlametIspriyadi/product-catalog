import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Impor AuthService Anda

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Cek signal 'currentUser' dari AuthService
  if (authService.isAuthenticated() && authService.currentUser()?.role === 'admin') {
    return true; // Izinkan
  }

  // Jika bukan admin, tendang ke halaman utama
  router.navigate(['/products']);
  return false; 
};