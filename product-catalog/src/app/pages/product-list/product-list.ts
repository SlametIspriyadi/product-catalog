import { 
  Component, 
  OnInit, 
  inject, 
  signal  // <-- 1. Impor 'signal'
} from '@angular/core';
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
export class ProductListComponent implements OnInit {

  // 2. Definisikan 'products' sebagai signal
  // Dimulai dengan array kosong
  products = signal<any[]>([]); 

  private productService = inject(ProductService);

  ngOnInit(): void {
    console.log('ProductListComponent dimuat, mengambil data...');

    this.productService.getProducts().subscribe({
      next: (data) => {
        // 3. Gunakan .set() untuk mengisi data ke signal
        this.products.set(data);
        
        // 4. Baca data signal dengan memanggilnya: products()
        console.log('Produk berhasil di-set ke signal!', this.products().length); 
      },
      error: (err) => {
        console.error('ERROR saat mengambil produk:', err);
      }
    });
  }
}