<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\UpdateAdminUserPermissionsRequest;
use App\Models\User;
use App\Services\AdminPermissionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        AdminPermissionService::synchronizeRolesAndPermissions();

        return Inertia::render('Admin/Users/Index', [
            'users' => User::query()
                ->with(['roles:id,name', 'permissions:id,name'])
                ->orderBy('name')
                ->get(['id', 'name', 'email'])
                ->map(fn (User $user): array => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->values()->all(),
                    'permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
                ])
                ->values()
                ->all(),
            'roles' => ['admin', 'super-admin'],
            'availablePermissions' => AdminPermissionService::featureDefinitions(),
        ]);
    }

    public function store(StoreAdminUserRequest $request): RedirectResponse
    {
        AdminPermissionService::synchronizeRolesAndPermissions();

        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([$validated['role']]);
        $user->syncPermissions($validated['permissions'] ?? []);

        return to_route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function updateAccess(UpdateAdminUserPermissionsRequest $request, User $user): RedirectResponse
    {
        if ($user->hasRole('super-admin')) {
            return to_route('admin.users.index')->with('error', 'Super-admin access cannot be modified.');
        }

        AdminPermissionService::synchronizeRolesAndPermissions();

        $validated = $request->validated();

        $user->syncRoles([$validated['role']]);
        $user->syncPermissions($validated['permissions'] ?? []);

        return to_route('admin.users.index')->with('success', 'User access updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return to_route('admin.users.index')->with('error', 'You cannot delete your own account.');
        }

        if ($user->hasRole('super-admin')) {
            return to_route('admin.users.index')->with('error', 'Super-admin accounts cannot be deleted.');
        }

        $user->delete();

        return to_route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
