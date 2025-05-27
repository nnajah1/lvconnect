<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    public function show()
    {
        $preference = auth()->user()->notificationPreference;
        return response()->json($preference);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'in_app' => 'boolean',
            'email' => 'boolean',
        ]);

        $preference = auth()->user()->notificationPreference()->updateOrCreate(
            ['user_id' => auth()->id()],
            $data
        );

        return response()->json(['message' => 'Preferences updated.', 'data' => $preference]);
    }
}
