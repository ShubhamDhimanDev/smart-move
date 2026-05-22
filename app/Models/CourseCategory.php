<?php

namespace App\Models;

use Database\Factories\CourseCategoryFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;

class CourseCategory extends Model
{
    /** @use HasFactory<CourseCategoryFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'label',
        'slug',
        'description',
        'is_featured_home',
        'is_featured_nav',
        'is_featured_on_form',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured_home' => 'boolean',
            'is_featured_nav' => 'boolean',
            'is_featured_on_form' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $category): void {
            if (blank($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function courseTypes(): BelongsToMany
    {
        return $this->belongsToMany(CourseType::class, 'course_category_course_type');
    }

    public function pageContent(): MorphOne
    {
        return $this->morphOne(PageContent::class, 'contentable');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeaturedHome(Builder $query): Builder
    {
        return $query->where('is_featured_home', true);
    }

    public function scopeFeaturedNav(Builder $query): Builder
    {
        return $query->where('is_featured_nav', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
