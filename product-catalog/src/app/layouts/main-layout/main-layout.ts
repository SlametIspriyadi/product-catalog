import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../../services/cart.service'; // Sesuaikan path jika perlu
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  // 1. Tambahkan semua impor yang dibutuhkan navbar
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {
  // Ini seharusnya sudah ada:
  public cartService = inject(CartService);
  
  // 2. Inject AuthService (buat 'public' agar bisa dipakai di HTML)
  public authService = inject(AuthService); 

  // 3. Buat fungsi untuk tombol logout
  logout(): void {
    this.authService.logout();
    // AuthService akan otomatis redirect ke halaman login
  }
}