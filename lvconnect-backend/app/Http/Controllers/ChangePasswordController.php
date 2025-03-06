<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\OTPNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ChangePasswordController extends Controller
{
    public function changePassword(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric|digits:6',
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

        // Retrieve user
        $user = User::where('email', $request->email)->first();

        // Check if the OTP is valid
        if (!$user->otp || $user->otp !== $request->otp || $user->otp_expires_at < now()) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        // Update user's password and clear OTP
        $user->update([
            'password' => Hash::make($request->new_password),
            'otp' => null, // Clear OTP after successful password change
            'otp_expires_at' => null,
        ]);

        $user->notify(new OTPNotification(null, 'new_password'));

        return response()->json(['message' => 'Password successfully changed.'], 200);
    }
}
