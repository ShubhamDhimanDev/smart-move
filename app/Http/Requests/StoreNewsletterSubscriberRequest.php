<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNewsletterSubscriberRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                Rule::unique('newsletter_subscribers', 'email')->withoutTrashed(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already subscribed.',
        ];
    }
}
