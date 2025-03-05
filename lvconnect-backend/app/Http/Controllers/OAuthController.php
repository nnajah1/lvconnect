<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; // For handling HTTP requests
use Illuminate\Support\Facades\Cache;
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
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Check if user exists using google_id or email
            $user = User::where('google_id', $googleUser->getId())
                        ->orWhere('email', $googleUser->getEmail())
                        ->first();

            if (!$user) {
                return response()->json(['error' => 'Account not found. Please contact admin.'], 403);
            }

            // If user exists but doesn't have a google_id, update it
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }

            // Generate a temporary authorization code (or token)
        $tempCode = Str::random(40);
        Cache::put("oauth_code_{$tempCode}", $user->id, 60); // Store code for 60s

        // Redirect to frontend with the temporary code
        return redirect("http://localhost:5173/google-auth-success?code={$tempCode}");

        } catch (\Exception $e) {
            return redirect('http://localhost:5173/login?error=google_failed');
        }
    }

    public function exchangeGoogleToken(Request $request)
    {
        // Validate request
        $code = $request->input('code');
        if (!$code) {
            return response()->json(['message' => 'Authorization code is required'], 400);
        }

        try {
            // Retrieve user ID from cache using OAuth code
            $userId = Cache::pull("oauth_code_{$code}");
    
            if (!$userId) {
                return response()->json(['error' => 'Invalid or expired OAuth code'], 400);
            }
    
            // Find the user in the database
            $user = User::find($userId);
    
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
    
            // Generate Access Token
            $token = JWTAuth::fromUser($user);
    
            // Generate Refresh Token
            $refreshToken = JWTAuth::fromUser($user, ['refresh' => true]);
    
            return response()->json(['message' => 'Google login successful'])
                ->cookie('auth_token', $token, 60, '/', null, false, true)  // Access token (HttpOnly)
                ->cookie('refresh_token', $refreshToken, 43200, '/', null, false, true); // Refresh token (HttpOnly)
    
        } catch (\Exception $e) {
            return response()->json(['error' => 'Google login failed'], 500);
        }
    }
  

}
