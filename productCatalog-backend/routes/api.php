<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;


Route::get('/test-cors-config', function () {
    return response()->json([
        'env_value' => env('SANCTUM_STATEFUL_DOMAINS'), // Apa nilai dari .env?
        'config_value' => config('sanctum.stateful'), // Apa nilai yang dibaca config?
    ]);
});

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

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::delete('/cart/{id}', [CartController::class, 'remove']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Admin Product Routes
    Route::prefix('admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });
});
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
