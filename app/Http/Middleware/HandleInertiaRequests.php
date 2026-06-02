<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use App\Models\City;
use App\Models\CourseCategory;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user()?->loadMissing('roles:id,name', 'permissions:id,name');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user === null
                    ? null
                    : [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'email_verified_at' => $user->email_verified_at,
                        'created_at' => $user->created_at,
                        'updated_at' => $user->updated_at,
                        'roles' => $user->roles->pluck('name')->values()->all(),
                        'permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
                    ],
            ],
            'flash' => [
                'success' => fn (): ?string => $request->session()->get('success'),
                'error' => fn (): ?string => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'featuredCategories' => fn () => CourseCategory::active()->featuredNav()->ordered()->get(['id', 'name', 'slug'])->toArray(),
            'navFeaturedCities' => fn () => City::active()->featuredNav()->ordered()->get(['id', 'name', 'slug'])->toArray(),
            'announcementBar' => fn () => [
                'enabled' => AppSetting::getValue('announcement_bar_enabled', '1') === '1',
                'text' => AppSetting::getValue('announcement_bar_text', 'June 2026 Intake is Now Open !'),
                'linkText' => AppSetting::getValue('announcement_bar_link_text', 'Apply by 31st March'),
                'linkUrl' => AppSetting::getValue('announcement_bar_link_url', '#'),
            ],
        ];
    }
}
