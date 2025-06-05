<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class supabaseController extends Controller
{
 

public function getSignedUrl(Request $request)
{
     $request->validate([
        'filename' => 'required|string',
        'content_type' => 'required|string',
    ]);

    $supabaseUrl = env('SUPABASE_URL');
    $supabaseKey = env('SUPABASE_SERVICE_ROLE_KEY');
    $bucket = env('SUPABASE_BUCKET');
    $filename = $request->input('filename');
    $contentType = $request->input('content_type');

    $response = Http::withToken($supabaseKey)->post(
        "{$supabaseUrl}/storage/v1/object/sign/{$bucket}/{$filename}",
        ['contentType' => $contentType, 'expiresIn' => 60]
    );

    if ($response->failed()) {
        return response()->json(['message' => 'Failed to create signed URL'], 500);
    }

    return response()->json($response->json());
}
}
