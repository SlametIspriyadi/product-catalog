import { Injectable, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators'; // Kita akan pakai 'tap' dari RxJS

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // 1. Definisikan URL backend Laravel Anda
  // (Pastikan ini sesuai dengan URL 'artisan serve' Anda)
  private baseUrl = 'http://localhost:8000/api'; 

  // 2. Inject service yang kita butuhkan
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // 3. Kunci untuk menyimpan token di localStorage
  private tokenKey = 'auth_token';

  // 4. SIGNALS untuk melacak status login
  // Signal ini akan menyimpan data pengguna (null jika tidak login)
  public currentUser = signal<any | null>(null); 
  
  // Signal ini akan memberitahu apakah pengguna terautentikasi
  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadTokenOnStart();

    // 5. Gunakan 'effect' untuk update 'isAuthenticated'
    // Kapanpun 'currentUser' berubah, 'isAuthenticated' akan ikut berubah
    effect(() => {
      this.isAuthenticated.set(this.currentUser() !== null);
    });
  }

  // --- Fungsi Utama ---

  // Fungsi untuk REGISTER
  public register(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
    // Kita tidak otomatis login setelah register, 
    // kita akan minta mereka login manual dulu.
  }

  // Fungsi untuk LOGIN
  public login(credentials: any) {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Jika login sukses, backend (Laravel Sanctum) akan kirim token
        // Kita simpan token dan data pengguna
        this.setAuthState(response.token, response.user);
        
        // Arahkan pengguna ke halaman produk
        this.router.navigate(['/products']); 
      })
    );
  }

  // Fungsi untuk LOGOUT
  public logout() {
    // Di sini kita juga bisa memanggil API /logout Laravel jika perlu
    // Tapi untuk sekarang, kita hapus data di sisi klien saja
    
    this.clearAuthState();
    console.log('Anda telah logout');
    // Arahkan pengguna kembali ke halaman login
    this.router.navigate(['/login']);
  }

  // --- Fungsi Helper (Bantu) ---

  // Cek token saat aplikasi pertama kali dimuat
  private loadTokenOnStart() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        // NANTINYA: Seharusnya kita panggil API /api/user di sini
        // untuk memvalidasi token dan mengambil data pengguna.
        // Untuk sekarang, kita anggap token-nya masih valid.
        // Ini HANYA CONTOH SEMENTARA:
        // this.currentUser.set({ name: 'Pengguna (dari token)' });
        
        // Karena kita belum punya data user, kita panggil /api/user
        // untuk mengambilnya menggunakan token
        this.getUserFromToken(token);
      }
    }
  }

  // (Opsional tapi sangat disarankan) Ambil data user pakai token
  private getUserFromToken(token: string) {
    // Kita perlu mengirim token di header
    const headers = { 'Authorization': `Bearer ${token}` };
    
    this.http.get(`${this.baseUrl}/user`, { headers }).subscribe({
      next: (user) => {
        // Jika token valid dan user didapat
        this.setAuthState(token, user);
      },
      error: (err) => {
        // Jika token tidak valid (misal: kadaluwarsa)
        this.clearAuthState();
      }
    });
  }

  // Helper untuk menyimpan state login
  private setAuthState(token: string, user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      this.currentUser.set(user);
    }
  }

  // Helper untuk menghapus state login
  private clearAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      this.currentUser.set(null);
    }
  }

  // Helper untuk mengambil token (jika diperlukan)
  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
}