<?php

namespace App\Http\Controllers;

use App\Models\FormSubmission;
use App\Models\FormSubmissionData;
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
            return FormType::with('formFields')
                ->where('is_visible', true)
                ->get();
        }

        if ($user->hasRole('psas')) {
            return FormType::with('formFields')->where('created_by', $user->id)->get();
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }

    /**
     * Store a newly created resource in storage.
     */

    // Create new form
    public function store(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'pdf' => 'required|file|mimes:pdf',
            'is_visible' => 'boolean',
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
            'content' => $request->content,
            'pdf_path' => $pdfPath,
            'has_pdf' => true,
            'is_visible' => $request->is_visible ?? true,
            'created_by' => $user->id,
        ]);

        return response()->json(['message' => 'Form uploaded successfully', 'form' => $formType], 201);
    }

    //Store form fields 
    public function storeFields(Request $request, $formTypeId)
    {
        $validator = Validator::make($request->all(), [
            'fields' => 'required|array',
            'fields.*.label' => 'required|string',
            'fields.*.type' => 'required|string',
            'fields.*.name' => 'required|string',
            'fields.*.required' => 'boolean',
            'fields.*.x' => 'nullable|numeric',
            'fields.*.y' => 'nullable|numeric',
            'fields.*.width' => 'nullable|numeric',
            'fields.*.height' => 'nullable|numeric',
            'fields.*.options' => 'nullable|array',
            'fields.*.page' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->fields as $field) {
            FormField::create([
                'form_type_id' => $formTypeId,
                'field_data' => [
                    'label' => $field['label'],
                    'type' => $field['type'],
                    'name' => $field['name'],
                    'options' => $field['options'] ?? [],
                ],
                'x' => $field['x'] ?? 0,
                'y' => $field['y'] ?? 0,
                'width' => $field['width'] ?? 100,
                'height' => $field['height'] ?? 40,
                'required' => $field['required'] ?? false,
                'page' => $field['page'] ?? 1,
            ]);
        }

        return response()->json(['message' => 'Fields saved successfully.']);
    }


    /**
     * Visibility for toggle
     */
    public function toggleVisibility(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $form = FormType::findOrFail($id);

        $form->is_visible = !$form->is_visible;
        $form->save();

        return response()->json([
            'message' => 'Visibility updated successfully.',
            'is_visible' => $form->is_visible
        ]);
    }

    //Submit form data
    public function submitForm(Request $request, $formTypeId)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|integer',
            'answers' => 'required|array',
            'answers.*.field_id' => 'required|integer',
            'answers.*.field_name' => 'required|string',
            'answers.*.answer_data' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $submission = FormSubmission::create([
            'form_type_id' => $formTypeId,
            'student_id' => $request->student_id,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        foreach ($request->answers as $answer) {
            FormSubmissionData::create([
                'form_submission_id' => $submission->id,
                'form_field_id' => $answer['field_id'],
                'field_name' => $answer['field_name'],
                'answer_data' => json_encode($answer['answer_data']),
                'is_verified' => false,
            ]);
        }

        return response()->json(['message' => 'Form submitted successfully.']);
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
            'content' => 'nullable|string',
            'pdf' => 'sometimes|file|mimes:pdf',
            'is_visible' => 'boolean',
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
        $form->content = $request->content ?? $form->content;
        $form->is_visible = $request->is_visible ?? $form->is_visible;
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
