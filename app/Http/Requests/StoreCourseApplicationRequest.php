<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'dob' => ['required', 'date', 'before:today'],
            'phone' => ['required', 'string', 'max:40'],
            'email' => ['required', 'email:rfc', 'max:200'],
            'nationality' => ['required', 'string', 'max:120'],
            'immigration_status' => ['required', 'string', 'max:255'],
            'immigration_status_other' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf($this->input('immigration_status') === 'Others'),
            ],
            'selected_courses' => ['required', 'array', 'min:1'],
            'selected_courses.*' => ['required', 'integer', 'exists:course_types,id'],
            'other_course' => [
                'nullable',
                'string',
                'max:120',
            ],
            'preferred_course' => ['nullable', 'string', 'max:255'],
            'selected_locations' => ['required', 'array', 'min:1'],
            'selected_locations.*' => ['required', 'string', Rule::exists('cities', 'name')->where('is_featured_on_form', true)],
            'preferred_location' => ['nullable', 'string', 'max:255'],
            'has_taken_sfe_before' => ['required', 'boolean'],
            'previous_qualification_work_experience' => ['required', 'array'],
            'previous_qualification_work_experience.qualification' => ['required', 'string', 'max:2000'],
            'previous_qualification_work_experience.work_experience' => ['required', 'string', 'max:2000'],
        ];
    }
}
