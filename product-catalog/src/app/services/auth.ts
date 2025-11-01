import { Injectable, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { HttpClient,HttpXsrfTokenExtractor, HttpHeaders  } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = '/api';
  private tokenExtractor = inject(HttpXsrfTokenExtractor);
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private tokenKey = 'auth_token';
  public currentUser = signal<any | null>(null); 
  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadTokenOnStart();
    effect(() => {
      this.isAuthenticated.set(this.currentUser() !== null);
    });
  }

  getCsrfToken() {
    return this.http.get('/sanctum/csrf-cookie', { withCredentials: true });
  }

  public register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData, { withCredentials: true });
  }

  // Tambahkan '/api' di sini
  login(credentials: {email: string, password: string}) {
    return this.http.post('/api/login', credentials, { 
      withCredentials: true,
      headers: {
        'X-XSRF-TOKEN': this.tokenExtractor.getToken() || ''
      }
    }).pipe(
      tap((response: any) => {
        if (response.user) {
          this.currentUser.set(response.user);
        }
      }));
  }
  public logout() {
    // Jika Anda ingin memanggil API logout, tambahkan /api juga:
    // this.http.post(`${this.baseUrl}/api/logout`, {}).subscribe(...) 
    this.clearAuthState();
    console.log('Anda telah logout');
    this.router.navigate(['/login']);
  }

  // --- Fungsi Helper ---

  private loadTokenOnStart() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this.getUserFromToken(token);
      }
    }
  }

  private getUserFromToken(token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    // Tambahkan '/api' di sini
    this.http.get(`${this.apiUrl}/user`, { headers, withCredentials: true }).subscribe({
      next: (user) => {
        this.setAuthState(token, user);
      },
      error: (err) => {
        this.clearAuthState();
      }
    });
  }

  private setAuthState(token: string, user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      this.currentUser.set(user);
    }
  }

  private clearAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      this.currentUser.set(null);
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
}