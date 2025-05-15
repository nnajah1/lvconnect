<?php

namespace App\Http\Controllers;

use App\Models\EnrolleeRecord;
use App\Models\StudentInformation;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $user = JWTAuth::authenticate();

        if ($user->hasRole('student')) {
            return EnrolleeRecord::where('id', $user->id)
                ->get();
        }

        if ($user->hasRole('psas')) { //change to registrar
            return StudentInformation::with('enrolleeRecord')
                ->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
