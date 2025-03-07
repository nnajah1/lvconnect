<?php

namespace App\Http\Controllers;

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
    public function store(Request $request)
    {
       try {
            
            $user = JWTAuth::authenticate();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $deviceId = $request->input('deviceId');
            $deviceName = $request->input('deviceName');

            if (!$deviceId || !$deviceName) {
                return response()->json(['error' => 'Device ID and name are required'], 400);
            }

            // Check if the device is already trusted
            $existingDevice = TrustedDevice::where('user_id', $user->id)
                                           ->where('device_name', $deviceName)
                                           ->first();

            if ($existingDevice) {
                return response()->json(['error' => 'Device is already trusted'], 409);
            }

            // Add the new device
            TrustedDevice::create([
                'user_id' => $user->id,
                'device_id' => $deviceId,
                'device_name' => $deviceName,
            ]);

            return response()->json(['message' => 'Device added successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not store device: ' . $e->getMessage()], 500);
        }
    }

    // Check if a device already exists for the current user
    public function checkDevice(Request $request)
    {
        try {
            
            $user = JWTAuth::authenticate();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $deviceName = $request->input('deviceName');

            if (!$deviceName) {
                return response()->json(['error' => 'Device name is required'], 400);
            }

            $device = TrustedDevice::where('user_id', $user->id)
                                   ->where('device_name', $deviceName)
                                   ->first();

            if (!$device) {
                return response()->json(['error' => 'Device not found'], 404);
            }

            return response()->json(['deviceId' => $device->device_id]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not check device: ' . $e->getMessage()], 500);
        }
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
