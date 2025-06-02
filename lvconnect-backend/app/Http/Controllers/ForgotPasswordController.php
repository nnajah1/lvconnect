<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Log;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => hash('sha256', $token),
                    'created_at' => now(),
                ]
            );

            $frontendUrl = 'https://yourfrontend.com/reset-password';

            $resetLink = $frontendUrl . '?token=' . $token . '&email=' . urlencode($request->email);

            $user->notify(new PasswordResetNotification($resetLink));

            Log::info('Password reset link sent.', ['email' => $request->email, 'token' => $token]);
        }

        return response()->json([
            'message' => 'If the email is registered, a password reset link has been sent.'
        ]);
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

    Log::info('Stored hash:', ['db_token' => $tokenData->token]);
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->must_change_password = false;
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }
}
