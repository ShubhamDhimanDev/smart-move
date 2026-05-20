<?php

namespace App\Models;

use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Course extends Model
{
    /** @use HasFactory<CourseFactory> */
    use HasFactory;

    use SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'course_category_id',
        'excerpt',
        'status',
        'is_featured',
        'duration',
        'duration_unit',
        'level',
        'delivery_mode',
        'start_date',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'duration' => 'integer',
            'sort_order' => 'integer',
            'start_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $course): void {
            if (blank($course->slug)) {
                $course->slug = Str::slug($course->title);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'course_category_id');
    }

    public function cities(): BelongsToMany
    {
        return $this->belongsToMany(City::class, 'course_city');
    }

    public function universities(): BelongsToMany
    {
        return $this->belongsToMany(University::class, 'course_university');
    }

    public function pageContent(): MorphOne
    {
        return $this->morphOne(PageContent::class, 'contentable');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('title');
    }
}
