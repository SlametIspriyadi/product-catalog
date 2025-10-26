import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Untuk *ngIf
// 1. Impor semua yang kita butuhkan untuk Reactive Forms
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { RouterLink } from '@angular/router'; // Untuk link "Register"
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // 2. Tambahkan ReactiveFormsModule di sini
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService); // <-- Inject
  public loginError: string | null = null; // <-- (Opsional) untuk pesan error
  
  // // 3. Buat variabel untuk form kita
  // loginForm!: FormGroup;

  // // 4. Inject FormBuilder untuk "membangun" form
  // private fb = inject(FormBuilder);

  // 5. Kita pakai ngOnInit untuk menginisialisasi form saat komponen dimuat
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Buat dua kontrol: 'email' dan 'password'
      // Kita juga tambahkan validasi dasar
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 6. Buat fungsi yang akan dipanggil saat form disubmit
  onSubmit() {
    if (this.loginForm.valid) {
      this.loginError = null; // Bersihkan error lama
      // Panggil service Anda
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Sukses! AuthService akan otomatis redirect
          console.log('Login berhasil!');
        },
        error: (err) => {
          // Tangani jika login gagal
          console.error('Login gagal', err);
          this.loginError = 'Email atau password salah. Coba lagi.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // 7. (Helper) Buat getter agar lebih mudah mengecek error di HTML
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}