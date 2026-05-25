<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseTypeRequest extends FormRequest
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
        $courseTypeId = $this->route('course_type')?->id;
        $isFeatured = $this->boolean('is_featured');

        return [
            'course_category_ids' => ['nullable', 'array'],
            'course_category_ids.*' => ['integer', 'exists:course_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('course_types', 'slug')->ignore($courseTypeId)],
            'image' => [$isFeatured ? 'required' : 'nullable', 'string', 'max:500'],
            'short_description' => [$isFeatured ? 'required' : 'nullable', 'string'],
            'duration' => [$isFeatured ? 'required' : 'nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'show_in_filters' => ['nullable', 'boolean'],
        ];
    }
}
