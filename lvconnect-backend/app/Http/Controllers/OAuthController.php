<?php

namespace App\Http\Controllers;

use App\Models\TrustedDevice;
use App\Notifications\OTPNotification;
use Illuminate\Http\Request; // For handling HTTP requests
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class OAuthController extends Controller
{
    // Redirect to Google for authentication
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // Handle Google callback and authentication
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Check if user exists using google_id or email
            $user = User::where('email', $googleUser->getEmail())
                ->orWhere('google_id', $googleUser->getId())
                ->first();

            if (!$user) {
                return redirect(env('FRONTEND_URL') . "/login?error=Account+not+found");
            }

            // If user exists but doesn't have a google_id, update it
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }

            $tempCode = bin2hex(random_bytes(20)); // Generate temporary auth code
            Cache::put("oauth_code_{$tempCode}", [
                'user_id' => $user->id,
                'email' => $user->email,
                'created_at' => now()
            ], 300); // Store for 2 minutes

            // Redirect to frontend with the temporary code
            return redirect(to: env('FRONTEND_URL') . "/google-auth-success?code={$tempCode}");

        } catch (\Exception $e) {
            Log::error("Google OAuth Callback Error", ['message' => $e->getMessage()]);
            return redirect(env('FRONTEND_URL') . '/login?error=google_failed');
        }
    }

    // Exchange Google OAuth Code for JWT Token
    public function exchangeGoogleToken(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'device_id' => 'nullable|string',
            'remember_device' => 'nullable|boolean',
        ]);


        try {
            $tempCode = $request->input('code');
            $userData = Cache::pull("oauth_code_{$tempCode}");

            if (!$userData) {
                Log::warning("OAuth Code Not Found or Expired", ['tempCode' => $tempCode]);
                return response()->json(['error' => 'Invalid or expired OAuth code'], 400);
            }

            // Fetch user from database
            $user = User::find($userData['user_id']);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Hash device ID and check if it's trusted
            $hashedDeviceId = hash('sha256', $request->device_id);

            $trustedDevice = TrustedDevice::where('user_id', $user->id)
                ->where('device_id', $hashedDeviceId)
                ->first();

            if (!$trustedDevice) {
                $OTPController = App::make(OTPController::class);
                $OTPController->sendOTP(new Request([
                    'user_id' => $user->id,
                    'purpose' => 'unrecognized_device'
                ]));

                return response()->json([
                    'success' => false,
                    'otp_required' => true,
                    'user_id' => encrypt($user->id),
                ]);
            }

            // If device is trusted, generate JWT token
            $token = JWTAuth::fromUser($user);
            $refreshToken = JWTAuth::fromUser($user, ['refresh' => true]);

            return response()->json([
                'message' => 'Google login successful',
                // 'must_change_password' => $user->must_change_password,
                'user_id' => encrypt($user->id),
            ])
                ->cookie('auth_token', $token, 60, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'))
                ->cookie('refresh_token', $refreshToken, 43200, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'));

        } catch (\Exception $e) {
            \Log::error("Google login failed", ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Google login failed', 'details' => $e->getMessage()], 500);
        }
    }

}