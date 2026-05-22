<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseCategoryRequest;
use App\Http\Requests\Admin\UpdateCourseCategoryRequest;
use App\Models\CourseCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseCategoryController extends Controller
{
    private function mapCategory(CourseCategory $courseCategory): array
    {
        return [
            'id' => $courseCategory->id,
            'name' => $courseCategory->name,
            'label' => $courseCategory->label,
            'slug' => $courseCategory->slug,
            'description' => $courseCategory->description,
            'is_featured_on_form' => $courseCategory->is_featured_on_form,
            'is_featured_home' => $courseCategory->is_featured_home,
            'is_featured_nav' => $courseCategory->is_featured_nav,
            'sort_order' => $courseCategory->sort_order,
            'is_active' => $courseCategory->is_active,
            'page_content' => [
                'page_title' => $courseCategory->pageContent?->page_title,
                'meta_title' => $courseCategory->pageContent?->meta_title,
                'meta_description' => $courseCategory->pageContent?->meta_description,
                'og_title' => $courseCategory->pageContent?->og_title,
                'og_description' => $courseCategory->pageContent?->og_description,
                'og_image' => $courseCategory->pageContent?->og_image,
                'featured_image' => $courseCategory->pageContent?->featured_image,
            ],
        ];
    }

    public function index(): Response
    {
        return Inertia::render('Admin/CourseCategories/Index', [
            'courseCategories' => CourseCategory::query()
                ->with('pageContent:id,contentable_type,contentable_id,page_title,meta_title,meta_description,og_title,og_description,og_image,featured_image')
                ->ordered()
                ->get()
                ->map(fn (CourseCategory $c): array => $this->mapCategory($c))
                ->values()
                ->all(),
        ]);
    }

    public function edit(CourseCategory $courseCategory): Response
    {
        $courseCategory->loadMissing('pageContent');

        return Inertia::render('Admin/CourseCategories/Edit', [
            'courseCategory' => $this->mapCategory($courseCategory),
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:course_categories,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            CourseCategory::whereKey($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Order saved.');
    }

    public function store(StoreCourseCategoryRequest $request): RedirectResponse
    {
        $courseCategory = CourseCategory::create($request->safe()->except('page_content'));

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $courseCategory->pageContent()->create($pageContent);
        }

        return to_route('admin.course-categories.index')->with('success', 'Course category created successfully.');
    }

    public function update(UpdateCourseCategoryRequest $request, CourseCategory $courseCategory): RedirectResponse
    {
        $courseCategory->update($request->safe()->except('page_content'));

        $pageContent = $request->input('page_content');
        if (is_array($pageContent) && $pageContent !== []) {
            $courseCategory->pageContent()->updateOrCreate([], $pageContent);
        }

        return to_route('admin.course-categories.index')->with('success', 'Course category updated successfully.');
    }

    public function destroy(CourseCategory $courseCategory): RedirectResponse
    {
        CourseCategory::query()->whereKey($courseCategory->id)->delete();

        return to_route('admin.course-categories.index')->with('success', 'Course category deleted successfully.');
    }
}
