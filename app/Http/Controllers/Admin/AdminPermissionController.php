<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePermissionRequest;
use App\Services\AdminPermissionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class AdminPermissionController extends Controller
{
    public function index(): Response
    {
        AdminPermissionService::synchronizeRolesAndPermissions();

        return Inertia::render('Admin/Permissions/Index', [
            'permissions' => Permission::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Permission $permission): array => [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'is_core' => AdminPermissionService::isCorePermission($permission->name),
                ])
                ->values()
                ->all(),
        ]);
    }

    public function store(StorePermissionRequest $request): RedirectResponse
    {
        Permission::findOrCreate($request->validated('name'), 'web');

        return to_route('admin.permissions.index')->with('success', 'Permission created successfully.');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        if (AdminPermissionService::isCorePermission($permission->name)) {
            return to_route('admin.permissions.index')->with('error', 'Core admin permissions cannot be deleted.');
        }

        $permission->delete();

        return to_route('admin.permissions.index')->with('success', 'Permission deleted successfully.');
    }
}
