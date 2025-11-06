import { 
  Component, 
  OnInit, 
  inject, 
  signal  // <-- 1. Impor 'signal'
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {

  // 2. Definisikan 'product' sebagai signal, dimulai dari 'undefined'
  product = signal<any>(undefined); 

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  // Fungsi untuk menambahkan produk ke keranjang 
  addToCart() {
    const currentProduct = this.product();
    if (currentProduct) {
      const button = document.querySelector('.add-to-cart-btn') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'Adding...';
      }

      this.cartService.addToCart(currentProduct).subscribe({
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
    } else {
      console.error('No product to add to cart.');
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      
      if (productId) {
        this.productService.getProduct(productId).subscribe((data: any) => {
          // 3. Gunakan .set() untuk mengisi data ke signal
          this.product.set(data);
          console.log('Detail produk di-set ke signal!', this.product());
        });
      }
    });
  }
}