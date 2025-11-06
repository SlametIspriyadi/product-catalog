import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getCookie } from '../utils/helper'; // <-- Impor helper baru

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Interceptor ini hanya boleh bekerja di browser
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // 1. Ambil Bearer Token dari localStorage
  const token = localStorage.getItem('auth_token'); // <-- Ambil langsung dari localStorage
  
  // 2. Ambil XSRF-TOKEN dari cookie
  const xsrfToken = getCookie('XSRF-TOKEN');

  // Jika tidak ada token, lanjutkan saja
  if (!token && !xsrfToken) {
    return next(req);
  }

  // Buat header baru
  let headers = req.headers;

  // 3. Tambahkan header Authorization (jika ada)
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // 4. Tambahkan header X-XSRF-TOKEN (jika ada)
  if (xsrfToken) {
    headers = headers.set('X-XSRF-TOKEN', xsrfToken);
  }

  // Clone request dengan header baru
  const clonedReq = req.clone({
    headers: headers
  });

  return next(clonedReq);
};