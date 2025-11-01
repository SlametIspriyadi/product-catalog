import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

// 1. Impor AuthService
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  public loginError: string | null = null;
  private returnUrl: string = '/products';

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/products'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
    
    this.authService.getCsrfToken().subscribe();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    this.loginError = null;
    
    // First get CSRF token, then attempt login
    this.authService.getCsrfToken().subscribe({
      next: () => {
        this.authService.login(this.loginForm.value).subscribe({
          next: (response) => {
            console.log('Login berhasil!', response);
            this.router.navigateByUrl(this.returnUrl);
          },
          error: (err) => {
            console.error('Login gagal:', err);
            this.loginError = err.error.message || 'Email atau password salah. Coba lagi.';
          }
        });
      },
      error: (err) => {
        console.error('Gagal mendapatkan CSRF token:', err);
        this.loginError = 'Terjadi kesalahan sistem. Silakan coba lagi.';
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}
  // (Getter email/password Anda tetap sama)
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}