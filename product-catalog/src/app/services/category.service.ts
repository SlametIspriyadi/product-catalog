import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Asumsi URL backend Anda untuk kategori
  private apiUrl = 'http://localhost:8000/api/categories'; 
  private http = inject(HttpClient);

  /**
   * Mengambil SEMUA kategori
   */
  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}