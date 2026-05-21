<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUniversityRequest extends FormRequest
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
        $universityId = $this->route('university')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('universities', 'slug')->ignore($universityId)],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'website' => ['nullable', 'string', 'url', 'max:500'],
            'is_featured' => ['nullable', 'boolean'],
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
