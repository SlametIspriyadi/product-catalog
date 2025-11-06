import { 
  Component, 
  OnInit, 
  OnDestroy,
  inject, 
  signal
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products = signal<any[]>([]);
  private productService = inject(ProductService);
  private subscription?: Subscription;

  // frontend/src/app/pages/product-list/product-list.ts

  // Ganti kode ini di src/app/pages/product-list/product-list.ts

// Ganti kode ini di src/app/pages/product-list/product-list.ts

ngOnInit(): void {
    console.log('ProductListComponent dimuat, mengambil data...');
    this.subscription = this.productService.getProducts().subscribe({
      next: (data) => {
        
        // Kita cast 'data' ke 'any' untuk mem-bypass error TS2339.
        const responseData = data as any;

        // --- PERBAIKAN / FIX ---
        // Array produk Anda ada di dalam properti 'data', bukan 'products'
        if (responseData && Array.isArray(responseData.data)) {
          
          // Ambil array dari 'responseData.data'
          this.products.set(responseData.data); 
        } 
        // Fallback jika API terkadang mengembalikan array secara langsung
        else if (Array.isArray(responseData)) {
          this.products.set(responseData);
        } 
        // Tangani jika data tidak terduga
        else {
          console.error("Struktur data produk tidak terduga:", responseData);
          this.products.set([]);
        }
        
        console.log('Produk berhasil di-set ke signal!', this.products().length);
      },
      error: (err) => {
        console.error('ERROR saat mengambil produk:', err);
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}