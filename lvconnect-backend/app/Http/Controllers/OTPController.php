<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\TrustedDevice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // Check if an OTP was recently requested
        $existingOTP = Otp::where('user_id', $user->id)->latest()->first();

        if ($existingOTP && $existingOTP->expires_at->subMinutes(2)->gt(Carbon::now())) {
            return response()->json(['error' => 'Please wait before requesting a new OTP'], 429);
        }


        // Generate OTP
        $otpCode = rand(100000, 999999);

        // Store OTP in otps table with expiration
        Otp::create([
            'user_id' => $user->id,
            'otp' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(2),
        ]);

        // Send OTP via notification (dynamic purpose)
        $user->notify(new OTPNotification($otpCode, $request->purpose));

        return response()->json(['message' => 'OTP sent to your email'], 200);
    }


    public function verifyOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|string',
            'device_id' => 'required|string',
            'device_name' => 'required|string',
            'remember_device' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Fetch latest OTP record
        $otpRecord = OTP::where('user_id', $user->id)->where('otp', $request->otp)->latest()->first();

        if (!$otpRecord || $otpRecord->expires_at < Carbon::now()) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        // Mark email as verified
        if (!$user->email_verified_at) {
            $user->update(['email_verified_at' => now()]);
        }
        // Clear OTP after successful verification
        $otpRecord->delete();

        // Store the device as trusted if "remember this device" is checked
        if ($request->remember_device) {
            TrustedDevice::updateOrCreate(
                ['user_id' => $user->id, 'device_id' => $request->device_id],
                ['device_name' => $request->device_name, 'last_used_at' => now()]
            );
        }
            
        // Generate JWT Token
        $token = JWTAuth::fromUser($user);
        $refreshToken = JWTAuth::fromUser($user, ['refresh' => true]);

        return response()->json(['message' => 'OTP Verified, Login Successful'], 200)
        ->cookie('auth_token', $token, 60, '/', null, false, true)
        ->cookie('refresh_token', $refreshToken, 43200, '/', null, false, true);
    }
}


