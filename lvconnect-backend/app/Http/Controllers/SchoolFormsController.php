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
use Intervention\Image\Facades\Image;

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
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'pdf' => 'nullable|file|mimes:pdf',
            'is_visible' => 'boolean',
            
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pdfPath = null;
        $hasPdf = false;
        
        try {
            if ($request->hasFile('pdf')) {
                $pdfPath = $request->file('pdf')->store('pdf_forms', 'public');
                $hasPdf = true;
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'PDF upload failed', 'error' => $e->getMessage()], 500);
        }
        
        // Create FormType record
        $formType = FormType::create([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'pdf_path' => $pdfPath,
            'has_pdf' => $hasPdf,
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

    /**
     * Submit form for student.
     */
    public function submitForm(Request $request, $formTypeId)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $formType = FormType::with('formFields')->findOrFail($formTypeId);

        // Validate dynamic fields
        $rules = [];
        foreach ($formType->formFields as $field) {
            $rules["fields.{$field->id}"] = $field->is_required ? 'required|string' : 'nullable|string';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create form submission
        $submission = FormSubmission::create([
            'form_type_id' => $formTypeId,
            'user_id' => $user->id,
            'status' => 'pending', // 👈 this is where the 'pending' status is set
        ]);

        // Store submitted field data
        foreach ($request->fields as $fieldId => $value) {
            FormSubmissionData::create([
                'form_submission_id' => $submission->id,
                'form_field_id' => $fieldId,
                'value' => $value,
            ]);
        }

        return response()->json([
            'message' => 'Form submitted successfully and is now pending review.',
            'submission_id' => $submission->id,
        ], 201);
    }


    /**
     * Approved or Rejected for admin
     */
    public function reviewSubmission(Request $request, $id)
    {
        $user = JWTAuth::authenticate();

        if (!$user->hasRole('psas')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $submission = FormSubmission::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
            'admin_remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $submission->status = $request->status;
        $submission->admin_remarks = $request->admin_remarks ?? null;
        $submission->save();

        return response()->json([
            'message' => 'Form submission reviewed successfully.',
            'submission' => $submission,
        ]);
    }


    // For student
    public function uploadImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $image = Image::make($request->file('image'));

        if ($image->width() !== 192 || $image->height() !== 192) {
            return response()->json(['error' => 'Image must be exactly 2x2 inches (192x192 pixels at 96 DPI).'], 422);
        }

        $path = $request->file('image')->store('2x2_images', 'public');

        return response()->json(['message' => 'Image uploaded', 'path' => $path]);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Retrieve the form and its fields
        $formType = FormType::with('fields')->find($id);

        if (!$formType) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        return response()->json($formType);
    }

    public function getVisibleForms()
    {
        // Retrieve all forms where is_visible is true
        $forms = FormType::where('is_visible', true)->get();

        return response()->json($forms);
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
