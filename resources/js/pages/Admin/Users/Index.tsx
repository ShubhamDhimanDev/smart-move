import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as userRoutes from '@/routes/admin/users';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
};

type PermissionOption = {
    name: string;
    label: string;
};

type Props = {
    users: AdminUser[];
    roles: string[];
    availablePermissions: PermissionOption[];
};

type CreateUserForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    permissions: string[];
};

export default function UsersIndex({ users, roles, availablePermissions }: Props) {
    const createForm = useForm<CreateUserForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin',
        permissions: [],
    });

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingRole, setEditingRole] = useState<string>('admin');
    const [editingPermissions, setEditingPermissions] = useState<string[]>([]);

    const submitCreate = (event: FormEvent) => {
        event.preventDefault();

        createForm.post(userRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () =>
                createForm.reset('name', 'email', 'password', 'password_confirmation', 'permissions'),
        });
    };

    const startEditing = (user: AdminUser) => {
        setEditingUserId(user.id);
        setEditingRole(user.roles[0] ?? 'admin');
        setEditingPermissions(user.permissions);
    };

    const saveAccess = (userId: number) => {
        router.patch(
            userRoutes.updateAccess.url({ user: userId }),
            {
                role: editingRole,
                permissions: editingPermissions,
            },
            {
                preserveScroll: true,
                onSuccess: () => setEditingUserId(null),
            },
        );
    };

    const deleteUser = (user: AdminUser) => {
        if (!window.confirm(`Delete user "${user.name}"?`)) {
            return;
        }

        router.delete(userRoutes.destroy.url({ user: user.id }), {
            preserveScroll: true,
        });
    };

    const togglePermission = (selectedPermissions: string[], permissionName: string): string[] => {
        if (selectedPermissions.includes(permissionName)) {
            return selectedPermissions.filter((permission) => permission !== permissionName);
        }

        return [...selectedPermissions, permissionName];
    };

    return (
        <>
            <Head title="Users" />

            <div className="space-y-4">
                <h1 className="text-2xl font-semibold tracking-tight">Users</h1>

                <form
                    onSubmit={submitCreate}
                    className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                >
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={createForm.data.name}
                                onChange={(event) => createForm.setData('name', event.target.value)}
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(event) => createForm.setData('email', event.target.value)}
                            />
                            <InputError message={createForm.errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={createForm.data.password}
                                onChange={(event) => createForm.setData('password', event.target.value)}
                            />
                            <InputError message={createForm.errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={createForm.data.password_confirmation}
                                onChange={(event) => createForm.setData('password_confirmation', event.target.value)}
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                value={createForm.data.role}
                                onChange={(event) => createForm.setData('role', event.target.value)}
                                className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            <InputError message={createForm.errors.role} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Permissions</Label>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {availablePermissions.map((permission) => (
                                <label
                                    key={permission.name}
                                    className="flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={createForm.data.permissions.includes(permission.name)}
                                        onChange={() =>
                                            createForm.setData(
                                                'permissions',
                                                togglePermission(createForm.data.permissions, permission.name),
                                            )
                                        }
                                    />
                                    <span>{permission.label}</span>
                                </label>
                            ))}
                        </div>
                        <InputError message={createForm.errors.permissions} />
                    </div>

                    <Button type="submit" disabled={createForm.processing}>
                        Create User
                    </Button>
                </form>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Permissions</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {users.map((user) => {
                                const isEditing = editingUserId === user.id;
                                const isSuperAdmin = user.roles.includes('super-admin');

                                return (
                                    <tr key={user.id}>
                                        <td className="px-4 py-3">{user.name}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <select
                                                    value={editingRole}
                                                    onChange={(event) => setEditingRole(event.target.value)}
                                                    className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm"
                                                >
                                                    {roles.map((role) => (
                                                        <option key={role} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                user.roles.join(', ')
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isSuperAdmin ? (
                                                <span className="text-sm text-neutral-400">All permissions</span>
                                            ) : isEditing ? (
                                                <div className="grid gap-1 sm:grid-cols-2">
                                                    {availablePermissions.map((permission) => (
                                                        <label
                                                            key={permission.name}
                                                            className="flex items-center gap-2 text-xs"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={editingPermissions.includes(permission.name)}
                                                                onChange={() =>
                                                                    setEditingPermissions((currentPermissions) =>
                                                                        togglePermission(
                                                                            currentPermissions,
                                                                            permission.name,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                            <span>{permission.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                user.permissions.join(', ') || '-'
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isSuperAdmin ? (
                                                <span className="text-sm text-neutral-400">Protected</span>
                                            ) : isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => saveAccess(user.id)}
                                                        className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingUserId(null)}
                                                        className="text-sm font-medium text-neutral-500 underline-offset-4 hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditing(user)}
                                                        className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
                                                    >
                                                        Edit Access
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteUser(user)}
                                                        className="text-sm font-medium text-red-600 underline-offset-4 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = withAdminLayout;
