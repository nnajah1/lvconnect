<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/createUser', [AuthController::class, 'createUser']);

Route::middleware('auth:api')->group(function () {
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::post('/dashboard', [AuthController::class, 'dashboard']);
    Route::post('/createUser', [AuthController::class, 'createUser']);
});