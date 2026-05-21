<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseTypeRequest;
use App\Http\Requests\Admin\UpdateCourseTypeRequest;
use App\Models\CourseCategory;
use App\Models\CourseType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseTypeController extends Controller
{
    private function mapCourseType(CourseType $courseType): array
    {
        return [
            'id' => $courseType->id,
            'course_category_ids' => $courseType->courseCategories->pluck('id')->all(),
            'course_category_names' => $courseType->courseCategories->pluck('name')->all(),
            'name' => $courseType->name,
            'slug' => $courseType->slug,
            'image' => $courseType->image,
            'short_description' => $courseType->short_description,
            'duration' => $courseType->duration,
            'sort_order' => $courseType->sort_order,
            'is_active' => $courseType->is_active,
            'is_featured' => $courseType->is_featured,
        ];
    }

    public function index(): Response
    {
        return Inertia::render('Admin/CourseTypes/Index', [
            'courseTypes' => CourseType::query()
                ->with('courseCategories:id,name')
                ->ordered()
                ->get()
                ->map(fn (CourseType $ct): array => $this->mapCourseType($ct))
                ->values()
                ->all(),
            'courseCategories' => CourseCategory::query()
                ->ordered()
                ->get(['id', 'name'])
                ->all(),
        ]);
    }

    public function edit(CourseType $courseType): Response
    {
        $courseType->loadMissing('courseCategories');

        return Inertia::render('Admin/CourseTypes/Edit', [
            'courseType' => $this->mapCourseType($courseType),
            'courseCategories' => CourseCategory::query()
                ->ordered()
                ->get(['id', 'name'])
                ->all(),
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:course_types,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            CourseType::whereKey($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Order saved.');
    }

    public function store(StoreCourseTypeRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $courseType = CourseType::create($validated);
        $courseType->courseCategories()->sync($validated['course_category_ids'] ?? []);

        return to_route('admin.course-types.index')->with('success', 'Course area created successfully.');
    }

    public function update(UpdateCourseTypeRequest $request, CourseType $courseType): RedirectResponse
    {
        $validated = $request->validated();
        $courseType->update($validated);
        $courseType->courseCategories()->sync($validated['course_category_ids'] ?? []);

        return to_route('admin.course-types.index')->with('success', 'Course area updated successfully.');
    }

    public function destroy(CourseType $courseType): RedirectResponse
    {
        CourseType::whereKey($courseType->id)->delete();

        return to_route('admin.course-types.index')->with('success', 'Course area deleted successfully.');
    }
}
