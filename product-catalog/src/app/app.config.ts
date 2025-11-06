import { ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { 
  provideHttpClient, 
  withFetch, 
  // withCredentials,
  withXsrfConfiguration 
} from '@angular/common/http';

// 1. Impor interceptor Anda
import { credentialsInterceptor } from './with-credentials-interceptor'; 
// 2. Impor 'withInterceptors'
import { withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withFetch(),
      // withCredentials(),
      withXsrfConfiguration({ 
        cookieName: 'XSRF-TOKEN', // Nama cookie Laravel
        headerName: 'X-XSRF-TOKEN' // Nama header Laravel
      }),
      // 4. TAMBAHKAN 'withInterceptors' DI SINI
      withInterceptors([
        credentialsInterceptor, // <-- Daftarkan interceptor Anda
        authInterceptor
      ])
    ),
    // ...
  ]
};