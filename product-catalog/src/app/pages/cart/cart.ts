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
  private cartService = inject(CartService);
  
  // Create computed signals for the template
  protected readonly cart = this.cartService.cart;

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity).subscribe();
  }
}