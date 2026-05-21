import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as universityRoutes from '@/routes/admin/universities';

type University = {
    id: number;
    name: string;
    slug: string;
    city_id: number | null;
    city_name: string | null;
    country_id: number | null;
    country_name: string | null;
    website: string | null;
    is_featured: boolean;
    is_active: boolean;
    page_content?: {
        page_title?: string | null;
        meta_title?: string | null;
    };
};

type Country = {
    id: number;
    name: string;
};

type City = {
    id: number;
    name: string;
};

type Props = {
    universities: University[];
    countries: Country[];
    cities: City[];
};

type UniversityFormData = {
    name: string;
    slug: string;
    city_id: number | null;
    country_id: number | null;
    website: string;
    is_featured: boolean;
    is_active: boolean;
    page_content: {
        page_title: string;
        meta_title: string;
    };
};

const emptyForm: UniversityFormData = {
    name: '',
    slug: '',
    city_id: null,
    country_id: null,
    website: '',
    is_featured: false,
    is_active: true,
    page_content: {
        page_title: '',
        meta_title: '',
    },
};

export default function UniversitiesIndex({ universities, countries, cities }: Props) {
    const createForm = useForm<UniversityFormData>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<UniversityFormData>(emptyForm);

    const submitCreate = (event: FormEvent) => {
        event.preventDefault();

        createForm.post(universityRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const startEditing = (university: University) => {
        setEditingId(university.id);
        setEditingData({
            name: university.name,
            slug: university.slug,
            city_id: university.city_id,
            country_id: university.country_id,
            website: university.website ?? '',
            is_featured: university.is_featured,
            is_active: university.is_active,
            page_content: {
                page_title: university.page_content?.page_title ?? '',
                meta_title: university.page_content?.meta_title ?? '',
            },
        });
    };

    const submitUpdate = (event: FormEvent, universityId: number) => {
        event.preventDefault();

        router.patch(universityRoutes.update.url({ university: universityId }), editingData, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    return (
        <>
            <Head title="Universities" />

            <div className="space-y-4">
                <h1 className="text-2xl font-semibold tracking-tight">Universities</h1>

                <form
                    onSubmit={submitCreate}
                    className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-4"
                >
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input value={createForm.data.name} onChange={(event) => createForm.setData('name', event.target.value)} />
                        <InputError message={createForm.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Slug</Label>
                        <Input value={createForm.data.slug} onChange={(event) => createForm.setData('slug', event.target.value)} />
                        <InputError message={createForm.errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label>City</Label>
                        <select
                            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                            value={createForm.data.city_id ?? ''}
                            onChange={(event) => createForm.setData('city_id', event.target.value ? Number(event.target.value) : null)}
                        >
                            <option value="">No city</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Country</Label>
                        <select
                            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                            value={createForm.data.country_id ?? ''}
                            onChange={(event) => createForm.setData('country_id', event.target.value ? Number(event.target.value) : null)}
                        >
                            <option value="">No country</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label>Website</Label>
                        <Input value={createForm.data.website} onChange={(event) => createForm.setData('website', event.target.value)} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Page Title</Label>
                        <Input
                            value={createForm.data.page_content.page_title}
                            onChange={(event) =>
                                createForm.setData('page_content', {
                                    ...createForm.data.page_content,
                                    page_title: event.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Meta Title</Label>
                        <Input
                            value={createForm.data.page_content.meta_title}
                            onChange={(event) =>
                                createForm.setData('page_content', {
                                    ...createForm.data.page_content,
                                    meta_title: event.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="flex items-center gap-6 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_featured}
                                onChange={(event) => createForm.setData('is_featured', event.target.checked)}
                            />
                            Featured
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_active}
                                onChange={(event) => createForm.setData('is_active', event.target.checked)}
                            />
                            Active
                        </label>
                    </div>

                    <div className="md:col-span-4">
                        <Button type="submit">Save University</Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">City</th>
                                <th className="px-4 py-3 font-medium">Country</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {universities.map((university) => {
                                const isEditing = editingId === university.id;

                                return (
                                    <tr key={university.id}>
                                        <td className="px-4 py-3">{isEditing ? <Input value={editingData.name} onChange={(event) => setEditingData((prev) => ({ ...prev, name: event.target.value }))} /> : university.name}</td>
                                        <td className="px-4 py-3">{university.city_name ?? '-'}</td>
                                        <td className="px-4 py-3">{university.country_name ?? '-'}</td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={(event) => submitUpdate(event, university.id)} className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline">Save</button>
                                                    <button type="button" onClick={() => setEditingId(null)} className="text-sm font-medium text-neutral-500 underline-offset-4 hover:underline">Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <button type="button" onClick={() => startEditing(university)} className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline">Edit</button>
                                                    <button
                                                        type="button"
                                                        onClick={() => router.delete(universityRoutes.destroy.url({ university: university.id }), { preserveScroll: true })}
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

UniversitiesIndex.layout = withAdminLayout;
