<?php

namespace Database\Seeders;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Role::create(['name' => 'superadmin', 'guard_name' => 'api']);
        Role::create(['name' => 'admin', 'guard_name' => 'api']);
        Role::create(['name' => 'comms', 'guard_name' => 'api']);
        Role::create(['name' => 'scadmin', 'guard_name' => 'api']);
        Role::create(['name' => 'psas', 'guard_name' => 'api']);
        Role::create(['name' => 'student', 'guard_name' => 'api']);

        // Assign permissions
        // $comms->givePermissionTo(
        //     ['create post', 
        //     'update post', 
        //     'submit for approval',
        //     'delete post', 
        //     'publish post'
        
        //     ]);

        // $scadmin->givePermissionTo(
        //     ['approve post',
        //     'request revision',
        //     'reject post',
        //     ]);
    }
}

