<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\AdminPermissionService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminPermissionService::synchronizeRolesAndPermissions();

        $user = User::query()->updateOrCreate(
            ['email' => 'admin@cms.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        $user->syncRoles(['super-admin']);
    }
}
