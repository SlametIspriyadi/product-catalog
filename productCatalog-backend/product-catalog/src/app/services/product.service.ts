import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = '/api/products'; // Gunakan path relatif

  private http = inject(HttpClient);

  private productsCache$: Observable<any[]> | null = null;

  getProducts() {
    if (!this.productsCache$) {
      console.log('ProductService: Fetching products from', this.apiUrl);
      this.productsCache$ = this.http.get<any[]>(this.apiUrl, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).pipe(
        shareReplay(1)
      );
    }
    return this.productsCache$;
  }

  getProductById(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

}