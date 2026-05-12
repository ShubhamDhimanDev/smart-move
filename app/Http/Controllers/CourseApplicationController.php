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
        $application = CourseApplication::query()->create($request->validated());

        $recipient = AppSetting::getValue('application_notification_email', config('mail.from.address'));

        if (filled($recipient)) {
            Mail::to($recipient)->send(new CourseApplicationSubmitted($application));
        }

        return back()->with('success', 'Your application has been submitted successfully.');
    }
}
