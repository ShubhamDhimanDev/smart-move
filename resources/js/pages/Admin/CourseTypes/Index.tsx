import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type FormEvent, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import MediaUrlField from '@/components/cms/media-url-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultiSelect from '@/components/ui/multi-select';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as courseTypeRoutes from '@/routes/admin/course-types';

type CourseCategory = {
    id: number;
    name: string;
};

type CourseType = {
    id: number;
    course_category_ids: number[];
    course_category_names: string[];
    name: string;
    slug: string;
    image: string | null;
    short_description: string | null;
    duration: string | null;
    sort_order: number;
    is_active: boolean;
    is_featured: boolean;
};

type Props = {
    courseTypes: CourseType[];
    courseCategories: CourseCategory[];
};

type CourseTypeFormData = {
    course_category_ids: number[];
    name: string;
    slug: string;
    image: string;
    short_description: string;
    duration: string;
    sort_order: number;
    is_active: boolean;
    is_featured: boolean;
};

const emptyForm: CourseTypeFormData = {
    course_category_ids: [],
    name: '',
    slug: '',
    image: '',
    short_description: '',
    duration: '',
    sort_order: 0,
    is_active: true,
    is_featured: false,
};

// ── Sortable row ──────────────────────────────────────────────────────────────
function SortableRow({
    courseType,
    onDelete,
}: {
    courseType: CourseType;
    onDelete: (item: CourseType) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: courseType.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <tr ref={setNodeRef} style={style} className="hover:bg-neutral-50">
            <td className="w-8 px-3 py-3 text-neutral-400">
                <button type="button" className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                    <GripVertical className="h-4 w-4" />
                </button>
            </td>
            <td className="px-4 py-3 font-medium text-neutral-900">{courseType.name}</td>
            <td className="px-4 py-3 text-sm text-neutral-600">
                {courseType.course_category_names.length > 0
                    ? courseType.course_category_names.join(', ')
                    : '—'}
            </td>
            <td className="px-4 py-3 font-mono text-sm text-neutral-500">{courseType.slug}</td>
            <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    {courseType.is_active ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                            Inactive
                        </span>
                    )}
                    {courseType.is_featured && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                            Featured
                        </span>
                    )}
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-neutral-500">{courseType.sort_order}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <Link
                        href={courseTypeRoutes.edit.url({ course_type: courseType.id })}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium hover:bg-neutral-50"
                    >
                        <Pencil className="h-3 w-3" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(courseType)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function CourseTypesIndex({ courseTypes: initialCourseTypes, courseCategories }: Props) {
    const createForm = useForm<CourseTypeFormData>(emptyForm);
    const [items, setItems] = useState<CourseType[]>(initialCourseTypes);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
            ...item,
            sort_order: index,
        }));

        setItems(reordered);

        router.post(
            courseTypeRoutes.reorder.url(),
            { items: reordered.map((i) => ({ id: i.id, sort_order: i.sort_order })) },
            { preserveScroll: true },
        );
    };

    const submitCreate = (event: FormEvent) => {
        event.preventDefault();
        createForm.post(courseTypeRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const deleteItem = (courseType: CourseType) => {
        if (!window.confirm(`Delete "${courseType.name}"?`)) {
            return;
        }

        router.delete(courseTypeRoutes.destroy.url({ course_type: courseType.id }), {
            preserveScroll: true,
            onSuccess: () => setItems((prev) => prev.filter((i) => i.id !== courseType.id)),
        });
    };

    return (
        <>
            <Head title="Course Areas" />

            <div className="space-y-6">
                <h1 className="text-2xl font-semibold tracking-tight">Course Areas</h1>

                {/* Create form */}
                <form
                    onSubmit={submitCreate}
                    className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-4"
                >
                    <div className="grid gap-2">
                        <Label>Programmes</Label>
                        <MultiSelect
                            options={courseCategories.map((c) => ({ value: c.id, label: c.name }))}
                            value={createForm.data.course_category_ids}
                            onChange={(ids) => createForm.setData('course_category_ids', ids)}
                            placeholder="Select programmes…"
                        />
                        <InputError message={createForm.errors.course_category_ids} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input
                            value={createForm.data.name}
                            onChange={(e) => createForm.setData('name', e.target.value)}
                        />
                        <InputError message={createForm.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Slug</Label>
                        <Input
                            value={createForm.data.slug}
                            onChange={(e) => createForm.setData('slug', e.target.value)}
                            placeholder="auto-generated"
                        />
                        <InputError message={createForm.errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Sort Order</Label>
                        <Input
                            type="number"
                            value={createForm.data.sort_order}
                            onChange={(e) => createForm.setData('sort_order', Number(e.target.value || 0))}
                        />
                    </div>

                    <div className="flex items-center gap-4 md:col-span-4">
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_active}
                                onChange={(e) => createForm.setData('is_active', e.target.checked)}
                            />
                            Active
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_featured}
                                onChange={(e) => createForm.setData('is_featured', e.target.checked)}
                            />
                            Featured on Homepage
                        </label>
                    </div>

                    {createForm.data.is_featured && (
                        <>
                            <div className="grid gap-2">
                                <Label>Image *</Label>
                                <MediaUrlField
                                    id={createForm.data.slug}
                                    label="Image"
                                    value={createForm.data.image}
                                    onChange={(v) => createForm.setData('image', v)}
                                />
                                <InputError message={createForm.errors.image} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label>Short Description *</Label>
                                <textarea
                                    rows={3}
                                    value={createForm.data.short_description}
                                    onChange={(e) => createForm.setData('short_description', e.target.value)}
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                />
                                <InputError message={createForm.errors.short_description} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Duration *</Label>
                                <Input
                                    value={createForm.data.duration}
                                    onChange={(e) => createForm.setData('duration', e.target.value)}
                                    placeholder="e.g. 12 months"
                                />
                                <InputError message={createForm.errors.duration} />
                            </div>
                        </>
                    )}

                    <div className="md:col-span-4">
                        <Button type="submit" disabled={createForm.processing}>
                            Add Course Area
                        </Button>
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {items.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-neutral-500">No course areas found.</div>
                    ) : (
                        <table className="w-full divide-y divide-neutral-200 text-sm">
                            <thead className="bg-neutral-50">
                                <tr className="text-left text-neutral-600">
                                    <th className="w-8 px-3 py-3"></th>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Programme</th>
                                    <th className="px-4 py-3 font-medium">Slug</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Order</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={items.map((i) => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <tbody className="divide-y divide-neutral-100">
                                        {items.map((courseType) => (
                                            <SortableRow
                                                key={courseType.id}
                                                courseType={courseType}
                                                onDelete={deleteItem}
                                            />
                                        ))}
                                    </tbody>
                                </SortableContext>
                            </DndContext>
                        </table>
                    )}
                </div>

                {items.length > 1 && (
                    <p className="text-xs text-neutral-400">Drag rows to reorder. Order is saved automatically.</p>
                )}
            </div>
        </>
    );
}

CourseTypesIndex.layout = withAdminLayout;
export default CourseTypesIndex;
