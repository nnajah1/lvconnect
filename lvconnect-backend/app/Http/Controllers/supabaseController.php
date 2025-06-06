<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class supabaseController extends Controller
{
public function uploadFile(Request $request)
{
    $request->validate([
        'file' => 'required',
    ]);

    $files = is_array($request->file('file')) ? $request->file('file') : [$request->file('file')];

    $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
    $supabaseKey = env('SUPABASE_SERVICE_ROLE');
    $bucket = env('SUPABASE_BUCKET');

    $uploaded = [];

    foreach ($files as $file) {
        $filename = time() . '-' . $file->getClientOriginalName();
        $path = "{$bucket}/{$filename}";

        // Upload to Supabase
        $uploadResponse = Http::withToken($supabaseKey)
            ->attach('file', file_get_contents($file->getRealPath()), $filename)
            ->post("{$supabaseUrl}/storage/v1/object/{$bucket}/{$filename}");

        if ($uploadResponse->failed()) {
            
        \Log::error('upload failed', ['response' => $uploadResponse->body()]);
            return response()->json(['message' => 'Upload failed'], 500);
        }

        // Generate signed URL
        $signResponse = Http::withToken($supabaseKey)
            ->post("{$supabaseUrl}/storage/v1/object/sign/{$path}", [
                'expiresIn' => 3600, // 1 hour
            ]);


         if ($signResponse->failed()) {
        \Log::error('Signed URL generation failed', ['response' => $signResponse->body()]);
        return response()->json(['message' => 'Signed URL generation failed'], 500);
    }


        $signedUrl = $signResponse->json('signedURL');

        $uploaded[] = [
            'url' => "{$supabaseUrl}{$signedUrl}",
            'path' => $path,
        ];
    }

    return response()->json([
        'uploaded' => $uploaded,
    ]);
}

}
