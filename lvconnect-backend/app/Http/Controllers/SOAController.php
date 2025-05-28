<?php

namespace App\Http\Controllers;

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

        if ($user->hasRole('student')) {
            return FeeTemplate::where('status', 'saved')
                            ->where('is_visible', true)
                            ->with('fees')
                            ->get();
        }

        if ($user->hasRole('registrar')) {
            return FeeTemplate::with('fees')->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:saved,archived',
            'is_visible' => 'required|boolean',
            'fees' => 'required|array',
            'fees.*.fee_category_id' => 'required|exists:fee_categories,id',
            'fees.*.fee_name' => 'required|string',
            'fees.*.amount' => 'required|numeric|min:0',
        ]);

        $termTotal = collect($request->fees)->sum('amount');
        $wholeYear = $termTotal * 2;

        $template = FeeTemplate::create([
            'status' => $request->status,
            'is_visible' => $request->is_visible,
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

        if (! $user->hasRole('registrar') && ! $user->hasRole('student')) {
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('registrar')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:saved,archived',
            'is_visible' => 'required|boolean',
            'fees' => 'required|array',
            'fees.*.fee_category_id' => 'required|exists:fee_categories,id',
            'fees.*.fee_name' => 'required|string',
            'fees.*.amount' => 'required|numeric|min:0',
        ]);
//         $request->validate([
//     'schoolYear' => 'required|string|exists:academic_years,year',
//     'tuitionFee.ratePerUnit' => 'required|numeric|min:0',
//     'tuitionFee.units' => 'required|numeric|min:0',
//     'tuitionFee.total' => 'required|numeric|min:0',

//     'miscFees' => 'required|array',
//     'miscFees.*.name' => 'required|string',
//     'miscFees.*.amount' => 'required|numeric|min:0',

//     'scholarshipDiscount' => 'nullable|numeric|min:0',
//     'programInfo' => 'nullable|string',

//     'miscTotal' => 'required|numeric|min:0',
//     'semesterTotal' => 'required|numeric|min:0',
//     'yearTotal' => 'required|numeric|min:0',
//     'totalPayment' => 'required|numeric|min:0',
// ]);


        $template = FeeTemplate::findOrFail($id);

        $termTotal = collect($request->fees)->sum('amount');
        $wholeYear = $termTotal * 2;

        $template->update([
            'status' => $request->status,
            'is_visible' => $request->is_visible,
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

        if (!$user->hasRole('registrar')) {
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
