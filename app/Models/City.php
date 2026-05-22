<?php

namespace App\Models;

use Database\Factories\CityFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Str;

class City extends Model
{
    /** @use HasFactory<CityFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'image',
        'short_description',
        'is_featured_home',
        'is_featured_on_form',
        'is_featured_nav',
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
            'is_featured_on_form' => 'boolean',
            'is_featured_nav' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeFeaturedOnForm(Builder $query): Builder
    {
        return $query->where('is_featured_on_form', true);
    }

    protected static function booted(): void
    {
        static::saving(function (self $city): void {
            if (blank($city->slug)) {
                $city->slug = Str::slug($city->name);
            }
        });
    }

    public function universities(): HasMany
    {
        return $this->hasMany(University::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_city');
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
