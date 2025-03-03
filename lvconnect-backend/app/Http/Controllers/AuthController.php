<?php

namespace App\Http\Controllers;

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
class AuthController extends Controller
{
    public function createUser(request $request)
    {
       
        $user = JWTAuth::parseToken()->authenticate();

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
    public function login(request $request)

    {   
         // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => ['required','string','min:8','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/','regex:/[\W]/'],
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Retrieve user
        $user = User::where('email', $request->email)->first();

        // Check if password is correct
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Incorrect Password'], 401);
        }

        // Generate JWT token
        $token = JWTAuth::fromUser($user);
        // $refreshToken = $this->createRefreshToken($user);

        // Return response
        return response()->json(['message'=> 'Login Successfully', 'user' => $user->makehidden(['password']),
        'token' => $token,
        // 'refresh_token' => $refreshToken,
    ], 201);
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

    
    public function dashboard(request $request)

    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error'=> 'User not found'], 404);
            }
        }

        catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }


        return response()->json(['user' => $user,
        'message' => 'Welcome to dashboard'
    ]);
        
    }

    public function logout(request $request)

    {
        try {
            $token = JWTAuth::getToken();
            if(!$token) {
                return response()->json(['error'=>'Token not Provided'], 401);

            }
            JWTAuth::Invalidate($token);
            return response()->json(['message' => 'logout successfully'], 201);
        }

        catch(\Tymon\JWTAuth\Exceptions\JWTException $e){
            return response()->json(['error' => 'failed to logout'], 401);
        }
        
    }
        
}
