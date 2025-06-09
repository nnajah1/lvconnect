<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\EnrollmentStatusNotification;
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
    public function showStudentManagement()
    {
        $user = JWTAuth::authenticate();

        // If registrar
        if ($user->hasRole('registrar')) {
            $students = StudentInformation::with([
                'guardian',
                'enrolleeRecords' => function ($query) {
                    $query->latest()->limit(1);
                }
            ])->get();

            return response()->json([
                'students' => $students,
            ]);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Show Student profile.
     */
    public function showStudentProfile()
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // Get student profile info
        $studentInfo = StudentInformation::where('user_id', $user->id)
            ->with([
                'enrolleeRecords' => function ($query) {
                    $query->latest()->limit(1)->with('program');
                }
            ])
            ->first();

        if (!$studentInfo) {
            return response()->json(['message' => 'Student information not found.'], 404);
        }

        $latestEnrollee = $studentInfo->enrolleeRecords->first();

        return response()->json([
            'avatar' => $user->avatar,
            'program' => $latestEnrollee?->program?->program_name,
            'year_level' => $latestEnrollee?->year_level,
            'student_number' => $studentInfo->student_id_number,
            'email' => $user->email,
            'first_name' => $studentInfo->first_name,
            'middle_name' => $studentInfo->middle_name,
            'last_name' => $studentInfo->last_name,
            'suffix' => $studentInfo->Suffix,
            'birth_date' => $studentInfo->birth_date,
            'birth_place' => $studentInfo->birth_place,
            'gender' => $studentInfo->gender,
            'civil_status' => $studentInfo->civil_status,
            'religion' => $studentInfo->religion,
            'contact_number' => $studentInfo->mobile_number,
            'fb_profile_link' => $studentInfo->fb_link,
        ]);
    }

    /**
     * Registrar Update the Student Information resource in storage.
     */
    public function updateStudentManagement(Request $request, $studentId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Fetch student
        $student = StudentInformation::find($studentId);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // Validate and update student_information
        $validatedStudent = $request->validate([
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
            // 'lrn' => 'required|string|max:50',
            'fb_link' => 'required|url|max:255',
            'student_type' => 'required|in:regular,irregular',
            'government_subsidy' => 'required|string|max:255',
            'scholarship_status' => 'required|string|max:255',
            'last_school_attended' => 'required|string|max:255',
            'previous_school_address' => 'required|string|max:255',
            'school_type' => 'required|string|max:255',
            // 'academic_awards' => 'required|string|max:255',
            'floor/unit/building_no' => 'required|string|max:255',
            'house_no/street' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'city_municipality' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'zip_code' => 'required|integer',
        ]);

        $student->update($validatedStudent);

        // Validate and update family information
        $validatedFamily = $request->validate([
            'num_children_in_family' => 'required|integer',
            'birth_order' => 'required|integer',
            'has_sibling_in_lvcc' => 'required|boolean',
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

        $family = StudentFamilyInformation::updateOrCreate(
            ['student_information_id' => $student->id],
            $validatedFamily
        );

        // Validate and update enrollee record (program_id and year_level only)
        $validatedEnrollee = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'year_level' => 'required|integer|min:1',
        ]);

        $enrolleeRecord = EnrolleeRecord::where('student_information_id', $student->id)
            ->latest()
            ->first();

        if ($enrolleeRecord) {
            $enrolleeRecord->update([
                'program_id' => $validatedEnrollee['program_id'],
                'year_level' => $validatedEnrollee['year_level'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Student record updated successfully.',
            'data' => [
                'student_information' => $student,
                'family_information' => $family,
                'enrollee_record' => $enrolleeRecord
            ]
        ]);
    }

    /**
     * Student update profile.
     */
    public function updateStudentProfile(Request $request)
    {
        $user = JWTAuth::authenticate();

        // Validate input - only contact number and fb link
        $request->validate([
            'mobile_number' => 'required|string|max:20',
            'fb_link' => 'nullable|url|max:255',
        ]);

        // Find student information by user_id
        $studentInfo = StudentInformation::where('user_id', $user->id)->first();

        if (!$studentInfo) {
            return response()->json(['message' => 'Student information not found.'], 404);
        }

        // Update fields
        $studentInfo->mobile_number = $request->input('mobile_number');
        $studentInfo->fb_link = $request->input('fb_link');
        $studentInfo->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'student_info' => $studentInfo,
        ]);
    }

    /**
     * Button to archived student information.
     */

    public function bulkArchive(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasActiveRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ids = $request->input('ids');
        EnrolleeRecord::whereIn('id', $ids)->update(['enrollment_status' => 'archived']);
        return response()->json(['message' => 'Archived successfully.']);
    
    }

    public function archive(Request $request, $studentId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $enrolleeRecord = EnrolleeRecord::where('student_information_id', $studentId)->latest()->first();

        if (!$enrolleeRecord) {
            return response()->json(['message' => 'Enrollee record not found for this student.'], 404);
        }

         $request->validate([
            'admin_remarks' => 'required|string|max:1000',
        ]);

        $enrolleeRecord->update([
            'enrollment_status' => 'archived',
            'admin_remarks' => $request->input('admin_remarks')
        ]);

           $enrolleeRecord->notify(new EnrollmentStatusNotification('archived', ''));
    
        return response()->json([
            'success' => true,
            'message' => 'Student enrollee record archived successfully.',
            'data' => $enrolleeRecord
        ]);
    }

    public function showStudents()
    {

        $user = JWTAuth::authenticate();

       if ($user->hasRole('registrar')) {
    return StudentInformation::with('enrolleeRecord')
        ->whereHas('enrolleeRecord', function ($q) {
            $q->whereNotNull('enrollment_status'); 
        })
        ->get();
}

        return response()->json(['message' => 'Unauthorized'], 403);

    }

    public function newStudents()
    {
        $user = JWTAuth::authenticate();
        if ($user->hasRole('registrar')) {
            return User::role('student')
                ->whereDoesntHave('studentInformation')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'full_name' => $user->full_name,
                        'email' => $user->email,
                        // 'enrollment_status' => 'not_enrolled',
                    ];
                });
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
