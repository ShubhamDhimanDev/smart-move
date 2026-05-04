<?php

namespace App\Http\Middleware;

use App\Services\AdminPermissionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ?string $permission = null): Response
    {
        $user = $request->user();

        if ($user === null) {
            abort(403);
        }

        if ($user->hasAnyRole(['admin', 'super-admin'])) {
            return $next($request);
        }

        $userPermissions = $user->getAllPermissions()->pluck('name');

        if ($permission !== null && $userPermissions->contains($permission)) {
            return $next($request);
        }

        if ($permission === null && $userPermissions->intersect(AdminPermissionService::featurePermissions())->isNotEmpty()) {
            return $next($request);
        }

        abort(403);
    }
}
