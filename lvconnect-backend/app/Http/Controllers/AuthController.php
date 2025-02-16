<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
class AuthController extends Controller
{
    public function createUser(request $request)
    {
        // Get the authenticated user
        $authUser = Auth::user();

        if (!$authUser) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // define allowed roles
        $allowedRoles = $authUser->hasRole('superadmin') 
        ? ['student', 'admin', 'superadmin'] 
        : ['student'];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|max:12|min:8',
            'role' => ['required', Rule::in($allowedRoles)], // Only allow valid roles
        ]);

        if($validator->fails()){
            return response()->json(['errors'=>$validator->errors(), 422]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),

        ]);

        $user->assignRole($request->role);

        return response()->json(['message'=> 'User created successfully'
    ], 201);
    }
    public function login(request $request)

    {   
         // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8',
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

        // Return response
        return response()->json(['message'=> 'Login Successfully', 'user' => $user->makehidden(['password']),
        'token' => $token,
    ], 201);
        
    }
    
    public function dashboard(request $request)

    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error'=> 'User not found'], 404);
            }
        }

        catch(\Tymon\JWTAuth\Exceptions\TokenInvalidException $e){
            return response()->json(['error' => 'token is Invalid. Please login again.'], 401);
        }

        catch(\Tymon\JWTAuth\Exceptions\TokenExpiredException $e){
            return response()->json(['error' => 'token has Expired. Please login again.'], 401);

        } 
        catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token is missing. Please provide a valid token.'], 401);
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
