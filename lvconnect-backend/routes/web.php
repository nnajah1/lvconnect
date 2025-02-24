<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OAuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('login/google', [OAuthController::class, 'redirectToGoogle']);
Route::get('login/google/callback', [OAuthController::class, 'handleGoogleCallback']);


