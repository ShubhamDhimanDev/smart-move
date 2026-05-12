<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminPermissionService
{
    /**
     * @return array<int, array{name: string, label: string}>
     */
    public static function featureDefinitions(): array
    {
        return [
            ['name' => 'manage pages', 'label' => 'Pages'],
            ['name' => 'manage posts', 'label' => 'Posts'],
            ['name' => 'manage categories', 'label' => 'Categories'],
            ['name' => 'manage media', 'label' => 'Media'],
            ['name' => 'manage comments', 'label' => 'Comments'],
            ['name' => 'manage events', 'label' => 'Events'],
            ['name' => 'manage applications', 'label' => 'Applications'],
            ['name' => 'manage users', 'label' => 'Users'],
            ['name' => 'manage permissions', 'label' => 'Permissions'],
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function featurePermissions(): array
    {
        return array_column(self::featureDefinitions(), 'name');
    }

    /**
     * @return array<int, string>
     */
    public static function adminRolePermissions(): array
    {
        return array_values(array_filter(
            self::featurePermissions(),
            fn (string $permission): bool => ! in_array($permission, ['manage users', 'manage permissions'], true),
        ));
    }

    public static function isCorePermission(string $permission): bool
    {
        return in_array($permission, self::featurePermissions(), true);
    }

    public static function synchronizeRolesAndPermissions(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (self::featurePermissions() as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $adminRole = Role::findOrCreate('admin', 'web');
        $superAdminRole = Role::findOrCreate('super-admin', 'web');

        $adminRole->syncPermissions(self::adminRolePermissions());
        $superAdminRole->syncPermissions(self::featurePermissions());
    }
}
