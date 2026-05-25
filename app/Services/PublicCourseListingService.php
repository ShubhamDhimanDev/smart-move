<?php

namespace App\Services;

use App\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class PublicCourseListingService
{
    /**
     * @param  array{search?: string|null, level?: string|null, delivery_mode?: string|null, duration_unit?: string|null, types?: string[]|null}  $filters
     */
    public function listCourses(array $categorySlugs, array $citySlugs, array $filters, int $perPage = 9): LengthAwarePaginator
    {
        $query = Course::query()
            ->with([
                // legacy single relations kept for compatibility
                'category:id,name,slug',
                'courseType:id,name,slug',
                // new many-to-many relations
                'categories:id,name,slug',
                'courseTypes:id,name,slug',
                'cities:id,name,slug',
                'pageContent:id,contentable_type,contentable_id,page_title,description,featured_image,meta_title,meta_description,og_title,og_description,og_image',
            ])
            ->where('status', 'published')
            ->when(! empty($categorySlugs), function (Builder $builder) use ($categorySlugs): void {
                $builder->whereHas('categories', function (Builder $categoryQuery) use ($categorySlugs): void {
                    $categoryQuery->whereIn('slug', $categorySlugs)
                        ->where('is_active', true);
                });
            })
            ->when(! empty($citySlugs), function (Builder $builder) use ($citySlugs): void {
                $builder->whereHas('cities', function (Builder $cityQuery) use ($citySlugs): void {
                    $cityQuery->whereIn('slug', $citySlugs)
                        ->where('is_active', true);
                });
            })
            ->when(filled($filters['search'] ?? null), function (Builder $builder) use ($filters): void {
                $searchTerm = trim((string) $filters['search']);

                $builder->where(function (Builder $searchQuery) use ($searchTerm): void {
                    $searchQuery->where('title', 'like', "%{$searchTerm}%")
                        ->orWhere('excerpt', 'like', "%{$searchTerm}%");
                });
            })
            ->when(filled($filters['level'] ?? null), fn (Builder $builder) => $builder->where('level', $filters['level']))
            ->when(filled($filters['delivery_mode'] ?? null), fn (Builder $builder) => $builder->where('delivery_mode', $filters['delivery_mode']))
            ->when(filled($filters['duration_unit'] ?? null), fn (Builder $builder) => $builder->where('duration_unit', $filters['duration_unit']))
            ->when(filled($filters['types'] ?? null), function (Builder $builder) use ($filters): void {
                $builder->whereHas('courseTypes', function (Builder $typeQuery) use ($filters): void {
                    $typeQuery->whereIn('slug', (array) $filters['types'])->where('is_active', true);
                });
            })
            ->ordered();

        return $query
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (Course $course): array => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'excerpt' => $course->excerpt,
                'duration' => $course->duration,
                'duration_unit' => $course->duration_unit,
                'level' => $course->level,
                'delivery_mode' => $course->delivery_mode,
                'start_date' => $course->start_date?->toDateString(),
                // keep legacy single relations for compatibility
                'category' => $course->category
                    ? [
                        'id' => $course->category->id,
                        'name' => $course->category->name,
                        'slug' => $course->category->slug,
                    ]
                    : null,
                'type' => $course->courseType
                    ? [
                        'id' => $course->courseType->id,
                        'name' => $course->courseType->name,
                        'slug' => $course->courseType->slug,
                    ]
                    : null,
                // return all categories/types the course belongs to
                'categories' => $course->categories
                    ->map(fn ($cat): array => [
                        'id' => $cat->id,
                        'name' => $cat->name,
                        'slug' => $cat->slug,
                    ])
                    ->values()
                    ->all(),
                'types' => $course->courseTypes
                    ->map(fn ($t): array => [
                        'id' => $t->id,
                        'name' => $t->name,
                        'slug' => $t->slug,
                    ])
                    ->values()
                    ->all(),
                'cities' => $course->cities
                    ->map(fn ($city): array => [
                        'id' => $city->id,
                        'name' => $city->name,
                        'slug' => $city->slug,
                    ])
                    ->values()
                    ->all(),
                'page_content' => [
                    'page_title' => $course->pageContent?->page_title,
                    'description' => $course->pageContent?->description,
                    'featured_image' => $course->pageContent?->featured_image,
                    'meta_title' => $course->pageContent?->meta_title,
                    'meta_description' => $course->pageContent?->meta_description,
                    'og_title' => $course->pageContent?->og_title,
                    'og_description' => $course->pageContent?->og_description,
                    'og_image' => $course->pageContent?->og_image,
                ],
            ]);
    }

    /**
     * @return array{levels: array<int, string>, delivery_modes: array<int, string>, duration_units: array<int, string>}
     */
    public function filterOptions(): array
    {
        return [
            'levels' => $this->distinctValues('level'),
            'delivery_modes' => $this->distinctValues('delivery_mode'),
            'duration_units' => $this->distinctValues('duration_unit'),
        ];
    }

    /**
     * @return array<int, string>
     */
    private function distinctValues(string $column): array
    {
        return Course::query()
            ->where('status', 'published')
            ->whereNotNull($column, 'and')
            ->select($column)
            ->distinct()
            ->orderBy($column, 'asc')
            ->pluck($column)
            ->filter(fn ($value): bool => is_string($value) && $value !== '')
            ->values()
            ->all();
    }
}
