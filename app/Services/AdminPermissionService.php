<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminPermissionService
{
    /**
     * All system permissions
     *
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

            ['name' => 'manage courses', 'label' => 'Courses'],
            ['name' => 'manage course categories', 'label' => 'Course Categories'],
            ['name' => 'manage course cities', 'label' => 'Course Cities'],
            ['name' => 'manage course types', 'label' => 'Course Types'],

            ['name' => 'manage users', 'label' => 'Users'],
            ['name' => 'manage permissions', 'label' => 'Permissions'],
        ];
    }

    /**
     * Get all permission names
     *
     * @return array<int, string>
     */
    public static function featurePermissions(): array
    {
        return array_column(self::featureDefinitions(), 'name');
    }

    /**
     * Role definitions
     *
     * @return array<string, array<int, string>>
     */
    public static function roleDefinitions(): array
    {
        return [

            /*
            |--------------------------------------------------------------------------
            | Blogger
            |--------------------------------------------------------------------------
            */
            'blogger' => [
                'manage posts',
                'manage categories',
                'manage media',
                'manage comments',
            ],

            /*
            |--------------------------------------------------------------------------
            | Event Manager
            |--------------------------------------------------------------------------
            */
            'event-manager' => [
                'manage events',
            ],

            /*
            |--------------------------------------------------------------------------
            | Application Manager
            |--------------------------------------------------------------------------
            */
            'application-manager' => [
                'manage applications',
            ],

            /*
            |--------------------------------------------------------------------------
            | Course Manager
            |--------------------------------------------------------------------------
            */
            'course-manager' => [
                'manage courses',
                'manage course categories',
                'manage course cities',
                'manage course types',
            ],

            /*
            |--------------------------------------------------------------------------
            | Admin
            |--------------------------------------------------------------------------
            */
            'admin' => [
                // Blog
                'manage posts',
                'manage categories',
                'manage media',
                'manage comments',

                // Events
                'manage events',

                // Applications
                'manage applications',

                // Courses
                'manage courses',
                'manage course categories',
                'manage course cities',
                'manage course types',
            ],

            /*
            |--------------------------------------------------------------------------
            | Super Admin
            |--------------------------------------------------------------------------
            */
            'super-admin' => self::featurePermissions(),
        ];
    }

    public static function isCorePermission(string $permission): bool
    {
        return in_array($permission, self::featurePermissions(), true);
    }

    /**
     * Create/update all roles and permissions
     */
    public static function synchronizeRolesAndPermissions(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | Create Permissions
        |--------------------------------------------------------------------------
        */
        foreach (self::featurePermissions() as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        /*
        |--------------------------------------------------------------------------
        | Create Roles + Assign Permissions
        |--------------------------------------------------------------------------
        */
        foreach (self::roleDefinitions() as $roleName => $permissions) {

            $role = Role::findOrCreate($roleName, 'web');

            $role->syncPermissions($permissions);
        }
    }
}
