<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateApplicationSettingsRequest;
use App\Models\AppSetting;
use App\Models\CourseApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class CourseApplicationController extends Controller
{
    public function index(): Response
    {
        $applications = CourseApplication::query()
            ->latest()
            ->paginate(20)
            ->through(fn (CourseApplication $application): array => $this->mapApplication($application));

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'notificationEmail' => AppSetting::getValue('application_notification_email', config('mail.from.address')),
        ]);
    }

    public function show(CourseApplication $application): Response
    {
        return Inertia::render('Admin/Applications/Show', [
            'application' => $this->mapApplication($application),
        ]);
    }

    public function updateSettings(UpdateApplicationSettingsRequest $request): RedirectResponse
    {
        AppSetting::setValue('application_notification_email', $request->validated('application_notification_email'));

        return back()->with('success', 'Application notification email updated successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function mapApplication(CourseApplication $application): array
    {
        $qualificationAndWork = $application->previous_qualification_work_experience;

        if (! is_array($qualificationAndWork)) {
            $qualificationAndWork = [
                'qualification' => (string) $application->getRawOriginal('previous_qualification_work_experience'),
                'work_experience' => '',
            ];
        }

        return [
            'id' => $application->id,
            'first_name' => $application->first_name,
            'last_name' => $application->last_name,
            'dob' => $application->dob?->toDateString(),
            'phone' => $application->phone,
            'email' => $application->email,
            'nationality' => $application->nationality ?? $application->nationality_immigration_status,
            'immigration_status' => $application->immigration_status ?? '',
            'preferred_course' => $application->preferred_course ?? $application->preferred_course_location,
            'preferred_location' => $application->preferred_location ?? '',
            'has_taken_sfe_before' => (bool) $application->has_taken_sfe_before,
            'previous_qualification_work_experience' => [
                'qualification' => (string) Arr::get($qualificationAndWork, 'qualification', ''),
                'work_experience' => (string) Arr::get($qualificationAndWork, 'work_experience', ''),
            ],
            'created_at' => $application->created_at?->toISOString(),
        ];
    }
}
