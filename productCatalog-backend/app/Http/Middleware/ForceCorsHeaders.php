<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceCorsHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http.Request): (\Symfony\Component\HttpFoundation.Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah ini preflight request (OPTIONS)
        if ($request->isMethod('OPTIONS')) {
            // Langsung kirim respons 204 No Content dengan header CORS
            return response('', 204) 
                  ->header('Access-Control-Allow-Origin', 'http://localhost:4200')
                  ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE') // Izinkan metode yang Anda butuhkan
                  ->header('Access-Control-Allow-Headers', 'Content-Type, X-XSRF-TOKEN, Authorization') // Header penting
                  ->header('Access-Control-Allow-Credentials', 'true');
        }

        // 2. Jika bukan OPTIONS, lanjutkan request seperti biasa
        $response = $next($request);

        // 3. Tambahkan header CORS ke response yang akan dikirim
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:4200');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
