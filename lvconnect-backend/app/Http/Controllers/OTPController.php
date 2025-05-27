<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\TrustedDevice;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Notifications\OTPNotification;

class OTPController extends Controller
{
    public function sendOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'purpose' => 'required|string|in:forgot_password,new_password,unrecognized_device',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);

        // Use user ID for rate limiter key
        $rateLimiterKey = 'otp-' . $user->id;

        if (RateLimiter::tooManyAttempts($rateLimiterKey, 5)) {
            return response()->json([
                'error' => 'Too many attempts. Try again later.'
            ], 429);
        }

        // Increment the attempt count (expires in 1 minute)
        RateLimiter::hit($rateLimiterKey, 60);

        // Check if an OTP was recently requested
        $existingOTP = Otp::where('user_id', $user->id)->latest()->first();

        if ($existingOTP && $existingOTP->created_at->addMinutes(2)->gt(Carbon::now())) {
            return response()->json(['error' => 'Please wait before requesting a new OTP'], 429);
        }

        // Generate OTP
        $otpCode = rand(100000, 999999);
        // $otpCode = 123456; // for testing

        // Logging before saving
        \Log::info('Attempting to create OTP for user', [
            'user_id' => $user->id,
            'otp' => $otpCode,
        ]);

        try {
            $otpRecord = Otp::create([
                'user_id' => $user->id,
                'otp' => $otpCode,
                'expires_at' => Carbon::now()->addMinutes(2),
            ]);
            \Log::info('OTP saved successfully', ['otp_id' => $otpRecord->id]);
        } catch (\Throwable $e) {
            \Log::error('Failed to save OTP', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Server error while saving OTP'], 500);
        }

        // Send OTP via notification (dynamic purpose)
        $user->notify(new OTPNotification($otpCode, $request->purpose));

        // Clear rate limiter on success
        RateLimiter::clear($rateLimiterKey);

        return response()->json(['message' => 'OTP sent to your email'], 200);
    }
    public function verifyOTP(Request $request)
    {
        try {
            $userId = decrypt($request->user_id);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid user ID'], 400);
        }

        $validator = Validator::make([
            'user_id' => $userId,
            'otp' => $request->otp,
            'device_id' => $request->device_id,
            'device_name' => $request->device_name,
            'remember_device' => $request->remember_device,
        ], [
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|string|min:6|max:6',
            'device_id' => 'nullable|string',
            'remember_device' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        if (RateLimiter::tooManyAttempts('otp-' . $userId, 5)) {
            return response()->json([
                'error' => 'Too many attempts. Try again later.'
            ], 429);
        }

        // Increment the attempt count (expires in 1 minute)
        RateLimiter::hit('otp-' . $userId, 60);

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $otpRecord = OTP::where('user_id', $user->id)
            ->where('otp', $request->otp)
            ->latest()
            ->first();

        if (!$otpRecord || $otpRecord->expires_at < Carbon::now()) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }


        // Mark email as verified
        if (!$user->email_verified_at) {
            $user->update(['email_verified_at' => now()]);
        }
        // Clear OTP after successful verification
        $otpRecord->delete();


        $hashedDeviceId = hash('sha256', $request->device_id);

        // Store trusted device if "remember this device" is checked
        if ($request->input('remember_device')) {
            TrustedDevice::updateOrCreate(
                ['user_id' => $user->id, 'device_id' => $hashedDeviceId],
                ['device_name' => $request->header('User-Agent'), 'last_used_at' => now()]
            );
        }
        // Reset attempt count on success
        RateLimiter::clear('otp-' . $userId);

        // If user must change password, return flag
        // if ($user->must_change_password) {
        //     return response()->json([
        //         'success' => true,
        //         'must_change_password' => true,
        //         'message' => 'Password change required',
        //         'user_id' => encrypt($user->id),
        //     ]);
        // }

        // Generate JWT Token
        $token = JWTAuth::fromUser($user);
        $refreshToken = JWTAuth::fromUser($user, ['refresh' => true]);

        return response()->json([
            'message' => 'OTP Verified, Login Successful'
        ], 200)
            ->cookie('auth_token', $token, 60, '/', "https://lvconnect.up.railway.app", request()->secure(), true)
            ->cookie('refresh_token', $refreshToken, 43200, '/', "https://lvconnect.up.railway.app", request()->secure(), true);

    }
    public function verifyOtpForPasswordChange(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'otp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Retrieve user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if (RateLimiter::tooManyAttempts('otp-' . $user, 5)) {
            return response()->json([
                'error' => 'Too many attempts. Try again later.'
            ], 429);
        }

        // Increment the attempt count (expires in 1 minute)
        RateLimiter::hit('otp-' . $user, 60);

        // Fetch latest OTP record
        $otpRecord = OTP::where('user_id', $user->id)
            ->where('otp', $request->otp);

        if (!$otpRecord) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        // Reset attempt count on success
        RateLimiter::clear('otp-' . $user);
        return response()->json([
            'message' => 'OTP Verified. You can now change your password.',
        ], 200);
    }

    public function resendOTP(Request $request)
    {
        try {
            // Decrypt user ID before validation
            $decryptedUserId = decrypt($request->user_id);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid user ID.'], 400);
        }

        // Inject the decrypted ID into request for validation
        $request->merge(['user_id' => $decryptedUserId]);

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'purpose' => 'required|string|in:forgot_password,new_password,unrecognized_device',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::find($request->user_id);

        // Throttle OTP resend attempts
        if (RateLimiter::tooManyAttempts('otp-' . $user->id, 5)) {
            return response()->json([
                'error' => 'Too many attempts. Try again later.'
            ], 429);
        }

        RateLimiter::hit('otp-' . $user->id, 60); // 1 minute cooldown

        // Prevent frequent resend within 2 minutes
        $existingOTP = Otp::where('user_id', $user->id)->latest()->first();
        if ($existingOTP && $existingOTP->created_at->addMinutes(2)->gt(Carbon::now())) {
            return response()->json(['error' => 'Please wait before requesting a new OTP'], 429);
        }

        // Generate and store new OTP
        $otpCode = rand(100000, 999999);
        Otp::create([
            'user_id' => $user->id,
            'otp' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(2),
        ]);

        // Send via notification
        $user->notify(new OTPNotification($otpCode, $request->purpose));

        RateLimiter::clear('otp-' . $user->id);

        return response()->json(['message' => 'OTP sent to your email'], 200);
    }

}


