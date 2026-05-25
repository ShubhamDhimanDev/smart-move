<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('courses', 'slug')],
            'course_type_id' => ['nullable', 'integer', 'exists:course_types,id'],
            'course_type_ids' => ['nullable', 'array'],
            'course_type_ids.*' => ['integer', 'exists:course_types,id'],
            'course_category_id' => ['nullable', 'integer', 'exists:course_categories,id'],
            'course_category_ids' => ['nullable', 'array'],
            'course_category_ids.*' => ['integer', 'exists:course_categories,id'],
            'excerpt' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'is_featured' => ['nullable', 'boolean'],
            'duration' => ['nullable', 'integer', 'min:1', 'max:999'],
            'duration_unit' => ['nullable', Rule::in(['days', 'weeks', 'months', 'years'])],
            'level' => ['nullable', Rule::in(['beginner', 'intermediate', 'advanced'])],
            'delivery_mode' => ['nullable', Rule::in(['online', 'in-person', 'hybrid'])],
            'start_date' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'city_ids' => ['nullable', 'array'],
            'city_ids.*' => ['integer', 'exists:cities,id'],
            'university_ids' => ['nullable', 'array'],
            'university_ids.*' => ['integer', 'exists:universities,id'],
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
