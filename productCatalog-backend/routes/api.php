<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;

// 1. Impor ProductController Anda
use App\Http\Controllers\Api\ProductController; 

// 2. Tambahkan Rute Produk di sini
// === RUTE PRODUK (Publik) ===
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Rute Publik (Siapapun bisa akses)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rute Privat (Hanya untuk yang sudah login)
// 'auth:sanctum' adalah penjaganya
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
