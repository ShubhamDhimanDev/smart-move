import { Head, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import MediaUrlField from '@/components/cms/media-url-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as partnerRoutes from '@/routes/admin/university-partners';

type Partner = {
    id: number;
    name: string;
    universities_link: string | null;
    image: string | null;
    is_active: boolean;
};

type Props = {
    partners: Partner[];
};

type PartnerForm = {
    name: string;
    universities_link: string;
    image: string;
    is_active: boolean;
};

const emptyForm: PartnerForm = {
    name: '',
    universities_link: '',
    image: '',
    is_active: true,
};

export default function UniversityPartnersIndex({ partners: initialPartners }: Props) {
    const createForm = useForm<PartnerForm>(emptyForm);
    const [items, setItems] = useState<Partner[]>(initialPartners);

    useEffect(() => {
        setItems(initialPartners);
    }, [initialPartners]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<PartnerForm>(emptyForm);

    const submitCreate = (event: FormEvent) => {
        event.preventDefault();

        createForm.post(partnerRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const startEditing = (partner: Partner) => {
        setEditingId(partner.id);
        setEditingData({
            name: partner.name,
            universities_link: partner.universities_link ?? '',
            image: partner.image ?? '',
            is_active: partner.is_active,
        });
    };

    const submitUpdate = (event: FormEvent, id: number) => {
        event.preventDefault();

        router.patch(partnerRoutes.update.url({ university_partner: id }), editingData, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const deleteItem = (partner: Partner) => {
        if (!window.confirm(`Delete "${partner.name}"?`)) {
            return;
        }

        router.delete(partnerRoutes.destroy.url({ university_partner: partner.id }), {
            preserveScroll: true,
            onSuccess: () => setItems((prev) => prev.filter((p) => p.id !== partner.id)),
        });
    };

    return (
        <>
            <Head title="University Partners" />

            <div className="space-y-4">
                <h1 className="text-2xl font-semibold tracking-tight">University Partners</h1>

                <form onSubmit={submitCreate} className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-4">
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} />
                        <InputError message={createForm.errors.name} />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label>Universities Link</Label>
                        <Input value={createForm.data.universities_link} onChange={(e) => createForm.setData('universities_link', e.target.value)} />
                        <InputError message={createForm.errors.universities_link} />
                    </div>

                    <div className="grid gap-2 md:col-span-4">
                        <MediaUrlField id="create-partner-image" label="Image" value={createForm.data.image} onChange={(v) => createForm.setData('image', v)} error={createForm.errors.image} />
                    </div>

                    <div className="flex items-center gap-6 md:col-span-3">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={createForm.data.is_active} onChange={(e) => createForm.setData('is_active', e.target.checked)} />
                            Active
                        </label>
                    </div>

                    <div>
                        <Button type="submit">Add Partner</Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Link</th>
                                <th className="px-4 py-3 font-medium">Image</th>
                                <th className="px-4 py-3 font-medium">Active</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {items.map((partner) => {
                                const isEditing = editingId === partner.id;

                                return (
                                    <tr key={partner.id}>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editingData.name} onChange={(e) => setEditingData((prev) => ({ ...prev, name: e.target.value }))} />
                                            ) : (
                                                partner.name
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editingData.universities_link} onChange={(e) => setEditingData((prev) => ({ ...prev, universities_link: e.target.value }))} />
                                            ) : (
                                                partner.universities_link ?? '-'
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <MediaUrlField id={`edit-partner-image-${partner.id}`} label="Image" value={editingData.image} onChange={(v) => setEditingData((prev) => ({ ...prev, image: v }))} />
                                            ) : partner.image ? (
                                                <img src={partner.image} alt={partner.name} className="h-8 w-24 rounded object-cover" />
                                            ) : (
                                                <span className="text-neutral-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">{partner.is_active ? 'Yes' : 'No'}</td>

                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={(e) => submitUpdate(e as unknown as FormEvent, partner.id)} className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline">Save</button>
                                                    <button type="button" onClick={() => setEditingId(null)} className="text-sm font-medium text-neutral-500 underline-offset-4 hover:underline">Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <button type="button" onClick={() => startEditing(partner)} className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline">Edit</button>
                                                    <button type="button" onClick={() => deleteItem(partner)} className="text-sm font-medium text-red-600 underline-offset-4 hover:underline">Delete</button>
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

UniversityPartnersIndex.layout = withAdminLayout;
