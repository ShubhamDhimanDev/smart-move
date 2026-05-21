import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import MediaUrlField from '@/components/cms/media-url-field';

type Option = {
    id: number;
    name: string;
};

type CoursePayload = {
    title: string;
    slug: string;
    course_category_id: number | null;
    excerpt: string;
    status: 'draft' | 'published';
    is_featured: boolean;
    duration: number | null;
    duration_unit: '' | 'days' | 'weeks' | 'months' | 'years';
    level: '' | 'beginner' | 'intermediate' | 'advanced';
    delivery_mode: '' | 'online' | 'in-person' | 'hybrid';
    start_date: string;
    sort_order: number;
    city_ids: number[];
    university_ids: number[];
    page_content: {
        page_title: string;
        description: string;
        body: string;
        featured_image: string;
        meta_title: string;
        meta_description: string;
        og_title: string;
        og_description: string;
        og_image: string;
    };
};

type Props = {
    mode: 'create' | 'edit';
    course?: Partial<CoursePayload>;
    categories: Option[];
    cities: Option[];
    // universities: Option[];
    submitUrl: string;
    cancelUrl: string;
};

export default function CourseForm({ mode, course, categories, cities, submitUrl, cancelUrl }: Props) {
    const form = useForm<CoursePayload>({
        title: course?.title ?? '',
        slug: course?.slug ?? '',
        course_category_id: course?.course_category_id ?? null,
        excerpt: course?.excerpt ?? '',
        status: course?.status ?? 'draft',
        is_featured: course?.is_featured ?? false,
        duration: course?.duration ?? null,
        duration_unit: course?.duration_unit ?? '',
        level: course?.level ?? '',
        delivery_mode: course?.delivery_mode ?? '',
        start_date: course?.start_date ?? '',
        sort_order: course?.sort_order ?? 0,
        city_ids: course?.city_ids ?? [],
        university_ids: course?.university_ids ?? [],
        page_content: {
            page_title: course?.page_content?.page_title ?? '',
            description: course?.page_content?.description ?? '',
            body: course?.page_content?.body ?? '',
            featured_image: course?.page_content?.featured_image ?? '',
            meta_title: course?.page_content?.meta_title ?? '',
            meta_description: course?.page_content?.meta_description ?? '',
            og_title: course?.page_content?.og_title ?? '',
            og_description: course?.page_content?.og_description ?? '',
            og_image: course?.page_content?.og_image ?? '',
        },
    });

    const errorBag = form.errors as Record<string, string>;

    const toggleId = (field: 'city_ids' | 'university_ids', id: number, checked: boolean) => {
        const current = form.data[field];

        if (checked) {
            form.setData(field, [...current, id]);
            return;
        }

        form.setData(
            field,
            current.filter((value) => value !== id),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (mode === 'create') {
            form.post(submitUrl);
            return;
        }

        form.patch(submitUrl);
    };

    return (
        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Title</label>
                    <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                    {form.errors.title ? <p className="mt-1 text-xs text-red-600">{form.errors.title}</p> : null}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Slug</label>
                    <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                    {form.errors.slug ? <p className="mt-1 text-xs text-red-600">{form.errors.slug}</p> : null}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
                    <select
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                        value={form.data.course_category_id ?? ''}
                        onChange={(e) => form.setData('course_category_id', e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">No category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Status</label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.status} onChange={(e) => form.setData('status', e.target.value as 'draft' | 'published')}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Duration</label>
                    <input
                        type="number"
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                        value={form.data.duration ?? ''}
                        onChange={(e) => form.setData('duration', e.target.value ? Number(e.target.value) : null)}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Duration Unit</label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.duration_unit} onChange={(e) => form.setData('duration_unit', e.target.value as CoursePayload['duration_unit'])}>
                        <option value="">Select</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Level</label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.level} onChange={(e) => form.setData('level', e.target.value as CoursePayload['level'])}>
                        <option value="">Select</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Delivery Mode</label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.delivery_mode} onChange={(e) => form.setData('delivery_mode', e.target.value as CoursePayload['delivery_mode'])}>
                        <option value="">Select</option>
                        <option value="online">Online</option>
                        <option value="in-person">In Person</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Start Date</label>
                    <input type="date" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.start_date} onChange={(e) => form.setData('start_date', e.target.value)} />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Sort Order</label>
                    <input type="number" className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', Number(e.target.value || 0))} />
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Excerpt</label>
                <textarea className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" rows={3} value={form.data.excerpt} onChange={(e) => form.setData('excerpt', e.target.value)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <p className="mb-2 text-sm font-medium text-neutral-700">Cities</p>
                    <div className="max-h-40 space-y-2 overflow-auto rounded-lg border border-neutral-200 p-3 text-sm">
                        {cities.map((city) => (
                            <label key={city.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.data.city_ids.includes(city.id)}
                                    onChange={(e) => toggleId('city_ids', city.id, e.target.checked)}
                                />
                                {city.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Universities section commented out */}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Page Title</label>
                    <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.page_content.page_title} onChange={(e) => form.setData('page_content', { ...form.data.page_content, page_title: e.target.value })} />
                    {errorBag['page_content.page_title'] ? <p className="mt-1 text-xs text-red-600">{errorBag['page_content.page_title']}</p> : null}
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Meta Title</label>
                    <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.page_content.meta_title} onChange={(e) => form.setData('page_content', { ...form.data.page_content, meta_title: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Meta Description</label>
                    <textarea className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" rows={3} value={form.data.page_content.meta_description} onChange={(e) => form.setData('page_content', { ...form.data.page_content, meta_description: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Body Content</label>
                    <textarea className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" rows={6} value={form.data.page_content.body} onChange={(e) => form.setData('page_content', { ...form.data.page_content, body: e.target.value })} />
                </div>
                <MediaUrlField
                    id="course-featured-image"
                    label="Featured Image"
                    value={form.data.page_content.featured_image}
                    onChange={(value) => form.setData('page_content', { ...form.data.page_content, featured_image: value })}
                    error={errorBag['page_content.featured_image']}
                />
                <MediaUrlField
                    id="course-og-image"
                    label="OG Image"
                    value={form.data.page_content.og_image}
                    onChange={(value) => form.setData('page_content', { ...form.data.page_content, og_image: value })}
                    error={errorBag['page_content.og_image']}
                />
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">OG Title</label>
                    <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.page_content.og_title} onChange={(e) => form.setData('page_content', { ...form.data.page_content, og_title: e.target.value })} />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">OG Description</label>
                    <input className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.page_content.og_description} onChange={(e) => form.setData('page_content', { ...form.data.page_content, og_description: e.target.value })} />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.data.is_featured} onChange={(e) => form.setData('is_featured', e.target.checked)} />
                    Featured on homepage/navbar
                </label>
            </div>

            <div className="flex gap-3 border-t border-neutral-200 pt-4">
                <button type="submit" disabled={form.processing} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50">
                    {mode === 'create' ? 'Create Course' : 'Update Course'}
                </button>
                <Link href={cancelUrl} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
                    Cancel
                </Link>
            </div>
        </form>
    );
}
