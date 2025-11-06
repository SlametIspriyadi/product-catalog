import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Subscription } from 'rxjs';
import { AdminProductCardComponent } from '../../../components/admin-product-card/admin-product-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  // Pastikan untuk mengimpor AdminProductCardComponent dan RouterLink
  imports: [CommonModule, AdminProductCardComponent, RouterLink], 
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products = signal<any[]>([]);
  private productService = inject(ProductService);
  private subscription?: Subscription;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('AdminProductListComponent dimuat, mengambil data...');
    this.subscription = this.productService.getProducts().subscribe({
      next: (data) => {
        const responseData = data as any;
        if (responseData && Array.isArray(responseData.data)) {
          this.products.set(responseData.data);
        } else if (Array.isArray(responseData)) {
          this.products.set(responseData);
        } else {
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

  // Fungsi ini akan dipanggil oleh event (delete) dari admin-product-card
  handleDelete(productId: number): void {
    console.log('Menghapus produk dengan ID:', productId);

    this.productService.deleteProduct(productId.toString()).subscribe({
      next: (res) => {
        console.log('Produk berhasil dihapus', res);
        // Hapus produk dari signal agar UI ter-update tanpa reload
        this.products.update(currentProducts => 
          currentProducts.filter(p => p.id !== productId)
        );
      },
      error: (err) => {
        console.error('ERROR saat menghapus produk:', err);
        alert('Gagal menghapus produk. Silakan coba lagi.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}