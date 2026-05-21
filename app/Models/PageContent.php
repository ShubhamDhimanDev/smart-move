<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PageContent extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'contentable_type',
        'contentable_id',
        'page_title',
        'description',
        'body',
        'featured_image',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'og_image',
        'schema_data',
        'custom_data',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'schema_data' => 'array',
            'custom_data' => 'array',
        ];
    }

    public function contentable(): MorphTo
    {
        return $this->morphTo();
    }
}
