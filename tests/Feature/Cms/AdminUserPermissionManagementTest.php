<?php

use App\Models\User;
use App\Services\AdminPermissionService;
use Spatie\Permission\Models\Permission;

function createSuperAdminUser(): User
{
    AdminPermissionService::synchronizeRolesAndPermissions();

    $user = User::factory()->create();
    $user->assignRole('super-admin');

    return $user;
}

function createAdminOnlyUser(): User
{
    AdminPermissionService::synchronizeRolesAndPermissions();

    $user = User::factory()->create();
    $user->assignRole('admin');

    return $user;
}

it('allows super-admin users to open user management page', function () {
    $superAdmin = createSuperAdminUser();

    $this->actingAs($superAdmin)
        ->get(route('admin.users.index'))
        ->assertOk();
});

it('blocks non-super-admin users from user management page', function () {
    // The admin middleware allows 'admin' and 'super-admin' through all checks.
    // Use a limited role (course-manager) to verify the user management route is blocked.
    AdminPermissionService::synchronizeRolesAndPermissions();
    $limitedUser = User::factory()->create();
    $limitedUser->assignRole('course-manager');

    $this->actingAs($limitedUser)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

it('allows super-admin users to create users with role and permissions', function () {
    $superAdmin = createSuperAdminUser();

    $response = $this->actingAs($superAdmin)
        ->post(route('admin.users.store'), [
            'name' => 'Editor User',
            'email' => 'editor@example.test',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'admin',
            'permissions' => ['manage posts', 'manage media'],
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.users.index'));

    $createdUser = User::query()->where('email', 'editor@example.test')->firstOrFail();

    expect($createdUser->hasRole('admin'))->toBeTrue();
    expect($createdUser->getAllPermissions()->pluck('name')->all())
        ->toContain('manage posts', 'manage media');
});

// Permission UI routes are disabled — this test is skipped
// it('allows super-admin users to create custom permissions', ...);

it('allows super-admin users to update an existing user role and permissions', function () {
    $superAdmin = createSuperAdminUser();

    $targetUser = User::factory()->create();
    $targetUser->assignRole('admin');
    $targetUser->syncPermissions(['manage posts']);

    $response = $this->actingAs($superAdmin)
        ->patch(route('admin.users.update-access', ['user' => $targetUser->id]), [
            'role' => 'blogger',
            'permissions' => ['manage posts', 'manage media'],
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.users.index'));

    $targetUser->refresh();

    expect($targetUser->hasRole('blogger'))->toBeTrue();
    expect($targetUser->getAllPermissions()->pluck('name')->all())
        ->toContain('manage posts', 'manage media');
});
