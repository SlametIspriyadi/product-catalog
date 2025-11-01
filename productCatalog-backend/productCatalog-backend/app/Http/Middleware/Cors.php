<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);

        $frontendUrl = env('ORIGIN'); // add this line  
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->header('Access-Control-Allow-Origin', 'http://localhost:4200');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');

        // return [
        //         'paths' => ['api/login', 'api/register', 'api/products'],
        //         // Methods I want to allow for CORS:
        //         'allowed_methods' => ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
        //         // Origins from where I allow access without CORS interference:
        //         'allowed_origins' => ['http://localhost:4200'],

        //         'allowed_origins_patterns' => [],

        //         // Headers I want to allow to receive in frontend requests:
        //         'allowed_headers' => ['Content-Type', 'Authorization', 'Accept'],

        //         'exposed_headers' => [],
        //         // Don't perform preflight until 1 hour has passed:
        //         'max_age' => 3600,
        //         // Indicates if the browser can send cookies (works with tokens):
        //         'supports_credentials' => false 
        //     ];

        return $response;
    }
}
