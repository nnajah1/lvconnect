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
    public function createUser(request $request)
    {
       
        $user = JWTAuth::parseToken()->authenticate();

        // checks user if authorized
        if (!$user) {
                return response()->json(['error'=> 'not authorized'], 404);
            }

        // define allowed roles
        $allowedRoles = $user->hasRole('superadmin') 
        ? ['student', 'admin', 'superadmin'] 
        : ['student'];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in($allowedRoles)], // Only allow valid roles
        ]);

        if($validator->fails()){
            return response()->json(['errors'=>$validator->errors(), 422]);
        }

          // Generate a random password
        $randomPassword = Str::random(10);

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($randomPassword),

        ]);

        $newUser->assignRole($request->role);

        Mail::to($newUser->email)->send(new UserCredentialsMail($newUser, $randomPassword));

        return response()->json(['message'=> 'User created successfully',  
    ], 201);
    }
    
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
    
         // Generate Refresh Token
        $refreshToken = JWTAuth::fromUser(Auth::user(), ['refresh' => true]);

        return response()->json(['message' => 'Login successful'])
            ->cookie('auth_token', $token, 60, '/', null, false, true)  // Access token (HttpOnly)
            ->cookie('refresh_token', $refreshToken, 43200, '/', null, false, true); // Refresh token (HttpOnly)
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

         // Load roles from Spatie
         $user->load('roles');
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
   public function logout(Request $request)
   {
    try {
        // Invalidate the auth token
        $token = $request->cookie('auth_token'); // Get token from cookie
        if ($token) {
            // Invalidate the token 
            JWTAuth::setToken($token)->invalidate();
        }

        return response()->json(['message' => 'Logged out successfully'])
            ->cookie('auth_token', '', -1, '/', null, false, true)  // Remove auth token
            ->cookie('refresh_token', '', -1, '/', null, false, true); // Remove refresh token
    } catch (JWTException $e) {
        return response()->json(['error' => 'Failed to log out'], 500);
    }

   }

   //handle refresh token
   public function refreshToken(Request $request)
{
    try {
        JWTAuth::setToken($request->cookie('refresh_token'));
        $newToken = JWTAuth::refresh();

        return response()->json(['message' => 'Token refreshed'])
            ->cookie('auth_token', $newToken, 60, '/', null, false, true);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Refresh token expired'], 401);
    }
}


}