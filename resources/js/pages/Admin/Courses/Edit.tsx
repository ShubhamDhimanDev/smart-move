import { Head } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import CourseForm from '@/pages/Admin/Courses/CourseForm';
import * as courseRoutes from '@/routes/admin/courses';

type Option = {
    id: number;
    name: string;
};

type Course = {
    id: number;
    title: string;
    slug: string;
    course_category_id: number | null;
    excerpt: string | null;
    status: 'draft' | 'published';
    is_featured: boolean;
    duration: number | null;
    duration_unit: '' | 'days' | 'weeks' | 'months' | 'years';
    level: '' | 'beginner' | 'intermediate' | 'advanced';
    delivery_mode: '' | 'online' | 'in-person' | 'hybrid';
    start_date: string | null;
    sort_order: number;
    city_ids: number[];
    university_ids: number[];
    page_content: {
        page_title: string | null;
        description: string | null;
        body: string | null;
        featured_image: string | null;
        meta_title: string | null;
        meta_description: string | null;
        og_title: string | null;
        og_description: string | null;
        og_image: string | null;
    };
};

type Props = {
    course: Course;
    categories: Option[];
    cities: Option[];
    // universities: Option[];
};

export default function EditCourse({ course, categories, cities }: Props) {
    return (
        <>
            <Head title="Edit Course" />
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold tracking-tight">Edit Course</h1>
                <CourseForm
                    mode="edit"
                    course={{
                        ...course,
                        excerpt: course.excerpt ?? '',
                        start_date: course.start_date ?? '',
                        page_content: {
                            page_title: course.page_content.page_title ?? '',
                            description: course.page_content.description ?? '',
                            body: course.page_content.body ?? '',
                            featured_image: course.page_content.featured_image ?? '',
                            meta_title: course.page_content.meta_title ?? '',
                            meta_description: course.page_content.meta_description ?? '',
                            og_title: course.page_content.og_title ?? '',
                            og_description: course.page_content.og_description ?? '',
                            og_image: course.page_content.og_image ?? '',
                        },
                    }}
                    categories={categories}
                    cities={cities}
                    // universities={universities}
                    submitUrl={courseRoutes.update.url({ course: course.id })}
                    cancelUrl={courseRoutes.index.url()}
                />
            </div>
        </>
    );
}

EditCourse.layout = withAdminLayout;
