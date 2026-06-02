<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgentEnquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:120'],
            'company_name' => ['nullable', 'string', 'max:200'],
            'email'        => ['required', 'email:rfc', 'max:200'],
            'mobile'       => ['required', 'string', 'max:40'],
            'message'      => ['required', 'string', 'max:3000'],
        ];
    }
}
