<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
// use App\Http\Middleware\ForceCorsHeaders;
use App\Http\Middleware\Cors;



return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        
        // $app->middleware([
        //     \App\Http\Middleware\Cors::class,
        // ]);

        // $middleware->alias([
        //   \App\Http\Middleware\Cors::class,
        // ]);
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);


        $middleware->statefulApi();
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
        $middleware->web(\Illuminate\Cookie\Middleware\EncryptCookies::class);
        $middleware->web(\Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class);
        $middleware->web(\Illuminate\Session\Middleware\StartSession::class);
        $middleware->web(\Illuminate\View\Middleware\ShareErrorsFromSession::class);
        $middleware->web(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);

        // $middleware->append(ForceCorsHeaders::class);

        // $middleware->append(ForceCorsHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
