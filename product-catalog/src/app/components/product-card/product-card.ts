// Pastikan 'Input' ditambahkan di sini
import { Component, Input } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {

  // Tambahkan baris ini!
  // @Input() memberitahu Angular bahwa properti 'product'
  // akan diisi dari komponen luar (yaitu dari product-list).
  @Input() product: any;

  constructor() { }

}