<?php

namespace App\Http\Controllers;

use App\Models\OTP;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class OTPController extends Controller
{
    public function sendOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'device' => 'required|string', // Device info (e.g., 'iPhone-14' or 'Windows-Chrome')
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        $otpCode = rand(100000, 999999);

        OTP::updateOrCreate(
            ['user_id' => $user->id, 'device' => $request->device],
            ['otp' => $otpCode, 'expires_at' => Carbon::now()->addMinutes(10)]
        );

        Mail::raw("Your OTP Code is: $otpCode. It expires in 10 minutes.", function ($message) use ($user) {
            $message->to($user->email)->subject('Your OTP Code');
        });

        return response()->json(['message' => 'OTP sent to your email'], 200);
    }

    public function verifyOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric|digits:6',
            'device' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();
        $otpRecord = OTP::where('user_id', $user->id)
            ->where('device', $request->device)
            ->where('otp', $request->otp)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$otpRecord) {
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        $otpRecord->delete();

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'OTP Verified, Login Successful',
            'user' => $user->makeHidden(['password']),
            'token' => $token,
        ], 200);
    }
}
