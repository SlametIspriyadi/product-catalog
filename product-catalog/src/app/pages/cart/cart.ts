import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Kita perlu ini untuk *ngFor, | currency
import { CartService } from '../../services/cart.service'; // Impor service Anda
import { RouterLink } from '@angular/router'; // Impor RouterLink untuk link

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- Pastikan di-impor
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  // 1. Inject CartService (buat 'public' agar bisa dipakai di HTML)
  public cartService = inject(CartService);

  // 2. Buat fungsi untuk tombol "Remove"
  // (Kita hanya memanggil fungsi yang sudah ada di service)
  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }
}