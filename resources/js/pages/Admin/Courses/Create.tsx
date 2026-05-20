import { Head } from '@inertiajs/react';
import { withAdminLayout } from '@/pages/Admin/AdminLayout';
import CourseForm from '@/pages/Admin/Courses/CourseForm';
import * as courseRoutes from '@/routes/admin/courses';

type Option = {
    id: number;
    name: string;
};

type Props = {
    categories: Option[];
    cities: Option[];
    // universities: Option[];
};

export default function CreateCourse({ categories, cities }: Props) {
    return (
        <>
            <Head title="Create Course" />
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold tracking-tight">Create Course</h1>
                <CourseForm
                    mode="create"
                    categories={categories}
                    cities={cities}
                    // universities={universities}
                    submitUrl={courseRoutes.store.url()}
                    cancelUrl={courseRoutes.index.url()}
                />
            </div>
        </>
    );
}

CreateCourse.layout = withAdminLayout;
