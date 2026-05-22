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
    course_type_id: number | null;
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
    types: Option[];
    // universities: Option[];
};

export default function EditCourse({ course, categories, cities, types }: Props) {
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
                    }}
                    categories={categories}
                    types={types}
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
