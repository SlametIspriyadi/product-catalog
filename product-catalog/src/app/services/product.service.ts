import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products';
  private http = inject(HttpClient);

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: FormData): Observable<any> { // <-- Ubah 'any' menjadi 'FormData' agar lebih jelas
    // Tetap POST, ini sudah benar
    return this.http.post(this.apiUrl, data);
  }

  // --- PERUBAHAN DI SINI ---
  updateProduct(id: string, data: FormData): Observable<any> { // <-- Ubah 'any' menjadi 'FormData'
    // Ubah dari 'put' menjadi 'post'
    // Laravel akan membacanya sebagai PUT/PATCH karena kita mengirim 
    // field '_method: "PUT"' di dalam FormData.
    return this.http.post(`${this.apiUrl}/${id}`, data);
  }
  // --- AKHIR PERUBAHAN ---

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}