<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FeeTemplate;
use Tymon\JWTAuth\Facades\JWTAuth;

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
                            ->get();
        }

        if ($user->hasRole('registrar')) {
            return FeeTemplate::all();
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
            'term' => 'required|string',
            'status' => 'required|in:saved,archived',
            'is_visible' => 'required|boolean',
            'fees' => 'required|array',
            'fees.*.fee_category_id' => 'required|exists:fee_categories,id',
            'fees.*.fee_name' => 'required|string',
            'fees.*.amount' => 'required|numeric|min:0',
        ]);

        $template = FeeTemplate::create([
            'term' => $request->term,
            'status' => $request->status,
            'is_visible' => $request->is_visible,
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
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = JWTAuth::authenticate();

        $template = FeeTemplate::with('fees')->find($id);

        if (!$template) {
            return response()->json(['message' => 'SOA not found'], 404);
        }

        if ($user->hasRole('student')) {
            // Students only see saved & visible SOAs
            if ($template->status !== 'saved' || !$template->is_visible) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            return response()->json($template);
        }

        if ($user->hasRole('registrar')) {
            return response()->json($template);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
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
            'term' => 'required|string',
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

        $template->update([
            'term' => $request->term,
            'status' => $request->status,
            'is_visible' => $request->is_visible,
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
