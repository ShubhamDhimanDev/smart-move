<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;
use App\Models\City;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseType;
// use App\Models\University;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Courses/Index', [
            'courses' => Course::query()
                ->with([
                    'category:id,name,slug',
                    'courseType:id,name,slug',
                    'categories:id,name',
                    'courseTypes:id,name',
                    'cities:id,name,slug',
                    // 'universities:id,name,slug',
                    'pageContent:id,contentable_type,contentable_id,page_title,meta_title',
                ])
                ->ordered()
                ->paginate(15)
                ->through(fn (Course $course): array => $this->formatCourse($course)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Courses/Create', [
            'categories' => CourseCategory::query()->active()->ordered()->get(['id', 'name']),
            'types' => CourseType::query()->active()->ordered()->get(['id', 'name']),
            'cities' => City::query()->active()->ordered()->get(['id', 'name']),
            // 'universities' => University::query()->where('is_active', true)->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $course = Course::create($request->safe()->except(['city_ids', 'university_ids', 'page_content']));

        $course->cities()->sync($request->input('city_ids', []));
        // $course->universities()->sync($request->input('university_ids', []));

        // Sync multiple categories and types
        $course->categories()->sync($request->input('course_category_ids', []));
        $course->courseTypes()->sync($request->input('course_type_ids', []));

        // Keep legacy FK columns in sync with the first selected value for compatibility
        $firstCategory = $request->input('course_category_ids', []) ? $request->input('course_category_ids')[0] : $request->input('course_category_id');
        $firstType = $request->input('course_type_ids', []) ? $request->input('course_type_ids')[0] : $request->input('course_type_id');
        $course->update([
            'course_category_id' => $firstCategory ?? null,
            'course_type_id' => $firstType ?? null,
        ]);

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $course->pageContent()->create($pageContent);
        }

        return to_route('admin.courses.index')->with('success', 'Course created successfully.');
    }

    public function edit(Course $course): Response
    {
        $course->load([
            'category:id,name',
            'courseType:id,name',
            'categories:id,name',
            'courseTypes:id,name',
            'cities:id,name',
            // 'universities:id,name',
            'pageContent:id,contentable_type,contentable_id,page_title,description,body,featured_image,meta_title,meta_description,og_title,og_description,og_image,schema_data,custom_data',
        ]);

        return Inertia::render('Admin/Courses/Edit', [
            'course' => $this->formatCourse($course),
            'categories' => CourseCategory::query()->active()->ordered()->get(['id', 'name']),
            'types' => CourseType::query()->active()->ordered()->get(['id', 'name']),
            'cities' => City::query()->active()->ordered()->get(['id', 'name']),
            // 'universities' => University::query()->where('is_active', true)->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $course->update($request->safe()->except(['city_ids', 'university_ids', 'page_content']));

        $course->cities()->sync($request->input('city_ids', []));
        // $course->universities()->sync($request->input('university_ids', []));

        // Sync multiple categories and types
        $course->categories()->sync($request->input('course_category_ids', []));
        $course->courseTypes()->sync($request->input('course_type_ids', []));

        // Keep legacy FK columns in sync with the first selected value for compatibility
        $firstCategory = $request->input('course_category_ids', []) ? $request->input('course_category_ids')[0] : $request->input('course_category_id');
        $firstType = $request->input('course_type_ids', []) ? $request->input('course_type_ids')[0] : $request->input('course_type_id');
        $course->update([
            'course_category_id' => $firstCategory ?? null,
            'course_type_id' => $firstType ?? null,
        ]);

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $course->pageContent()->updateOrCreate([], $pageContent);
        }

        return to_route('admin.courses.index')->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        Course::query()->whereKey($course->id)->delete();

        return to_route('admin.courses.index')->with('success', 'Course deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formatCourse(Course $course): array
    {
        return [
            'id' => $course->id,
            'title' => $course->title,
            'slug' => $course->slug,
            'course_category_id' => $course->course_category_id,
            'course_type_id' => $course->course_type_id,
            'course_category_ids' => $course->categories->pluck('id')->values()->all(),
            'course_category_names' => $course->categories->pluck('name')->values()->all(),
            'course_type_ids' => $course->courseTypes->pluck('id')->values()->all(),
            'course_type_names' => $course->courseTypes->pluck('name')->values()->all(),
            'category_name' => $course->category?->name,
            'course_type_name' => $course->courseType?->name,
            'excerpt' => $course->excerpt,
            'status' => $course->status,
            'is_featured' => $course->is_featured,
            'duration' => $course->duration,
            'duration_unit' => $course->duration_unit,
            'level' => $course->level,
            'delivery_mode' => $course->delivery_mode,
            'start_date' => $course->start_date?->toDateString(),
            'sort_order' => $course->sort_order,
            'city_ids' => $course->cities->pluck('id')->values()->all(),
            'city_names' => $course->cities->pluck('name')->values()->all(),
            // 'university_ids' => $course->universities->pluck('id')->values()->all(),
            // 'university_names' => $course->universities->pluck('name')->values()->all(),
            'page_content' => [
                'page_title' => $course->pageContent?->page_title,
                'description' => $course->pageContent?->description,
                'body' => $course->pageContent?->body,
                'featured_image' => $course->pageContent?->featured_image,
                'meta_title' => $course->pageContent?->meta_title,
                'meta_description' => $course->pageContent?->meta_description,
                'og_title' => $course->pageContent?->og_title,
                'og_description' => $course->pageContent?->og_description,
                'og_image' => $course->pageContent?->og_image,
                'schema_data' => $course->pageContent?->schema_data,
                'custom_data' => $course->pageContent?->custom_data,
            ],
        ];
    }
}
