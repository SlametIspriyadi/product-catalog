import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth'; // <-- 1. Impor AuthService

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {
  private cartService = inject(CartService);
  protected readonly cart = this.cartService.cart;
  
  // 2. Inject AuthService (buat 'public' agar bisa dipakai di HTML)
  public authService = inject(AuthService); 

  // 3. Buat fungsi untuk tombol logout
  logout(): void {
    this.authService.logout();
    // AuthService akan otomatis redirect ke halaman login
  }
}