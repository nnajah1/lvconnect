<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\SchoolFormsController;
use App\Http\Controllers\SOAController;
use App\Http\Controllers\StudentManagementController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\SchoolUpdateController;
use App\Http\Controllers\TrustedDeviceController;
use App\Http\Controllers\CreateAccountController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OTPController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refreshToken']);

Route::post('/send-otp', [OTPController::class, 'sendOTP']);
Route::post('/resend-otp', [OTPController::class, 'resendOTP']);
Route::post('/verify-otp', [OTPController::class, 'verifyOTP']);

Route::post('/must-change-password', [ChangePasswordController::class, 'mustChangePassword']);

Route::post('/trusted-device', [TrustedDeviceController::class, 'storeDevice']); // Store a trusted device
Route::get('/trusted-device/check', [TrustedDeviceController::class, 'checkDevice']); // Check if a device is trusted

Route::get('/login/google/redirect', [OAuthController::class, 'redirectToGoogle']);
Route::get('/login/google/callback', [OAuthController::class, 'handleGoogleCallback']);
Route::post('/auth/google/token', [OAuthController::class, 'exchangeGoogleToken']);

Route::post('/send-reset-link', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::middleware('auth.jwt')->group(function () {
  Route::get('/me', [AuthController::class, 'me']);
  Route::get('/logout', [AuthController::class, 'logout']);
  Route::post('/switch-role', [AuthController::class, 'switchRole']);
  Route::post('/create-admin', [CreateAccountController::class, 'createAdminAccount']);
  Route::get('/trusted-devices', [TrustedDeviceController::class, 'index']); // List all trusted devices
  Route::delete('/trusted-devices/{device_id}', [TrustedDeviceController::class, 'destroy']); // Remove a trusted device
  Route::post('/verify-password-otp', [OTPController::class, 'verifyOtpForPasswordChange']);
  Route::post('/change-password', [ChangePasswordController::class, 'ChangePassword']);
  
  Route::get('/posts', [SchoolUpdateController::class, 'index']);
  Route::get('/posts/{id}', [SchoolUpdateController::class, 'show']);
  Route::get('/archive', [SchoolUpdateController::class, 'archivedPosts']);
  
  Route::post('/posts', [SchoolUpdateController::class, 'store']);
  Route::post('/posts/{schoolupdate}', [SchoolUpdateController::class, 'update']);
  Route::post('/posts/{schoolupdate}/submit', [SchoolUpdateController::class, 'submitForApproval']);
  Route::post('/posts/{schoolupdate}/approve', [SchoolUpdateController::class, 'approve']);
  Route::post('/posts/{schoolupdate}/reject', [SchoolUpdateController::class, 'reject']);
  Route::post('/posts/{schoolupdate}/revision', [SchoolUpdateController::class, 'requestRevision']);
  Route::post('/posts/{schoolupdate}/publish', [SchoolUpdateController::class, 'publish']);
  Route::post('/posts/{schoolupdate}/archive', [SchoolUpdateController::class, 'archive']);
  Route::post('/posts/{schoolupdate}/restore', [SchoolUpdateController::class, 'restore']);
  Route::post('/facebook-sync', [SchoolUpdateController::class, 'sync']);
  Route::delete('/posts/{id}/delete', [SchoolUpdateController::class, 'destroy']);


  Route::post('/forms', [SchoolFormsController::class, 'store']);
  Route::post('/forms/{formTypeId}/fields', [SchoolFormsController::class, 'storeFields']);
  Route::post('forms/submissions/{id}', [SchoolFormsController::class, 'submitForm']);
  Route::post('/forms/submissions/{id}/review', [SchoolFormsController::class, 'reviewSubmission']);
  Route::post('/upload-2x2-image', [SchoolFormsController::class, 'upload2x2Image']);


  Route::get('forms', [SchoolFormsController::class, 'index']);
  Route::get('/forms/{id}', [SchoolFormsController::class, 'show']);
  Route::get('/submissions', [SchoolFormsController::class, 'submissions']);
  Route::get('/forms/submissions/{id}', [SchoolFormsController::class, 'showSubmission']);
  Route::get('/submissions/{submissionId}/download', [SchoolFormsController::class, 'downloadApprovedForm']);
  Route::get('/approved-form-data/{submissionId}', [SchoolFormsController::class, 'getApprovedFormData']);


  Route::put('/forms/{id}', [SchoolFormsController::class, 'update']);
  Route::put('/forms/{formTypeId}/fields', [SchoolFormsController::class, 'updateFields']);
  Route::put('/forms/submissions/{id}', [SchoolFormsController::class, 'reviewSubmission']);
  Route::put('/submissions/{id}', [SchoolFormsController::class, 'updateDraftForm']);
  Route::delete('/forms/{id}', [SchoolFormsController::class, 'destroy']);


  Route::get('surveys', [SurveyController::class, 'index']);
  Route::get('/survey-responses/{id}', [SurveyController::class, 'getSurveyResponses']);
  Route::get('/surveys/{id}', [SurveyController::class, 'show']);
  Route::get('/survey-submissions/check/{surveyId}', [SurveyController::class, 'checkSubmission']);
  Route::get('/my-survey-response/{surveyId}', [SurveyController::class, 'getSurveyResponse']);
  Route::get('/survey-response/{surveyResponseId}', [SurveyController::class, 'getSubmittedSurveyResponseWithQuestions']);

  Route::post('/survey', [SurveyController::class, 'storeSurveyWithQuestions']);
  Route::post('/survey-responses', [SurveyController::class, 'submitResponse']);
  Route::post('/upload-photo', [SurveyController::class, 'uploadImage']);

  Route::put('/surveys/{id}', [SurveyController::class, 'updateSurveyWithQuestions']);

  Route::delete('/surveys/{id}', [SurveyController::class, 'destroy']);

  
  Route::get('/enrollment', [EnrollmentController::class, 'index']);
  Route::get('/enrollees', [EnrollmentController::class, 'adminView']);
  Route::get('/not-enrolled', [EnrollmentController::class, 'getStudentsWithoutEnrollment']);
  Route::get('/enrollees/enrolled', [EnrollmentController::class, 'showEnrolled']);
  Route::get('/enrollee/{id}', [EnrollmentController::class, 'show']);
  Route::get('/not-enrolled/{id}', [EnrollmentController::class, 'directEnrollButton']);
  Route::get('/enrollment-schedule', [EnrollmentController::class, 'showEnrollmentSchedule']);
  Route::post('/enrollment-approve/{id}', [EnrollmentController::class, 'approve']);
  Route::post('/enrollment-reject/{id}', [EnrollmentController::class, 'reject']);
  Route::post('/enrollment/bulk-approve', [EnrollmentController::class, 'bulkApprove']);
  Route::post('/enrollment/bulk-delete', [EnrollmentController::class, 'bulkDelete']);
  Route::post('/enrollment/bulk-export', [EnrollmentController::class, 'bulkExport']);
  Route::post('/enrollment/bulk-remind', [EnrollmentController::class, 'bulkRemind']);
  Route::post('/enrollment/bulk-remind-rejected', [EnrollmentController::class, 'bulkRemindRejected']);
  Route::post('/archive-student-data/{id}', [StudentManagementController::class, 'archive']);
  Route::post('/enrollees/bulk-archive', [StudentManagementController::class, 'bulkArchive']);
  Route::post('/enrollment-schedule/toggle', [EnrollmentController::class, 'toggleEnrollmentSchedule']);

  Route::get('/enrollment-data', [EnrollmentController::class, 'showEnrollmentData']);
  Route::put('/manual-enrollment/{id}', [EnrollmentController::class, 'manualEnrollment']);
  Route::put('/update-student/{id}', [StudentManagementController::class, 'updateStudentManagement']);
  Route::put('/student/enroll', [EnrollmentController::class, 'studentEnrollment']);
  Route::post('/enrollees/{id}', [StudentManagementController::class, 'archive']);
  Route::post('/academic-years', [AcademicYearController::class, 'store']);
  Route::get('/academic-years', [AcademicYearController::class, 'index']);

  Route::get('/soa/{schoolYear}', [SOAController::class, 'show']);
  Route::post('/soa', [SOAController::class, 'store']);
  Route::put('/soa/{schoolYear}', [SOAController::class, 'update']);

  Route::get('/analytics-summary/{surveyId}', [DashboardController::class, 'analyticsSummary']);
  Route::get('/psas-dashboard', [DashboardController::class, 'analyticsDashboard']);
  Route::get('/schooladmin-dashboard', [DashboardController::class, 'schoolDashboard']);
  

});

Route::patch('/user/notification-preference', [UserController::class, 'updateNotificationPreference']);