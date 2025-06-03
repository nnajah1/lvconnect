<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Notifications\UserCredentialsNotification;

class CreateAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createAdminAccount(Request $request)
    {
        $authenticatedUser = JWTAuth::authenticate();

        if (!$authenticatedUser || !$authenticatedUser->hasRole('superadmin')) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $allowedAdminRoles = ['registrar', 'psas', 'comms', 'scadmin'];
        $roles = $request->input('roles');

        if (!is_array($roles)) {
            $roles = [$roles];
            $request->merge(['roles' => $roles]);
        }
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'roles' => 'required|array',
            'roles.*' => ['required', Rule::in($allowedAdminRoles)],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Generate email from first and last name
        $firstName = strtolower(preg_replace('/\s+/', '', $request->first_name));
        $lastName = strtolower(preg_replace('/\s+/', '', $request->last_name));
        $email = $firstName . $lastName . '@laverdad.edu.ph';

        // Ensure email is unique (append number if needed)
        // $counter = 1;
        while (User::where('email', $email)->exists()) {
            // $email = $firstName . '.' . $lastName . $counter . '@example.com';
            $email = $firstName . $lastName . '@laverdad.edu.ph';

            // $counter++;
        }

        // Generate a random password
        $randomPassword = Str::random(10);

        // Create user
        $newAdmin = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $email,
            'password' => Hash::make($randomPassword),
        ]);

        $newAdmin->assignRole($request->roles);

        // Notify user with credentials
        $newAdmin->notify(new UserCredentialsNotification($randomPassword));

        return response()->json([
            'message' => 'Admin account created successfully.',
            'user' => [
                'name' => $newAdmin->first_name . ' ' . $newAdmin->last_name,
                'email' => $newAdmin->email,
                'roles' => $newAdmin->getRoleNames(),
            ]
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createStudentAccount(Request $request)
    {
        $user = JWTAuth::authenticate();

        if (!$user || !$user->hasRole('registrar')) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // convert first and last name: only letters and lowercase
        $firstName = strtolower(preg_replace('/[^a-zA-Z]/', '', $request->first_name));
        $lastName = strtolower(preg_replace('/[^a-zA-Z]/', '', $request->last_name));

        // Create base email
        $email = $firstName . $lastName . '@student.laverdad.edu.ph';

        // Ensure email is unique
        $counter = 1;
        while (User::where('email', $email)->exists()) {
            $email = $firstName . $lastName . $counter . '@student.laverdad.edu.ph';
            $counter++;
        }

        // Generate random password
        $randomPassword = Str::random(10);

        // Create student user
        $student = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $email,
            'password' => Hash::make($randomPassword),
        ]);

        $student->assignRole('student');

        // Notify student with credentials
        $student->notify(new UserCredentialsNotification($randomPassword));

        return response()->json([
            'message' => 'Student account created successfully.',
            'user' => [
                'name' => $student->first_name . ' ' . $student->last_name,
                'email' => $student->email,
                'role' => 'student',
            ]
        ], 201);
    }

    /**
     * Create more than one student.
     */
    public function batchCreateStudents(Request $request)
    {
        $authUser = JWTAuth::authenticate();

        if (!$authUser || !$authUser->hasRole('registrar')) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'users' => 'required|array|min:1',
            'users.*.first_name' => 'required|string|max:255',
            'users.*.last_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $createdUsers = [];

        foreach ($request->users as $userData) {
            // convert first and last name: only letters and lowercase
            $first = strtolower(preg_replace('/[^a-zA-Z]/', '', $userData['first_name']));
            $last = strtolower(preg_replace('/[^a-zA-Z]/', '', $userData['last_name']));

            // Build base email
            $emailBase = $first . $last;
            $email = $emailBase . '@student.laverdad.edu.ph';

            // Ensure uniqueness
            $counter = 1;
            while (User::where('email', $email)->exists()) {
                $email = $emailBase . $counter . '@student.laverdad.edu.ph';
                $counter++;
            }

            $randomPassword = Str::random(10);

            $newUser = User::create([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'email' => $email,
                'password' => Hash::make($randomPassword),
                'is_active' => true,
            ]);

            $newUser->assignRole('student');

            $newUser->notify(new UserCredentialsNotification($randomPassword));

            $createdUsers[] = [
                'name' => $newUser->first_name . ' ' . $newUser->last_name,
                'email' => $email,
                'role' => 'student',
            ];
        }

        return response()->json([
            'message' => 'Student accounts created successfully',
            'users' => $createdUsers,
        ], 201);
    }

    /**
     * Deactivate User
     */
    public function deactivateUser(Request $request, $id)
    {
        $authUser = JWTAuth::authenticate();

        if (!$authUser || !$authUser->hasAnyRole(['superadmin', 'registrar'])) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->hasRole('superadmin')) {
            return response()->json(['error' => 'Cannot deactivate a superadmin'], 403);
        }

        // Registrar admin can only deactivate students
        if ($authUser->hasRole('registrar') && !$user->hasRole('student')) {
            return response()->json(['error' => 'Registrar can only deactivate student accounts'], 403);
        }

        // Deactivate by setting is_active to false
        $user->is_active = false;
        $user->save();

        return response()->json(['message' => 'User has been deactivated and moved to Deactivated tab.']);
    }

    /**
     * Reactivate User.
     */
    public function reactivateUser(Request $request, $id)
    {
        $authUser = JWTAuth::authenticate();

        if (!$authUser || !$authUser->hasAnyRole(['superadmin', 'registrar'])) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->hasRole('superadmin')) {
            return response()->json(['error' => 'Cannot reactivate a superadmin'], 403);
        }

        // Registrar admin can only reactivate students
        if ($authUser->hasRole('registrar') && !$user->hasRole('student')) {
            return response()->json(['error' => 'Registrar can only reactivate student accounts'], 403);
        }

        // Reactivate by setting is_active to true
        $user->is_active = true;
        $user->save();

        return response()->json(['message' => 'User has been reactivated successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function showUserRole(Request $request, string $id = null)
    {
        $authUser = JWTAuth::authenticate();

        if (!$authUser || !$authUser->hasRole('superadmin')) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        if ($id) {
            $user = User::with('roles')->find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                ]
            ]);
        }

        $users = User::with('roles')->get();

        $data = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'roles' => $user->getRoleNames(),
            ];
        });

        // Get all role names
        $roles = Role::pluck('name');

        return response()->json([
            'users' => $data,
            'roles' => $roles,
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function updateAdminAccount(Request $request, $id)
    {
        $authUser = JWTAuth::authenticate();

        if (!$authUser || !$authUser->hasRole('superadmin')) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $admin = User::find($id);

        if (!$admin) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($admin->hasRole('superadmin')) {
            return response()->json(['error' => 'Cannot update another superadmin'], 403);
        }

        $allowedAdminRoles = ['registrar', 'psas', 'scadmin', 'comms'];
          $roles = $request->input('roles');

        if (!is_array($roles)) {
            $roles = [$roles];
            $request->merge(['roles' => $roles]);
        }

        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => ['required', Rule::in($allowedAdminRoles)],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $admin->syncRoles($request->roles);

        return response()->json([
            'message' => 'Admin role updated successfully',
            'user' => [
                'name' => $admin->first_name . ' ' . $admin->last_name,
                'new_roles' => $admin->getRoleNames(),
            ]
        ]);
    }

    public function updateAdminAccount2(Request $request, $id)
    {
        $authenticatedUser = JWTAuth::authenticate();

        if (!$authenticatedUser || !$authenticatedUser->hasRole('superadmin')) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $allowedAdminRoles = ['registrar', 'psas', 'scadmin', 'comms'];
        $roles = $request->input('roles');

        if (!is_array($roles)) {
            $roles = [$roles];
            $request->merge(['roles' => $roles]);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'roles' => 'required|array',
            'roles.*' => ['required', Rule::in($allowedAdminRoles)],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update user data
        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
        ]);

        // Sync roles
        $user->syncRoles($request->roles);

        return response()->json([
            'message' => 'Admin account updated successfully.',
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ]
        ]);
    }


    /**
     * Soft delete user.
     */
    public function deleteUser(Request $request, $id)
    {
        $authUser = JWTAuth::authenticate();

        if (!$authUser || !$authUser->hasAnyRole(['superadmin', 'registrar'])) {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->hasRole('superadmin')) {
            return response()->json(['error' => 'Cannot delete a superadmin'], 403);
        }

        // Registrar admin can only delete users with the 'student' role
        if ($authUser->hasRole('registrar') && !$user->hasRole('student')) {
            return response()->json(['error' => 'Registrar can only delete student accounts'], 403);
        }

        $user->delete(); // Soft delete

        return response()->json(['message' => 'User deleted (soft delete) successfully.']);
    }

    //list of deleted user
    public function listTrashedUsers()
    {
        return User::onlyTrashed()->get();
    }

    //restore deleted user
    public function restoreUser($id)
    {
        $user = User::onlyTrashed()->find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->restore();

        return response()->json(['message' => 'User restored successfully.']);
    }

}
