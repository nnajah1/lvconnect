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
            $path = "{$filename}";

            // Upload to Supabase
            $uploadResponse = Http::withToken($supabaseKey)
                ->attach('file', file_get_contents($file->getRealPath()), $filename)
                ->post("{$supabaseUrl}/storage/v1/object/{$bucket}/{$filename}");

            if ($uploadResponse->failed()) {
                \Log::error('Supabase upload failed', ['response' => $uploadResponse->body()]);
                return response()->json(['message' => 'Upload failed'], 500);
            }

            $uploaded[] = $path; // Return only path
        }

        return response()->json([
            'paths' => $uploaded, // Send only paths to frontend
        ]);
    }
    public function generateSignedUrls(Request $request)
{
    $request->validate(['path' => 'required|string']);

    $signed = generateSignedUrl($request->path);

    return $signed
        ? response()->json(['signed_url' => $signed])
        : response()->json(['message' => 'Failed to generate signed URL'], 500);
}


    

}
