import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Impor semua yang kita butuhkan untuk Reactive Forms
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { RouterLink } from '@angular/router'; // Untuk link "Login"
import { AuthService } from '../../services/auth'; // <-- Impor
import { Router } from '@angular/router'; // <-- Impor Router

@Component({
  selector: 'app-register',
  standalone: true,
  // 2. Tambahkan ReactiveFormsModule dan RouterLink
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  // 3. PENTING: Kita pakai ulang CSS dari login agar gayanya sama!
  styleUrls: ['../login/login.css'] 
})
export class RegisterComponent implements OnInit {
registerForm!: FormGroup;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService); // <-- Inject
  private router = inject(Router); // <-- Inject
  public registerError: any = null;

  ngOnInit(): void {
    // 4. Buat form dengan tiga field: name, email, password
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerError = null;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          console.log('Registrasi berhasil!');
          // Arahkan ke halaman login setelah sukses register
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registrasi gagal', err);
          this.registerError = err.error.errors; // Tampilkan error validasi
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // 5. Buat getter untuk validasi di HTML
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