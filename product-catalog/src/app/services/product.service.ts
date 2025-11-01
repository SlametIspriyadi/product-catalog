import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

interface ProductResponse {
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';
  private http = inject(HttpClient);
  private productsCache$: Observable<any[]> | null = null;

  getProducts(): Observable<any[]> {
    if (!this.productsCache$) {
      console.log('ProductService: Fetching products from', this.apiUrl);
      this.productsCache$ = this.http.get<ProductResponse>(this.apiUrl).pipe(
        map(response => Array.isArray(response.data) ? response.data : []),
        shareReplay(1)
      );
    }
    return this.productsCache$;
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}