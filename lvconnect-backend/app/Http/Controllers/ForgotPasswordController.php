<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Notifications\OTPNotification;

class ForgotPasswordController extends Controller
{
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(),[
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

        if($validator->fails()){
            return response()->json(['error' =>$validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();
        
        if (!$user->otp || $user->otp !== $request->otp || $user->otp_expires_at < Carbon::now()){
            return response()->json(['error' => 'Invalid or expired OTP'], 401);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
            'otp'=> null,
            'otp_expires_at' => null,
        ]);

        $user->notify(new OTPNotification(null, 'forgot_password'));

        return response()->json(['message' => 'Password reset successful. You can now log in with your new password.'], 200);

        
    }
}
