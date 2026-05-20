<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Event;
use App\Models\Page;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Inertia\Response as InertiaResponse;

class PublicPageController extends Controller
{
    public function homePage(){
        $upcomingEvents = Event::query()
            ->where('status', 'published')
            ->where('starts_at', '>=', now())
            ->orderBy('starts_at', 'DESC')
            ->limit(3)
            ->get([
                'id',
                'title',
                'slug',
                'type',
                'starts_at',
                'ends_at',
                'timezone',
                'location',
                'location_url',
            ])
            ->map(fn (Event $event): array => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'type' => $event->type,
                'starts_at' => $event->starts_at?->toIso8601String(),
                'ends_at' => $event->ends_at?->toIso8601String(),
                'timezone' => $event->timezone,
                'location' => $event->location,
                'location_url' => $event->location_url,
            ])
            ->values();

        $featuredCourseCategories = CourseCategory::query()
            ->active()
            ->featuredHome()
            ->ordered()
            ->get(['id', 'name', 'slug'])
            ->values();

        $featuredCourses = Course::query()
            ->where('status', 'published')
            ->featured()
            ->with([
                'category:id,name,slug',
                'pageContent:id,contentable_type,contentable_id,featured_image',
            ])
            ->ordered()
            ->get()
            ->map(fn (Course $course): array => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'excerpt' => $course->excerpt,
                'duration' => $course->duration,
                'duration_unit' => $course->duration_unit,
                'category' => $course->category
                    ? [
                        'id' => $course->category->id,
                        'name' => $course->category->name,
                        'slug' => $course->category->slug,
                    ]
                    : null,
                'featured_image' => $course->pageContent?->featured_image,
            ])
            ->values();

        $featuredCities = City::query()
            ->active()
            ->featuredHome()
            ->ordered()
            ->with('pageContent:id,contentable_type,contentable_id,description')
            ->get()
            ->map(fn (City $city): array => [
                'id' => $city->id,
                'name' => $city->name,
                'slug' => $city->slug,
                'image' => $city->image,
                'description' => $city->pageContent?->description,
            ])
            ->values();

        return inertia('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'upcomingEvents' => $upcomingEvents,
            'featuredCourseCategories' => $featuredCourseCategories,
            'featuredCourses' => $featuredCourses,
            'featuredCities' => $featuredCities,
        ]);
    }
    public function show(string $slug): InertiaResponse
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->where(function ($query): void {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->firstOrFail();

        abort_if($this->isReservedSlug($slug), Response::HTTP_NOT_FOUND);

        return Inertia::render('Public/PageView', [
            'page' => $page->only(['id', 'title', 'slug', 'meta_title', 'meta_description']),
            'layout' => $page->layout,
        ]);
    }

    private function isReservedSlug(string $slug): bool
    {
        return in_array($slug, ['admin', 'dashboard', 'settings', 'login', 'register', 'logout'], true);
    }
}
