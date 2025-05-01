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
use Barryvdh\DomPDF\Facade\Pdf;

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
    public function submissions(Request $request)
    {
        $user = JWTAuth::authenticate();

        if ($user->hasRole('student')) {
            // Ensure there's data being returned
            $submissions = FormSubmission::with('formType')
                ->where('submitted_by', $user->id)
                ->get();

            return response()->json($submissions);
        }

        if ($user->hasRole('psas')) {
            // Ensure there's data being returned for psas role
            $submissions = FormSubmission::with('formType')->get();

            return response()->json($submissions);
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
                'required' => $field['required'] ?? false,
                'page' => $field['page'] ?? 1,
            ]);
        }

        return response()->json(['message' => 'Fields saved successfully.']);
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

        $status = $request->input('status', 'pending');
        // Validate dynamic fields
        $rules = [];
        if ($status !== 'draft') {
            foreach ($formType->formFields as $field) {
                $rules["fields.{$field->id}"] = $field->is_required ? 'required|string' : 'nullable|string';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
        }

        // Create form submission
        $submission = FormSubmission::create([
            'form_type_id' => $formTypeId,
            'submitted_by' => $user->id,
            'status' => $status,
        ]);

        // Store submitted field data
        foreach ($request->fields as $fieldId => $value) {
            $field = $formType->formFields->find($fieldId);
            $fieldData = $field->field_data;
            $fieldName = $fieldData['name'] ?? null;

            if (!$field->is_required && is_null($value))
                continue;

            FormSubmissionData::create([
                'form_submission_id' => $submission->id,
                'form_field_id' => $fieldId,
                'field_name' => $fieldName,
                'answer_data' => $value,
                'is_verified' => true,
            ]);
        }

        return response()->json([
            'message' => $status === 'draft' ? 'Form saved as draft.' : 'Form submitted successfully and is now pending review.',
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

    /**
     * Download the form into PDF.
     */
    public function downloadApprovedForm($submissionId)
    {
        $user = JWTAuth::authenticate();

        $submission = FormSubmission::with(['formType', 'submissionData'])->findOrFail($submissionId);

        // Allow only student who owns it or PSAS role
        if (
            !$user->hasRole('psas') &&
            $submission->submitted_by !== $user->id
        ) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($submission->status !== 'approved') {
            return response()->json(['message' => 'Form not approved'], 403);
        }

        // Prepare data for the view
        $data = [
            'formType' => $submission->formType->name,
            'fields' => $submission->submissionData->map(function ($item) {
                return [
                    'field_name' => $item->field_name,
                    'value' => json_decode($item->answer_data),
                ];
            })
        ];

        $pdf = Pdf::loadView('pdf.form-submission', $data);

        return $pdf->download("submission_{$submission->id}.pdf");
    }

    // For student
    public function upload2x2Image(Request $request)
    {
        $user = JWTAuth::authenticate();
        if (!$user->hasRole('student')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpeg,png,jpg|dimensions:width=600,height=600|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $image = $request->file('photo');

        // Store to 'public/2x2' (which is storage/app/public/2x2)
        $path = $image->store('2x2', 'public');

        return response()->json([
            'message' => 'Image uploaded successfully',
            'image_url' => asset('storage/' . $path), // Full web-accessible URL
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Retrieve the form and its fields
        $formType = FormType::with('formFields')->find($id);

        if (!$formType) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        return response()->json(['form' => $formType, 'fields' => $formType->formFields]);
    }
    public function showSubmission($id)
    {
        $user = JWTAuth::authenticate();

        // Load the submission and submission data
        $submission = FormSubmission::with(['submissionData', 'formType'])->find($id);

        if (!$submission) {
            return response()->json(['message' => 'Submission not found'], 404);
        }

        if ($user->hasRole('student') && $submission->submitted_by !== $user->id) {
            return response()->json(['message' => 'Unauthorized access to this submission.'], 403);
        }

        if ($user->hasRole('psas') || $user->hasRole('student')) {
            return response()->json([
                'submission' => $submission,
                'submission_data' => $submission->submissionData,
            ]);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
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
            'description' => 'nullable|string',
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

    public function updateFields(Request $request, $formTypeId)
    {
        // Validate incoming fields
        $validator = Validator::make($request->all(), [
            'fields' => 'required|array',
            'fields.*.id' => 'nullable',
            'fields.*.label' => 'required|string',
            'fields.*.type' => 'required|string',
            'fields.*.name' => 'required|string',
            'fields.*.required' => 'boolean',
            'fields.*.options' => 'nullable|array',
            'fields.*.page' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Handle deleted fields
        if ($request->has('deleted_ids')) {
            FormField::where('form_type_id', $formTypeId)
                ->whereIn('id', $request->deleted_ids)
                ->delete();
        }

        // Loop over the fields to update
        foreach ($request->fields as $field) {
            if (
                !empty($field['id']) && is_numeric($field['id']) &&
                FormField::where('form_type_id', $formTypeId)->where('id', $field['id'])->exists()
            ) {
                // UPDATE existing field
                $formField = FormField::find($field['id']);
                $formField->update([
                    'field_data' => [
                        'label' => $field['label'],
                        'type' => $field['type'],
                        'name' => $field['name'],
                        'options' => $field['options'] ?? [],
                    ],
                    'required' => $field['required'] ?? false,
                    'page' => $field['page'] ?? 1,
                ]);
            } else {
                // CREATE new field
                FormField::create([
                    'form_type_id' => $formTypeId,
                    'field_data' => [
                        'label' => $field['label'],
                        'type' => $field['type'],
                        'name' => $field['name'],
                        'options' => $field['options'] ?? [],
                    ],
                    'required' => $field['required'] ?? false,
                    'page' => $field['page'] ?? 1,
                ]);
            }
        }


        return response()->json(['message' => 'Fields updated successfully.']);
    }

    public function updateDraftForm(Request $request, $id)
    {
        $user = JWTAuth::authenticate();
        $submission = FormSubmission::with('formType.formFields')->findOrFail($id);

        if ($submission->submitted_by !== $user->id || $submission->status !== 'draft') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $formType = $submission->formType;
        $rules = [];
        foreach ($formType->formFields as $field) {
            $rules["fields.{$field->id}"] = $field->is_required && $request->status !== 'draft'
                ? 'required|string'
                : 'nullable|string';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $submission->status = $request->status;
        $submission->save();

        // Update or create submission data
        foreach ($request->fields as $fieldId => $value) {
            $field = $formType->formFields->find($fieldId);
            $fieldName = $field->field_data['name'] ?? null;

            FormSubmissionData::updateOrCreate(
                [
                    'form_submission_id' => $submission->id,
                    'form_field_id' => $fieldId,
                ],
                [
                    'field_name' => $fieldName,
                    'answer_data' => $value,
                    'is_verified' => true,
                ]
            );
        }

        return response()->json(['message' => 'Draft updated successfully']);
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
        if ($form->pdf_path) {
            Storage::disk('public')->delete($form->pdf_path);
        }
        $form->delete();

        return response()->json(['message' => 'Form deleted successfully']);
    }
}
