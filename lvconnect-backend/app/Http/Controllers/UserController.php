<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function updateNotificationPreference(Request $request)
    {
        $request->validate([
            'notify_via_email' => 'required|boolean',
        ]);

        auth()->user()->update(['notify_via_email' => $request->notify_via_email]);

        return response()->json(['message' => 'Notification preference updated successfully']);
    }

}
