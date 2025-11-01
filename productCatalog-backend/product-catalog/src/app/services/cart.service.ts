import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl = '/api/cart';

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  public cartItems = signal<any[]>([]);
  
  constructor() {
    // Initialize with empty array
    this.cartItems.set([]);
    this.cartItemsSubject.next([]);

    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          const items = JSON.parse(saved);
          if (Array.isArray(items)) {
            this.cartItemsSubject.next(items);
            this.cartItems.set(items);
          }
        } catch (e) {
          console.error('Error parsing cart from localStorage:', e);
          localStorage.removeItem('cart'); // Clear invalid data
        }
      }
    }
  }

  public totalItems = computed(() => {
    const items = this.cartItems();
    return Array.isArray(items) ? items.length : 0;
  });

  public totalPrice = computed(() => {
    const items = this.cartItems();
    return Array.isArray(items) ? 
      items.reduce((total, item) => total + (parseFloat(item.price) || 0), 0) : 0;
  });

  private loadCart() {
    // Initialize with empty array
    const emptyCart: any[] = [];
    this.cartItems.set(emptyCart);
    this.cartItemsSubject.next(emptyCart);

    if (isPlatformBrowser(this.platformId)) {
      // First try to load from localStorage
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          const items = JSON.parse(saved);
          if (Array.isArray(items)) {
            this.cartItemsSubject.next(items);
            this.cartItems.set(items);
          }
        } catch (e) {
          console.error('Error parsing cart from localStorage:', e);
          localStorage.removeItem('cart');
        }
      }
    }
    
    // Then try to sync with server
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (items) => {
        if (Array.isArray(items)) {
          this.cartItemsSubject.next(items);
          this.cartItems.set(items);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('cart', JSON.stringify(items));
          }
        }
      },
      error: (error) => {
        console.error('Error syncing cart with server:', error);
      }
    });
  }

  // --- Fungsi Publik ---

  public addToCart(product: any) {
    // Update local state first
    const currentItems = this.cartItems();
    const updatedItems = Array.isArray(currentItems) ? [...currentItems] : [];
    updatedItems.push(product);
    
    this.cartItems.set(updatedItems);
    this.cartItemsSubject.next(updatedItems);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }

    // Then try to sync with server
    return this.http.post('/api/cart/add', {
      product_id: product.id,
      quantity: 1
    }, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap({
        next: (response) => {
          console.log('Product added to cart successfully:', response);
        },
        error: (error) => {
          console.error('Failed to sync cart with server:', error);
        }
      })
    );
  }

  public removeItem(productId: number) {
    this.cartItems.update(items => 
      items.filter(item => item.id !== productId)
    );
    return this.http.delete(`/api/cart/${productId}`, {
      withCredentials: true
    });
  }

  public clearCart() {
    this.cartItems.set([]);
    return this.http.delete('/api/cart', {
      withCredentials: true
    });
  }

  public getCartFromServer() {
    return this.http.get<any[]>('/api/cart', {
      withCredentials: true
    });
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