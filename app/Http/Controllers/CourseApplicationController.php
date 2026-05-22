<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseApplicationRequest;
use App\Mail\CourseApplicationSubmitted;
use App\Models\AppSetting;
use App\Models\Country;
use App\Models\CourseApplication;
use App\Models\CourseCategory;
use App\Models\City;
use App\Models\CourseType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class CourseApplicationController extends Controller
{
    public function create(): Response
    {
        $countries = Country::query()
            ->where('is_active', true)
            ->orderBy('nationality', 'ASC')
            ->get(['id', 'name', 'nationality']);
        $featuredCourseCategories = CourseCategory::query()
            ->where('is_featured_on_form', true)
            ->ordered()
            ->with(['courseTypes' => function ($q) {
                $q->active()->ordered();
            }])
            ->get()
            ->map(function (CourseCategory $c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'label' => $c->label,
                    'course_types' => $c->courseTypes->map(fn (CourseType $t) => [
                        'id' => $t->id,
                        'name' => $t->name,
                        'slug' => $t->slug,
                    ])->values()->all(),
                ];
            })->values()->all();

        $featuredCities = City::query()
            ->where('is_featured_on_form', true)
            ->active()
            ->ordered()
            ->get(['id', 'name', 'slug'])
            ->map(fn (City $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
            ])->values()->all();

        return Inertia::render('Public/ApplyNow', compact('countries', 'featuredCourseCategories', 'featuredCities'));
    }

    public function store(StoreCourseApplicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $selectedTypeIds = array_map('intval', $validated['selected_courses']);
        $preferredCourses = CourseType::query()
            ->findMany($selectedTypeIds)
            ->pluck('name')
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
