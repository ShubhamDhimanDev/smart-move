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
import { useState, useEffect, type FormEvent } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as courseCategoryRoutes from '@/routes/admin/course-categories';

type CourseCategory = {
    id: number;
    name: string;
    slug: string;
    label?: string | null;
    description: string | null;
    is_featured_on_form?: boolean;
    is_featured_home: boolean;
    is_featured_nav: boolean;
    sort_order: number;
    is_active: boolean;
    page_content?: {
        page_title?: string | null;
        meta_title?: string | null;
    };
};

type Props = {
    courseCategories: CourseCategory[];
};

type CourseCategoryFormData = {
    name: string;
    slug: string;
    label: string;
    description: string;
    is_featured_home: boolean;
    is_featured_nav: boolean;
    is_featured_on_form: boolean;
    sort_order: number;
    is_active: boolean;
};

const emptyForm: CourseCategoryFormData = {
    name: '',
    slug: '',
    label: '',
    description: '',
    is_featured_home: false,
    is_featured_nav: false,
    is_featured_on_form: false,
    sort_order: 0,
    is_active: true,
};

type Tab = 'all' | 'featured-home' | 'featured-nav';

// ── Sortable row ──────────────────────────────────────────────────────────────
function SortableRow({
    courseCategory,
    onDelete,
}: {
    courseCategory: CourseCategory;
    onDelete: (item: CourseCategory) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: courseCategory.id,
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
            <td className="px-4 py-3 font-medium text-neutral-900">{courseCategory.name}</td>
            <td className="px-4 py-3 text-sm font-mono text-neutral-500">{courseCategory.slug}</td>
            <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                    {courseCategory.is_active && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                            Active
                        </span>
                    )}
                    {courseCategory.is_featured_home && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-600/20">
                            Home
                        </span>
                    )}
                    {courseCategory.is_featured_on_form && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                            Form
                        </span>
                    )}
                    {courseCategory.is_featured_nav && (
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-purple-600/20">
                            Nav
                        </span>
                    )}
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-neutral-500">{courseCategory.sort_order}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <Link
                        href={courseCategoryRoutes.edit.url({ course_category: courseCategory.id })}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium hover:bg-neutral-50"
                    >
                        <Pencil className="h-3 w-3" />
                        Edit
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(courseCategory)}
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
function CourseCategoriesIndex({ courseCategories: initialCategories }: Props) {
    const createForm = useForm<CourseCategoryFormData>(emptyForm);
    const [items, setItems] = useState<CourseCategory[]>(initialCategories);

    useEffect(() => {
        setItems(initialCategories);
    }, [initialCategories]);
    const [activeTab, setActiveTab] = useState<Tab>('all');

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const filteredItems =
        activeTab === 'featured-home'
            ? items.filter((i) => i.is_featured_home)
            : activeTab === 'featured-nav'
              ? items.filter((i) => i.is_featured_nav)
              : items;

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
            courseCategoryRoutes.reorder.url(),
            { items: reordered.map((i) => ({ id: i.id, sort_order: i.sort_order })) },
            { preserveScroll: true },
        );
    };

    const submitCreate = (event: FormEvent) => {
        event.preventDefault();
        createForm.post(courseCategoryRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const deleteItem = (courseCategory: CourseCategory) => {
        if (!window.confirm(`Delete "${courseCategory.name}"?`)) {
            return;
        }

        router.delete(courseCategoryRoutes.destroy.url({ course_category: courseCategory.id }), {
            preserveScroll: true,
            onSuccess: () => setItems((prev) => prev.filter((i) => i.id !== courseCategory.id)),
        });
    };

    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: items.length },
        { key: 'featured-home', label: 'Featured — Homepage', count: items.filter((i) => i.is_featured_home).length },
        { key: 'featured-nav', label: 'Featured — Navigation', count: items.filter((i) => i.is_featured_nav).length },
    ];

    return (
        <>
            <Head title="Programmes" />

            <div className="space-y-6">
                <h1 className="text-2xl font-semibold tracking-tight">Programmes</h1>

                {/* Create form */}
                <form
                    onSubmit={submitCreate}
                    className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-4"
                >
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
                        />
                        <InputError message={createForm.errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Label</Label>
                        <Input
                            value={createForm.data.label}
                            onChange={(e) => createForm.setData('label', e.target.value)}
                        />
                        <InputError message={createForm.errors.label} />
                    </div>

                    {/* Page Title removed from create form */}

                    <div className="grid gap-2">
                        <Label>Sort Order</Label>
                        <Input
                            type="number"
                            value={createForm.data.sort_order}
                            onChange={(e) => createForm.setData('sort_order', Number(e.target.value || 0))}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:col-span-3">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_active}
                                onChange={(e) => createForm.setData('is_active', e.target.checked)}
                            />
                            Active
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_featured_home}
                                onChange={(e) => createForm.setData('is_featured_home', e.target.checked)}
                            />
                            Featured Home
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_featured_nav}
                                onChange={(e) => createForm.setData('is_featured_nav', e.target.checked)}
                            />
                            Featured Nav
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={createForm.data.is_featured_on_form}
                                onChange={(e) => createForm.setData('is_featured_on_form', e.target.checked)}
                            />
                            Featured On Form
                        </label>
                    </div>

                    <div>
                        <Button type="submit" disabled={createForm.processing}>
                            Add Programme
                        </Button>
                    </div>
                </form>

                {/* Tabs */}
                <div className="border-b border-neutral-200">
                    <nav className="-mb-px flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-neutral-900 text-neutral-900'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                        activeTab === tab.key
                                            ? 'bg-neutral-900 text-white'
                                            : 'bg-neutral-100 text-neutral-600'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    {filteredItems.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-neutral-500">No programmes found.</div>
                    ) : (
                        <table className="w-full divide-y divide-neutral-200 text-sm">
                            <thead className="bg-neutral-50">
                                <tr className="text-left text-neutral-600">
                                    <th className="w-8 px-3 py-3"></th>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Slug</th>
                                    <th className="px-4 py-3 font-medium">Flags</th>
                                    <th className="px-4 py-3 font-medium">Order</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={activeTab === 'all' ? handleDragEnd : undefined}
                            >
                                <SortableContext
                                    items={filteredItems.map((i) => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <tbody className="divide-y divide-neutral-100">
                                        {filteredItems.map((courseCategory) => (
                                            <SortableRow
                                                key={courseCategory.id}
                                                courseCategory={courseCategory}
                                                onDelete={deleteItem}
                                            />
                                        ))}
                                    </tbody>
                                </SortableContext>
                            </DndContext>
                        </table>
                    )}
                </div>

                {activeTab === 'all' && items.length > 1 && (
                    <p className="text-xs text-neutral-400">Drag rows to reorder. Order is saved automatically.</p>
                )}
            </div>
        </>
    );
}

CourseCategoriesIndex.layout = withAdminLayout;
export default CourseCategoriesIndex;
