<?php

namespace App\Http\Controllers;

use App\Models\FormType;
use App\Models\FormField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class SchoolFormsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = JWTAuth::authenticate();

        if ($user->hasRole('student')) {
            return FormType::with('formFields')->get();
        }

        if ($user->hasRole('psas')) {
            return FormType::with('formFields')->where('created_by', $user->id)->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'pdf' => 'required|file|mimes:pdf',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Store PDF
        $pdfPath = $request->file('pdf')->store('pdf_forms', 'public');

        // Create FormType record
        $formType = FormType::create([
            'title' => $request->title,
            'description' => $request->description,
            'pdf_path' => $pdfPath,
            'has_pdf' => true,
            'created_by' => $user->id,
        ]);

        return response()->json(['message' => 'Form uploaded successfully', 'form' => $formType], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $form = FormType::with('formFields')->findOrFail($id);
        return response()->json($form);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $form = FormType::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'pdf' => 'sometimes|file|mimes:pdf',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('pdf')) {
            // Delete old file
            Storage::disk('public')->delete($form->pdf_path);
            $pdfPath = $request->file('pdf')->store('pdf_forms', 'public');
            $form->pdf_path = $pdfPath;
        }

        $form->title = $request->title ?? $form->title;
        $form->description = $request->description ?? $form->description;
        $form->save();

        return response()->json(['message' => 'Form updated successfully', 'form' => $form]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $form = FormType::findOrFail($id);
        Storage::disk('public')->delete($form->pdf_path);
        $form->delete();

        return response()->json(['message' => 'Form deleted successfully']);
    }
}
