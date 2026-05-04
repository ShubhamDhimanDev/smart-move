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

it('allows super-admin users to open user and permission management pages', function () {
    $superAdmin = createSuperAdminUser();

    $this->actingAs($superAdmin)
        ->get(route('admin.users.index'))
        ->assertOk();

    $this->actingAs($superAdmin)
        ->get(route('admin.permissions.index'))
        ->assertOk();
});

it('blocks non-super-admin users from user and permission management pages', function () {
    $adminUser = createAdminOnlyUser();

    $this->actingAs($adminUser)
        ->get(route('admin.users.index'))
        ->assertForbidden();

    $this->actingAs($adminUser)
        ->get(route('admin.permissions.index'))
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

it('allows super-admin users to create custom permissions', function () {
    $superAdmin = createSuperAdminUser();

    $response = $this->actingAs($superAdmin)
        ->post(route('admin.permissions.store'), [
            'name' => 'manage seo',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.permissions.index'));

    expect(Permission::query()->where('name', 'manage seo')->exists())->toBeTrue();
});
