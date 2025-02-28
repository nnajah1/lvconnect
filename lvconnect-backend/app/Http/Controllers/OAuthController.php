<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
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

            // Generate JWT token
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Login Successful',
                'user' => $user->makeHidden(['password']),
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Google Authentication Failed'], 500);
        }
    }
}
