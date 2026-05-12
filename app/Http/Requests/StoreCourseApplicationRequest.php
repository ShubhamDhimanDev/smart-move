<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'nationality_immigration_status' => ['required', 'string', 'max:255'],
            'preferred_course_location' => ['required', 'string', 'max:255'],
            'has_taken_sfe_before' => ['required', 'boolean'],
            'previous_qualification_work_experience' => ['required', 'string', 'max:4000'],
        ];
    }
}
