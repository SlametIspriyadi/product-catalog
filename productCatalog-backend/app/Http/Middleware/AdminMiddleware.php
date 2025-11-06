<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user sudah login DAN rolenya 'admin'
        if (auth()->user() && auth()->user()->role == 'admin') {
            return $next($request); // Lanjutkan
        }

        // Jika bukan, tolak
        return response()->json(['message' => 'Akses ditolak'], 403);
        // return $next($request);
    }
}
