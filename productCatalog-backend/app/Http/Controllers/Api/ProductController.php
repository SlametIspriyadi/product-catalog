<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product; // <-- 1. Impor model Product
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Menampilkan semua produk (untuk halaman list)
     */
    public function index()
    {
        // 2. Ambil semua produk & kirim sebagai JSON
        return Product::all();
    }

    /**
     * Menampilkan satu produk spesifik (untuk halaman detail)
     */
    public function show(Product $product)
    {
        // 3. 'Product $product' adalah "Route Model Binding".
        // Laravel otomatis mencari produk berdasarkan ID di URL.
        // Kita tinggal mengembalikannya.
        return $product;
    }
}