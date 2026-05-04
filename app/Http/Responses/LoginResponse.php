<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request)
    {
        /** @var Request $request */
        $user = $request->user();

        $fallback = $user !== null && $user->hasAnyRole(['admin', 'super-admin'])
            ? route('admin.dashboard')
            : route('dashboard');

        return redirect()->intended($fallback);
    }
}
