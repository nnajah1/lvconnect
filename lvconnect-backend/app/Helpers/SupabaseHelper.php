<?php

use Illuminate\Support\Facades\Http;

if (!function_exists('generateSignedUrl')) {
   function generateSignedUrl(string $path, int $expiresIn = 3600): ?string
{
    $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
    $supabaseKey = env('SUPABASE_SERVICE_ROLE');
    $bucket = env('SUPABASE_BUCKET');

    $response = Http::withToken($supabaseKey)
        ->asJson()
        ->post("{$supabaseUrl}/storage/v1/object/sign/{$bucket}/" . rawurlencode($path), [
            'expiresIn' => $expiresIn
        ]);

    if ($response->failed()) {
        \Log::error('Supabase signed URL generation failed', ['response' => $response->body()]);
        return null;
    }

    $relative = $response->json('signedURL');

    if (!$relative || !str_starts_with($relative, '/storage/v1')) {
        $relative = "/storage/v1" . $relative;
    }

    return $supabaseUrl . $relative;
}

}
