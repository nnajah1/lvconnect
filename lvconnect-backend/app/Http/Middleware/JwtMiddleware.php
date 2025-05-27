<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use \Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    // public function handle(Request $request, Closure $next): Response
    // {
    //     if (!$request->bearerToken() && $request->cookie('auth_token')) {
    //         JWTAuth::setToken($request->cookie('auth_token'));
    //         $user = JWTAuth::authenticate();
    //         if (!$user) {
    //             return response()->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
    //         }
    //     }



    //     return $next($request);
    // }

    public function handle(Request $request, Closure $next): Response
    {
        try {
            if (!$request->bearerToken()) {
                $token = $request->cookie('auth_token');
                if ($token) {
                    JWTAuth::setToken($token);
                    $user = JWTAuth::authenticate();
                    if (!$user) {
                        return response()->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
                    }
                } else {
                    // No bearer token and no auth_token cookie: deny access
                    return response()->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
                }
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }

}

