<?php

namespace App\Http\Controllers;

use App\Mail\UserCredentialsMail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\App;
use Mail;
use Str;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\TrustedDevice;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^[A-Za-z0-9@#$%^&*()!]+$/',
            ],
            'device_id' => 'nullable|string',
            'remember_device' => 'nullable|boolean',
        ]);

        // Return validation errors
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get the authenticated user
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Return an error if email or password does not match
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Check if user is active
        if (!$user->is_active) {
            return response()->json(['message' => 'Account is deactivated. Please contact administrator.'], 403);
        }

        // Hash device ID for security
        $hashedDeviceId = hash('sha256', $request->device_id);

        // Check if device is trusted
        $trustedDevice = TrustedDevice::where('user_id', $user->id)
            ->where('device_id', $hashedDeviceId)
            ->first();

        if (!$trustedDevice) {
            $OTPController = App::make(OTPController::class);
            // If device is NOT trusted, send OTP
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

        // If device is trusted or no OTP or no password change needed, login immediately and generate JWT
        $customClaims = [];

        $token = JWTAuth::fromUser($user, $customClaims);
        $refreshToken = JWTAuth::fromUser($user, ['refresh' => true]);

        return response()->json([
            'message' => 'Login successful',
            // 'must_change_password' => $user->must_change_password,
            'user_id' => encrypt($user->id),
        ])
            ->cookie('auth_token', $token, 60, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'))
            ->cookie('refresh_token', $refreshToken, 43200, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'));
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

            //get permissions
            $permissions = $user->getAllPermissions()->pluck('name');

            // Return the user data
            return response()->json([
                // 'user' => [
                //      'id' => $user->id,
                //     'full_name' => $user->full_name,
                //     'active_role' => $user->active_role,
                //     'roles' => $user->roles->map(fn($role) => [
                //         'name' => $role->name
                //     ])
                // ],
                'user' => $user,
                // 'permissions' => $permissions,
                'message' => 'login successfully'
            ], 200);  // 200 OK
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not retrieve user data'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unexpected error occurred'], 500);
        }
    }

    // Switch Role
    // public function switchRole(Request $request)
    // {
    //     $request->validate([
    //         'role' => 'required|string',
    //     ]);

    //     $user = auth()->user();

    //     // Check if the user has the requested role
    //     if (!$user->hasRole($request->role)) {
    //         return response()->json(['error' => 'You do not have this role.'], 403);
    //     }

    //     // Update active_role in DB
    //     $user->active_role = $request->role;
    //     $user->save();

    //     // Regenerate JWT with updated custom claims
    //     $customClaims = [
    //         'role' => $request->role,
    //     ];
    //     $token = JWTAuth::fromUser($user, $customClaims);
    //     $refreshToken = JWTAuth::fromUser($user, array_merge($customClaims, ['refresh' => true]));

    //     return response()->json([
    //         'message' => 'Role switched successfully.',
    //         'user_id' => encrypt($user->id),
    //         'role' => $request->role,
    //     ])
    //         ->cookie('auth_token', $token, 60, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'))
    //         ->cookie('refresh_token', $refreshToken, 43200, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'));
    // }

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
                ->cookie('auth_token', '', -1, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'))  // Remove auth token
                ->cookie('refresh_token', '', -1, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site')); // Remove refresh token
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to log out'], 500);
        }

    }

    // Handle refresh token
    public function refreshToken(Request $request)
    {
        try {
            JWTAuth::setToken($request->cookie('refresh_token'));
            $newToken = JWTAuth::refresh();

            return response()->json(['message' => 'Token refreshed'])
                ->cookie('auth_token', $newToken, 60, '/', config('session.cookie_domain'), config('session.secure'), true, false, config('session.same_site'));
        } catch (JWTException $e) {
            return response()->json(['error' => 'Refresh token expired'], 401);
        }
    }


}