import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { CartComponent } from './pages/cart/cart';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { authGuard } from './guards/auth.guard';

// 1. Impor Layout baru kita
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  
  // 2. Rute-rute ini akan dimuat TANPA navbar
  // Mereka dimuat langsung di <router-outlet> milik AppComponent
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // 3. Rute-rute ini akan dimuat DI DALAM MainLayoutComponent
  // (karena itu, mereka akan punya navbar)
  {
    path: '', // URL kosong
    component: MainLayoutComponent,
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailComponent },
      { 
        path: 'cart', 
        component: CartComponent,
        canActivate: [authGuard]
      },
      
      // Redirect URL kosong (root) ke halaman produk
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },

  // 4. (Opsional) Fallback jika ada URL aneh
  { path: '**', redirectTo: 'products' }
];