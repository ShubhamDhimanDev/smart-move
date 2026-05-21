<?php

namespace App\Http\Requests\Admin;

use App\Services\AdminPermissionService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdminUserPermissionsRequest extends FormRequest
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
        $assignableRoles = array_keys(AdminPermissionService::roleDefinitions());
        $assignableRoles = array_values(array_filter($assignableRoles, fn (string $role): bool => $role !== 'super-admin'));

        return [
            'role' => ['required', 'string', Rule::in($assignableRoles)],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
        ];
    }
}
