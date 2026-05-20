import { Head, Link, router } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import * as courseRoutes from '@/routes/admin/courses';

type Course = {
    id: number;
    title: string;
    slug: string;
    category_name: string | null;
    status: 'draft' | 'published';
    is_featured: boolean;
    city_names: string[];
    university_names: string[];
};

type PaginatedResponse<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    courses: PaginatedResponse<Course>;
};

export default function CoursesIndex({ courses }: Props) {
    return (
        <>
            <Head title="Courses" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
                    <Link
                        href={courseRoutes.create.url()}
                        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                    >
                        Create Course
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-neutral-200 text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-neutral-600">
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Category</th>
                                <th className="px-4 py-3 font-medium">Coverage</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {courses.data.map((course) => (
                                <tr key={course.id}>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{course.title}</div>
                                        <div className="text-xs text-neutral-500">{course.slug}</div>
                                    </td>
                                    <td className="px-4 py-3">{course.category_name ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-neutral-600">
                                            <div>{course.city_names.length} cities</div>
                                            {/* <div>{course.university_names.length} universities</div> */}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-neutral-600">
                                            <div>{course.status}</div>
                                            <div>{course.is_featured ? 'Featured' : 'Standard'}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={courseRoutes.edit.url({ course: course.id })}
                                                className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm(`Delete course "${course.title}"?`)) {
                                                        router.delete(courseRoutes.destroy.url({ course: course.id }));
                                                    }
                                                }}
                                                className="text-sm font-medium text-red-600 underline-offset-4 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {courses.links.map((link, index) => (
                        <button
                            key={`${link.label}-${index}`}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`rounded-lg border px-3 py-1 text-sm ${
                                link.active
                                    ? 'border-neutral-900 bg-neutral-900 text-white'
                                    : 'border-neutral-300 bg-white text-neutral-700'
                            } disabled:opacity-40`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

CoursesIndex.layout = withAdminLayout;
