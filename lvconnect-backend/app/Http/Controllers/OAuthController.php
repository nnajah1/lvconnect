<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
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

            // Check if user exists using google_id
            $user = User::where('google_id', $googleUser->getId())
                        ->orWhere('email', $googleUser->getEmail())
                        ->first();

            if (!$user) {
                // Create a new user with Google ID
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(), // Store Google ID
                    'password' => Hash::make(uniqid()), // Set a random password
                ]);

                // Assign 'student' role by default
                $user->assignRole('student');
            } else {
                // If user exists but doesn't have a google_id, update it
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
            }

            // Generate JWT token
            $token = JWTAuth::fromUser($user);

            // Store JWT in HttpOnly Cookie
        $cookie = cookie('auth_token', $token, 1440, '/', null, true, true);

        return response()->json(['message' => 'Login Successful'])
            ->cookie($cookie);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Google Authentication Failed'], 500);
        }
    }
}
