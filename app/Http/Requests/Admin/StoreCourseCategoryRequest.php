<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('course_categories', 'slug')],
            'description' => ['nullable', 'string'],
            'is_featured_home' => ['nullable', 'boolean'],
            'is_featured_nav' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'page_content.page_title' => ['nullable', 'string', 'max:255'],
            'page_content.description' => ['nullable', 'string'],
            'page_content.body' => ['nullable', 'string'],
            'page_content.featured_image' => ['nullable', 'string', 'max:500'],
            'page_content.meta_title' => ['nullable', 'string', 'max:255'],
            'page_content.meta_description' => ['nullable', 'string'],
            'page_content.og_title' => ['nullable', 'string', 'max:255'],
            'page_content.og_description' => ['nullable', 'string'],
            'page_content.og_image' => ['nullable', 'string', 'max:500'],
            'page_content.schema_data' => ['nullable', 'array'],
            'page_content.custom_data' => ['nullable', 'array'],
        ];
    }
}
