<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use App\Notifications\OTPNotification;

class OTPController extends Controller
{
    public function sendOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'purpose' => 'required|string|in:forgot_password,new_password,unrecognized_device', // Ensure valid purpose
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->otp_expires_at && $user->otp_expires_at->subMinutes(2)->gt(Carbon::now())) {
            return response()->json(['error' => 'Please wait before requesting a new OTP'], 429);
        }

        // Generate OTP
        $otpCode = rand(100000, 999999);

        // Store OTP in users table with expiration
        $user->update([
            'otp' => $otpCode,
            'otp_expires_at' => Carbon::now()->addMinutes(2),
        ]);

        // Send OTP via notification (dynamic purpose)
        $user->notify(new OTPNotification($otpCode, $request->purpose));

        return response()->json(['message' => 'OTP sent to your email'], 200);
    }



    public function verifyOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Check OTP validity
        if (!$user->otp || $user->otp !== $request->otp || $user->otp_expires_at < Carbon::now()) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        // Clear OTP after successful verification
        $user->update(['otp' => null, 'otp_expires_at' => null]);

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'OTP Verified, Login Successful',
            'user' => $user->makeHidden(['password']),
            'token' => $token,
        ], 200);
    }

}
