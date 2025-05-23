<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Notifications\PasswordResetNotification;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user->notify_via_email) {
            return response()->json(['message' => 'User has disabled email notifications.'], 403);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => hash('sha256', $token),
                'created_at' => now(),
            ]
        );

        $resetLink = url('/reset-password?token=' . $token . '&email=' . urlencode($request->email));

        // Send the reset link using a Laravel notification
        $user->notify(new PasswordResetNotification($resetLink));

        return response()->json(['message' => 'Reset password link sent to your email.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/[a-z]/',      // Lowercase
                'regex:/[A-Z]/',      // Uppercase
                'regex:/[0-9]/',      // Numbers
                'regex:/[\W]/',       // Symbols
            ],
        ]);

        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (
            !$tokenData ||
            !hash_equals($tokenData->token, hash('sha256', $request->token)) ||
            Carbon::parse($tokenData->created_at)->addMinutes(60)->isPast()
        ) {
            return response()->json(['error' => 'Invalid or expired token.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->must_change_password = false;
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }
}
