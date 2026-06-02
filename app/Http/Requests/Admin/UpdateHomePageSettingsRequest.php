<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomePageSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'announcement_bar_enabled' => ['required', 'boolean'],
            'announcement_bar_text' => ['required', 'string', 'max:255'],
            'announcement_bar_link_text' => ['nullable', 'string', 'max:255'],
            'announcement_bar_link_url' => ['nullable', 'string', 'max:500'],
            'hero_badge_text' => ['required', 'string', 'max:255'],
            'hero_badge_link' => ['nullable', 'string', 'max:500'],
            'hero_heading_line1' => ['required', 'string', 'max:255'],
            'hero_heading_line2' => ['required', 'string', 'max:255'],
            'hero_heading_line3' => ['required', 'string', 'max:255'],
            'hero_subheading' => ['required', 'string', 'max:1000'],
        ];
    }
}
