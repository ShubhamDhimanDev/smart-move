<?php

use App\Models\City;
use App\Models\Course;
use App\Models\CourseCategory;
use Inertia\Testing\AssertableInertia;

function createCourseCategory(array $overrides = []): CourseCategory
{
    return CourseCategory::query()->create(array_merge([
        'name' => 'Business Management',
        'slug' => 'business-management',
        'description' => 'Business programmes',
        'is_featured_home' => false,
        'is_featured_nav' => false,
        'sort_order' => 0,
        'is_active' => true,
    ], $overrides));
}

function createCity(array $overrides = []): City
{
    return City::query()->create(array_merge([
        'name' => 'London',
        'slug' => 'london',
        'image' => null,
        'is_featured_home' => false,
        'is_featured_nav' => false,
        'sort_order' => 0,
        'is_active' => true,
    ], $overrides));
}

function createCourse(CourseCategory $category, array $overrides = []): Course
{
    return Course::query()->create(array_merge([
        'title' => 'BA Business',
        'slug' => 'ba-business-'.str()->random(6),
        'course_category_id' => $category->id,
        'excerpt' => 'Business course excerpt',
        'status' => 'published',
        'is_featured' => false,
        'duration' => 12,
        'duration_unit' => 'months',
        'level' => 'undergraduate',
        'delivery_mode' => 'online',
        'sort_order' => 0,
    ], $overrides));
}

it('renders the public courses index with pagination and only published courses', function () {
    $category = createCourseCategory();
    $city = createCity();

    foreach (range(1, 11) as $index) {
        $course = createCourse($category, [
            'title' => "Published Course {$index}",
            'slug' => "published-course-{$index}",
            'sort_order' => $index,
        ]);

        $course->cities()->sync([$city->id]);
    }

    $draftCourse = createCourse($category, [
        'title' => 'Draft Course',
        'slug' => 'draft-course',
        'status' => 'draft',
    ]);
    $draftCourse->cities()->sync([$city->id]);

    $this->get(route('courses.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('Public/Courses/Index')
            ->where('title', 'All Courses')
            ->where('courses.total', 11)
            ->has('courses.data', 9)
            ->where('context.category', null)
            ->where('context.city', null)
        );
});

it('renders category route with scoped courses and seo metadata', function () {
    $business = createCourseCategory([
        'name' => 'Business',
        'slug' => 'business',
    ]);
    $business->pageContent()->create([
        'meta_title' => 'Business Programmes',
        'meta_description' => 'Study business courses.',
    ]);

    $health = createCourseCategory([
        'name' => 'Health',
        'slug' => 'health',
    ]);

    $city = createCity();

    $businessCourse = createCourse($business, [
        'title' => 'BSc Business Analytics',
        'slug' => 'bsc-business-analytics',
    ]);
    $businessCourse->cities()->sync([$city->id]);

    $healthCourse = createCourse($health, [
        'title' => 'BSc Nursing',
        'slug' => 'bsc-nursing',
    ]);
    $healthCourse->cities()->sync([$city->id]);

    $this->get(route('courses.category', ['courseCategory' => 'business']))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('Public/Courses/Index')
            ->where('title', 'Business Programmes')
            ->where('description', 'Study business courses.')
            ->where('context.category.slug', 'business')
            ->where('courses.total', 1)
            ->where('courses.data.0.slug', 'bsc-business-analytics')
            ->where('seo.title', 'Business Programmes')
        );
});

it('renders city route with scoped courses', function () {
    $category = createCourseCategory();
    $london = createCity([
        'name' => 'London',
        'slug' => 'london',
    ]);
    $manchester = createCity([
        'name' => 'Manchester',
        'slug' => 'manchester',
    ]);

    $londonCourse = createCourse($category, [
        'title' => 'London Course',
        'slug' => 'london-course',
    ]);
    $londonCourse->cities()->sync([$london->id]);

    $manchesterCourse = createCourse($category, [
        'title' => 'Manchester Course',
        'slug' => 'manchester-course',
    ]);
    $manchesterCourse->cities()->sync([$manchester->id]);

    $this->get(route('courses.city', ['city' => 'london']))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('Public/Courses/Index')
            ->where('context.city.slug', 'london')
            ->where('courses.total', 1)
            ->where('courses.data.0.slug', 'london-course')
        );
});

it('renders combined category and city route with scoped results', function () {
    $business = createCourseCategory([
        'name' => 'Business',
        'slug' => 'business',
    ]);
    $health = createCourseCategory([
        'name' => 'Health',
        'slug' => 'health',
    ]);

    $london = createCity([
        'name' => 'London',
        'slug' => 'london',
    ]);
    $manchester = createCity([
        'name' => 'Manchester',
        'slug' => 'manchester',
    ]);

    $matchingCourse = createCourse($business, [
        'title' => 'Business in London',
        'slug' => 'business-in-london',
    ]);
    $matchingCourse->cities()->sync([$london->id]);

    $otherCategory = createCourse($health, [
        'title' => 'Health in London',
        'slug' => 'health-in-london',
    ]);
    $otherCategory->cities()->sync([$london->id]);

    $otherCity = createCourse($business, [
        'title' => 'Business in Manchester',
        'slug' => 'business-in-manchester',
    ]);
    $otherCity->cities()->sync([$manchester->id]);

    $this->get(route('courses.categoryCity', ['categorySlug' => 'business', 'citySlug' => 'london']))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('Public/Courses/Index')
            ->where('context.category.slug', 'business')
            ->where('context.city.slug', 'london')
            ->where('courses.total', 1)
            ->where('courses.data.0.slug', 'business-in-london')
        );
});

it('returns not found for inactive taxonomy routes', function () {
    createCourseCategory([
        'name' => 'Inactive Category',
        'slug' => 'inactive-category',
        'is_active' => false,
    ]);

    createCity([
        'name' => 'Inactive City',
        'slug' => 'inactive-city',
        'is_active' => false,
    ]);

    $this->get(route('courses.category', ['courseCategory' => 'inactive-category']))->assertNotFound();
    $this->get(route('courses.city', ['city' => 'inactive-city']))->assertNotFound();
});
