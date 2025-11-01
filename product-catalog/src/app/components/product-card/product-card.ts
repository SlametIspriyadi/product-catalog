// Pastikan 'Input' ditambahkan di sini
import { Component, Input, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {

  // Tambahkan baris ini!
  // @Input() memberitahu Angular bahwa properti 'product'
  // akan diisi dari komponen luar (yaitu dari product-list).
  @Input() product: any;
  
  public authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  addToCart(product: any) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      button.disabled = true;
      button.textContent = 'Adding...';
    }

    this.cartService.addToCart(product).subscribe({
      next: () => {
        if (button) {
          button.textContent = 'Added to Cart';
          setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Add to Cart';
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        if (button) {
          button.disabled = false;
          button.textContent = 'Add to Cart';
        }
        alert('Product added to cart locally. Syncing with server failed.');
      }
    });
  }

}