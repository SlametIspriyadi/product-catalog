// GANTI SEMUA DI src/app/app.routes.ts DENGAN KODE INI

import { Routes } from '@angular/router';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { CartComponent } from './pages/cart/cart';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin-guard'; // Pastikan Anda mengimpor ini
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

// Impor semua komponen yang diperlukan
import { ProductListComponent } from './pages/product-list/product-list';
import { ProductFormComponent } from './pages/admin/product-form/product-form';

// Ganti nama impor komponen daftar admin agar tidak bentrok
import { ProductListComponent as AdminProductListComponent } from './pages/admin/product-list/product-list'; 

export const routes: Routes = [
  
  // --- Rute Tanpa Layout (Login/Register) ---
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // --- Rute DENGAN Layout (Navbar, dll) ---
  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      // Rute Pelanggan
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { 
        path: 'cart', 
        component: CartComponent,
        canActivate: [authGuard]
      },
      
      // === RUTE ADMIN (PERBAIKANNYA DI SINI) ===
      { 
        path: 'admin', // <-- Rute /admin yang hilang
        component: AdminProductListComponent, // <-- Muat komponen daftar admin
        canActivate: [adminGuard] 
      },
      { 
        path: 'admin/products/new', // <-- Rute form
        component: ProductFormComponent, 
        canActivate: [adminGuard]
      },
      { 
        path: 'admin/products/edit/:id', // <-- Rute edit
        component: ProductFormComponent, 
        canActivate: [adminGuard]
      },
      // === AKHIR RUTE ADMIN ===

      // Redirect halaman utama ke /products
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },

  // Fallback terakhir
  { path: '**', redirectTo: 'products' }
];