<?php

use Illuminate\Support\Facades\Http;

if (!function_exists('generateSignedUrl')) {
    function generateSignedUrl(string $path, int $expiresIn = 3600): ?string
    {
        $supabaseUrl = rtrim(env('SUPABASE_URL'), '/');          // e.g. https://pjhkjha.supabase.co
        $supabaseKey = env('SUPABASE_SERVICE_ROLE');             // SERVICE_ROLE key
        $bucket = env('SUPABASE_BUCKET');                  // e.g. uploads

        $response = Http::withToken($supabaseKey)
            ->asJson()                                          // send JSON body
            ->post(
                "{$supabaseUrl}/storage/v1/object/sign/{$bucket}/" . rawurlencode($path),
                ['expiresIn' => $expiresIn]                   // seconds
            );

        if ($response->failed()) {
            \Log::error('Supabase signed URL generation failed', ['response' => $response->body()]);
            return null;
        }

        // Supabase returns a **relative** URL starting with /storage/…
        $relative = $response->json('signedURL');

        return $relative ? $supabaseUrl . $relative : null;
    }


}
