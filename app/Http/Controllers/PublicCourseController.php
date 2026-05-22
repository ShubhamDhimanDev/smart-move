<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\CourseCategory;
use App\Models\CourseType;
use App\Services\PublicCourseListingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class PublicCourseController extends Controller
{
    public function __construct(private PublicCourseListingService $listingService) {}

    public function index(Request $request): Response
    {
        return $this->renderListing($request);
    }

    public function byCategory(Request $request, CourseCategory $courseCategory): Response
    {
        abort_unless($courseCategory->is_active, 404);

        return $this->renderListing(
            request: $request,
            category: $courseCategory,
            pageTitle: $courseCategory->pageContent?->meta_title ?? sprintf('%s Programmes', $courseCategory->name),
            pageDescription: $courseCategory->pageContent?->meta_description ?? $courseCategory->description,
        );
    }

    public function byCity(Request $request, City $city): Response
    {
        abort_unless($city->is_active, 404);

        return $this->renderListing(
            request: $request,
            city: $city,
            pageTitle: $city->pageContent?->meta_title ?? sprintf('Programmes in %s', $city->name),
            pageDescription: $city->pageContent?->meta_description ?? $city->pageContent?->description,
        );
    }

    public function byCategoryAndCity(Request $request, string $categorySlug, string $citySlug): Response
    {
        $category = CourseCategory::query()
            ->where('slug', $categorySlug)
            ->where('is_active', true)
            ->firstOrFail();

        $city = City::query()
            ->where('slug', $citySlug)
            ->where('is_active', true)
            ->firstOrFail();

        return $this->renderListing(
            request: $request,
            category: $category,
            city: $city,
            pageTitle: sprintf('%s in %s', $category->name, $city->name),
            pageDescription: $category->pageContent?->meta_description ?? $city->pageContent?->meta_description,
        );
    }

    private function renderListing(
        Request $request,
        ?CourseCategory $category = null,
        ?City $city = null,
        ?string $pageTitle = null,
        ?string $pageDescription = null,
    ): Response {
        $appliedFilters = [
            'search' => $this->normalizeValue($request->string('search')->toString()),
            'categories' => array_filter((array) $request->input('category', $category?->slug ? [$category->slug] : [])),
            'cities' => array_filter((array) $request->input('city', $city?->slug ? [$city->slug] : [])),
            'types' => array_filter((array) $request->input('course_type', [])),
            'level' => $this->normalizeValue($request->string('level')->toString()),
            'delivery_mode' => $this->normalizeValue($request->string('delivery_mode')->toString()),
            'duration_unit' => $this->normalizeValue($request->string('duration_unit')->toString()),
        ];

        $courses = $this->listingService->listCourses(
            categorySlugs: $appliedFilters['categories'],
            citySlugs: $appliedFilters['cities'],
            filters: $appliedFilters,
        );

        $taxonomyOptions = [
            'categories' => CourseCategory::query()
                ->active()
                ->ordered()
                ->get(['id', 'name', 'slug'])
                ->map(fn (CourseCategory $courseCategory): array => [
                    'id' => $courseCategory->id,
                    'name' => $courseCategory->name,
                    'slug' => $courseCategory->slug,
                    'url' => route('courses.category', ['courseCategory' => $courseCategory->slug]),
                ])
                ->values()
                ->all(),
            'cities' => City::query()
                ->active()
                ->ordered()
                ->get(['id', 'name', 'slug'])
                ->map(fn (City $courseCity): array => [
                    'id' => $courseCity->id,
                    'name' => $courseCity->name,
                    'slug' => $courseCity->slug,
                    'url' => route('courses.city', ['city' => $courseCity->slug]),
                ])
                ->values()
                ->all(),
            'course_types' => CourseType::query()
                ->active()
                ->ordered()
                ->get(['id', 'name', 'slug'])
                ->map(fn (CourseType $courseType): array => [
                    'id' => $courseType->id,
                    'name' => $courseType->name,
                    'slug' => $courseType->slug,
                    'url' => route('courses.index', ['course_type' => $courseType->slug]),
                ])
                ->values()
                ->all(),
        ];

        $seoTitle = $pageTitle ?? 'All Courses';
        $defaultDescription = 'Explore our latest programmes with flexible study options and multiple UK destinations.';
        $canonicalQuery = array_filter([
            'search' => $appliedFilters['search'],
            'level' => $appliedFilters['level'],
            'delivery_mode' => $appliedFilters['delivery_mode'],
            'duration_unit' => $appliedFilters['duration_unit'],
            'page' => $request->integer('page') > 1 ? $request->integer('page') : null,
        ], fn ($value): bool => $value !== null && $value !== '');

        return Inertia::render('Public/Courses/Index', [
            'courses' => $courses,
            'title' => $seoTitle,
            'description' => $pageDescription ?? $defaultDescription,
            'context' => [
                'category' => $category
                    ? [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                    ]
                    : null,
                'city' => $city
                    ? [
                        'id' => $city->id,
                        'name' => $city->name,
                        'slug' => $city->slug,
                    ]
                    : null,
            ],
            'listingUrl' => URL::route($request->route()?->getName() ?? 'courses.index', $request->route()?->parameters() ?? []),
            'filters' => [
                'applied' => $appliedFilters,
                ...$this->listingService->filterOptions(),
                ...$taxonomyOptions,
            ],
            'breadcrumbs' => $this->buildBreadcrumbs($category, $city),
            'seo' => [
                'title' => $seoTitle,
                'description' => $pageDescription ?? $defaultDescription,
                'canonical' => URL::route($request->route()?->getName() ?? 'courses.index', [
                    ...($request->route()?->parameters() ?? []),
                    ...$canonicalQuery,
                ]),
                'og_title' => $category?->pageContent?->og_title ?? $city?->pageContent?->og_title,
                'og_description' => $category?->pageContent?->og_description ?? $city?->pageContent?->og_description,
                'og_image' => $category?->pageContent?->og_image ?? $city?->pageContent?->og_image,
            ],
        ]);
    }

    /**
     * @return array<int, array{label: string, url: string|null}>
     */
    private function buildBreadcrumbs(?CourseCategory $category, ?City $city): array
    {
        $breadcrumbs = [
            ['label' => 'Home', 'url' => route('home')],
            ['label' => 'Courses', 'url' => route('courses.index')],
        ];

        if ($category !== null) {
            $breadcrumbs[] = [
                'label' => $category->name,
                'url' => $city === null ? null : route('courses.category', ['courseCategory' => $category->slug]),
            ];
        }

        if ($city !== null) {
            $breadcrumbs[] = [
                'label' => $city->name,
                'url' => null,
            ];
        }

        return $breadcrumbs;
    }

    private function normalizeValue(string $value): ?string
    {
        $normalized = trim($value);

        return $normalized === '' ? null : $normalized;
    }
}
