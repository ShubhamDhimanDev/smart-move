import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
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
    courseType: CourseType;
    courseCategories: CourseCategory[];
};

type FormData = {
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

function EditCourseType({ courseType, courseCategories }: Props) {
    const { data, setData, patch, processing, errors } = useForm<FormData>({
        course_category_ids: courseType.course_category_ids,
        name: courseType.name,
        slug: courseType.slug,
        image: courseType.image ?? '',
        short_description: courseType.short_description ?? '',
        duration: courseType.duration ?? '',
        sort_order: courseType.sort_order,
        is_active: courseType.is_active,
        is_featured: courseType.is_featured,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(courseTypeRoutes.update.url({ course_type: courseType.id }));
    };

    return (
        <>
            <Head title={`Edit: ${courseType.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link
                        href={courseTypeRoutes.index.url()}
                        className="rounded-lg p-2 hover:bg-neutral-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Course Area</h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="font-semibold text-neutral-900">Basic Information</h2>

                        <div className="grid gap-2">
                            <Label htmlFor="course_category_ids">Programmes</Label>
                            <MultiSelect
                                id="course_category_ids"
                                options={courseCategories.map((c) => ({ value: c.id, label: c.name }))}
                                value={data.course_category_ids}
                                onChange={(ids) => setData('course_category_ids', ids)}
                                placeholder="Select programmes…"
                            />
                            <InputError message={errors.course_category_ids} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="auto-generated"
                                />
                                <InputError message={errors.slug} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="short_description">
                                Short Description{data.is_featured ? ' *' : ''}
                            </Label>
                            <textarea
                                id="short_description"
                                rows={3}
                                value={data.short_description}
                                onChange={(e) => setData('short_description', e.target.value)}
                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
                            />
                            <InputError message={errors.short_description} />
                        </div>

                        <div className="grid gap-2 sm:w-32">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number(e.target.value || 0))}
                            />
                        </div>
                    </div>

                    {/* Image */}
                    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="font-semibold text-neutral-900">
                            Image{data.is_featured ? ' *' : ''}
                        </h2>

                        <MediaUrlField
                            label={data.is_featured ? 'Image (required when featured)' : 'Image'}
                            value={data.image}
                            onChange={(v) => setData('image', v)}
                        />
                        <InputError message={errors.image} />
                    </div>

                    {/* Duration */}
                    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="font-semibold text-neutral-900">
                            Duration{data.is_featured ? ' *' : ''}
                        </h2>

                        <div className="grid gap-2">
                            <Label htmlFor="duration">
                                Duration{data.is_featured ? ' *' : ''}
                                <span className="ml-1 text-xs font-normal text-neutral-400">e.g. "12 months", "6 weeks"</span>
                            </Label>
                            <Input
                                id="duration"
                                value={data.duration}
                                onChange={(e) => setData('duration', e.target.value)}
                                placeholder="e.g. 12 months"
                            />
                            <InputError message={errors.duration} />
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="font-semibold text-neutral-900">Visibility</h2>

                        <div className="space-y-3">
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <span className="text-sm font-medium">Active</span>
                            </label>

                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    className="mt-0.5 h-4 w-4 rounded"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                />
                                <div>
                                    <span className="text-sm font-medium">Featured on Homepage</span>
                                    <p className="text-xs text-neutral-500">Shows this area in the homepage featured section.</p>
                                </div>
                            </label>
                        </div>

                        {data.is_featured && (
                            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                <p>
                                    <span className="font-semibold">Featured is enabled.</span> Image, short description, and
                                    duration are now required before saving.
                                </p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Save Changes
                    </Button>
                </form>
            </div>
        </>
    );
}

EditCourseType.layout = withAdminLayout;
export default EditCourseType;
