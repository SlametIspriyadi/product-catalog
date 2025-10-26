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
      this.cartService.addItem(currentProduct);
      console.log(`${currentProduct.title} ditambahkan ke keranjang dari ProductDetailComponent`);
    } else {
      console.error('Tidak ada produk untuk ditambahkan ke keranjang.');
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      
      if (productId) {
        this.productService.getProductById(productId).subscribe(data => {
          // 3. Gunakan .set() untuk mengisi data ke signal
          this.product.set(data);
          console.log('Detail produk di-set ke signal!', this.product());
        });
      }
    });
  }
}