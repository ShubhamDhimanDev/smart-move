<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateHomePageSettingsRequest;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomePageSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/HomePageSettings/Index', [
            'settings' => [
                'announcement_bar_enabled' => AppSetting::getValue('announcement_bar_enabled', '1') === '1',
                'announcement_bar_text' => AppSetting::getValue('announcement_bar_text', 'June 2026 Intake is Now Open !'),
                'announcement_bar_link_text' => AppSetting::getValue('announcement_bar_link_text', 'Apply by 31st March'),
                'announcement_bar_link_url' => AppSetting::getValue('announcement_bar_link_url', '#'),
                'hero_badge_text' => AppSetting::getValue('hero_badge_text', 'June 2026 Intake Open'),
                'hero_badge_link' => AppSetting::getValue('hero_badge_link', '/apply-now'),
                'hero_heading_line1' => AppSetting::getValue('hero_heading_line1', 'Your Journey to'),
                'hero_heading_line2' => AppSetting::getValue('hero_heading_line2', 'UK Degree'),
                'hero_heading_line3' => AppSetting::getValue('hero_heading_line3', 'Starts Here.'),
                'hero_subheading' => AppSetting::getValue('hero_subheading', 'Empowering ambitious students to access top UK universities guiding you from your first enquiry to the right course and a successful career.'),
            ],
        ]);
    }

    public function update(UpdateHomePageSettingsRequest $request): RedirectResponse
    {
        $data = $request->validated();

        AppSetting::setValue('announcement_bar_enabled', $data['announcement_bar_enabled'] ? '1' : '0');
        AppSetting::setValue('announcement_bar_text', $data['announcement_bar_text']);
        AppSetting::setValue('announcement_bar_link_text', $data['announcement_bar_link_text'] ?? '');
        AppSetting::setValue('announcement_bar_link_url', $data['announcement_bar_link_url'] ?? '');
        AppSetting::setValue('hero_badge_text', $data['hero_badge_text']);
        AppSetting::setValue('hero_badge_link', $data['hero_badge_link'] ?? '');
        AppSetting::setValue('hero_heading_line1', $data['hero_heading_line1']);
        AppSetting::setValue('hero_heading_line2', $data['hero_heading_line2']);
        AppSetting::setValue('hero_heading_line3', $data['hero_heading_line3']);
        AppSetting::setValue('hero_subheading', $data['hero_subheading']);

        return back()->with('success', 'Home page settings updated successfully.');
    }
}
