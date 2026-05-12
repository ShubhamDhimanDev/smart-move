<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateApplicationSettingsRequest;
use App\Models\AppSetting;
use App\Models\CourseApplication;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseApplicationController extends Controller
{
    public function index(): Response
    {
        $applications = CourseApplication::query()
            ->latest()
            ->paginate(20)
            ->through(fn (CourseApplication $application): array => [
                'id' => $application->id,
                'first_name' => $application->first_name,
                'last_name' => $application->last_name,
                'dob' => $application->dob?->toDateString(),
                'phone' => $application->phone,
                'email' => $application->email,
                'nationality_immigration_status' => $application->nationality_immigration_status,
                'preferred_course_location' => $application->preferred_course_location,
                'has_taken_sfe_before' => (bool) $application->has_taken_sfe_before,
                'previous_qualification_work_experience' => $application->previous_qualification_work_experience,
                'created_at' => $application->created_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'notificationEmail' => AppSetting::getValue('application_notification_email', config('mail.from.address')),
        ]);
    }

    public function updateSettings(UpdateApplicationSettingsRequest $request): RedirectResponse
    {
        AppSetting::setValue('application_notification_email', $request->validated('application_notification_email'));

        return back()->with('success', 'Application notification email updated successfully.');
    }
}
