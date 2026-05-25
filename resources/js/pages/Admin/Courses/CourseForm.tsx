import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import MultiSelect from '@/components/ui/multi-select';

type Option = {
    id: number;
    name: string;
};

type CoursePayload = {
    title: string;
    slug: string;
    course_category_ids: number[];
    course_type_ids: number[];
    excerpt: string;
    status: 'draft' | 'published';
    duration: number | null;
    duration_unit: '' | 'days' | 'weeks' | 'months' | 'years';
    city_ids: number[];
    university_ids: number[];
};

type Props = {
    mode: 'create' | 'edit';
    course?: Partial<CoursePayload>;
    categories: Option[];
    types: Option[];
    cities: Option[];
    // universities: Option[];
    submitUrl: string;
    cancelUrl: string;
};

export default function CourseForm({ mode, course, categories, types, cities, submitUrl, cancelUrl }: Props) {
    const form = useForm<CoursePayload>({
        title: course?.title ?? '',
        slug: course?.slug ?? '',
        course_category_ids: (course as any)?.course_category_ids ?? [],
        course_type_ids: (course as any)?.course_type_ids ?? [],
        excerpt: course?.excerpt ?? '',
        status: course?.status ?? 'draft',
        duration: course?.duration ?? null,
        duration_unit: course?.duration_unit ?? '',
        city_ids: course?.city_ids ?? [],
        university_ids: course?.university_ids ?? [],
    });

    const errorBag = form.errors as Record<string, string>;

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
                    <MultiSelect
                        id="course_category_ids"
                        options={categories.map((c) => ({ value: c.id, label: c.name }))}
                        value={form.data.course_category_ids}
                        onChange={(ids) => form.setData('course_category_ids', ids)}
                        placeholder="Select categories…"
                    />
                    {form.errors.course_category_ids ? <p className="mt-1 text-xs text-red-600">{form.errors.course_category_ids}</p> : null}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Type</label>
                    <MultiSelect
                        id="course_type_ids"
                        options={types.map((t) => ({ value: t.id, label: t.name }))}
                        value={form.data.course_type_ids}
                        onChange={(ids) => form.setData('course_type_ids', ids)}
                        placeholder="Select types…"
                    />
                    {form.errors.course_type_ids ? <p className="mt-1 text-xs text-red-600">{form.errors.course_type_ids}</p> : null}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Status</label>
                    <select className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" value={form.data.status} onChange={(e) => form.setData('status', e.target.value as 'draft' | 'published')}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">Cities</label>
                    <MultiSelect
                        id="city_ids"
                        options={cities.map((c) => ({ value: c.id, label: c.name }))}
                        value={form.data.city_ids}
                        onChange={(ids) => form.setData('city_ids', ids)}
                        placeholder="Select cities…"
                    />
                    {form.errors.city_ids ? <p className="mt-1 text-xs text-red-600">{form.errors.city_ids}</p> : null}
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
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Excerpt</label>
                <textarea className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm" rows={3} value={form.data.excerpt} onChange={(e) => form.setData('excerpt', e.target.value)} />
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
