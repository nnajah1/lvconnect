<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\StudentInformation;
use App\Models\StudentFamilyInformation;
use App\Models\EnrolleeRecord;

class StudentManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = JWTAuth::authenticate();

        if ($user->hasRole('student')) {
            $student = StudentInformation::with('familyInformation')
                ->where('user_id', $user->id)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $student,
            ]);
        }

        if ($user->hasRole('registrar')) {
            $students = StudentInformation::with('familyInformation')->get();

            return response()->json([
                'success' => true,
                'data' => $students,
            ]);
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
     * Update the Student Information resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $student = StudentInformation::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $validated = $request->validate([
            'student_id_number' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'civil_status' => 'required|in:single,married,divorced,widowed',
            'gender' => 'required|in:male,female',
            'birth_date' => 'required|date',
            'birth_place' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:20',
            'religion' => 'required|string|max:255',
            'lrn' => 'required|string|max:50',
            'fb_link' => 'required|url|max:255',
            'student_type' => 'required|in:regular,irregular',
            'government_subsidy' => 'required|string|max:255',
            'scholarship_status' => 'required|string|max:255',
            'last_school_attended' => 'required|string|max:255',
            'previous_school_address' => 'required|string|max:255',
            'school_type' => 'required|string|max:255',
            'academic_awards' => 'required|string|max:255',
            'floor/unit/building_no' => 'required|string|max:255',
            'house_no/street' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'city_municipality' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'zip_code' => 'required|integer',
        ]);


        $student->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student information updated successfully.',
            'data' => $student,
        ]);
    }

    /**
     * Update the Student Family Information resource in storage.
     */
    public function updateFamilyInformation(Request $request, $studentInformationId)
    {
        $user = auth()->user();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'num_children_in_family' => 'required|integer',
            'birth_order' => 'required|integer',
            'has_sibling_in_lvcc' => 'required|string',
            'mother_first_name' => 'required|string',
            'mother_middle_name' => 'required|string',
            'mother_last_name' => 'required|string',
            'mother_religion' => 'required|string',
            'mother_occupation' => 'required|string',
            'mother_monthly_income' => 'required|string',
            'mother_mobile_number' => 'required|string',
            'father_first_name' => 'required|string',
            'father_middle_name' => 'required|string',
            'father_last_name' => 'required|string',
            'father_religion' => 'required|string',
            'father_occupation' => 'required|string',
            'father_monthly_income' => 'required|string',
            'father_mobile_number' => 'required|string',
            'guardian_first_name' => 'required|string',
            'guardian_middle_name' => 'required|string',
            'guardian_last_name' => 'required|string',
            'guardian_religion' => 'required|string',
            'guardian_occupation' => 'required|string',
            'guardian_monthly_income' => 'required|string',
            'guardian_mobile_number' => 'required|string',
            'guardian_relationship' => 'required|string',
        ]);

        $familyInfo = StudentFamilyInformation::updateOrCreate(
            ['student_information_id' => $studentInformationId],
            $validated
        );

        return response()->json([
            'message' => 'Family information updated successfully.',
            'data' => $familyInfo
        ]);
    }

    /**
     * Button to archived student information.
     */
    public function archive($studentId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $enrolleeRecord = EnrolleeRecord::where('student_information_id', $studentId)->latest()->first();

        if (!$enrolleeRecord) {
            return response()->json(['message' => 'Enrollee record not found for this student.'], 404);
        }

        $enrolleeRecord->update([
            'enrollment_status' => 'archived'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student enrollee record archived successfully.',
            'data' => $enrolleeRecord
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
