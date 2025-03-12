<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\TrustedDevice;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class TrustedDeviceController extends Controller
{

    // List all trusted devices for a user
    public function index()
    {
        try {
        $user = JWTAuth::authenticate();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $devices = TrustedDevice::where('user_id', $user->id)->get();

        if ($devices->isEmpty()) {
            return response()->json(['error' => 'No trusted devices found'], 404);
        }

        return response()->json(['devices' => $devices]);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Token error: ' . $e->getMessage()], 401);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
    }
    
    }


    // Add a new device to the list of trusted devices
    public function storeDevice(Request $request)
    {
       try {
            
            $user = User::find($request->user_id);
           
            $deviceId = $request->input('deviceId');
            $deviceName = $request->input('deviceName');


            // Add the new device
            TrustedDevice::updateOrCreate([
                'user_id' => $user->id,
                'device_id' => $deviceId,
                'device_name' => $deviceName,
            ]);

            return response()->json(['message' => 'Device added successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not store device: ' . $e->getMessage()], 500);
        }
    }

    // Check if device is trusted
    public function checkDevice(Request $request)
{
    // Prioritize searching by deviceId
    $device = TrustedDevice::where('device_id', $request->device_id)->first();

    // If not found, try to match by device_name (User-Agent)
    if (!$device) {
        $device = TrustedDevice::where('device_name', $request->header('User-Agent'))->first();
    }

    return response()->json(['deviceId' => $device?->device_id]);
}


    // Remove a trusted device
    public function destroy($deviceId)
    {
    try {
        $user = JWTAuth::authenticate();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $device = TrustedDevice::where('user_id', $user->id)
                               ->where('device_id', $deviceId)
                               ->first();

        if (!$device) {
            return response()->json(['error' => 'Device not found'], 404);
        }

        $device->delete();

        return response()->json(['message' => 'Device removed successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Could not remove device: ' . $e->getMessage()], 500);
    }
}
}
