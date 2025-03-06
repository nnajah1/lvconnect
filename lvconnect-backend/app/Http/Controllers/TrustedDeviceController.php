<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrustedDevice;
use Illuminate\Support\Facades\Auth;

class TrustedDeviceController extends Controller
{
    // Store a new trusted device
    public function store(Request $request)
    {
        $user = Auth::user(); // Get authenticated user
        $deviceId = $request->device_id; // Get unique device identifier from frontend

        // Check if the device is already trusted
        if (!$user->trustedDevices()->where('device_id', $deviceId)->exists()) {
            $user->trustedDevices()->create([
                'device_id' => $deviceId,
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
            ]);
        }

        return response()->json(['message' => 'Device marked as trusted.']);
    }

    // Check if a device is trusted
    public function isTrusted(Request $request)
    {
        $user = Auth::user();
        $deviceId = $request->device_id;

        $isTrusted = $user->trustedDevices()->where('device_id', $deviceId)->exists();

        return response()->json(['trusted' => $isTrusted]);
    }

    // List all trusted devices for a user
    public function listTrustedDevices()
    {
        $user = Auth::user();
        $trustedDevices = $user->trustedDevices()->get();

        return response()->json(['trusted_devices' => $trustedDevices]);
    }

    // Remove a trusted device
    public function removeTrustedDevice(Request $request)
    {
        $user = Auth::user();
        $deviceId = $request->device_id;

        $user->trustedDevices()->where('device_id', $deviceId)->delete();

        return response()->json(['message' => 'Device removed.']);
    }
}
