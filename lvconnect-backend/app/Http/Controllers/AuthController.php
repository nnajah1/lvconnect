<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Mail\UserCredentialsMail;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use Mail;
use Str;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
class AuthController extends Controller
{

    public function login(Request $request)
    {
        // Validate request
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);
    
        try {
            // Attempt authentication
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    
        // Set token in HttpOnly cookie
        return response()->json(['message' => 'Login successful'])
            ->cookie('auth_token', $token, 60, '/', null, false, true, false, 'lax');
    }
    
   // Get Authenticated User
   public function me(Request $request)
{
    try {
        // Get the token from the cookies
        $token = $request->cookie('auth_token');
        
        if (!$token) {
            return response()->json(['error' => 'Token not found'], 401);  // 401 Unauthorized
        }

        // Set the token to JWTAuth
        JWTAuth::setToken($token);

        // Get the authenticated user
        $user = JWTAuth::authenticate(); // based on the token

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Return the user data
        return response()->json(['user' => $user], 200);  // 200 OK
    } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
        return response()->json(['error' => 'Token expired'], 401);
    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
        return response()->json(['error' => 'Invalid token'], 401);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Could not retrieve user data'], 500);
    }

}


   // Logout
   public function logout()
   {
    Auth::logout();

    // Invalidate the token and remove the HttpOnly cookie
    return response()->json(['message' => 'Logged out successfully'])
        ->cookie('jwt', '', -1);  // Delete the cookie

   }

}