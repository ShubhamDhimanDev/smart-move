import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import MediaUrlField from '@/components/cms/media-url-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as cityRoutes from '@/routes/admin/cities';

type City = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    short_description?: string | null;
    is_featured_home: boolean;
    is_featured_nav: boolean;
    is_featured_on_form: boolean;
    sort_order: number;
    is_active: boolean;
    page_content: {
        page_title: string | null;
        meta_title: string | null;
        meta_description: string | null;
        og_title: string | null;
        og_description: string | null;
        og_image: string | null;
        featured_image: string | null;
    };
};

type Props = {
    city: City;
};

type FormData = {
    name: string;
    slug: string;
    image: string;
    short_description: string;
    is_featured_home: boolean;
    is_featured_nav: boolean;
    is_featured_on_form: boolean;
    sort_order: number;
    is_active: boolean;
    page_content: {
        page_title: string;
        meta_title: string;
        meta_description: string;
        og_title: string;
        og_description: string;
        og_image: string;
        featured_image: string;
    };
};

function EditCity({ city }: Props) {
    const { data, setData, patch, processing, errors } = useForm<FormData>({
        name: city.name,
        slug: city.slug,
        image: city.image ?? '',
        short_description: city.short_description ?? '',
        is_featured_home: city.is_featured_home,
        is_featured_on_form: city.is_featured_on_form,
        is_featured_nav: city.is_featured_nav,
        sort_order: city.sort_order,
        is_active: city.is_active,
        page_content: {
            page_title: city.page_content.page_title ?? '',
            meta_title: city.page_content.meta_title ?? '',
            meta_description: city.page_content.meta_description ?? '',
            og_title: city.page_content.og_title ?? '',
            og_description: city.page_content.og_description ?? '',
            og_image: city.page_content.og_image ?? '',
            featured_image: city.page_content.featured_image ?? '',
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(cityRoutes.update.url({ city: city.id }));
    };

    return (
        <>
            <Head title={`Edit: ${city.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={cityRoutes.index.url()} className="rounded-lg p-2 hover:bg-neutral-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Study Destination</h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-neutral-900">Basic Information</h2>

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
                                />
                                <InputError message={errors.slug} />
                            </div>
                        </div>

                        {data.is_featured_home && (
                            <div className="sm:col-span-2">
                                <MediaUrlField
                                    id="image"
                                    label="Image"
                                    value={data.image}
                                    onChange={(value) => setData('image', value)}
                                    error={errors.image}
                                />
                            </div>
                        )}

                        <div className="grid gap-2 sm:w-32">
                            <Label htmlFor="sort-order">Sort Order</Label>
                            <Input
                                id="sort-order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number(e.target.value || 0))}
                            />
                        </div>

                        {data.is_featured_home && (
                            <div className="grid gap-2">
                                <Label htmlFor="short-desc">Short Description</Label>
                                <textarea
                                    id="short-desc"
                                    rows={2}
                                    className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                />
                                <InputError message={errors.short_description} />
                            </div>
                        )}
                    </div>

                    {/* Visibility flags */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-neutral-900">Visibility</h2>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <span className="text-sm font-medium">Active</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded"
                                    checked={data.is_featured_home}
                                    onChange={(e) => setData('is_featured_home', e.target.checked)}
                                />
                                <div>
                                    <span className="text-sm font-medium">Featured on Homepage</span>
                                    <p className="text-xs text-neutral-500">Shows in homepage section</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded"
                                    checked={data.is_featured_nav}
                                    onChange={(e) => setData('is_featured_nav', e.target.checked)}
                                />
                                <div>
                                    <span className="text-sm font-medium">Featured in Navigation</span>
                                    <p className="text-xs text-neutral-500">Shows in the Courses dropdown in the site header</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded"
                                    checked={data.is_featured_on_form}
                                    onChange={(e) => setData('is_featured_on_form', e.target.checked)}
                                />
                                <div>
                                    <span className="text-sm font-medium">Featured on Apply Form</span>
                                    <p className="text-xs text-neutral-500">Include this city in the Apply Now form location list</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* SEO removed from edit page */}

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                        <Link href={cityRoutes.index.url()}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

EditCity.layout = withAdminLayout;
export default EditCity;
