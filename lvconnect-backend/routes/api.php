<?php

use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\TrustedDeviceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OTPController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refreshToken']);

Route::post('/send-otp', [OTPController::class, 'sendOTP']);
Route::post('/verify-otp', [OTPController::class, 'verifyOTP']);
    
Route::post('/must-change-password', [ChangePasswordController::class, 'mustChangePassword']);

Route::post('/trusted-device', [TrustedDeviceController::class, 'storeDevice']); // Store a trusted device
Route::get('/trusted-device/check', [TrustedDeviceController::class, 'checkDevice']); // Check if a device is trusted

Route::get('/login/google/redirect', [OAuthController::class, 'redirectToGoogle']);
Route::get('/login/google/callback', [OAuthController::class, 'handleGoogleCallback']);
Route::post('/auth/google/token', [OAuthController::class, 'exchangeGoogleToken']);

Route::middleware('auth.jwt')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/logout', [AuthController::class, 'logout']);
    Route::post('/create-user', [AuthController::class, 'createUser']);
    Route::get('/trusted-devices', [TrustedDeviceController::class, 'index']); // List all trusted devices
    Route::delete('/trusted-devices/{device_id}', [TrustedDeviceController::class, 'destroy']); // Remove a trusted device
    Route::post('/verify-password-otp', [OTPController::class, 'verifyOtpForPasswordChange']);
    Route::post('/change-password', [ChangePasswordController::class, 'ChangePassword']);
});
