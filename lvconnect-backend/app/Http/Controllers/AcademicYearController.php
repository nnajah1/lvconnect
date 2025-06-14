<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\ValidationException;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => AcademicYear::orderBy('school_year', 'desc')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole(['registrar', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $validated = $request->validate([
                'school_year' => [
                    'required',
                    'regex:/^\d{4}-\d{4}$/',
                    'unique:academic_years,school_year',
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        $parts = explode('-', $validated['school_year']);
        if ((int) $parts[1] !== (int) $parts[0] + 1) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => ['school_year' => ['Invalid school year range.']]
            ], 422);
        }

        AcademicYear::query()->update(['is_active' => false]);
        $validated['is_active'] = true;

        $year = AcademicYear::create($validated);

        return response()->json([
            'message' => 'Academic year created successfully.',
            'data' => $year
        ], 201);
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
