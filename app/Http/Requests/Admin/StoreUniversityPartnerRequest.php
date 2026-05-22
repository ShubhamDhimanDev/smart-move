<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreUniversityPartnerRequest extends FormRequest
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
            'universities_link' => ['nullable', 'string', 'max:500'],
            'image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
