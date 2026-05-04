import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as permissionRoutes from '@/routes/admin/permissions';

type PermissionItem = {
    id: number;
    name: string;
    is_core: boolean;
};

type Props = {
    permissions: PermissionItem[];
};

type PermissionForm = {
    name: string;
};

export default function PermissionsIndex({ permissions }: Props) {
    const form = useForm<PermissionForm>({
        name: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        form.post(permissionRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const deletePermission = (permission: PermissionItem) => {
        if (!window.confirm(`Delete permission "${permission.name}"?`)) {
            return;
        }

        router.delete(permissionRoutes.destroy.url({ permission: permission.id }), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Permissions" />

            <div className="space-y-4">
                <h1 className="text-2xl font-semibold tracking-tight">Permissions</h1>

                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Permission Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. manage seo"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="self-end">
                        <Button type="submit" disabled={form.processing}>
                            Add Permission
                        </Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Permission</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {permissions.map((permission) => (
                                <tr key={permission.id}>
                                    <td className="px-4 py-3">{permission.name}</td>
                                    <td className="px-4 py-3">
                                        {permission.is_core ? 'Core admin feature' : 'Custom'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {permission.is_core ? (
                                            <span className="text-neutral-400">Protected</span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => deletePermission(permission)}
                                                className="text-sm font-medium text-red-600 underline-offset-4 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

PermissionsIndex.layout = withAdminLayout;
