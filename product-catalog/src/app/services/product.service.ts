import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // 1. Definisikan URL API
  private apiUrl = 'http://localhost:8000/api/products';

  // 2. Inject HttpClient menggunakan fungsi inject()
  private http = inject(HttpClient);

  // 3. Buat fungsi untuk mengambil SEMUA produk
  // Fungsi ini mengembalikan sebuah Observable yang berisi array produk
  getProducts() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // 4. Buat fungsi untuk mengambil SATU produk berdasarkan ID
  getProductById(id: string) {
    // Kita gunakan backtick (`) untuk memasukkan variabel ${id} ke dalam string
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
