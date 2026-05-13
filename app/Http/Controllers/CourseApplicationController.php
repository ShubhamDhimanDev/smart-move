<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseApplicationRequest;
use App\Mail\CourseApplicationSubmitted;
use App\Models\AppSetting;
use App\Models\CourseApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class CourseApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Public/ApplyNow');
    }

    public function store(StoreCourseApplicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $courseLabelMap = [
            'certhe_business' => 'Business',
            'certhe_health_social_care' => 'Health & Social Care',
            'certhe_it_computing' => 'IT/Computing',
            'foundation_business' => 'Business',
            'foundation_health' => 'Health',
            'foundation_law' => 'Law',
            'foundation_it' => 'IT',
            'foundation_others' => 'Others',
        ];
        $preferredCourses = collect($validated['selected_courses'])
            ->map(function (string $course) use ($validated, $courseLabelMap): string {
                if ($course === 'foundation_others' && filled($validated['other_course'] ?? null)) {
                    return sprintf('Others: %s', trim((string) $validated['other_course']));
                }

                return $courseLabelMap[$course] ?? $course;
            })
            ->implode(', ');
        $preferredLocations = collect($validated['selected_locations'])->implode(', ');

        $application = CourseApplication::query()->create([
            ...$validated,
            'preferred_course' => $preferredCourses,
            'preferred_location' => $preferredLocations,
            'nationality_immigration_status' => sprintf('%s - %s', $validated['nationality'], $validated['immigration_status']),
            'preferred_course_location' => sprintf('%s - %s', $preferredCourses, $preferredLocations),
        ]);

        $recipient = AppSetting::getValue('application_notification_email', config('mail.from.address'));

        if (filled($recipient)) {
            Mail::to($recipient)->send(new CourseApplicationSubmitted($application));
        }

        return back()->with('success', 'Your application has been submitted successfully.');
    }
}
