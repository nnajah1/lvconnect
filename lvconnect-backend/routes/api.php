<?php

use App\Http\Controllers\OAuthController;
use App\Http\Controllers\TrustedDeviceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OTPController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refreshToken']);

Route::get('/login/google/redirect', [OAuthController::class, 'redirectToGoogle']);
Route::get('/login/google/callback', [OAuthController::class, 'handleGoogleCallback']);
Route::post('/auth/google/token', [OAuthController::class, 'exchangeGoogleToken']);

Route::middleware('auth.jwt')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::post('/createUser', [AuthController::class, 'createUser']);
});

Route::post('/send-otp', [OTPController::class, 'sendOTP']);
Route::post('/verify-otp', [OTPController::class, 'verifyOTP']);

Route::middleware('auth:api')->group(function () {
    Route::post('/trusted-device', [TrustedDeviceController::class, 'store']); // Store a trusted device
    Route::get('/trusted-device/check', [TrustedDeviceController::class, 'isTrusted']); // Check if a device is trusted
    Route::get('/trusted-devices', [TrustedDeviceController::class, 'listTrustedDevices']); // List all trusted devices
    Route::delete('/trusted-device', [TrustedDeviceController::class, 'removeTrustedDevices']); // Remove a trusted device
});