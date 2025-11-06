import { Component, OnInit, inject, signal } from '@angular/core'; // <-- Tambah 'signal'
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../services/category.service'; // <-- 1. IMPOR SERVICE BARU

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  
  isEditMode = false;
  productId: string | null = null;
  selectedFile: File | null = null; 
  existingImageUrl: string | null = null; 

  // --- 2. TAMBAHKAN SIGNAL UNTUK KATEGORI ---
  categories = signal<any[]>([]);

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private categoryService = inject(CategoryService); // <-- 3. INJEKSI SERVICE BARU

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      
      // --- 4. TAMBAHKAN FIELD BARU UNTUK VALIDASI ---
      stock: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      category_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadCategories(); // <-- 5. PANGGIL FUNGSI LOAD KATEGORI

    if (this.productId) {
      this.isEditMode = true;
      this.productService.getProduct(this.productId).subscribe({
        next: (product: any) => {
          const productData = product.data || product; 
          this.productForm.patchValue(productData);
          this.existingImageUrl = productData.image; 
        },
        error: (err: any) => {
          console.error('Gagal mengambil data produk:', err);
        }
      });
    } else {
      this.isEditMode = false;
    }
  }

  // --- 6. FUNGSI BARU UNTUK LOAD KATEGORI ---
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        // Asumsi API Anda mengembalikan { data: [...] }
        this.categories.set(response.data || response); 
        console.log('Kategori berhasil dimuat:', this.categories().length);
      },
      error: (err) => {
        console.error('Gagal mengambil kategori:', err);
        alert('Gagal memuat daftar kategori. Pastikan backend menyala.');
      }
    });
  }

  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
      this.existingImageUrl = null;
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    
    // --- 7. TAMBAHKAN FIELD BARU KE FORMDATA ---
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', this.productForm.get('stock')?.value); // <-- TAMBAHKAN INI
    formData.append('category_id', this.productForm.get('category_id')?.value); // <-- TAMBAHKAN INI
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    let apiCall: Observable<any>;
    
    if (this.isEditMode) {
      formData.append('_method', 'PUT');
      apiCall = this.productService.updateProduct(this.productId!, formData);
    } else {
      if (!this.selectedFile) {
         alert('Harap pilih gambar untuk produk baru.');
         return; 
      }
      apiCall = this.productService.createProduct(formData);
    }

    apiCall.subscribe({
      next: (response) => {
        this.router.navigate(['/admin']);
        alert(this.isEditMode ? 'Produk berhasil diupdate!' : 'Produk berhasil dibuat!');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 422) {
          console.error('ERROR VALIDASI 422 (Unprocessable Content):');
          console.log(err.error.errors); 
          const validationErrors = JSON.stringify(err.error.errors, null, 2);
          alert(`Gagal menyimpan produk. Periksa kembali data Anda.\nError:\n${validationErrors}`);
        } else {
          console.error(`Gagal menyimpan produk (Error ${err.status}):`, err.message);
          alert(`Terjadi error: ${err.message}`);
        }
      }
    });
  }

  // --- 8. TAMBAHKAN GETTERS BARU ---
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); } // <-- TAMBAHKAN INI
  get category_id() { return this.productForm.get('category_id'); } // <-- TAMBAHKAN INI
}