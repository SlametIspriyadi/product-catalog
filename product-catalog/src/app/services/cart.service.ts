import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
// 1. Impor 'isPlatformBrowser' dan 'PLATFORM_ID'
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // 2. Inject PLATFORM_ID untuk mengecek kita ada di server atau browser
  private platformId = inject(PLATFORM_ID);

  // 3. Panggilan ini sekarang aman, karena fungsi di bawahnya sudah kita perbaiki
  public cartItems = signal<any[]>(this.getCartFromLocalStorage());

  public totalItems = computed(() => this.cartItems().length);

  public totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.price, 0);
  });

  constructor() {
    // 4. 'effect' juga berjalan di server, jadi kita HARUS mengecek di dalamnya
    effect(() => {
      // HANYA simpan ke localStorage jika kita di browser
      if (isPlatformBrowser(this.platformId)) {
        this.saveCartToLocalStorage(this.cartItems());
        console.log('Keranjang disimpan ke localStorage:', this.cartItems());
      }
    });
  }

  // --- Fungsi Publik ---

  public addItem(product: any) {
    this.cartItems.update(items => [...items, product]);
    console.log(`${product.title} ditambahkan ke keranjang`);
  }

  public removeItem(productId: number) {
    this.cartItems.update(items => 
      items.filter(item => item.id !== productId)
    );
    console.log(`Item ${productId} dihapus`);
  }

  public clearCart() {
    this.cartItems.set([]);
  }

  // --- Fungsi Helper (Private) ---

  private saveCartToLocalStorage(items: any[]) {
    // 5. Tambahkan 'if' di sini
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('shopping_cart', JSON.stringify(items));
    }
  }

  private getCartFromLocalStorage(): any[] {
    // 6. Tambahkan 'if' di sini
    if (isPlatformBrowser(this.platformId)) {
      const items = localStorage.getItem('shopping_cart');
      return items ? JSON.parse(items) : [];
    }
    // 7. Jika di server, selalu kembalikan array kosong
    return [];
  }
}