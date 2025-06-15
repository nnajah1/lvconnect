<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {

        // Ensure the 'student' role exists
        $studentRole = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'api']);

        // student accounts
        $students = [
            ['first_name' => 'Daniel',    'last_name' => 'Casimiro',    'email' => 'daniel.casimiro@student.laverdad.edu.ph'],
            ['first_name' => 'Leander Dylan',    'last_name' => 'Broñola',  'email' => 'leanderdylan.bronola@student.laverdad.edu.ph'],
            ['first_name' => 'Marwin',    'last_name' => 'Mandocdoc',  'email' => 'marwin.mandocdoc@student.laverdad.edu.ph'],
            ['first_name' => 'Lorein',   'last_name' => 'Manluctao',  'email' => 'lorein.manluctao@student.laverdad.edu.ph'],
            ['first_name' => 'Diana',   'last_name' => 'Teves',  'email' => 'diana.teves@student.laverdad.edu.ph'],
            ['first_name' => 'Ydrey Ann',   'last_name' => 'Ramirez',    'email' => 'ydreyann.ramirez@student.laverdad.edu.ph'],
            ['first_name' => 'Janice',  'last_name' => 'Agnote', 'email' => 'janice.agnote@student.laverdad.edu.ph'],
            ['first_name' => 'Angelene',   'last_name' => 'Ariate',  'email' => 'angelene.ariate@student.laverdad.edu.ph'],
            ['first_name' => 'April Joy',  'last_name' => 'Gud-ay', 'email' => 'apriljoy.gud-ay@student.laverdad.edu.ph'],
            ['first_name' => 'Jay-r',  'last_name' => 'Santos',  'email' => 'jayr.santos@student.laverdad.edu.ph'],
            
            ['first_name' => 'Brenan Lester',    'last_name' => 'Espeleta',    'email' => 'brenanlester.espeleta@student.laverdad.edu.ph'],
            ['first_name' => 'Perfecto',   'last_name' => 'Gardoce III',  'email' => 'perfecto.gardoceiii@student.laverdad.edu.ph'],
            ['first_name' => 'Leorenz Bien',    'last_name' => 'Rodriguez',  'email' => 'leorenzbienrodriguez@student.laverdad.edu.ph'],
            ['first_name' => 'Allan Jay',   'last_name' => 'Sao-ngon',  'email' => 'allanjay.sao-ngon@student.laverdad.edu.ph'],
            ['first_name' => 'Romar',   'last_name' => 'Samson',  'email' => 'romarsamson@student.laverdad.edu.ph'],
            ['first_name' => 'Miguel', 'last_name' => 'Ramirez',    'email' => 'juanmiguelramirez@student.laverdad.edu.ph'],
            ['first_name' => 'Jocelyn',  'last_name' => 'Bendoy', 'email' => 'jocelynbendoy@student.laverdad.edu.php'],
            ['first_name' => 'Patrick Premacio',   'last_name' => 'Pioquinto',  'email' => 'patrickpioquinto@student.laverdad.edu.ph'],
            ['first_name' => 'Jamela',  'last_name' => 'Fernandez', 'email' => 'jamelafernandez@student.laverdad.edu.ph'],
            ['first_name' => 'Eunice',  'last_name' => 'Lugtu',  'email' => 'eunicelugtu@student.laverdad.edu.ph'],
            
            ['first_name' => 'Luisa',    'last_name' => 'Padillon',    'email' => 'luisajean.padillon@student.laverdad.edu.ph'],
            ['first_name' => 'Nicklee',    'last_name' => 'Almaida',  'email' => 'nickleealmaida@student.laverdad.edu.ph'],
            ['first_name' => 'Shandi',    'last_name' => 'Belen',  'email' => 'shandilorainebelen@student.laverdad.edu.ph'],
            ['first_name' => 'Jeremy',   'last_name' => 'Ortega',  'email' => 'jeremyortega@student.laverdad.edu.ph'],
            ['first_name' => 'John Miguel',   'last_name' => 'Manabo',  'email' => 'johnmiguelmanabo@student.laverdad.edu.ph'],
            ['first_name' => 'Amber Princess',   'last_name' => 'Rosana',    'email' => 'amberprincessrosana@student.laverdad.edu.ph'],
            ['first_name' => 'Sofia Isabel',  'last_name' => 'Latina', 'email' => 'sofiaisabellatina@student.laverdad.edu.ph'],
            ['first_name' => 'Ryan Aaron',   'last_name' => 'Dela Cruz',  'email' => 'ryanaarondelacruz@student.laverdad.edu.ph'],
            ['first_name' => 'Lovely Heart',  'last_name' => 'Pintes', 'email' => 'lovelyheartpintes@student.laverdad.edu.ph'],
            ['first_name' => 'Altia',  'last_name' => 'Inale',  'email' => 'altiainale@student.laverdad.edu.ph'],
        ];

        foreach ($students as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'password' => Hash::make('password'),
                    'avatar' => 'https://loremflickr.com/200/200/animal?random=' . $this->faker()->unique()->numberBetween(1, 9999),
                    'must_change_password' => false,
                ]
            );

            $user->assignRole($studentRole);
        }

        $this->command->info('50 student users seeded with "student" role and avatars.');
    }

    protected function faker()
    {
        return \Faker\Factory::create();
    }
}
