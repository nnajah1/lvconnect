<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Mail\UserCredentialsMail;
use Illuminate\Http\Request;
use App\Models\User;
use Mail;
use Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
class yAuthController extends Controller
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
        $credentials = $request->only('email', 'password');
    
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        $user = Auth::user(); // Get authenticated user
    
        // Set HTTP-only Cookie
    $cookie = cookie(
        'auth_token', 
        $token, 
        60, // 60 minutes expiration
        '/', 
        'null', // Change this for production
        false, // Secure = false for localhost
        true // HttpOnly
    );

        // Store the token in an HTTP-only cookie
        return response()->json([
            'message' => 'Login successful',
            'user' => $user
        ])->withCookie($cookie);
        // Secure, HTTP-only
    }

    private function createRefreshToken($user)
{
    return JWTAuth::fromUser($user, ['refresh' => true]);
}

public function refreshToken(Request $request)
{
    try {
    // Get refresh token from request
    $refreshToken = $request->input('refresh_token');

    // Ensure token is provided
    if (!$refreshToken) {
        return response()->json(['error' => 'Refresh token is required'], 400);
    }

    // Verify and authenticate user from refresh token
    $user = JWTAuth::setToken($refreshToken)->authenticate();

    if (!$user) {
        return response()->json(['error' => 'Invalid refresh token'], 401);
    }

    // Generate new access and refresh tokens
    $newToken = JWTAuth::fromUser($user);
    $newRefreshToken = $this->createRefreshToken($user);

    return response()->json([
        'token' => $newToken,
        'refresh_token' => $newRefreshToken
    ]);
    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        return response()->json(['error' => 'Invalid or expired refresh token'], 401);
    }
}

    public function logout(Request $request)
{
    try {
        $token = $request->cookie('auth_token'); // Get token from cookie
        if ($token) {
            // Invalidate the token 
            JWTAuth::setToken($token)->invalidate();
        }
        return response()->json(['message' => 'Logged out'])
            ->cookie('auth_token', '', -1, '/', 'localhost', false, true); // Clear cookie
    } catch (\Exception $e) {
        return response()->json(['message' => 'Logout failed'], 500);
    }
}

public function user()
    {
        return response()->json(['user' => auth()->user()]);
    }
}
