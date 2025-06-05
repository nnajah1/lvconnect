<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Notifications\UserCredentialsNotification;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        $errors = [];
        foreach ($rows as $row) {
            $data = [
                'first_name' => $row['first_name'] ?? '',
                'last_name' => $row['last_name'] ?? '',
            ];

            // Validate each row
            $validator = Validator::make($data, [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                continue; // Skip invalid rows
            }

            $firstName = ucwords(strtolower($data['first_name']));
            $lastName = ucwords(strtolower($data['last_name']));


            // Prepare email
            $first = strtolower(preg_replace('/[^a-zA-Z]/', '', $data['first_name']));
            $last = strtolower(preg_replace('/[^a-zA-Z]/', '', $data['last_name']));
            $baseEmail = $first . $last;
            $email = $baseEmail . '@example.com';

            $nameEmailExists = User::where('first_name', $data['first_name'])
                ->where('last_name', $data['last_name'])
                ->where('email', $email)
                ->exists();

            if ($nameEmailExists) {
                $errors[] = "Email '{$email}' already exists.";
                continue;
            }


            // Create user
            $randomPassword = Str::random(10);
            $user = User::create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => Hash::make($randomPassword),
                'is_active' => true,
            ]);

            $user->assignRole('student');
            $user->notify(new UserCredentialsNotification($randomPassword));

        }
        if (count($errors)) {
        return response()->json([
            'message' => 'Some accounts were created.',
            'error' => 'Import failed',
            'details' => $errors,
        ], 207);
    }
    }
}

