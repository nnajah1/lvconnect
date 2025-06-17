<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\FeeCategory;
use Illuminate\Http\Request;
use App\Models\FeeTemplate;
use Tymon\JWTAuth\Facades\JWTAuth;
use DB;

class SOAController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $user = JWTAuth::authenticate();


        if ($user->hasAnyRole(['registrar', 'superadmin'])) {
            return FeeTemplate::with('fees', 'academicYear')
                ->whereHas('academicYear', function ($query) {
                    $query->where('is_active', 0);
                })
                ->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
    public function student()
    {
        $user = JWTAuth::authenticate();

        if ($user->hasAnyRole(['student', 'superadmin'])) {
            // Active Academic Year
            $activeTemplates = FeeTemplate::where('is_visible', true)
                ->with('fees', 'academicYear')
                ->whereHas('academicYear', function ($query) {
                    $query->where('is_active', 1);
                })
                ->first();

            // Inactive Academic Years
            $pastTemplates = FeeTemplate::where('is_visible', true)
                ->with('fees', 'academicYear')
                ->whereHas('academicYear', function ($query) {
                    $query->where('is_active', 0);
                })
                ->get();

            return response()->json([
                'active' => $activeTemplates,
                'past' => $pastTemplates,
            ]);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function getActiveAcademicYear()
    {
        $activeYear = AcademicYear::where('is_active', 1)->first();

        if (!$activeYear) {
            return response()->json(['message' => 'No active academic year found'], 404);
        }

        return response()->json([
            'data' => $activeYear
        ]);
    }



    public function feeCategory()
    {
        $categories = FeeCategory::select('id', 'name')->orderBy('name')->get();

        return response()->json([
            'data' => $categories
        ]);
    }

    public function createFeeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:fee_categories,name',
        ]);


        $category = FeeCategory::create([
            'name' => $request->name,
        ]);

        return response()->json(['message' => 'Category created successfully', 'data' => $category], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'is_visible' => 'required|boolean',
            'tuition_per_unit' => 'required|numeric|min:0',
            'total_units' => 'required|integer|min:0',
            'fees' => 'required|array',
            'fees.*.fee_category_id' => 'required|exists:fee_categories,id',
            'fees.*.fee_name' => 'required|string',
            'fees.*.amount' => 'required|numeric|min:0',
        ]);


        $tuitionTotal = $request->tuition_per_unit * $request->total_units;
        $miscellaneousCategoryId = FeeCategory::where('name', 'Miscellaneous')->value('id');

        if (!$miscellaneousCategoryId) {
            return response()->json(['message' => 'The "Miscellaneous" fee category does not exist.'], 400);
        }

        $miscellaneousTotal = collect($request->fees)
            ->where('fee_category_id', $miscellaneousCategoryId)
            ->sum('amount');

        $termTotal = $tuitionTotal + $miscellaneousTotal;
        $wholeYear = $termTotal * 2;

        $activeYear = AcademicYear::where('is_active', 1)->first();
        if (!$activeYear) {
            return response()->json(['message' => 'No active academic year found'], 404);
        }

        $template = FeeTemplate::create([
            // 'status' => $request->status,
            'academic_year_id' => $activeYear->id,
            'is_visible' => $request->is_visible,
            'tuition_per_unit' => $request->tuition_per_unit,
            'total_units' => $request->total_units,
            'tuition_total' => $tuitionTotal,
            'miscellaneous_total' => $miscellaneousTotal,
            'first_term_total' => $termTotal,
            'second_term_total' => $termTotal,
            'whole_academic_year' => $wholeYear,
            'scholarship_discount' => $wholeYear,
            'total_payment' => 0,
        ]);

        foreach ($request->fees as $fee) {
            $template->fees()->create([
                'fee_category_id' => $fee['fee_category_id'],
                'fee_name' => $fee['fee_name'],
                'amount' => $fee['amount'],
            ]);
        }

        return response()->json(['message' => 'SOA created successfully', 'data' => $template->load('fees')], 201);
    }

    /**
     * Display calculated SOA.
     */
    public function viewSoa()
    {
        $user = auth()->user();

        if (!$user->hasAnyRole(['registrar', 'student', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Query fee templates depending on role
        $query = DB::table('fee_templates');
        if ($user->hasRole('student')) {
            $query->where('is_visible', true);
        }
        $feeTemplates = $query->orderBy('created_at', 'desc')->get();

        if ($feeTemplates->isEmpty()) {
            return response()->json(['message' => 'No SOA data found'], 404);
        }

        // Prepare SOA data array
        $soaData = [];

        foreach ($feeTemplates as $template) {
            // Get fees for this template, grouped by category
            $fees = DB::table('fees')
                ->join('fee_categories', 'fees.fee_category_id', '=', 'fee_categories.id')
                ->where('fees.fee_template_id', $template->id)
                ->select('fee_categories.name as category_name', 'fees.fee_name', 'fees.amount')
                ->get()
                ->groupBy('category_name');

            $tuitionTotal = $template->tuition_per_unit * $template->total_units;
            $miscTotal = $fees->has('Miscellaneous') ? $fees['Miscellaneous']->sum('amount') : 0;

            $firstTermTotal = $tuitionTotal + $miscTotal;
            $secondTermTotal = $tuitionTotal + $miscTotal;
            $wholeAcademicYear = $firstTermTotal + $secondTermTotal;

            $soaData[] = [
                'template' => $template,
                'fees' => $fees,
                'tuitionTotal' => $tuitionTotal,
                'miscTotal' => $miscTotal,
                'firstTermTotal' => $firstTermTotal,
                'secondTermTotal' => $secondTermTotal,
                'wholeAcademicYear' => $wholeAcademicYear,
            ];
        }

        return view('soa.view', ['soaData' => $soaData]);
    }

    public function show($id)
    {

        $user = JWTAuth::authenticate();


        if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized to view SOAs'], 403);
        }

        $feeTemplate = FeeTemplate::where('academic_year_id', $id)
            ->with('fees')
            ->first();

        if (!$feeTemplate) {
            return response()->json(['message' => 'No Fee Template found for the specified academic year.'], 404);
        }

        return response()->json(['data' => $feeTemplate], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }


        $template = FeeTemplate::findOrFail($id);
        $request->validate([
            'is_visible' => 'required|boolean',
            'tuition_per_unit' => 'required|numeric|min:0',
            'total_units' => 'required|integer|min:0',
            'fees' => 'required|array',
            'fees.*.fee_category_id' => 'required|exists:fee_categories,id',
            'fees.*.fee_name' => 'required|string',
            'fees.*.amount' => 'required|numeric|min:0',
        ]);

        $tuitionTotal = $request->tuition_per_unit * $request->total_units;
        $miscellaneousCategoryId = FeeCategory::where('name', 'Miscellaneous')->value('id');

        if (!$miscellaneousCategoryId) {
            return response()->json(['message' => 'The "Miscellaneous" fee category does not exist.'], 400);
        }

        $miscellaneousTotal = collect($request->fees)
            ->where('fee_category_id', $miscellaneousCategoryId)
            ->sum('amount');

        $termTotal = $tuitionTotal + $miscellaneousTotal;
        $wholeYear = $termTotal * 2;

        $activeYear = AcademicYear::where('is_active', 1)->first();
        if (!$activeYear) {
            return response()->json(['message' => 'No active academic year found'], 404);
        }

        $template->update([
            // 'status' => $request->status,
            'academic_year_id' => $activeYear->id,
            'is_visible' => $request->is_visible,
            'tuition_per_unit' => $request->tuition_per_unit,
            'total_units' => $request->total_units,
            'tuition_total' => $tuitionTotal,
            'miscellaneous_total' => $miscellaneousTotal,
            'first_term_total' => $termTotal,
            'second_term_total' => $termTotal,
            'whole_academic_year' => $wholeYear,
            'scholarship_discount' => $wholeYear,
            'total_payment' => 0,
        ]);

        $template->fees()->delete();

        foreach ($request->fees as $fee) {
            $template->fees()->create([
                'fee_category_id' => $fee['fee_category_id'],
                'fee_name' => $fee['fee_name'],
                'amount' => $fee['amount'],
            ]);
        }

        return response()->json(['message' => 'SOA updated successfully', 'data' => $template->load('fees')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasAnyRole(['registrar', 'superadmin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $template = FeeTemplate::find($id);

        if (!$template) {
            return response()->json(['message' => 'SOA not found'], 404);
        }

        $template->delete();

        return response()->json(['message' => 'SOA deleted successfully']);
    }

}
