<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CourseCategory;
use App\Models\CourseType;
use App\Models\Event;
use App\Models\Page;
use App\Models\Post;
use App\Models\Category;
use App\Models\UniversityPartner;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Laravel\Fortify\Features;

class PublicPageController extends Controller
{
    public function homePage()
    {
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

        $featuredCourses = CourseType::query()
            ->active()
            ->where('is_featured', true)
            ->with(['courseCategories:id,name,slug'])
            ->ordered()
            ->get()
            ->map(fn (CourseType $courseType): array => [
                'id' => $courseType->id,
                'title' => $courseType->name,
                'slug' => $courseType->slug,
                'excerpt' => $courseType->short_description,
                'duration' => null,
                'duration_unit' => null,
                'duration_text' => $courseType->duration,
                'category' => $courseType->courseCategories->first()
                    ? [
                        'id' => $courseType->courseCategories->first()->id,
                        'name' => $courseType->courseCategories->first()->name,
                        'slug' => $courseType->courseCategories->first()->slug,
                    ]
                    : null,
                'featured_image' => $courseType->image,
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

        $partners = UniversityPartner::query()
            ->active()
            ->get(['id', 'name', 'image', 'universities_link'])
            ->map(fn (UniversityPartner $p): array => [
                'id' => $p->id,
                'name' => $p->name,
                'image' => $p->image,
                'universities_link' => $p->universities_link,
            ])
            ->values();

        $recentPosts = Post::query()
            ->with(['user:id,name', 'categories:id,name,slug'])
            ->where('status', 'published')
            ->where(function ($query): void {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderByDesc('published_at')
            ->latest('id')
            ->limit(3)
            ->get()
            ->map(fn (Post $post): array => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'published_at' => $post->published_at?->toIso8601String(),
                'featured_image_url' => $post->getFirstMediaUrl('featured_image') ?: null,
                'categories' => $post->categories->map(fn (Category $category): array => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ])->values()->all(),
                'author' => [
                    'id' => $post->user?->id,
                    'name' => $post->user?->name,
                ],
            ])
            ->values();

        return inertia('welcome', [
            'upcomingEvents' => $upcomingEvents,
            'featuredCourseCategories' => $featuredCourseCategories,
            'featuredCourses' => $featuredCourses,
            'featuredCities' => $featuredCities,
            'partners' => $partners,
            'recentPosts' => $recentPosts,
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
