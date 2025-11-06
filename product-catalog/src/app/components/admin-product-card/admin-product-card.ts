import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- Impor RouterLink
  templateUrl: './admin-product-card.html',
  styleUrls: ['./admin-product-card.css']
})
export class AdminProductCardComponent {
  // Menerima data produk dari parent (admin-product-list)
  @Input({ required: true }) product: any;

  // Mengirimkan event 'delete' ke parent saat tombol delete diklik
  @Output() delete = new EventEmitter<number>();

  onDeleteClick(): void {
    // Tampilkan konfirmasi sebelum menghapus
    if (confirm(`Apakah Anda yakin ingin menghapus "${this.product.name}"?`)) {
      // Kirim ID produk ke parent
      this.delete.emit(this.product.id);
    }
  }
}