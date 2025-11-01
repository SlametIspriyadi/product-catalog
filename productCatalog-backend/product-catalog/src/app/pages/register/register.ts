import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // <-- 1. Impor Router

// 2. Impor AuthService
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['../login/login.css'] // (Tetap pakai CSS login)
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  private fb = inject(FormBuilder);
  
  // 3. Inject AuthService dan Router
  private authService = inject(AuthService);
  private router = inject(Router);

  // 4. (Opsional) Variabel untuk error validasi dari Laravel
  public validationErrors: any = null;

  ngOnInit(): void {
    this.authService.getCsrfToken().subscribe();
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    // 5. Hapus console.log lama, ganti dengan ini
    if (this.registerForm.valid) {
      this.validationErrors = null; // Bersihkan error lama

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registrasi berhasil!', response);
          // 6. Arahkan pengguna ke halaman Login setelah sukses
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Jika gagal (misal: 422 Unprocessable Entity / email sudah ada)
          console.error('Registrasi gagal:', err);
          this.validationErrors = err.error; // Simpan error dari Laravel
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // (Getter name/email/password Anda tetap sama)
  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
}