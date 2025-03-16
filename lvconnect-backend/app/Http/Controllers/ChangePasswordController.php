<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\User;
use App\Notifications\OTPNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class ChangePasswordController extends Controller
{
    public function changePassword(Request $request)
    {
        
        // Validate input
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',     
                'regex:/[A-Z]/',     
                'regex:/[0-9]/',      
                'regex:/[\W]/',       
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = Auth::user();

         // Check if the entered current password matches the user's actual password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect.'], 422);
        }

        // Check if the new password is the same as the old one
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json(['error' => 'New password cannot be the same as the old password.'], 422);
        }

        // Update user's password and clear OTP
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        $user->notify(new OTPNotification(null, 'new_password'));

        return response()->json(['message' => 'Password successfully changed.'], 200);
    }

    public function mustChangePassword(Request $request) {
        try {
            $userId = decrypt($request->user_id);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid user ID'], 400);
        }

        $validator = Validator::make($request->all(), [
           
            'new_password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',     
                'regex:/[A-Z]/',     
                'regex:/[0-9]/',      
                'regex:/[\W]/',       
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
         // Check if new password is the same as the old one
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json(['error' => 'New password cannot be the same as the old password.'], 422);
        }
    
        $user->update([
            'password' => Hash::make($request->new_password),
            'must_change_password' => false,
        ]);
     

        // Generate New JWT Token
        $token = JWTAuth::fromUser($user);
        $refreshToken = JWTAuth::fromUser($user, ['refresh' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
        ])->cookie('auth_token', $token, 60, '/', null, false, true)
        ->cookie('refresh_token', $refreshToken, 43200, '/', null, false, true);
    }
    
    

}
