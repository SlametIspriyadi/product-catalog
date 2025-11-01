import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, Observable } from 'rxjs';
import { Cart, CartItem } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private apiUrl = '/api/cart';

  private cartSignal = signal<Cart>({ 
    items: [], 
    total: 0,
    itemCount: 0
  });
  
  cart = computed(() => this.cartSignal());

  private updateCartTotals(cart: Cart) {
    cart.itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return cart;
  }
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          const cart = JSON.parse(saved);
          if (cart && Array.isArray(cart.items)) {
            this.cartSignal.set(cart);
          }
        } catch (e) {
          console.error('Error parsing cart from localStorage:', e);
          localStorage.removeItem('cart'); // Clear invalid data
        }
      }
    }
    
    // Set up effect to save cart to localStorage when it changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('cart', JSON.stringify(this.cart()));
      }
    });
  }

  private loadCart() {
    // Initialize with empty cart
    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0
    };
    this.cartSignal.set(emptyCart);

    if (isPlatformBrowser(this.platformId)) {
      // First try to load from localStorage
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          const cart = JSON.parse(saved);
          if (cart && Array.isArray(cart.items)) {
            this.cartSignal.set(this.updateCartTotals(cart));
          }
        } catch (e) {
          console.error('Error parsing cart from localStorage:', e);
          localStorage.removeItem('cart');
        }
      }
    }
    
    // Then try to sync with server
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => {
        if (cart && Array.isArray(cart.items)) {
          const updatedCart = this.updateCartTotals(cart);
          this.cartSignal.set(updatedCart);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
          }
        }
      },
      error: (error) => {
        console.error('Error syncing cart with server:', error);
      }
    });
  }

  // --- Fungsi Publik ---

  addToCart(product: CartItem) {
    const currentCart = { ...this.cartSignal() };
    const existingItem = currentCart.items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.items.push({ ...product, quantity: 1 });
    }

    this.cartSignal.set(this.updateCartTotals(currentCart));

    return this.syncCartWithServer();
  }

  removeFromCart(productId: number) {
    const currentCart = { ...this.cartSignal() };
    currentCart.items = currentCart.items.filter(item => item.id !== productId);
    this.cartSignal.set(this.updateCartTotals(currentCart));
    return this.syncCartWithServer();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      return this.removeFromCart(productId);
    }

    const currentCart = { ...this.cartSignal() };
    const item = currentCart.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartSignal.set(this.updateCartTotals(currentCart));
      return this.syncCartWithServer();
    }
    return new Observable(subscriber => subscriber.complete());
  }

  clearCart() {
    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0
    };
    this.cartSignal.set(emptyCart);
    return this.syncCartWithServer();
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>('/api/cart').pipe(
      tap({
        next: (cart) => {
          if (cart && Array.isArray(cart.items)) {
            this.cartSignal.set(cart);
          }
        },
        error: (error) => {
          console.error('Failed to fetch cart from server:', error);
        }
      })
    );
  }

  // --- Fungsi Helper (Private) ---

  private syncCartWithServer(): Observable<any> {
    return this.http.post('/api/cart/sync', this.cart()).pipe(
      tap({
        next: (response: any) => {
          // Update local cart with server response if needed
          if (response?.items) {
            this.cartSignal.set(response);
          }
        },
        error: (error) => {
          console.error('Failed to sync cart with server:', error);
        }
      })
    );
  }

  // Helper methods
  isProductInCart(productId: number): boolean {
    return this.cart().items.some(item => item.id === productId);
  }

  getItemQuantity(productId: number): number {
    const item = this.cart().items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
}