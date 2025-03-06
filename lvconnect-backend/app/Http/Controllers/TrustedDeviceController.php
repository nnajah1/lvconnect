<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrustedDevice;
use Illuminate\Support\Facades\Auth;

class TrustedDeviceController extends Controller
{

    // List all trusted devices for a user
    public function index()
    {
        $user = Auth::user();
        $devices = TrustedDevice::where('user_id', $user->id)->get();

        return response()->json(['devices' => $devices]);
    
    }

    // Remove a trusted device
    public function destroy($deviceId)
    {
        $user = Auth::user();
        $device = TrustedDevice::where('user_id', $user->id)
                                ->where('device_id', $deviceId)
                                ->first();

        if (!$device) {
            return response()->json(['error' => 'Device not found'], 404);
        }

        $device->delete();

        return response()->json(['message' => 'Device removed successfully.']);
    }
}
