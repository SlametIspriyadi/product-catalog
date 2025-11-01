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

  ngOnInit(): void {
    console.log('ProductListComponent dimuat, mengambil data...');
    this.subscription = this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
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